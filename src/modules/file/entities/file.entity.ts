import {
  Entity,
  Column,
  ObjectID,
  ObjectIdColumn,
} from 'typeorm';
import {
  Transform,
  Exclude
} from 'class-transformer';
import { objectIdToString } from 'src/utils';

export class FileSegment {
  @Column()
  public hash = '';

  @Column()
  public size = 0;

  @Column()
  public completeTime = 0;
}

/**
 * file entity
 */
@Entity('t_file')
export class FileEntity extends FileSegment {
  @Transform(id => objectIdToString(id))
  @ObjectIdColumn()
  public id: ObjectID;

  @Column()
  public filename: string;

  @Exclude()
  @Column()
  public serverFilename: string;

  @Column()
  public segments: FileSegment[] = [];

  /**
   * file create time
   */
  @Column()
  public createTime: number;
}
