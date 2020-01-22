import {
  Entity,
  Column
} from 'typeorm';
import { BaseEntity } from 'src/common/entities';

@Entity('t_disk')
export class DiskEntity<T = string> extends BaseEntity {
  @Column()
  public userId: string;

  /**
   * disk usage
   */
  @Column()
  public usedSpace = 0;

  /**
   * file list
   */
  @Column()
  public files: T[] = [];
}
