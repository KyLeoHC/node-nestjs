/* eslint-disable @typescript-eslint/no-explicit-any */
import { BussinessStatus } from '../enums';

export interface ResponseData<T> {
  data?: T;
}

/**
 * response DTO for client
 */
export class ResponseDto<T = any> implements ResponseData<T> {
  constructor(
    public code: BussinessStatus,
    public message?: string,
    public data?: T
  ) {
  }
}
