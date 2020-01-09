import { BussinessStatus } from '../enums';
import { BusinessException } from './business.exception';

export class UserNotFoundException extends BusinessException {
  constructor(
    code = BussinessStatus.USER_NOT_FOUND,
    message = '用户不存在'
  ) {
    super(code, message);
  }
}
