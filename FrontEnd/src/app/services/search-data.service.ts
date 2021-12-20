import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { SearchDataDTO } from '../dtos/searchData.dto';

@Injectable({
  providedIn: 'root'
})
export class SearchDataService {
  private subject = new Subject<SearchDataDTO>()

  set = (data: SearchDataDTO) => this.subject.next(data)
  get = () => this.subject.asObservable()
  clear = () => this.subject.next()
}
