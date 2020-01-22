import {
  Controller,
  Get,
  Res,
  Param
} from '@nestjs/common';
import { Response } from 'express';
import { FileService } from './file.service';
import {
  TargetFileDto
} from './dto';

@Controller('download')
export class DownloadController {
  constructor(
    private readonly fileService: FileService
  ) {
  }

  @Get(':id')
  public async download(
    /* eslint-disable */
    @Param() targetFileDto: TargetFileDto,
    @Res() response: Response
    /* eslint-enable */
  ): Promise<void> {
    const targetFile = await this.fileService.findCompleteFileById(targetFileDto.id);
    const stream = await this.fileService.loadServerFileData(targetFile.serverFilename);
    response.setHeader('Content-Type', 'application/octet-stream');
    response.attachment(targetFile.filename);
    stream.pipe(response);
  }
}
