import { Module } from '@nestjs/common';
import {
  ConfigModule,
  ConfigService
} from '@nestjs/config';
import {
  MulterModule
} from '@nestjs/platform-express';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FileController } from './file.controller';
import { DownloadController } from './download.controller';
import { FileService } from './file.service';
import {
  DiskEntity,
  FileEntity
} from './entities';

@Module({
  imports: [
    MulterModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        limits: configService.get<object>('uploadOption.limits')
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([
      DiskEntity,
      FileEntity
    ])
  ],
  controllers: [FileController, DownloadController],
  providers: [FileService],
  exports: [FileService]
})
export class FileModule { }
