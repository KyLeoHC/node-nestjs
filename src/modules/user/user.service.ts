import {
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ObjectID } from 'mongodb';
import {
  Repository,
  ObjectLiteral
} from 'typeorm';
import { UserExistException } from 'src/common/exceptions';
import { hashPassword } from 'src/utils';
import { UserEntity } from './entities';
import { CreateUserDto } from './dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>
  ) {
  }

  /**
   * count user by username
   * @param username
   */
  public async countUserByUsername(username: string): Promise<number> {
    // Refer to this issue:
    // 'https://github.com/typeorm/typeorm/issues/2446'
    return await this.userRepository.count({
      username: { $eq: username }
    } as ObjectLiteral);
  }

  /**
   * create new user
   * @param {CreateUserDto} createUserDto
   */
  public async createUser(createUserDto: CreateUserDto): Promise<void> {
    if ((await this.countUserByUsername(createUserDto.username)) > 0) {
      throw new UserExistException();
    }
    const newUser = new UserEntity();
    newUser.username = createUserDto.username;
    newUser.password = await hashPassword(createUserDto.password);
    this.userRepository.save(newUser);
  }

  /**
   * fine user data by id
   * @param {string} username - user name
   */
  public async findUserById(id: string): Promise<UserEntity | undefined> {
    return await this.userRepository.findOne({
      where: {
        _id: { $eq: ObjectID(id) }
      }
    });
  }

  /**
   * fine user data
   * @param {string} username - user name
   */
  public async findUser(username: string): Promise<UserEntity[] | undefined> {
    return await this.userRepository.find({
      where: {
        username: { $eq: username }
      }
    });
  }
}
