import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ApiModelDTO } from '../dtos/apiModel.dto';
import { FilteredQuestionDTO } from '../dtos/questions/filteredQuestion.dto';
import { Favorite } from '../models/favorite.model';

@Injectable({
  providedIn: 'root'
})
export class UserFavoritesService {

  private endpoint = environment.apiUrl + '/favorites'

  constructor(private readonly http: HttpClient) { }

  getQuestions(page: number, limit: number) {
    const qParams = `?page=${page}&limit=${limit}`
    return this.http.get<ApiModelDTO<FilteredQuestionDTO>[]>(this.endpoint + qParams)
  }

  getQuestionsIds() {
    return this.http.get<ApiModelDTO<Favorite>[]>(this.endpoint + '/question-ids')
  }
}
