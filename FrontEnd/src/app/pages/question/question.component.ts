import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserFavorizedQuestion } from 'src/app/models/userFavorizedQuestion.model';
import { QuestionsService } from 'src/app/services/questions.service';
import { UserFavoritesService } from 'src/app/services/user-favorites.service';

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.scss']
})
export class QuestionPageComponent implements OnInit {

  questionId!: string
  question = new UserFavorizedQuestion()
  questionIsSet = false

  constructor(
    private readonly route: ActivatedRoute,
    private readonly questionsService: QuestionsService,
    private readonly userFavoritesService: UserFavoritesService,
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe( (param) => {
      this.questionId= param.questionId
    })
    this.refreshQuesionReplies()
  }

  refreshQuesionReplies() {
    this.questionsService.getById(this.questionId)
      .subscribe( questionDTO => {
        let isFavorite = false
        if(this.userFavoritesService.favoriteQuestionsIds?.includes(this.questionId)) {
          isFavorite = true
        }
        this.question = {
          isFavorite,
          question: questionDTO[0]._source
        }
        this.question.question.id = this.questionId
        this.question.question.replies.sort((a, b) => {
          if(a.createdAt > b.createdAt) return 1
          if(a.createdAt < b.createdAt) return -1
          return 0
        })
        this.questionIsSet = true
        console.log(this.question)
      })
  }

}
