import { Component, OnInit } from '@angular/core';
import { Category } from '../../data/models/category';
import { BackendService } from '../../services/backend.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  categories: Category[] = [];

  constructor(private backendService: BackendService) {}

  ngOnInit() {
    this.getCategories();
  }

  getCategories(): void {
    this.backendService.getCategories().subscribe((categories) => {
      console.log(categories);
      this.categories = categories.slice(0, 4);
    });
  }
}
