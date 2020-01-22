import {
  constants,
  createReadStream,
  promises as fsPromises,
  ReadStream
} from 'fs';
import { join } from 'path';
import {
  Injectable
} from '@nestjs/common';
import {
  ConfigService
} from '@nestjs/config';
import { ObjectID } from 'mongodb';
import { InjectRepository } from '@nestjs/typeorm';
import {
  MongoRepository
} from 'typeorm';
import {
  move,
  deleteFileOrDirectory,
  objectIdToString
} from 'src/utils';
import {
  DiskNotFoundException,
  FileNotFoundException,
  MissingFileDataException,
  SegmentNotFoundException,
  DuplicateSegmentIndexException
} from 'src/common/exceptions';
import { AppLogger } from '../../modules/app-logger/app-logger.service';
import {
  FILE_ENTITY_TABLE,
  DiskEntity,
  FileEntity,
  FileSegment
} from './entities';
import {
  CreateFileDto,
  UploadFileDto,
  UserFilesDto
} from './dto';

async function writeFile(path: string, buffer: ArrayBuffer): ReturnType<typeof fsPromises.writeFile> {
  return await fsPromises.writeFile(path, buffer);
}

function generateUniqueServerFilename(
  userId: string,
  hash: string,
  filename: string
): string {
  // server file name: '{userId}-{hash}-{1579419935235}-{filename}'
  return `${userId}-{${hash}}-{${new Date().getTime()}}-${filename}`;
}

function generateUniqueSegmentDirName(
  userId: string,
  fileEntity: FileEntity
): string {
  // segment directory: '{userId}-{hash}-{1579419935235}'
  return `${userId}-{${fileEntity.hash}}-{${fileEntity.createTime}}`;
}

function generateUniqueSegmentFileName(
  hash: string,
  index: number
): string {
  // server file name: '{0}-{hash}-{1579419935235}.part'
  return `{${index}}-{${hash}}-{${new Date().getTime()}}.part`;
}

@Injectable()
export class FileService {
  constructor(
    private readonly appLogger: AppLogger,
    private readonly configService: ConfigService,
    @InjectRepository(DiskEntity)
    private readonly diskRepo: MongoRepository<DiskEntity>,
    @InjectRepository(FileEntity)
    private readonly fileRepo: MongoRepository<FileEntity>
  ) {
  }

  /**
   * check if all segment has bean uploaded
   * @param fileEntity
   */
  public checkIfAllSegmentComplete(fileEntity: FileEntity): boolean {
    return !fileEntity.segments.length
      || fileEntity.segments.every((segment): boolean => segment.completeTime > 0);
  }

  /**
   * get user files
   * @param userId
   */
  public async getUserFiles(userId: string): Promise<UserFilesDto> {
    const data = await this.diskRepo.aggregate<UserFilesDto>([
      {
        $match: { userId }
      },
      { $unwind: '$files' },
      {
        $project: {
          usedSpace: 1,
          fileId: {
            '$toObjectId': '$files'
          }
        }
      },
      {
        $sort: {
          fileId: -1
        }
      },
      {
        $lookup: {
          from: FILE_ENTITY_TABLE,
          let: { fileId: '$fileId' },
          pipeline: [
            {
              $match: {
                $expr:
                {
                  $and: [{ $eq: ['$_id', '$$fileId'] }]
                }
              }
            },
            {
              $project: {
                _id: 0,
                id: '$_id',
                size: 1,
                filename: 1,
                createTime: 1
              }
            }
          ],
          as: 'files'
        }
      },
      {
        $group: {
          _id: null,
          usedSpace: {
            '$first': '$usedSpace'
          },
          files: {
            '$push': '$files'
          }
        }
      },
      {
        $project: {
          _id: 0,
          usedSpace: 1,
          count: {
            $size: '$files'
          },
          files: {
            $reduce: {
              input: '$files',
              initialValue: [],
              in: { $concatArrays: ['$$value', '$$this'] }
            }
          }
        }
      }
    ]).toArray();
    return data[0];
  }

  /**
   * create user disk
   * @param userId
   */
  public async createUserDisk(userId: string): Promise<void> {
    const newDisk = new DiskEntity();
    newDisk.userId = userId;
    await this.diskRepo.save(newDisk);
  }

  /**
   * find user disk
   * @param userId
   */
  public async findUserDisk(userId: string): Promise<DiskEntity> {
    const userDisk = await this.diskRepo.findOne({
      where: {
        userId: { $eq: userId }
      }
    });
    if (!userDisk) {
      throw new DiskNotFoundException();
    }
    return userDisk;
  }

  /**
   * find Uncomplete file by id
   * @param id
   */
  public async findUncompleteFileById(id: string): Promise<FileEntity> {
    const file = await this.fileRepo.findOne({
      where: {
        _id: { $eq: ObjectID(id) },
        completeTime: { $eq: 0 }
      }
    });
    if (!file) {
      throw new FileNotFoundException();
    }
    return file;
  }

  /**
   * find complete file by id
   * @param id
   */
  public async findCompleteFileById(id: string): Promise<FileEntity> {
    const file = await this.fileRepo.findOne({
      where: {
        _id: { $eq: ObjectID(id) },
        completeTime: { $gt: 0 }
      }
    });
    if (!file) {
      throw new FileNotFoundException();
    }
    return file;
  }

  /**
   * find file by hash value
   * @param hash
   */
  public async findCompleteFileByHash(hash: string): Promise<FileEntity | undefined> {
    return await this.fileRepo.findOne({
      where: {
        hash: { $eq: hash },
        completeTime: { $gt: 0 }
      }
    });
  }

  /**
   * save file on disk repo
   * @param userId
   * @param fileEntity
   */
  public async saveFileOnDiskRepo(
    userId: string,
    fileEntity: FileEntity
  ): Promise<void> {
    const diskEntity = await this.findUserDisk(userId);
    diskEntity.files.push(objectIdToString(fileEntity.id));
    await this.diskRepo.update(objectIdToString(diskEntity.id), {
      usedSpace: diskEntity.usedSpace + fileEntity.size,
      files: diskEntity.files
    });
  }

  /**
   * get absolute upload path
   * @param key
   * @param name
   */
  public getAbsoluteUploadPath(key: string, name: string): string {
    const uploadOption = this.configService.get<Record<string, string>>('uploadOption') || {};
    return join(`${key === 'fileDir' ? uploadOption.fileDir : uploadOption.segmentDir}`, name);
  }

  /**
   * create file before upload
   */
  public async createFile(
    userId: string,
    createFileDto: CreateFileDto
  ): Promise<string> {
    const newFile = new FileEntity();
    const existCompleteFile = await this.findCompleteFileByHash(createFileDto.hash);
    let fileId = '';
    if (existCompleteFile) {
      newFile.size = existCompleteFile.size;
      newFile.hash = existCompleteFile.hash;
      newFile.filename = createFileDto.filename;
      await this.fileRepo.save(newFile);
      // associate file with user disk repository
      await this.saveFileOnDiskRepo(userId, newFile);
    } else {
      // File not exist
      newFile.hash = createFileDto.hash;
      newFile.filename = createFileDto.filename;
      for (let i = 0; i < createFileDto.segmentCount; i++) {
        newFile.segments.push(new FileSegment());
      }
      await this.fileRepo.save(newFile);
      fileId = objectIdToString(newFile.id);
    }
    // return the new file id if this is a unique file
    return fileId;
  }

  /**
   * complete upload task
   * @param userId
   * @param fileEntity
   */
  public async completeUploadFile(
    userId: string,
    fileEntity: FileEntity
  ): Promise<void> {
    const fileId = objectIdToString(fileEntity.id);
    await this.fileRepo.update(fileId, {
      size: fileEntity.size,
      serverFilename: fileEntity.serverFilename,
      completeTime: new Date().getTime(),
      segments: []
    });
    // associate file with user disk repository
    await this.saveFileOnDiskRepo(userId, fileEntity);
  }

  /**
   * find file by hash value
   * @param hash
   */
  public async saveFileOrSegmentData(
    userId: string,
    uploadFileDto: UploadFileDto,
    file?: Express.Multer.File
  ): Promise<void> {
    if (!file) throw new MissingFileDataException();
    const fileEntity = await this.findUncompleteFileById(uploadFileDto.id);
    const fileId = objectIdToString(fileEntity.id);
    const segmentIndex = parseInt(uploadFileDto.index);
    if (!fileEntity.segments.length) {
      // no segment, just save this file directly
      fileEntity.serverFilename = generateUniqueServerFilename(userId, fileEntity.hash, fileEntity.filename);
      // write file into local disk
      await writeFile(this.getAbsoluteUploadPath('fileDir', fileEntity.serverFilename), file.buffer);
      // no segment split, just finish this task
      fileEntity.size = file.size;
      fileEntity.completeTime = new Date().getTime();
      this.completeUploadFile(userId, fileEntity);
    } else {
      // save segment
      const segment = fileEntity.segments[segmentIndex];
      if (!segment) {
        throw new SegmentNotFoundException();
      }
      if (segment.completeTime) {
        throw new DuplicateSegmentIndexException();
      }
      // This data is a segment file data
      const segmentFileDirName = fileEntity.segmentDir || generateUniqueSegmentDirName(userId, fileEntity);
      const segmentDirPath = this.getAbsoluteUploadPath('segmentDir', segmentFileDirName);
      try {
        // Check if segment directory exists
        await fsPromises.access(segmentDirPath, constants.F_OK);
      } catch (ex) {
        // Create segment directory if not exist
        await fsPromises.mkdir(segmentDirPath, { recursive: true });
      }
      segment.hash = uploadFileDto.hash;
      segment.size = file.size;
      segment.completeTime = new Date().getTime();
      segment.serverFilename = generateUniqueSegmentFileName(uploadFileDto.hash, segmentIndex);
      // write segment file into local disk
      await writeFile(
        `${segmentDirPath}/${segment.serverFilename}`,
        file.buffer
      );
      // update target segment data in mongoDB
      await this.fileRepo.update(fileId, {
        [`segments.${segmentIndex}`]: segment
      });
    }
  }

  /**
   * merge segment
   * @param userId
   * @param mergeFileDto
   */
  public async mergeSegment(
    userId: string,
    fileId: string
  ): Promise<void> {
    const fileEntity = await this.findUncompleteFileById(fileId);
    if (fileEntity.completeTime
      || !fileEntity.segments.length
      || !this.checkIfAllSegmentComplete(fileEntity)) return;
    const segmentFileDirName = generateUniqueSegmentDirName(userId, fileEntity);
    const segmentDirPath = this.getAbsoluteUploadPath('segmentDir', segmentFileDirName);
    const firstSegment = fileEntity.segments.shift();
    if (firstSegment) {
      const firstSegmentPath = `${segmentDirPath}/${firstSegment.serverFilename}`;
      // start merge file
      for (const segment of fileEntity.segments) {
        await fsPromises.appendFile(
          firstSegmentPath,
          await fsPromises.readFile(`${segmentDirPath}/${segment.serverFilename}`)
        );
      }
      const fileStats = await fsPromises.stat(firstSegmentPath);
      fileEntity.size = fileStats.size;
      fileEntity.completeTime = new Date().getTime();
      fileEntity.serverFilename = generateUniqueServerFilename(userId, fileEntity.hash, fileEntity.filename);
      // move file into the files directory
      await move(firstSegmentPath, this.getAbsoluteUploadPath('fileDir', fileEntity.serverFilename));
      // complete upload task
      this.completeUploadFile(userId, fileEntity);
      // delete segment directory
      deleteFileOrDirectory(segmentDirPath);
    }
  }

  /**
   * delete file
   * @param fileId
   */
  public async deleteFileOfDisk(
    userId: string,
    fileId: string
  ): Promise<void> {
    const targetFile = await this.findCompleteFileById(fileId);
    await this.diskRepo.updateOne({ userId }, {
      $pull: {
        files: { $in: [fileId] }
      },
      $inc: { usedSpace: -targetFile.size }
    });
    await this.fileRepo.deleteOne({
      where: {
        userId
      }
    });
  }

  /**
   * download file
   * @param fileId
   */
  public async loadServerFileData(
    serverFilename: string
  ): Promise<ReadStream> {
    const filePath = this.getAbsoluteUploadPath('fileDir', serverFilename);
    try {
      // check if file exists
      await fsPromises.access(filePath, constants.R_OK);
    } catch (exception) {
      this.appLogger.error(exception);
      throw new FileNotFoundException();
    }
    return createReadStream(filePath, { autoClose: true });
  }
}
