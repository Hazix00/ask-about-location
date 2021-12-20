import { Component, Input, OnInit } from '@angular/core';
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
  favoriteQuestionIds = new Array<{ questionId: string, createdAt:Date }>()
  page:number = 1
  limit:number = 10
  totalResults!: number

  searchType: 'byLocation' | 'byLatest' | 'bySearchTerms' | 'byFavorites' = 'byLatest'

  constructor(
    private readonly questionsService: QuestionsService,
    private readonly favoritesService: UserFavoritesService,
    private readonly searchDataService: SearchDataService,
    private readonly _snackBar: MatSnackBar,
    private readonly router: Router
  ) { }

  ngOnInit(): void {
    this.refresh()
  }

  refresh() {
    this.searchDataService.get().subscribe( data => {
      if(data) {
        this.getBySearchFields(data)
      }
    })
    this.getFavoriteQuestionIds()
    this.pageUrl = this.router.url
    if(this.pageUrl === '/home') {
      this.getLocation()
    }
    else if(this.router.url === '/favorite-questions') {
      this.getFavoriteQuestions()
    }
  }

  onPageChanges(pageEnvent: PageEvent) {
    this.page = pageEnvent.pageIndex
    this.limit = pageEnvent.pageSize
    console.log('onPageChanges executed!')
    this.refresh()
  }

  getBySearchFields(data: SearchDataDTO) {
    console.log(data)
    this.questionsService.getSearchTerms(this.page, this.limit, data).subscribe(
      this.mappingFavorizedQuestion,
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
            this.mappingFavorizedQuestion,
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
    this.questionsService.getLatest(this.page, this.limit).subscribe(
      this.mappingFavorizedQuestion,
      error => console.log(error)
    )
  }

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

  private getFavoriteQuestionIds() {
    this.favoritesService.getQuestionsIds().subscribe(
      userFavorites => {
        this.favoriteQuestionIds = userFavorites[0]._source.favoriteQuestionsIds
        console.log('/favorites/question-ids', userFavorites)
      },
      error => console.log(error)
    )
  }

  mappingFavorizedQuestion = (dtoQuestionsResult: PaginationApiModelDTO<FilteredQuestionDTO>) => {
    // The Questions mapping
    this.questions = dtoQuestionsResult.hits.map( dtoQuestion => {
      let isFavorite = false
      if(this.favoriteQuestionIds.find(favQuestion => favQuestion.questionId === dtoQuestion._id))
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
