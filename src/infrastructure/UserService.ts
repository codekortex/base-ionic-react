import Dexie, { Table } from 'dexie';
import { User } from '../domain/entities/User';

export class UserService extends Dexie {
  users!: Table<User, number>;

  constructor() {
    super('AppDatabase');
    this.version(1).stores({
      users: '++id, name, email',
    });
  }

  async getAllUsers(): Promise<User[]> {
    return await this.users.toArray();
  }

  async getUserById(id: number): Promise<User | undefined> {
    return await this.users.get(id);
  }

  async addUser(user: User): Promise<number> {
    return await this.users.add(user);
  }

  async updateUser(user: User): Promise<void> {
    await this.users.put(user);
  }

  async deleteUser(id: number): Promise<void> {
    await this.users.delete(id);
  }
}
