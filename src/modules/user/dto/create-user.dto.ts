import {
  IsString,
  IsNotEmpty,
  MinLength,
  MaxLength
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty({ message: 'username can not be empty' })
  @MaxLength(50, {
    message: "username is too long"
  })
  public readonly username: string;

  @IsString()
  @IsNotEmpty({ message: 'password can not be empty' })
  @MinLength(6, {
    message: "password is too short"
  })
  public readonly password: string;
}
