/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  HttpStatus,
  HttpException
} from '@nestjs/common';
import {
  BussinessStatus,
  BussinessMessage
} from '../enums';
import { ResponseDto } from '../dto';

export class SystemErrorException extends HttpException {
  constructor(
    code: BussinessStatus = BussinessStatus.SYSTEM_ERROR,
    message: string = BussinessMessage.SYSTEM_ERROR,
    data?: any
  ) {
    super(new ResponseDto(code, message, data), HttpStatus.OK);
  }
}
