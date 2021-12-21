import { FilteredQuestionDTO } from "../dtos/questions/filteredQuestion.dto";

export class UserFavorizedQuestion {
  constructor() {
    // this.question = {
    //   id:'',
    //   title:'',
    //   content:'',
    //   createdAt: new Date(),
    //   replies: [],
    //   user: {
    //     email:'',
    //     username:''
    //   },
    //   city: {
    //     id:'',
    //     name:'',
    //     coordinate: {lat:0, lon:0}
    //   }
    // }
  }
  isFavorite: boolean = false
  question!: FilteredQuestionDTO
}
