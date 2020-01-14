import {
  BussinessStatus,
  BussinessMessage
} from '../enums';
import { BusinessException } from './business.exception';

export class ValidationErrorException extends BusinessException {
  constructor(
    code = BussinessStatus.NORMAL_BUSINESS_ERROR,
    message: string = BussinessMessage.VALIDATION_ERROR
  ) {
    super(code, message);
  }
}
