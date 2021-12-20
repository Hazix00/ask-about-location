import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ApiModelDTO } from '../dtos/apiModel.dto';
import { FilteredQuestionDTO } from '../dtos/questions/filteredQuestion.dto';
import { PostQuestionDTO } from '../dtos/questions/postQuestion.dto';
import { PostQuestionReplyDTO } from '../dtos/questions/postQuestionReply.dto';
import { SearchDataDTO } from '../dtos/searchData.dto';
import { Coordinates } from '../models/coordinates.model';
import { Question } from '../models/question.model';
import { Reply } from '../models/replie.model';

@Injectable({
  providedIn: 'root'
})
export class QuestionsService {

  private endpoint = environment.apiUrl + '/questions'

  constructor(private readonly http: HttpClient) { }

  private getQuestions(qParams: string) {
    return this.http.get<ApiModelDTO<FilteredQuestionDTO>[]>(this.endpoint + qParams)
  }
  getLatest(page: number, limit: number) {
    const qParams = `?page=${page}&limit=${limit}`

    return this.getQuestions(qParams)
  }
  getByDistanceCloseToUserLocation(page: number,limit: number, coordinates: Coordinates) {
    const qParams = `?page=${page}&limit=${limit}&lat=${coordinates.lat}&lon=${coordinates.lon}`

    return this.getQuestions(qParams)
  }
  getSearchTerms(page: number,limit: number, searchData: SearchDataDTO) {
    let qParams = `?page=${page}&limit=${limit}&search=${searchData.search}`
    searchData.fields.forEach( searchField => qParams += '&field='+ searchField)

    return this.getQuestions(qParams)
  }
  getById(questionId: string) {
    return this.http.get<ApiModelDTO<FilteredQuestionDTO>[]>(this.endpoint + '/' + questionId)
  }

  addQuestion(question: PostQuestionDTO) {
    this.http.post<Question>(this.endpoint, question)
  }
  addQuestionReply(reply: PostQuestionReplyDTO) {
    this.http.post<Reply>(this.endpoint, reply)
  }
}
