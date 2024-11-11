import { CommonModule, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Observable, map, of } from 'rxjs';

import { ActivatedRoute } from '@angular/router';
import { OlympicCountry } from 'src/app/core/models';
import { OlympicService } from 'src/app/core/services/olympic.service';

@Component({
  selector: 'app-detail',
  standalone: true,
  imports: [NgIf, CommonModule],
  templateUrl: './detail.component.html',
  styleUrl: './detail.component.scss'
})
export class DetailComponent implements OnInit {
  constructor(private route: ActivatedRoute, private olympicService: OlympicService) {}

  public countryDetails$: Observable<OlympicCountry | null> = of(null);

  countryName: string = '';
  totalEntries: number = 0;
  totalMedals: number = 0;
  totalAthletes: number = 0;

  ngOnInit(): void {
    this.countryName = this.route.snapshot.paramMap.get('country')!;

    this.countryDetails$ = this.olympicService.getOlympics().pipe(
      map((countries: OlympicCountry[] | null) => {
        console.log("countries: ", countries)
        const country = countries?.find(c => c.country === this.countryName) || null;
        if(country) {
          this.totalEntries = country.participations.length;
          this.totalMedals = country.participations.reduce((acc, country) => acc + country.medalsCount, 0);
          this.totalAthletes = country.participations.reduce((acc, country) => acc + country.athleteCount, 0);
        }
        return country
      })
    )
  }

}
