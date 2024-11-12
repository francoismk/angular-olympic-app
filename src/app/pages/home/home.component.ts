import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Observable, map, of } from 'rxjs';

import { OlympicCountry } from 'src/app/core/models';
import { OlympicService } from 'src/app/core/services/olympic.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  public olympics$: Observable<OlympicCountry[] | null> = of(null);
  public chartData$: Observable<{name: string, value: number}[] | null> = of(null);
  public hasError$: Observable<boolean> = of(false);

  public totalCountries: number | null = null;
  public totalGames: number | null = null;

  view: any =  [window.innerWidth * 0.9, 400];
  colorScheme: any = {
    domain: ['#956065', '#793D52', '#8AA1DB', '#9780A1', '#BEE0F1', '#B9CBE7']
  };
  gradient: boolean = true;
  showLabels: boolean = true;

  constructor(private readonly olympicService: OlympicService, private readonly router: Router, private readonly cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.olympics$ = this.olympicService.getOlympics()
    this.hasError$ = this.olympicService.getError();

    this.chartData$ = this.olympics$.pipe(
      map((countries) => {
        if (!countries) {
          return []
        }

        this.totalCountries = countries.length;

        const allParticipations = countries.flatMap(country => country.participations);
        this.totalGames = new Set(allParticipations.map(participation => participation.year)).size;

        // Force angular to re check for changes after asynchronous data loading
        this.cdr.detectChanges();

        return countries.map(country =>({
          name: country.country,
          value: country.participations.reduce((acc, participations) => acc + participations.medalsCount, 0)
        }))
      })
    )
    window.addEventListener('resize', this.onResize);
  }

  ngOnDestroy(): void {
    window.removeEventListener('resize', this.onResize);
  }

    onResize = () => {
      this.view = [window.innerWidth * 0.9, 300];
    };

  onCountrySelect(event: any): void {
    const country = event?.name;

    if(country) {
      // go to detail page
      this.router.navigateByUrl(`detail/${country}`)
    } else {
      // go to error page
      this.router.navigateByUrl('**')
    }
  }
}
