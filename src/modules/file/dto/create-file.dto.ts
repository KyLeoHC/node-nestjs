import {
  IsString,
  IsNumber,
  IsNotEmpty
} from 'class-validator';

export class CreateFileDto {
  @IsNotEmpty()
  @IsString()
  public filename: string;

  @IsNotEmpty()
  @IsString()
  public hash: string;

  @IsNotEmpty()
  @IsNumber()
  public segmentCount: number;
}
