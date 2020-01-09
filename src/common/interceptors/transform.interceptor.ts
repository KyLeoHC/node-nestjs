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
  ResponseEntity
} from '../entities';

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, ResponseEntity<T>> {
  intercept(
    context: ExecutionContext,
    next: CallHandler<T>
  ): Observable<ResponseEntity<T>> {
    // transform result data into our standard style
    return next.handle().pipe(map(data => (new ResponseEntity(BussinessStatus.OK, undefined, data))));
  }
}
