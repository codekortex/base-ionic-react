import { User } from '../entities/User';

export interface IUserRepository {
  getAllUsers(): Promise<User[]>;
  addUser(user: User): Promise<User>;
  updateUser(user: User): Promise<User>;
  deleteUser(id: number): Promise<void>;
}
