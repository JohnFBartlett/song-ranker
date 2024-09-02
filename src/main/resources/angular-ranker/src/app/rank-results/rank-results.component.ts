import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OptionScore } from '../data/models/optionScore';
import { RankSession } from '../data/models/rankSession';
import { BackendService } from '../services/backend.service';

@Component({
  selector: 'app-rank-results',
  templateUrl: './rank-results.component.html',
  styleUrls: ['./rank-results.component.css'],
})
export class RankResultsComponent implements OnInit {
  rankSession: RankSession | undefined;
  optionScores: OptionScore[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private backendService: BackendService
  ) {}

  ngOnInit(): void {
    this.getRankSession();
  }

  getRankSession(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.backendService.getRankSession(+id).subscribe((rankSession) => {
        this.rankSession = rankSession;
        this.optionScores = rankSession.optionScores;
      });
    }
  }

  toCategorySummary(): void {
    this.router.navigate([`/summary/${this.rankSession!.category.id}`]);
  }
}
