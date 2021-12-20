import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  pageUrl!: string
  searchData!: {search:string, fields:string[]}

  constructor(
    private readonly router: Router
  ) { }

  ngOnInit(): void {
    this.pageUrl = this.router.url

  }
  sendSearchData(data: {search:string, fields:string[]}) {
    this.searchData = data
  }

}
