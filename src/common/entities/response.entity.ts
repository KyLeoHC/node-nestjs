/* eslint-disable @typescript-eslint/no-explicit-any */
import { BussinessStatus } from '../enums';

export interface ResponseData<T> {
  data?: T;
}

/**
 * response entity for client
 */
export class ResponseEntity<T = any> implements ResponseData<T> {
  constructor(
    public code: BussinessStatus,
    public message?: string,
    public data?: T
  ) {
  }
}
