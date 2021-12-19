import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ApiModelDTO } from '../dtos/apiModel.dto';
import { FilteredQuestionDTO } from '../dtos/questions/filteredQuestion.dto';
import { Coordinates } from '../models/coordinates.model';

@Injectable({
  providedIn: 'root'
})
export class QuestionsService {

  private endpoint = environment.apiUrl + '/questions'

  constructor(private readonly http: HttpClient) { }

  private getQuestions(params: HttpParams) {
    return this.http.get<ApiModelDTO<FilteredQuestionDTO>[]>(this.endpoint, {params})
  }
  getLatest(page: number, limit: number) {
    const params = new HttpParams()
    params.append('page', page)
    params.append('limit', limit)

    return this.getQuestions(params)
  }
  getByDistanceCloseToUserLocation(page: number,limit: number, coordinates: Coordinates) {
    const params = new HttpParams()
    params.append('page', page)
    params.append('limit', limit)
    params.append('lat', coordinates.lat)
    params.append('lon', coordinates.lon)

    return this.getQuestions(params)
  }
  getSearchTerms(page: number,limit: number, searchValue:string , searchFields: string[]) {
    const params = new HttpParams()
    params.append('page', page)
    params.append('limit', limit)
    searchFields.forEach( searchField => params.append('field', searchField))

    return this.getQuestions(params)
  }
  getById(questionId: string) {
    return this.http.get<ApiModelDTO<FilteredQuestionDTO>[]>(this.endpoint + '/' + questionId)
  }
}
