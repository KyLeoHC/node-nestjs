import {
  Entity,
  Column,
  ObjectID,
  ObjectIdColumn
} from 'typeorm';

@Entity('t_disk')
export class DiskEntity<T = string> {
  @ObjectIdColumn()
  public id: ObjectID;

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
