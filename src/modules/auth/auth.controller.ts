import {
  Controller,
  Post,
  Body
} from '@nestjs/common';
import { LoginUserDto } from './dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {
  }

  @Post('login')
  public async login(@Body() loginUserDto: LoginUserDto): Promise<string> {
    return (await this.authService.login(loginUserDto)).token;
  }
}
