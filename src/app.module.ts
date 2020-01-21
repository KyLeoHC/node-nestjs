/* eslint-disable @typescript-eslint/no-explicit-any */
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import config from '../config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppLoggerModule } from './modules/app-logger/app-logger.module';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { FileModule } from './modules/file/file.module';
import {
  UserEntity
} from './modules/user/entities';
import {
  DiskEntity,
  FileEntity
} from './modules/file/entities';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [config],
      isGlobal: true
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService): Promise<Record<string, any>> => {
        return Object.assign(configService.get<Record<string, any>>('db'), {
          // You can use 'entities: ["dist/**/*.entity{.ts,.js}"]' instead.
          // But static glob paths won't work properly with webpack hot reloading.
          entities: [
            UserEntity,
            DiskEntity,
            FileEntity
          ]
        });
      }
    }),
    AppLoggerModule,
    AuthModule,
    UserModule,
    FileModule
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule { }
