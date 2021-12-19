import { Component, OnInit } from '@angular/core';
import { ApiModelDTO } from 'src/app/dtos/apiModel.dto';
import { FilteredQuestionDTO } from 'src/app/dtos/questions/filteredQuestion.dto';
import { QuestionsService } from 'src/app/services/questions.service';

@Component({
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  questions: ApiModelDTO<FilteredQuestionDTO>[] = []
  page:number = 1
  limit:number = 10
  constructor(private readonly questionsService: QuestionsService) { }

  ngOnInit(): void {
    this.questionsService.getLatest(this.page, this.limit).subscribe(
      questions => {
        console.log('getLatest')
        console.log(questions)
      },
      error => console.log(error)
    )
    this.questionsService.getByDistanceCloseToUserLocation(this.page, this.limit, {lat: 33, lon: -7}).subscribe(
      questions => {
        console.log('getByDistanceCloseToUserLocation')
        console.log(questions)
      },
      error => console.log(error)
    )
    this.questionsService.getSearchTerms(this.page, this.limit, 'city', ['title']).subscribe(
      questions => {
        console.log('getSearchTerms')
        console.log(questions)
      },
      error => console.log(error)
    )
  }

}
