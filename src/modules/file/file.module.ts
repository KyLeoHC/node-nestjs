import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FileController } from './file.controller';
import { FileService } from './file.service';
import {
  DiskEntity,
  FileEntity
} from './entities';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      DiskEntity,
      FileEntity
    ])
  ],
  controllers: [FileController],
  providers: [FileService],
  exports: [FileService]
})
export class FileModule { }
