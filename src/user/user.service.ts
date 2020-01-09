import { Injectable } from '@nestjs/common';
import { hashPasswordSync } from '../utils';
import { User } from './entities';

@Injectable()
export class UserService {
  private readonly users: User[];

  constructor() {
    this.users = [
      {
        userId: '1a',
        username: 'john',
        password: hashPasswordSync('changeme')
      },
      {
        userId: '2b',
        username: 'chris',
        password: hashPasswordSync('secret')
      },
      {
        userId: '3c',
        username: 'maria',
        password: hashPasswordSync('guess')
      }
    ];
  }

  /**
   * fine one user data
   * @param {string} username - user name
   */
  public async findUser(username: string): Promise<User | undefined> {
    return this.users.find(user => user.username === username);
  }
}
