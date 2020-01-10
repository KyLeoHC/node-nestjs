import {
  IsString,
  IsNotEmpty
} from 'class-validator';

export class LoginUserDto {
  @IsString()
  @IsNotEmpty({ message: 'username can not be empty' })
  public readonly username: string;

  @IsString()
  @IsNotEmpty({ message: 'password can not be empty' })
  public readonly password: string;
}
