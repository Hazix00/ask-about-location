import { CityDTO } from "../city.dto";
import { UserDTO } from "../user.dto";

export interface PostQuestionDTO {
  title: string,
  content: string,
  city: CityDTO
}
