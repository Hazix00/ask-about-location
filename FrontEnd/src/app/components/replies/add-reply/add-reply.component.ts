import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { QuestionsService } from 'src/app/services/questions.service';
import { ReplyDataService } from 'src/app/services/replyData.service';

@Component({
  selector: 'app-add-reply',
  templateUrl: './add-reply.component.html',
  styleUrls: ['./add-reply.component.scss']
})
export class AddReplyComponent implements OnInit {

  @Input() questionId!: string
  replyContent = new FormControl('')

  constructor(
    private readonly questionsService: QuestionsService,
    private readonly replyDataService: ReplyDataService
  ) { }

  ngOnInit(): void {

  }

  submitReply() {
    if(this.replyContent.value != '') {
      const postReplyDTO = {
        questionId:this.questionId,
        reply: {
          content: this.replyContent.value
        }
      }

      this.questionsService.addQuestionReply(postReplyDTO)
      .subscribe((reply) => {
        this.replyDataService.set(reply)
        console.log(reply)
      })
    }
  }

}
