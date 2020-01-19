/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus
} from '@nestjs/common';
import { AppLogger } from '../../modules/app-logger/app-logger.service';
import { ResponseDto } from '../dto';
import { SystemErrorException } from '../exceptions';

const isDev = process.env.NODE_ENV !== 'production';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(
    private readonly appLogger?: AppLogger
  ) {
  }

  public catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    let responseDto: any = exception;

    if (exception instanceof HttpException) {
      statusCode = HttpStatus.OK;
      responseDto = exception.getResponse();
    } else if (exception instanceof Error) {
      this.appLogger && this.appLogger.error(exception.stack || exception.toString());
      isDev && console.error(exception);
      responseDto = new SystemErrorException().getResponse();
    }

    // transform some uncaught exception into our format
    response.status(statusCode)
      .json(
        responseDto instanceof ResponseDto
          ? responseDto
          : new ResponseDto(responseDto)
      );
  }
}
