import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
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

  constructor(
    private readonly questionsService: QuestionsService,
    private readonly _snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.getLocation()
  }

  getBySearchFields(data: {search:string, fields:string[]}) {
    console.log(data)
    this.questionsService.getSearchTerms(this.page, this.limit, data.search, data.fields).subscribe(
      questions => {
        this.questions = questions
        console.log(questions)
      },
      error => console.log(error)
    )
  }

  private getLocation(): void{
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position)=>{
            const {longitude, latitude} = position.coords;
            this.questionsService.getByDistanceCloseToUserLocation(
              this.page,
              this.limit,
              {lat: latitude, lon: longitude}
            )
            .subscribe(
              questions => this.questions = questions,
              error => console.log(error)
            )
          },
          this.locationError
        );
    } else {
       console.log("No support for geolocation")
    }
  }

  private locationError = (error: GeolocationPositionError) => {
    if(error.code === GeolocationPositionError.PERMISSION_DENIED) {
      this.openSnackBar()
    }
    this.questionsService.getSearchTerms(this.page, this.limit, 'city', ['title']).subscribe(
      questions => this.questions = questions,
      error => console.log(error)
    )
  }

  openSnackBar() {
    this._snackBar.open("Allow your browser location to get the closest question locations!", "Ok", {
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });
  }

}
