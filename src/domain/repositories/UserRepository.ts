import { UserService } from "../../infrastructure/UserService";
import { IUserRepository } from "../contracts/IUserRepository";
import { User } from "../entities/User";

export class UserRepository implements IUserRepository {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
    this.userService.open().catch((err) => {
      console.error("Failed to open db:", err.stack || err);
    });
  }

  async getAllUsers(): Promise<User[]> {
    return await this.userService.getAllUsers();
  }

  async addUser(user: User): Promise<User> {
    const users = await this.userService.getAllUsers();
    if (users.some((u) => u.email === user.email)) {
      throw new Error(`User with email ${user.email} already exists`);
    }
    const id = await this.userService.addUser(user);
    return { ...user, id };
  }

  async updateUser(user: User): Promise<User> {
    const existingUser = await this.userService.getUserById(user.id);
    if (!existingUser) {
      throw new Error(`User with id ${user.id} not found`);
    }

    if (existingUser.email !== user.email) {
      const users = await this.userService.getAllUsers();
      if (users.some((u) => u.email === user.email)) {
        throw new Error(`User with email ${user.email} already exists`);
      }
    }

    await this.userService.updateUser(user);
    return user;
  }

  async deleteUser(id: number): Promise<void> {
    const user = await this.userService.getUserById(id);
    if (!user) {
      throw new Error(`User with id ${id} not found`);
    }
    await this.userService.deleteUser(id);
  }
}
