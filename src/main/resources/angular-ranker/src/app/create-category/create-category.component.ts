import { Component, OnInit } from '@angular/core';
import { BackendService } from '../services/backend.service';
import { Category } from '../models/category';
import { Option } from '../models/option';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-category',
  templateUrl: './create-category.component.html',
  styleUrls: ['./create-category.component.css'],
})
export class CreateCategoryComponent implements OnInit {
  constructor(private backendService: BackendService, private router: Router) {}

  isSongs: boolean = false;
  artist: string = '';

  ngOnInit(): void {}

  checkSong() {
    this.isSongs = !this.isSongs;
  }

  async addCategory(name: string, optionString: string): Promise<void> {
    name = name.trim();
    if (!name) {
      return;
    }
    let type = this.isSongs ? 'song' : '';
    let optionLines = optionString.split(/[\r\n]+/);
    let options: Option[] = [];
    optionLines.forEach((optionLine) => {
      if (this.artist.length > 0) {
        options.push({ name: optionLine.trim(), artist: this.artist });
      } else {
        options.push({ name: optionLine.trim() });
      }
    });

    const category: Category = { name: name, type: type, options: options };
    await this.backendService
      .createCategory(category)
      .subscribe((categories) => {
        console.log(categories);
      });

    this.router.navigate(['/dashboard']);
  }
}
