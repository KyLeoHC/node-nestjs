import {
  IsString,
  IsNotEmpty
} from 'class-validator';

export class MergeFileDto {
  @IsNotEmpty()
  @IsString()
  public id: string;
}
