import { User } from "./user.model";

export interface Reply {
  content: string
  user: User
  createdAt: Date
}
