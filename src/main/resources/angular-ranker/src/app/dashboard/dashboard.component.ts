import { Component, OnInit } from '@angular/core';
import { Category } from '../models/category';
import { Option } from '../models/option';
import { HeroService } from '../services/hero.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  categories: Category[] = [];

  constructor(private heroService: HeroService) {}

  ngOnInit() {
    this.getCategories();
  }

  getCategories(): void {
    this.heroService.getCategories().subscribe((categories) => {
      console.log(categories);
      this.categories = categories.slice(0, 4);
    });
  }
}
