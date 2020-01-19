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
          entities: [`${__dirname}/**/*.entity.{js,ts}`]
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
