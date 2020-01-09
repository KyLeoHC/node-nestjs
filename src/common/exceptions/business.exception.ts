/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  HttpStatus,
  HttpException
} from '@nestjs/common';
import { BussinessStatus } from '../enums';
import { ResponseEntity } from '../entities';

export class BusinessException extends HttpException {
  constructor(code: BussinessStatus, message = '', data?: any) {
    super(new ResponseEntity(code, message, data), HttpStatus.OK);
  }
}
