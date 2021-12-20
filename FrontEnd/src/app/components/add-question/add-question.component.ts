import { Component, EventEmitter, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ApiModelDTO } from 'src/app/dtos/apiModel.dto';
import { PostQuestionDTO } from 'src/app/dtos/questions/postQuestion.dto';
import { City } from 'src/app/models/city.model';
import { CitiesService } from 'src/app/services/cities.service';

@Component({
  selector: 'app-add-question',
  templateUrl: './add-question.component.html',
  styleUrls: ['./add-question.component.scss']
})
export class AddQuestionComponent implements OnInit {

  questionForm = new FormGroup({
    title: new FormControl('', Validators.required),
    content: new FormControl('', Validators.required),
    city: new FormControl('', Validators.required),
  })
  question!: PostQuestionDTO

  cities!: ApiModelDTO<City>[]

  public event: EventEmitter<PostQuestionDTO> = new EventEmitter();

  constructor(
    public dialogRef: MatDialogRef<AddQuestionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private readonly citiesService: CitiesService
  ) { }

  ngOnInit = () => {
    this.questionForm.get('city')?.valueChanges.subscribe( value => {
      console.log(value)
      this.setCities(value)
    })
  }

  displayFn(apiCity: ApiModelDTO<City>): string {
    return apiCity && apiCity._source.name ? apiCity._source.name : '';
  }

  trackByMethod(index:number, el:ApiModelDTO<City>): string {
    return el._id;
  }

  onInput(event: any) {
    this.setCities(event.target.value)
  }

  setCities(value: string) {
    this.citiesService.get(value).subscribe( cities => {
      this.cities = cities
    })
  }

  onSubmit() {
    if(this.questionForm.valid){
      const value = this.questionForm.getRawValue()
      if(typeof(value.city) == 'string') return
      value.city = value.city._source
      this.event.emit(value)
      this.dialogRef.close()
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
