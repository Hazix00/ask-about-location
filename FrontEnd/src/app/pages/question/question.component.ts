import { Component, OnInit } from '@angular/core';
import { UserFavorizedQuestion } from 'src/app/models/userFavorizedQuestion.model';
import { QuestionsService } from 'src/app/services/questions.service';

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.scss']
})
export class QuestionPageComponent implements OnInit {

  questionId!: string
  question!: UserFavorizedQuestion
  constructor(
    private readonly questionsService: QuestionsService
  ) { }

  ngOnInit(): void {
    this.question = history.state
    console.log(history.state)
  }

}
