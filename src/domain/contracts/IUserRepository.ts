import { User } from '../entities/User';

export interface IUserRepository {
  getAllUsers(): Promise<User[]>;
  getUserById(id: number): Promise<User | undefined>;
  addUser(user: User): Promise<number>;
  updateUser(user: User): Promise<void>;
  deleteUser(id: number): Promise<void>;
}
