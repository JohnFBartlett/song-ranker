import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Category } from '../models/category';
import { RankSession } from '../models/rankSession';
import { HeroService } from '../services/hero.service';

@Component({
  selector: 'app-category-summary',
  templateUrl: './category-summary.component.html',
  styleUrls: ['./category-summary.component.css'],
})
export class CategorySummaryComponent implements OnInit {
  category: Category = {
    name: 'Loading Category...',
    options: [],
  };
  rankSessions: RankSession[] = [];
  rankerName = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private heroService: HeroService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.heroService.getCategory(+id).subscribe((category) => {
        this.category = category;
        this.getRankSessions();
      });
    }
  }

  getRankSessions(): void {
    console.log(
      `getting rank sessions for category with id ${this.category.id}`
    );
    this.heroService
      .getRankSessionsForCategory(this.category.id!)
      .subscribe((rankSessions) => {
        this.rankSessions = rankSessions;
      });
  }

  rankCategory(): void {
    console.log(`Ranker name: ${this.rankerName}`);
    this.router.navigate([`/rank/${this.category.id}`], {
      queryParams: { ranker: this.rankerName },
    });
  }

  goToRankSession(rankSession: RankSession): void {
    this.router.navigate([`/results/${rankSession.id}`]);
  }
}
