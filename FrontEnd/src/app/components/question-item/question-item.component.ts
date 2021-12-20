import { Component, Input, OnInit } from '@angular/core';
import { ApiModelDTO } from 'src/app/dtos/apiModel.dto';
import { FilteredQuestionDTO } from 'src/app/dtos/questions/filteredQuestion.dto';
import { UserFavorizedQuestion } from 'src/app/models/userFavorizedQuestion.model';

@Component({
  selector: 'app-question-item',
  templateUrl: './question-item.component.html',
  styleUrls: ['./question-item.component.scss']
})
export class QuestionItemComponent implements OnInit {

  @Input() question!: UserFavorizedQuestion
  constructor() { }

  ngOnInit(): void {
  }

}
