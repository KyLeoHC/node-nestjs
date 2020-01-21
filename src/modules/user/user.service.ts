import {
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ObjectID } from 'mongodb';
import {
  MongoRepository,
  ObjectLiteral
} from 'typeorm';
import { UserExistException } from 'src/common/exceptions';
import {
  hashPassword,
  objectIdToString
} from 'src/utils';
import { UserEntity } from './entities';
import { CreateUserDto } from './dto';
import { FileService } from '../file/file.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepo: MongoRepository<UserEntity>,
    private readonly fileService: FileService
  ) {
  }

  /**
   * count user by username
   * @param username
   */
  public async countUserByUsername(username: string): Promise<number> {
    return await this.userRepo.count({
      username: { $eq: username }
    });
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
    // At first, we create a new user data
    await this.userRepo.save(newUser);
    // Then, we create a new disk data that associated with the new user
    await this.fileService.createUserDisk(objectIdToString(newUser.id));
  }

  /**
   * fine user data by id
   * @param {string} username - user name
   */
  public async findUserById(id: string): Promise<UserEntity | undefined> {
    return await this.userRepo.findOne({
      where: {
        _id: { $eq: ObjectID(id) }
      }
    });
  }

  /**
   * fine users data by username
   * @param {string} username - user name
   */
  public async findUsersByUsername(username: string): Promise<UserEntity[]> {
    return await this.userRepo.find({
      where: {
        username: { $eq: username }
      }
    });
  }
}
