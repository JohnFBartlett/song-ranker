import { Component, OnInit } from '@angular/core';
import { Option } from '../models/option';
import { HeroService } from '../services/hero.service';

@Component({
  selector: 'app-heroes',
  templateUrl: './heroes.component.html',
  styleUrls: ['./heroes.component.css'],
})
export class HeroesComponent implements OnInit {
  heroes: Option[] | undefined;

  constructor(private heroService: HeroService) {}

  ngOnInit() {
    this.getCategories();
  }

  getCategories(): void {
    this.heroService
      .getCategories()
      .subscribe((heroes) => (this.heroes = heroes));
  }
}
