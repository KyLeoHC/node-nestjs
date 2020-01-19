import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  UseInterceptors,
  ClassSerializerInterceptor
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { User } from '../auth/decorators';
import { AuthUser } from '../auth/interfaces';
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
  public async getUserInfo(@User() user: AuthUser): Promise<UserEntity | undefined> {
    return await this.userService.findUserById(user.id);
  }

  @Post('register')
  public async registerAccount(
    @Body() createUserDto: CreateUserDto
  ): Promise<void> {
    await this.userService.createUser(createUserDto);
  }
}
