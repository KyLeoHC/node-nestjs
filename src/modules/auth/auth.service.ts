import {
  Injectable
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  UserNotFoundException,
  UserPasswordIncorrectException
} from 'src/common/exceptions';
import { comparePassword, objectIdToString } from 'src/utils';
import { UserEntity } from 'src/modules/user/entities';
import { UserService } from 'src/modules/user/user.service';
import { LoginUserDto } from './dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService
  ) {
  }

  /**
   * retrieve a user and verify the password
   * @param {LoginUserDto} user
   */
  public async validateUser(user: LoginUserDto): Promise<UserEntity> {
    const targetUser = (await this.userService.findUsersByUsername(user.username))[0];
    if (!targetUser) {
      throw new UserNotFoundException();
    }
    if (!(await comparePassword(user.password, targetUser.password))) {
      throw new UserPasswordIncorrectException();
    }
    return targetUser;
  }

  /**
   * login method
   * @param {LoginUserDto} user
   */
  public async login(user: LoginUserDto): Promise<{ token: string }> {
    const targetUser = await this.validateUser(user);
    const payload = { username: targetUser.username, sub: objectIdToString(targetUser.id) };
    return {
      token: this.jwtService.sign(payload),
    };
  }
}
