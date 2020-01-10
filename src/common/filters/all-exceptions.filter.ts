import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus
} from '@nestjs/common';
import { ResponseDto } from '../dto';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  public catch(exception: HttpException, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const isHttpException = exception instanceof HttpException;
    const statusCode = isHttpException
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;
    const responseDto = isHttpException ? exception.getResponse() : exception;

    // transform some uncaught exception into our format
    response.status(statusCode)
      .json(
        responseDto instanceof ResponseDto
          ? responseDto
          : new ResponseDto(responseDto)
      );
  }
}
