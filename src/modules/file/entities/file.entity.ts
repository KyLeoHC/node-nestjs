import {
  Entity,
  Column,
} from 'typeorm';
import {
  Exclude
} from 'class-transformer';
import { BaseEntity } from 'src/common/entities';

export class FileSegment extends BaseEntity {
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
