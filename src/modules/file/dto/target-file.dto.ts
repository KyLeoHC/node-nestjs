import {
  IsString,
  IsNotEmpty
} from 'class-validator';

export class TargetFileDto {
  @IsNotEmpty()
  @IsString()
  public id: string;
}
