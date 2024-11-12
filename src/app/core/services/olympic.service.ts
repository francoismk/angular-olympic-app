import { BehaviorSubject, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { OlympicCountry } from '../models';

@Injectable({
  providedIn: 'root',
})
export class OlympicService {
  private readonly olympicUrl = './assets/mock/olympic.json';
  private readonly olympics$ = new BehaviorSubject<OlympicCountry[] | null>(null);
  private readonly error$ = new BehaviorSubject<boolean>(false);

  constructor(private readonly http: HttpClient) {}

  loadInitialData() {
    return this.http.get<OlympicCountry[]>(this.olympicUrl).pipe(
      tap((value) => {
        this.error$.next(false);
        this.olympics$.next(value);
      }),
      catchError((error) => {
        console.error('Error when data loading: ', error);
        this.olympics$.next(null);
        this.error$.next(true);
        return of(null);
      })
    );
  }

  getOlympics() {
    return this.olympics$.asObservable();
  }

  getError(){
    return this.error$.asObservable();
  }
}
