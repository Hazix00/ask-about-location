import { UserDTO } from "../user.dto";

export interface GetUserFavoriteQuestions {
  from: string,
  size: string,
  user: UserDTO
}
