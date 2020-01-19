import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FileModule } from '../file/file.module';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UserEntity } from './entities';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserEntity
    ]),
    FileModule
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService]
})
export class UserModule { }
