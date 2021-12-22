import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Reply } from '../models/reply.model';

@Injectable({
  providedIn: 'root'
})
export class ReplyDataService {
  private subject = new Subject<Reply>()

  set = (data: Reply) => this.subject.next(data)
  get = () => this.subject.asObservable()
}
