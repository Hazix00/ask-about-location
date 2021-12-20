import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {

  @Output() searchEvent = new EventEmitter<{search:string, fields:string[]}>();
  searchControl = new FormControl('', Validators.required)
  fields = new FormControl('', Validators.required)

  constructor() { }

  ngOnInit(): void {
  }

  search() {
    if(this.fields.valid && this.searchControl.valid){
      const searchParams = {
        search: this.searchControl.value,
        fields: this.fields.value
      }
      this.searchEvent.emit(searchParams)
    }
  }

}
