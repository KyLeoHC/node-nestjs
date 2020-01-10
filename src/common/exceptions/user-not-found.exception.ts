import {
  BussinessStatus,
  BussinessMessage
} from '../enums';
import { BusinessException } from './business.exception';

export class UserNotFoundException extends BusinessException {
  constructor(
    code = BussinessStatus.USER_NOT_FOUND,
    message = BussinessMessage.USER_NOT_FOUND
  ) {
    super(code, message);
  }
}
