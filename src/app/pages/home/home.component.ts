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
  public chartData$: Observable<{country: string, totalMedals: number}[] | null> = of(null);

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
          country: country.country,
          totalMedals: country.participations.reduce((acc, participations) => acc + participations.medalsCount, 0)
        }))
      })
    )
  }
}
