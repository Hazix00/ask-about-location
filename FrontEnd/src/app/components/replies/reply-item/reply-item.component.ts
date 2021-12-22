import { Component, Input, OnInit } from '@angular/core';
import { Reply } from 'src/app/models/reply.model';

@Component({
  selector: 'app-reply-item',
  templateUrl: './reply-item.component.html',
  styleUrls: ['./reply-item.component.scss']
})
export class ReplyItemComponent implements OnInit {

  @Input() reply!: Reply

  constructor() { }

  ngOnInit(): void {
  }

}
