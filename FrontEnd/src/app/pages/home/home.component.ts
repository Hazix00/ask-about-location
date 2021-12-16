import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  message!: string

  constructor(private readonly http: HttpClient) { }

  ngOnInit(): void {
    this.testBackend('http://localhost:7001/api/test/all-user').subscribe((data:any) => {
      if(data.message){
        this.message = data.message
      }
      else {
        this.message = data
      }
    })
  }

  testBackend(url: string) {
    return this.http.get(url);
  }

}
