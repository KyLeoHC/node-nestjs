import {
  Controller,
  Get,
  UseGuards,
  Request
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JwtUser } from '../auth/interfaces';

@Controller('user')
export class UserController {
  @UseGuards(AuthGuard())
  @Get('profile')
  public getUserInfo(@Request() req): JwtUser {
    return req.user;
  }
}
