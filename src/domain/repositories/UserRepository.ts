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
    return await this.userService.getUserById(id);
  }

  async addUser(user: User): Promise<number> {
    return await this.userService.addUser(user);
  }

  async updateUser(user: User): Promise<void> {
    await this.userService.updateUser(user);
  }

  async deleteUser(id: number): Promise<void> {
    await this.userService.deleteUser(id);
  }
}
