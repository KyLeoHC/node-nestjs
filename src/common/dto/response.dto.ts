/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  isPlainObject,
  isNumber
} from 'lodash';
import {
  BussinessStatus,
  BussinessMessage
} from '../enums';

export interface ResponseData<T> {
  data?: T;
}

export interface NestDefaultJSON {
  statusCode: number;
  error?: string;
  message?: string;
}

export function isNestDefaultJSON(value: any): value is NestDefaultJSON {
  return isPlainObject(value) && isNumber(value.statusCode);
}

/**
 * response DTO for client
 */
export class ResponseDto<T = any> implements ResponseData<T> {
  public code: string;

  constructor(
    codeOrObj: string | Record<string, any>,
    public message?: string,
    public data?: T
  ) {
    if (typeof codeOrObj === 'string') {
      this.code = codeOrObj;
    } else if (isNestDefaultJSON(codeOrObj)) {
      // transform NestDefaultJSON into our format
      this.code = `${codeOrObj.statusCode}`;
      this.message = codeOrObj.error || BussinessMessage.UNKNOWN_ERROR;
    } else {
      this.code = BussinessStatus.UNKNOWN_ERROR;
      this.message = `${codeOrObj}`;
    }
  }
}
