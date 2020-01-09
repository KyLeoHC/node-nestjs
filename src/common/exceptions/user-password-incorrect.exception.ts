import { BussinessStatus } from '../enums';
import { BusinessException } from './business.exception';

export class UserPasswordIncorrectException extends BusinessException {
  constructor(
    code = BussinessStatus.USER_PASSEORD_INCORRECT,
    message = '账户密码不正确'
  ) {
    super(code, message);
  }
}
