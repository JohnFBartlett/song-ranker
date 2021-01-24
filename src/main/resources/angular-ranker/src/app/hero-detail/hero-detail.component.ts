import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { HeroService } from '../services/hero.service';

import { Option } from '../models/option';
import { Category } from '../models/category';

@Component({
  selector: 'app-hero-detail',
  templateUrl: './hero-detail.component.html',
  styleUrls: ['./hero-detail.component.css'],
})
export class HeroDetailComponent implements OnInit {
  category: Category | undefined;
  hero: Option = { name: 'choice1' };

  constructor(
    private route: ActivatedRoute,
    private heroService: HeroService,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.getHero();
  }

  getHero(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.heroService
        .getCategory(+id)
        .subscribe((hero) => (this.category = hero));
    }
  }

  goBack(): void {
    this.location.back();
  }

  save(): void {
    this.heroService.updateOption(this.hero).subscribe(() => this.goBack());
  }
}
