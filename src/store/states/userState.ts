import { User } from "../../domain/entities/User";

export interface UserState {
  users: User[];
  loading: boolean;
  error: string | null;
}