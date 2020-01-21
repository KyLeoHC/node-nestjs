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
  @Exclude()
  @Column()
  public serverFilename: string;

  @Column()
  public hash = '';

  @Column()
  public size = 0;

  @Column()
  public completeTime = 0;
}

export const FILE_ENTITY_TABLE = 't_file';

/**
 * file entity
 */
@Entity(FILE_ENTITY_TABLE)
export class FileEntity extends FileSegment {
  @Transform(id => objectIdToString(id))
  @ObjectIdColumn()
  public id: ObjectID;

  @Column()
  public filename: string;

  @Exclude()
  @Column()
  public segmentDir = '';

  @Column()
  public segments: FileSegment[] = [];

  /**
   * file create time
   */
  @Column()
  public createTime = new Date().getTime();
}
