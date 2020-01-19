import {
  IsString,
  IsNotEmpty
} from 'class-validator';

export class UploadFileDto {
  @IsNotEmpty()
  @IsString()
  public id: string;

  @IsNotEmpty()
  @IsString()
  public hash: string;

  @IsNotEmpty()
  @IsString()
  public index: string;
}
