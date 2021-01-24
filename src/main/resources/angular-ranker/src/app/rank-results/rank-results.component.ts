import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OptionScore } from '../models/optionScore';
import { RankSession } from '../models/rankSession';
import { HeroService } from '../services/hero.service';

@Component({
  selector: 'app-rank-results',
  templateUrl: './rank-results.component.html',
  styleUrls: ['./rank-results.component.css'],
})
export class RankResultsComponent implements OnInit {
  rankSession: RankSession | undefined;
  optionScores: OptionScore[] = [];

  constructor(private route: ActivatedRoute, private heroService: HeroService) {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.heroService.getRankSession(+id).subscribe((rankSession) => {
        this.rankSession = rankSession;
        this.optionScores = rankSession.optionScores;
      });
    }
  }

  ngOnInit(): void {
    this.getRankSession();
  }

  getRankSession(): void {}
}
