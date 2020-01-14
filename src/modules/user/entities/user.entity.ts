import {
  Entity,
  ObjectID,
  ObjectIdColumn,
  Column
} from 'typeorm';
import {
  Exclude,
  Transform
} from 'class-transformer';
import { objectIdToString } from 'src/utils';

@Entity('t_user')
export class UserEntity {
  @Transform(id => objectIdToString(id))
  @ObjectIdColumn()
  public id: ObjectID;

  @Column()
  public username: string;

  @Exclude()
  @Column()
  public password: string;
}
