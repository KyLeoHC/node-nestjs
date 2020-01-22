import {
  Controller,
  Get,
  Put,
  Post,
  Delete,
  UseGuards,
  UploadedFile,
  UseInterceptors,
  Body,
  Res,
  Header,
  Param,
  ClassSerializerInterceptor
} from '@nestjs/common';
import {
  FileInterceptor
} from '@nestjs/platform-express';
import { Response } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { User } from '../auth/decorators';
import { AuthUser } from '../auth/interfaces';
import { FileService } from './file.service';
import {
  CreateFileDto,
  UploadFileDto,
  TargetFileDto,
  UserFilesDto
} from './dto';

@Controller('file')
export class FileController {
  constructor(
    private readonly fileService: FileService
  ) {
  }

  @UseGuards(AuthGuard())
  @Post('create')
  public async createFile(
    // Refer to issue 'https://github.com/typescript-eslint/typescript-eslint/issues/1356'
    /* eslint-disable */
    @User() user: AuthUser,
    @Body() createFileDto: CreateFileDto
    /* eslint-enable */
  ): Promise<string> {
    return await this.fileService.createFile(user.id, createFileDto);
  }

  @UseGuards(AuthGuard())
  @UseInterceptors(FileInterceptor('file'))
  @Post('upload')
  public async uploadFile(
    /* eslint-disable */
    @User() user: AuthUser,
    @Body() uploadFileDto: UploadFileDto,
    @UploadedFile() file: Express.Multer.File
    /* eslint-enable */
  ): Promise<void> {
    await this.fileService.saveFileOrSegmentData(user.id, uploadFileDto, file);
  }

  @UseGuards(AuthGuard())
  @Put('merge')
  public async mergeSegment(
    /* eslint-disable */
    @User() user: AuthUser,
    @Body() targetFileDto: TargetFileDto,
    /* eslint-enable */
  ): Promise<void> {
    await this.fileService.mergeSegment(user.id, targetFileDto.id);
  }

  @UseGuards(AuthGuard())
  @UseInterceptors(ClassSerializerInterceptor)
  @Get('list')
  public async getUserFileList(
    @User() user: AuthUser
  ): Promise<UserFilesDto> {
    return await this.fileService.getUserFiles(user.id);
  }

  @UseGuards(AuthGuard())
  @Delete('delete/:id')
  public async deleteUserFile(
    /* eslint-disable */
    @User() user: AuthUser,
    @Param() targetFileDto: TargetFileDto,
    /* eslint-enable */
  ): Promise<void> {
    await this.fileService.deleteFileOfDisk(user.id, targetFileDto.id);
  }

  @Get('download/:id')
  @Header('Content-Type', 'application/octet-stream')
  public async download(
    /* eslint-disable */
    @Param() targetFileDto: TargetFileDto,
    @Res() response: Response
    /* eslint-enable */
  ): Promise<void> {
    const targetFile = await this.fileService.findCompleteFileById(targetFileDto.id);
    const stream = await this.fileService.loadServerFileData(targetFile.serverFilename);
    response.attachment(targetFile.filename);
    stream.pipe(response);
  }
}
