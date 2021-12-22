import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { PaginationApiModelDTO } from 'src/app/dtos/paginationApiModel.dto';
import { FilteredQuestionDTO } from 'src/app/dtos/questions/filteredQuestion.dto';
import { SearchDataDTO } from 'src/app/dtos/searchData.dto';
import { UserFavorizedQuestion } from 'src/app/models/userFavorizedQuestion.model';
import { QuestionsService } from 'src/app/services/questions.service';
import { SearchDataService } from 'src/app/services/search-data.service';
import { UserFavoritesService } from 'src/app/services/user-favorites.service';

@Component({
  selector: 'app-question-list',
  templateUrl: './question-list.component.html',
  styleUrls: ['./question-list.component.scss']
})
export class QuestionListComponent implements OnInit {

  pageUrl!: string
  questions: UserFavorizedQuestion[] = []
  page:number = 0
  limit:number = 10
  totalResults!: number
  loading = true
  searchData: SearchDataDTO | null = null

  constructor(
    private readonly questionsService: QuestionsService,
    private readonly favoritesService: UserFavoritesService,
    private readonly searchDataService: SearchDataService,
    private readonly _snackBar: MatSnackBar,
    private readonly router: Router,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    // loading questions
    this.refresh()
    // get the search submitted data
    this.searchDataService.get().subscribe( data => {
      if(!data) {
        this.page = 0 // get to the first page when search is cancelled
      }
      this.searchData = data
      this.refresh()
    })
  }

  refresh() {
    this.loading = true
    // search if searchData is set
    if(this.searchData){
      this.getBySearchFields(this.searchData)
    }
    else { //else load questions of the current page
      this.pageUrl = this.router.url
      if(this.pageUrl === '/home') {
        this.getLocation()
      }
      else if(this.router.url === '/favorite-questions') {
        this.getFavoriteQuestions()
      }
    }

    this.loading = false
  }
  // pagination
  onPageChanges(pageEnvent: PageEvent) {
    this.page = pageEnvent.pageIndex
    this.limit = pageEnvent.pageSize
    console.log('onPageChanges executed!')
    this.refresh()
  }
  // handle search
  getBySearchFields(data: SearchDataDTO) {
    console.log(data)
    this.questionsService.getSearchTerms(this.page, this.limit, data).subscribe(
      this.mappingFavorizedQuestion,
      error => console.log(error)
    )
  }
  //try to sort questions by location distance
  private getLocation(): void{
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position)=>{
          const {longitude, latitude} = position.coords;
          //getting sorted questions
          this.questionsService.getByDistanceCloseToUserLocation(
            this.page,
            this.limit,
            {lat: latitude, lon: longitude}
          )
          .subscribe(
            this.mappingFavorizedQuestion,
            error => console.log(error)
          )
        },
        this.locationError // error handler
      );
    } else {
      console.log("No support for geolocation")
    }
  }
  // handle position errors
  private locationError = (error: GeolocationPositionError) => {
    if(error.code === GeolocationPositionError.PERMISSION_DENIED) {
      this.openSnackBar()
    }
    this.questionsService.getLatest(this.page, this.limit).subscribe(
      this.mappingFavorizedQuestion,
      error => console.log(error)
    )
  }
  // Warning message about browser location service
  openSnackBar() {
    this._snackBar.open("Allow your browser location to get the closest question locations!", "Ok", {
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });
  }

  private getFavoriteQuestions() {
    this.favoritesService.getQuestions(this.page, this.limit).subscribe(
      this.mappingFavorizedQuestion,
      error => console.log(error)
    )
  }
  // mapping to UserFavorizedQuestion objects
  mappingFavorizedQuestion = (dtoQuestionsResult: PaginationApiModelDTO<FilteredQuestionDTO>) => {
    // The Questions mapping
    this.questions = dtoQuestionsResult.hits.map( dtoQuestion => {
      let isFavorite = false
      if(this.favoritesService.favoriteQuestionsIds?.find(qId => qId === dtoQuestion._id))
        isFavorite = true
      const question = dtoQuestion._source
      question.id = dtoQuestion._id
      return {
        isFavorite,
        question
      } as UserFavorizedQuestion
    })
    // Get total results
    this.totalResults = dtoQuestionsResult.total
  }


}
