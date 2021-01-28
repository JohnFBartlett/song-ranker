import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Category } from '../models/category';
import { Option } from '../models/option';
import { OptionScore } from '../models/optionScore';
import { RankSession } from '../models/rankSession';
import { HeroService } from '../services/hero.service';

@Component({
  selector: 'app-rank-page',
  templateUrl: './rank-page.component.html',
  styleUrls: ['./rank-page.component.css'],
})
export class RankPageComponent implements OnInit {
  rankSession: RankSession | undefined;
  optionScores: OptionScore[] = [];

  category: Category = {
    name: 'Loading Category...',
    options: [],
  };

  NUM_DISPLAY_OPTIONS = 2;
  options: Option[] = [];
  displayOptions: OptionScore[] = [];

  // state variables
  twiceRankedCondion = false;
  totalQuotaCondition = false;
  finishedRanking = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private heroService: HeroService
  ) {}

  ngOnInit(): void {
    console.log('trying to initialize rank page');
    this.getCategoryAndOptions();
  }

  getCategoryAndOptions(): void {
    const id = this.route.snapshot.paramMap.get('id');
    console.log(`Param map: ${this.route.snapshot.queryParamMap.keys}`);
    const rankerName = this.route.snapshot.queryParamMap.get('ranker');
    console.log(`Ranker name: ${rankerName}`);
    if (id) {
      this.heroService.getCategory(+id).subscribe((category) => {
        this.category = category;
        this.options = category.options;

        this.createRankSession(rankerName);

        this.chooseDisplayOptions(this.NUM_DISPLAY_OPTIONS);
      });
    }
  }

  createRankSession(rankerName: string | null): void {
    console.log('creating rank session');
    this.options.forEach((option) => {
      this.optionScores.push({
        option: option,
        timesRanked: 0,
        score: 0,
      });
    });
    this.rankSession = {
      category: this.category,
      optionScores: this.optionScores,
    };
    if (rankerName) {
      this.rankSession.ranker = rankerName;
    }
  }

  selectOption(optionScore: OptionScore): void {
    this.displayOptions.forEach((displayOption) => {
      displayOption.timesRanked++;
    });
    optionScore.score++;
    if (this.checkIfDone()) {
      // Display finish button
      this.finishedRanking = true;
      this.displayOptions = [];
    } else {
      this.chooseDisplayOptions(this.NUM_DISPLAY_OPTIONS);
    }
  }

  // two conditions (both must be met):
  // 1. all ranked twice
  // 2. there have been 3n rankings total
  checkIfDone(): boolean {
    return (
      (this.twiceRankedCondion || this.checkTwiceRanked()) &&
      (this.totalQuotaCondition || this.checkTotalQuota())
    );
  }

  checkTwiceRanked(): boolean {
    for (var i = 0; i < this.optionScores.length; i++) {
      if (this.optionScores[i].timesRanked < 2) {
        return false;
      }
    }
    return true;
  }

  checkTotalQuota(): boolean {
    let totalCount = 0;
    this.optionScores.forEach((optionScore) => {
      totalCount += optionScore.timesRanked;
    });

    return totalCount > 3 * this.optionScores.length;
  }

  chooseDisplayOptions(numOptions: number): void {
    this.displayOptions = [];
    let choosingArray = [...this.optionScores];

    for (var i = 0; i < numOptions; i++) {
      if (choosingArray.length == 0) break;
      const index = Math.floor(Math.random() * choosingArray.length);
      this.displayOptions.push(choosingArray[index]);
      choosingArray.splice(index, 1);
    }
  }

  async saveAndSeeResults() {
    // save results
    this.rankSession = await this.heroService
      .submitRankSession(this.rankSession!)
      .toPromise();

    this.router.navigate([`/results/${this.rankSession.id}`]);
  }

  toCategorySummary(): void {
    this.router.navigate([`/summary/${this.rankSession!.category.id}`]);
  }
}
