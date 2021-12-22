import { Component, Input, OnInit } from '@angular/core';
import { Reply } from 'src/app/models/reply.model';
import { ReplyDataService } from 'src/app/services/replyData.service';

@Component({
  selector: 'app-reply-list',
  templateUrl: './reply-list.component.html',
  styleUrls: ['./reply-list.component.scss']
})
export class ReplyListComponent implements OnInit {

  @Input() replies!: Reply[]

  constructor(
    private readonly replyDataService: ReplyDataService
  ) { }

  ngOnInit(): void {
    this.replyDataService.get()
    .subscribe( replyData => {
      this.replies = [replyData, ...this.replies]
    })
  }

}
