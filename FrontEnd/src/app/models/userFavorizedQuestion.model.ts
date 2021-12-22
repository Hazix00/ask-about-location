import { FilteredQuestionDTO } from "../dtos/questions/filteredQuestion.dto";

export class UserFavorizedQuestion {
  isFavorite: boolean = false
  question!: FilteredQuestionDTO
}
