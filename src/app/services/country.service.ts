import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class CountryService {
  constructor(private http: HttpClient) {}

  getCountries() {
    return this.http
      .get('https://restcountries.eu/rest/v2/regionalbloc/eu')
      .pipe(map((resp: any[]) => resp.map((country) => ({ name: country.name }))));
  }
}
