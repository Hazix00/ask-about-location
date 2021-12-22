import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AddQuestionComponent } from 'src/app/components/questions/add-question/add-question.component';
import { QuestionsService } from 'src/app/services/questions.service';

@Component({
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomePageComponent implements OnInit {

  pageUrl!: string
  searchData!: {search:string, fields:string[]}

  constructor(
    private readonly router: Router,
    public dialog: MatDialog,
    private readonly questionsService: QuestionsService
  ) { }

  ngOnInit(): void {
    this.pageUrl = this.router.url
  }
  // Add question dialog
  openDialog(): void {
    let dialogRef = this.dialog.open(AddQuestionComponent, {
      width: '600px',
      data: 'Add Post'
    });
    // handle adding question
    dialogRef.componentInstance.event.subscribe((result) => {
      // console.log(result)
      this.questionsService.addQuestion(result).subscribe( data => {
        console.log(data)
        this.reloadCurrentRoute()
      })
    });
  }

  // refrech page without browser refresh
  reloadCurrentRoute() {
    let currentUrl = this.router.url;
    this.router.navigateByUrl('/question', {skipLocationChange: true}).then(() => {
        this.router.navigate(['/home']);
        console.log(currentUrl);
    });
  }

}
