import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { City } from '../models/city.model';

@Injectable({
  providedIn: 'root'
})
export class CitiesService {
  endpoint = environment.apiUrl + '/cities'
  constructor(private readonly http: HttpClient) {}

  get(search:string, match: boolean = false): Observable<City[]> {
    return this.http.get<City[]>(this.endpoint + `?search=${search}&match=${match}`)
  }
}
