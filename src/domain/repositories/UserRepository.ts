import { UserService } from "../../infrastructure/UserService";
import { IUserRepository } from "../contracts/IUserRepository";
import { User } from "../entities/User";

export class UserRepository implements IUserRepository {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
    this.userService.open().catch((err) => {
      console.error('Failed to open db:', err.stack || err);
    });
  }

  async getAllUsers(): Promise<User[]> {
    return await this.userService.getAllUsers();
  }

  async getUserById(id: number): Promise<User | undefined> {
    const user = await this.userService.getUserById(id);
    if (user) {
      return user;
    } else {
      throw new Error(`User with id ${id} not found`);
    }
  }

  async addUser(user: User): Promise<number> {
    const users = await this.userService.getAllUsers();
    if (users.some((u) => u.email === user.email)) {
      throw new Error(`User with email ${user.email} already exists`);
    }
    return await this.userService.addUser(user);
  }

  async updateUser(user: User): Promise<void> {
    const findUser = await this.userService.getUserById(user.id);
    if (findUser) {
      if (findUser.email !== user.email) {
        const users = await this.userService.getAllUsers();
        if (users.some((u) => u.email === user.email)) {
          throw new Error(`User with email ${user.email} already exists`);
        }
      }
    } else {
      throw new Error(`User with id ${user.id} not found`);
    }
  }

  async deleteUser(id: number): Promise<void> {
    const user = await this.userService.getUserById(id);
    if (user) {
      await this.userService.deleteUser(id);
    } else {
      throw new Error(`User with id ${id} not found`);
    }
  }
}
