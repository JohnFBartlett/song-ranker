import { Component, OnInit } from '@angular/core';
import { HeroService } from '../services/hero.service';
import { Category } from '../models/category';
import { Option } from '../models/option';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-category',
  templateUrl: './create-category.component.html',
  styleUrls: ['./create-category.component.css'],
})
export class CreateCategoryComponent implements OnInit {
  constructor(private heroService: HeroService, private router: Router) {}

  ngOnInit(): void {}

  async addCategory(name: string, optionString: string): Promise<void> {
    name = name.trim();
    if (!name) {
      return;
    }
    let optionLines = optionString.split(/[\r\n]+/);
    let options: Option[] = [];
    optionLines.forEach((optionLine) => {
      options.push({ name: optionLine.trim() });
    });

    const category: Category = { name: name, options: options };
    await this.heroService.createCategory(category).subscribe((categories) => {
      console.log(categories);
    });

    this.router.navigate(['/dashboard']);
  }
}
