import {
  BussinessStatus,
  BussinessMessage
} from '../../enums';
import { BusinessException } from '../business.exception';

export class MissingFileDataException extends BusinessException {
  constructor(
    code = BussinessStatus.NORMAL_BUSINESS_ERROR,
    message = BussinessMessage.MISSING_FILE_DATA
  ) {
    super(code, message);
  }
}
