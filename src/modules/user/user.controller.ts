import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Request,
  UseInterceptors,
  ClassSerializerInterceptor
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JwtUser } from '../auth/interfaces';
import { UserService } from './user.service';
import { UserEntity } from './entities';
import { CreateUserDto } from './dto';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService
  ) {
  }

  @UseGuards(AuthGuard())
  @UseInterceptors(ClassSerializerInterceptor)
  @Get('profile')
  public async getUserInfo(@Request() req): Promise<UserEntity> {
    return await this.userService.findUserById((req.user as JwtUser).id);
  }

  @Post('register')
  public async registerAccount(
    @Body() createUserDto: CreateUserDto
  ): Promise<void> {
    await this.userService.createUser(createUserDto);
  }
}
