import {
  Entity,
  Column
} from 'typeorm';
import {
  Exclude
} from 'class-transformer';
import { BaseEntity } from 'src/common/entities';

@Entity('t_user')
export class UserEntity extends BaseEntity {
  @Column()
  public username: string;

  @Exclude()
  @Column()
  public password: string;
}
