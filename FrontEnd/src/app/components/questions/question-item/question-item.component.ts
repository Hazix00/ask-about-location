import { Component, Input, OnInit } from '@angular/core';
import { UserFavorizedQuestion } from 'src/app/models/userFavorizedQuestion.model';
import { UserFavoritesService } from 'src/app/services/user-favorites.service';

@Component({
  selector: 'app-question-item',
  templateUrl: './question-item.component.html',
  styleUrls: ['./question-item.component.scss']
})
export class QuestionItemComponent implements OnInit {

  @Input() question!: UserFavorizedQuestion
  @Input() titleIsLink!:boolean
  constructor(private readonly userFavorites: UserFavoritesService) { }

  ngOnInit(): void {
  }

  toggleFavorite() {
    if(this.question.isFavorite) {
      this.userFavorites.removeFavorite(this.question.question.id).subscribe(() => {
        this.question.isFavorite = false
      })
    }
    else {
      this.userFavorites.addFavorite({questionId: this.question.question.id}).subscribe(() => {
        this.question.isFavorite = true
      })
    }
  }

}
