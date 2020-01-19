import {
  Controller,
  Get,
  Post,
  UseGuards,
  UploadedFile,
  UseInterceptors,
  Body
} from '@nestjs/common';
import {
  FileInterceptor
} from '@nestjs/platform-express';
import { AuthGuard } from '@nestjs/passport';
import { User } from '../auth/decorators';
import { AuthUser } from '../auth/interfaces';
import { FileService } from './file.service';
import {
  CreateFileDto,
  UploadFileDto
} from './dto';

@UseGuards(AuthGuard())
@Controller('file')
export class FileController {
  constructor(
    private readonly fileService: FileService
  ) {
  }

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

  @Get('list')
  public async getUserFileList(
    @User() user: AuthUser
  ): Promise<string[]> {
    return await this.fileService.getUserFiles(user.id);
  }
}
