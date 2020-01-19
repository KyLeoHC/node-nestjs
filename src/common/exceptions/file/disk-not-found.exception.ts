import {
  BussinessStatus,
  BussinessMessage
} from '../../enums';
import { BusinessException } from '../business.exception';

export class DiskNotFoundException extends BusinessException {
  constructor(
    code = BussinessStatus.NORMAL_BUSINESS_ERROR,
    message = BussinessMessage.DISK_NOT_FOUND
  ) {
    super(code, message);
  }
}
