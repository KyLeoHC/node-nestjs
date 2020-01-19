import { promises as fsPromises } from 'fs';
import {
  Injectable
} from '@nestjs/common';
import {
  ConfigService
} from '@nestjs/config';
import { ObjectID } from 'mongodb';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Repository
} from 'typeorm';
import {
  DiskNotFoundException,
  FileNotFoundException
} from 'src/common/exceptions';
import {
  DiskEntity,
  FileEntity,
  FileSegment
} from './entities';
import {
  CreateFileDto,
  UploadFileDto
} from './dto';
import { objectIdToString } from 'src/utils';

@Injectable()
export class FileService {
  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(DiskEntity)
    private readonly diskRepo: Repository<DiskEntity>,
    @InjectRepository(FileEntity)
    private readonly fileRepo: Repository<FileEntity>
  ) {
  }

  /**
   * generate unique server filename
   * @param userId
   * @param hash
   * @param filename
   */
  public generateUniqueServerFilename(
    userId: string,
    hash: string,
    filename: string
  ): string {
    return `${userId}-${hash}-${new Date().getTime()}-${filename}`;
  }

  /**
   * get user files
   * @param userId
   */
  public async getUserFiles(userId: string): Promise<string[]> {
    const disk = await this.diskRepo.findOne({
      where: {
        userId: { $eq: userId }
      }
    });
    return disk ? (disk.files || []) : [];
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
   * create file before upload
   */
  public async createFile(
    userId: string,
    createFileDto: CreateFileDto
  ): Promise<string> {
    const existCompleteFile = await this.findCompleteFileByHash(createFileDto.hash);
    let fileId = '';
    if (existCompleteFile) {
      fileId = objectIdToString(existCompleteFile.id);
    } else {
      // File not exist
      const newFile = new FileEntity();
      newFile.hash = createFileDto.hash;
      newFile.filename = createFileDto.filename;
      newFile.createTime = new Date().getTime();
      newFile.segments = (new Array(createFileDto.segmentsCount)).map<FileSegment>(
        (): FileSegment => ({
          hash: '',
          size: 0,
          completeTime: 0
        })
      );
      await this.fileRepo.save(newFile);
      fileId = objectIdToString(newFile.id);
    }
    return fileId;
  }

  /**
   * save file on disk repo
   * @param userId
   * @param fileId
   */
  public async saveFileOnDiskRepo(
    userId: string,
    fileId: string
  ): Promise<void> {
    const diskEntity = await this.findUserDisk(userId);
    diskEntity.files.push(fileId);
    await this.diskRepo.update(objectIdToString(diskEntity.id), {
      files: diskEntity.files
    });
  }

  /**
   * find file by hash value
   * @param hash
   */
  public async saveFileOrSegmentData(
    userId: string,
    uploadFileDto: UploadFileDto,
    file: Express.Multer.File
  ): Promise<void> {
    const uploadOption = this.configService.get<Record<string, string>>('uploadOption') || {};
    const fileEntity = await this.findUncompleteFileById(uploadFileDto.id);
    const fileId = objectIdToString(fileEntity.id);
    const segmentIndex = parseInt(uploadFileDto.index);
    if (!fileEntity.segments.length) {
      fileEntity.serverFilename = this.generateUniqueServerFilename(userId, fileEntity.hash, fileEntity.filename);
      await fsPromises.writeFile(`${uploadOption.fileDir}/${fileEntity.serverFilename}`, file.buffer);
      // no segment split
      await this.fileRepo.update(fileId, {
        size: file.size,
        serverFilename: fileEntity.serverFilename,
        completeTime: new Date().getTime()
      });
    }
    // associate file with user disk repository
    await this.saveFileOnDiskRepo(userId, fileId);
  }
}
