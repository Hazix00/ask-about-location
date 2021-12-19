import { Component, Input, OnInit } from '@angular/core';
import { ApiModelDTO } from 'src/app/dtos/apiModel.dto';
import { FilteredQuestionDTO } from 'src/app/dtos/questions/filteredQuestion.dto';

@Component({
  selector: 'app-question-item',
  templateUrl: './question-item.component.html',
  styleUrls: ['./question-item.component.scss']
})
export class QuestionItemComponent implements OnInit {

  @Input() question!: ApiModelDTO<FilteredQuestionDTO>
  constructor() { }

  ngOnInit(): void {
  }

}
