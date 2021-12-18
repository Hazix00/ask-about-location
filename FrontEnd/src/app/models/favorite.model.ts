import { User } from "./user.model";

export interface Favorite {
  id: string
  user: User
  favoriteQuestionsIds: Array<{ questionId: string, createdAt:Date }>
}
