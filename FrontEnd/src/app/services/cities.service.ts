import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ApiModelDTO } from '../dtos/apiModel.dto';
import { City } from '../models/city.model';

@Injectable({
  providedIn: 'root'
})
export class CitiesService {
  endpoint = environment.apiUrl + '/cities'
  constructor(private readonly http: HttpClient) {}

  get(search:string, match: boolean = false): Observable<ApiModelDTO<City>[]> {
    return this.http.get<ApiModelDTO<City>[]>(this.endpoint + `?search=${search}&match=${match}`)
  }
}
