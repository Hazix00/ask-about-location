import { City } from "src/app/models/city.model";
import { User } from "src/app/models/user.model";

export interface FilteredQuestionDTO {
  id: string
  title: string
  content: string
  city: City
  user: User
  createdAt: Date
}
