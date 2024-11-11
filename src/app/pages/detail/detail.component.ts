import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-detail',
  standalone: true,
  imports: [],
  templateUrl: './detail.component.html',
  styleUrl: './detail.component.scss'
})
export class DetailComponent implements OnInit {
  constructor(private route: ActivatedRoute) {}
  countryName: string = '';

  ngOnInit(): void {
    this.countryName = this.route.snapshot.paramMap.get('country')!;
  }

}
