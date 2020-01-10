import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BussinessStatus } from '../enums';
import {
  ResponseDto
} from '../dto';

@Injectable()
export class TransformResponseInterceptor<T> implements NestInterceptor<T, ResponseDto<T>> {
  intercept(
    context: ExecutionContext,
    next: CallHandler<T>
  ): Observable<ResponseDto<T>> {
    // transform result data into our standard style
    return next.handle().pipe(map(data => (new ResponseDto(BussinessStatus.OK, undefined, data))));
  }
}
