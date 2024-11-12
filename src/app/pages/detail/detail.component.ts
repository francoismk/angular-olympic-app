import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { Observable, map, of } from 'rxjs';

import { OlympicCountry } from 'src/app/core/models';
import { OlympicService } from 'src/app/core/services/olympic.service';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrl: './detail.component.scss'
})
export class DetailComponent implements OnInit {
  constructor(private readonly route: ActivatedRoute, private readonly olympicService: OlympicService, private readonly router: Router) {}

  public countryDetails$: Observable<OlympicCountry | null> = of(null);


  countryName: string = '';
  totalEntries: number | null = null;
  totalMedals: number | null = null;
  totalAthletes: number | null = null;
  chartData: any[] = [];

  view: any =  [window.innerWidth * 0.9, 400];
  colorScheme: any = {
    domain: ['#5AA454', '#E44D25', '#CFC0BB', '#7aa3e5', '#a8385d', '#aae3f5']
  };
  gradient: boolean = true;
  legend = true;
  showXAxisLabel = true;
  showYAxisLabel = true;
  xAxis = true;
  yAxis = true;
  xAxisLabel = 'Dates';
  yAxisLabel = 'Medals';
  timeline = true;

  ngOnInit(): void {
    this.countryName = this.route.snapshot.paramMap.get('country')!;

    this.countryDetails$ = this.olympicService.getOlympics().pipe(
      map((countries: OlympicCountry[] | null) => {
        const country = countries?.find(c => c.country === this.countryName) || null;
        if (!country) {
          this.router.navigateByUrl('**')
          return null;
        }

        this.totalEntries = country.participations.length;
        this.totalMedals = country.participations.reduce((acc, participations) => acc + participations.medalsCount, 0);
        this.totalAthletes = country.participations.reduce((acc, participations) => acc + participations.athleteCount, 0);
        this.prepareChartData(country);
        return country;
      })
    );
    window.addEventListener('resize', this.onResize);
  }
  ngOnDestroy(): void {
    window.removeEventListener('resize', this.onResize);
  }

    onResize = () => {
      this.view = [window.innerWidth * 0.9, 300];
    };

  prepareChartData(country: OlympicCountry): void {
    this.chartData = [
      {
        name: country.country,
        series: country.participations.map(participation => ({
          name: participation.year.toString(),
          value: participation.medalsCount
        }))
      }
    ];
  }

}
