import {
  BussinessStatus,
  BussinessMessage
} from '../../enums';
import { BusinessException } from '../business.exception';

export class DuplicateSegmentIndexException extends BusinessException {
  constructor(
    code = BussinessStatus.NORMAL_BUSINESS_ERROR,
    message = BussinessMessage.DUPICATE_SEGMENT_INDEX
  ) {
    super(code, message);
  }
}
