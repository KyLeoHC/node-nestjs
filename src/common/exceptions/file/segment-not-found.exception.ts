import {
  BussinessStatus,
  BussinessMessage
} from '../../enums';
import { BusinessException } from '../business.exception';

export class SegmentNotFoundException extends BusinessException {
  constructor(
    code = BussinessStatus.NORMAL_BUSINESS_ERROR,
    message = BussinessMessage.SEGMENT_NOT_FOUND
  ) {
    super(code, message);
  }
}
