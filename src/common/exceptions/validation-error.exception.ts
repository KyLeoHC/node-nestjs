import {
  BussinessStatus,
  BussinessMessage
} from '../enums';
import { BusinessException } from './business.exception';

export class ValidationErrorException extends BusinessException {
  constructor(
    code = BussinessStatus.USER_PASSEORD_INCORRECT,
    message: string = BussinessMessage.VALIDATION_ERROR
  ) {
    super(code, message);
  }
}
