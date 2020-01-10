import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { ResponseDto } from '../dto';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter<HttpException> {
  public catch(exception: HttpException, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const statusCode = exception.getStatus();
    const responseDto = exception.getResponse();

    // transform some uncaught exception into our format
    response.status(statusCode)
      .json(
        responseDto instanceof ResponseDto
          ? responseDto
          : new ResponseDto(responseDto)
      );
  }
}
