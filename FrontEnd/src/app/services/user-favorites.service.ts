import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ApiModelDTO } from '../dtos/apiModel.dto';
import { FavorizeQuestionDTO } from '../dtos/favorites/favorizeQuestion.dto';
import { PaginationApiModelDTO } from '../dtos/paginationApiModel.dto';
import { FilteredQuestionDTO } from '../dtos/questions/filteredQuestion.dto';
import { Favorite } from '../models/favorite.model';

@Injectable({
  providedIn: 'root'
})
export class UserFavoritesService {

  private endpoint = environment.apiUrl + '/favorites'

  favoriteQuestionsIds:string[] | null = null

  constructor(private readonly http: HttpClient) {
    this.getQuestionsIds()
  }

  getQuestions(page: number, limit: number) {
    const qParams = `?page=${page}&limit=${limit}`
    return this.http.get<PaginationApiModelDTO<FilteredQuestionDTO>>(this.endpoint + qParams)
  }

  getQuestionsIds() {
    this.http.get<ApiModelDTO<Favorite>[]>(this.endpoint + '/question-ids')
    .subscribe((data) => {
      this.favoriteQuestionsIds = data[0]._source.favoriteQuestionsIds.map( id => id.questionId)
    })
  }

  private listenToAction(observer: Observable<any>) {
    observer.subscribe(() => {
      this.getQuestionsIds()
    })
  }

  addFavorite(favorizeQuestion: FavorizeQuestionDTO) {
    const addFavoriteObservable = this.http.post<ApiModelDTO<Favorite>[]>(this.endpoint, favorizeQuestion)
    this.listenToAction(addFavoriteObservable)
    return addFavoriteObservable
  }
  removeFavorite(questionId: string) {
    const removeFavoriteObservable = this.http.delete(this.endpoint + '/' + questionId)
    this.listenToAction(removeFavoriteObservable)
    return removeFavoriteObservable
  }
}
function tap(arg0: (data: any) => void): import("rxjs").OperatorFunction<ApiModelDTO<Favorite>[], unknown> {
  throw new Error('Function not implemented.');
}

