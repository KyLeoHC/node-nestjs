import { FileEntity } from '../entities';

export class UserFilesDto {
  public usedSpace = 0;
  public count = 0;
  public files: Pick<FileEntity, 'id' | 'size' | 'createTime' | 'filename'>[] = [];
}
