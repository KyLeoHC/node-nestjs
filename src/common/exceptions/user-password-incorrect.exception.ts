import {
  BussinessStatus,
  BussinessMessage
} from '../enums';
import { BusinessException } from './business.exception';

export class UserPasswordIncorrectException extends BusinessException {
  constructor(
    code = BussinessStatus.USER_PASSEORD_INCORRECT,
    message = BussinessMessage.USER_PASSEORD_INCORRECT
  ) {
    super(code, message);
  }
}
