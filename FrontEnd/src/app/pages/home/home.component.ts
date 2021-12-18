import { Component, OnInit } from '@angular/core';
import { ApiModelDTO } from 'src/app/dtos/apiModel.dto';
import { City } from 'src/app/models/city.model';
import { CitiesService } from 'src/app/services/cities.service';

@Component({
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  cities: ApiModelDTO<City>[] = []

  constructor(private readonly citiesService: CitiesService) { }

  ngOnInit(): void {

    this.citiesService.get('sett').subscribe(
      cities => { // success
        if(cities){
          console.log(cities)
          this.cities = cities
        }
        else {
          console.log('nothing returned')
        }
      },
      err => { // error
        console.log(err)
      }
    )
  }

}
