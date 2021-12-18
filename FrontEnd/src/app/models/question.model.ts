import { City } from "./city.model";
import { Reply } from "./replies.model";
import { User } from "./user.model";

export interface Question {
  id: string
  title: string
  content: string
  city: City
  user: User
  createdAt: Date
  replies: Reply[]
}
