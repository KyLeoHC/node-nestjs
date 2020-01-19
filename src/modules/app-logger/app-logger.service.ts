import { LoggerService, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  format,
  transports,
  createLogger
} from 'winston';
import 'winston-daily-rotate-file';
import { DailyRotateFileTransportOptions } from 'winston-daily-rotate-file';

@Injectable()
export class AppLogger implements LoggerService {
  private logger: ReturnType<typeof createLogger>;

  constructor(
    private readonly configService: ConfigService
  ) {
    const {
      colorize,
      simple,
      combine,
      timestamp,
      prettyPrint
    } = format;
    // Refer to 'https://github.com/winstonjs/winston' for more options
    const logger = createLogger({
      level: this.configService.get<string>('logger.level'),
      defaultMeta: this.configService.get<Record<string, string>>('logger.defaultMeta'),
      exitOnError: this.configService.get<boolean>('logger.exitOnError'),
      format: combine(
        timestamp({
          format: 'YYYY-MM-DD HH:mm:ss'
        }),
        prettyPrint()
      ),
      transports: [
        new transports.Console({
          format: combine(colorize(), simple())
        })
      ]
    });

    if (process.env.NODE_ENV === 'production') {
      logger.add(new transports.DailyRotateFile(this.configService.get<DailyRotateFileTransportOptions>('logger.file')));
    }

    this.logger = logger;
  }

  public log(message: string): void {
    this.logger.info(message);
  }

  public error(message: string, trace?: string): void {
    this.logger.error(`${message}${trace ? ('\n' + trace) : ''}`);
  }

  public warn(message: string): void {
    this.logger.warn(message);
  }

  public debug(message: string): void {
    this.logger.debug(message);
  }

  public verbose(message: string): void {
    this.logger.verbose(message);
  }
}
