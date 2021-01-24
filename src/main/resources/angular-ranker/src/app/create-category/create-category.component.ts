import { Component, OnInit } from '@angular/core';
import { HeroService } from '../services/hero.service';
import { Category } from '../models/category';

@Component({
  selector: 'app-create-category',
  templateUrl: './create-category.component.html',
  styleUrls: ['./create-category.component.css'],
})
export class CreateCategoryComponent implements OnInit {
  constructor(private heroService: HeroService) {}

  ngOnInit(): void {}

  add(name: string): void {
    name = name.trim();
    if (!name) {
      return;
    }
    const category: Category = { name: name, options: [] };
    this.heroService.createCategory(category);
  }
}
