import { Component, OnInit } from '@angular/core';
import { Observable, map, of } from 'rxjs';

import { OlympicCountry } from 'src/app/core/models';
import { OlympicService } from 'src/app/core/services/olympic.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  public olympics$: Observable<OlympicCountry[] | null> = of(null);
  public chartData$: Observable<{name: string, value: number}[] | null> = of(null);

  view: any = [700, 400];
  colorScheme: any = {
    domain: ['#956065', '#793D52', '#8AA1DB', '#9780A1', '#BEE0F1', '#B9CBE7']
  };
  gradient: boolean = true;
  showLabels: boolean = true;

  constructor(private olympicService: OlympicService) {}

  ngOnInit(): void {
    this.olympics$ = this.olympicService.getOlympics();

    this.chartData$ = this.olympics$.pipe(
      map((countries) => {
        console.log('Received countries:', countries);
        if (!countries) {
          return []
        }
        return countries.map(country =>({
          name: country.country,
          value: country.participations.reduce((acc, participations) => acc + participations.medalsCount, 0)
        }))
      })
    )
  }
}
