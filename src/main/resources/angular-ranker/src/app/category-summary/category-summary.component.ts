import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Category } from '../models/category';
import { RankSession } from '../models/rankSession';
import { HeroService } from '../services/hero.service';

@Component({
  selector: 'app-category-summary',
  templateUrl: './category-summary.component.html',
  styleUrls: ['./category-summary.component.scss'],
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

  toggleOptions(): void {
    let panel = document.getElementById('accordion-panel');
    let button = document.getElementById('accordion-button')!;
    // if (panel) {
    //   if (panel.style.display === 'block') {
    //     panel.style.display = 'none';
    //   } else {
    //     panel.style.display = 'block';
    //   }
    // }
    if (panel) {
      if (panel.clientHeight) {
        panel.style.height = '0';
        button.textContent = 'View Options \u002B';
      } else {
        let wrapper = document.querySelector('.measuringWrapper')!;
        panel.style.height = wrapper.clientHeight + 20 + 'px';
        button.textContent = 'Hide Options \u2212';
      }
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
