import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { SearchDataService } from 'src/app/services/search-data.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {

  searchControl = new FormControl('', Validators.required)
  fields = new FormControl('', Validators.required)

  constructor(private readonly searchDataService: SearchDataService) { }

  ngOnInit(): void {
  }

  search() {
    if(this.fields.valid && this.searchControl.valid){
      const searchParams = {
        search: this.searchControl.value,
        fields: this.fields.value
      }
      this.searchDataService.set(searchParams)
    }
  }

}
