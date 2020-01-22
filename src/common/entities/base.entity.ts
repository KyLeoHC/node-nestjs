import {
  Transform
} from 'class-transformer';
import {
  ObjectID,
  ObjectIdColumn
} from 'typeorm';
import { objectIdToString } from 'src/utils';

export class BaseEntity {
  @Transform(id => objectIdToString(id))
  @ObjectIdColumn()
  public id: ObjectID;
}
