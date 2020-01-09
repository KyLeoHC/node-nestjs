import { IsString } from 'class-validator';

export class LoginUserDto {
  @IsString()
  public readonly username: string;
  @IsString()
  public readonly password: string;
}
