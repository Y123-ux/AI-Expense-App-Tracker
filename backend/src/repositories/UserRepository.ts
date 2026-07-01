import { BaseRepository } from './BaseRepository';
import { User } from '../models/User';

export class UserRepository extends BaseRepository<User> {
  constructor() {
    super('users');
  }

  findByEmail(email: string): User | undefined {
    return this.db
      .prepare('SELECT * FROM users WHERE email = ?')
      .get(email) as User | undefined;
  }
}
