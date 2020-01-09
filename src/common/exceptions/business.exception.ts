/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  HttpStatus,
  HttpException
} from '@nestjs/common';
import { BussinessStatus } from '../enums';
import { ResponseDto } from '../dto';

export class BusinessException extends HttpException {
  constructor(code: BussinessStatus, message = '', data?: any) {
    super(new ResponseDto(code, message, data), HttpStatus.OK);
  }
}
