import { ThisReceiver } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Category } from '../models/category';
import { Option } from '../models/option';
import { OptionScore } from '../models/optionScore';
import { RankSession } from '../models/rankSession';
import { HeroService } from '../services/hero.service';
import { SpotifyService } from '../services/spotify-service.service';
import { AdvancedRanker } from '../strategies/advancedRanker';
import { BasicRanker } from '../strategies/basicRanker';
import { Ranker } from '../strategies/ranker';

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

  previousWinner: OptionScore | null = null;
  previousLoser: OptionScore | null = null;
  previousDisplayOptions: OptionScore[] | null = null;
  previousScoreDelta: number | null = null;

  NUM_DISPLAY_OPTIONS = 2;
  options: Option[] = [];
  displayOptions: OptionScore[] = [];

  rankerAlg: Ranker | undefined;
  finishedRanking = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private heroService: HeroService,
    private spotifyService: SpotifyService,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    console.log('trying to initialize rank page');
    this.getCategoryAndOptions();

    // get Spotify creds if we're ranking songs
    this.spotifyService.getCreds().then((_) => {
      this.spotifyService.getToken();
    });
  }

  async getCategoryAndOptions(): Promise<void> {
    const id = this.route.snapshot.paramMap.get('id');
    const rankerName = this.route.snapshot.queryParamMap.get('ranker');
    const algorithm =
      this.route.snapshot.queryParamMap.get('algorithm') || 'advanced';
    const rankSessionId = this.route.snapshot.queryParamMap.get(
      'rankSessionId'
    );
    console.log(`Ranker name: ${rankerName}`);
    if (id) {
      this.category = await this.heroService.getCategory(+id).toPromise();
      this.options = this.category.options;

      if (rankSessionId) {
        this.rankSession = await this.heroService
          .getRankSession(+rankSessionId)
          .toPromise();
        if (algorithm) {
          this.initRankerAlg(algorithm);
        }
      } else {
        this.createRankSession(rankerName, algorithm);
      }

      this.chooseDisplayOptions(this.NUM_DISPLAY_OPTIONS);
    }
  }

  initRankerAlg(algorithm: string) {
    // replace ranker with correct type
    if (this.rankSession) {
      if (algorithm == 'basic') {
        this.rankerAlg = new BasicRanker(this.rankSession);
      } else {
        this.rankerAlg = new AdvancedRanker(this.rankSession);
      }
    } else {
      console.error("Rank session doesn't exist yet!");
    }
  }

  createRankSession(rankerName: string | null, algorithm: string): void {
    console.log('creating rank session');
    this.options.forEach((option) => {
      this.optionScores.push({
        option: option,
        timesRanked: 0,
        score: 0,
        matchups: [],
      });
    });
    this.rankSession = {
      completenessScore: 0,
      numRanks: 0,
      category: this.category,
      optionScores: this.optionScores,
      algorithmType: algorithm,
      extendedRank: false,
    };
    this.initRankerAlg(algorithm);
    if (rankerName) {
      this.rankSession.ranker = rankerName;
    }
  }

  undoAvailable(): boolean {
    return (
      this.previousWinner != null &&
      this.previousLoser != null &&
      this.previousScoreDelta != null &&
      this.previousDisplayOptions != null
    );
  }

  undo(): void {
    if (this.undoAvailable()) {
      this.previousWinner!.score -= this.previousScoreDelta!;
      this.previousLoser!.score += this.previousScoreDelta!;

      this.displayOptions = this.previousDisplayOptions!;

      this.previousWinner = null;
      this.previousLoser = null;
      this.previousDisplayOptions = null;
      this.previousScoreDelta = null;
    } else {
      console.error("Can't undo, nothing to undo");
    }
  }

  selectOption(winner: OptionScore): void {
    const loser = this.displayOptions.find((option) => option != winner);
    if (!loser) {
      console.error('could not find loser option');
      return;
    }
    this.displayOptions.forEach((displayOption) => {
      displayOption.timesRanked++;
    });
    this.rankerAlg!.choicePicked(winner, loser);
    this.rankSession!.numRanks++;
    this.rankSession!.completenessScore = this.rankerAlg!.calculateCompletenessScore();
    if (!this.rankSession?.extendedRank && this.rankerAlg!.checkIfDone()) {
      // Display finish button
      this.finishedRanking = true;
      this.displayOptions = [];
    } else {
      this.chooseDisplayOptions(this.NUM_DISPLAY_OPTIONS);
    }
  }

  continueRanking() {
    this.finishedRanking = false;
    if (this.rankSession) {
      this.rankSession.extendedRank = true;

      // don't need to wait for this call
      // just saves that we want to keep going
      this.heroService.submitRankSession(this.rankSession);
    }
    this.chooseDisplayOptions(this.NUM_DISPLAY_OPTIONS);
  }

  async openModal(content: any): Promise<void> {
    // don't open modal if session already has a password
    if (this.rankSession?.password) {
      await this.heroService.submitRankSession(this.rankSession).toPromise();
      this.toCategorySummary();
    } else {
      this.modalService
        .open(content, { ariaLabelledBy: 'modal-basic-title' })
        .result.then(
          async (password) => {
            if (!this.rankSession) {
              console.log('no rank session');
              this.createRankSession(null, 'advanced');
            } else {
              console.log(`saving password: ${password}`);
              this.rankSession.password = btoa(password);
              console.log(`converted password: ${password}`);
              await this.heroService
                .submitRankSession(this.rankSession)
                .toPromise();
              this.toCategorySummary();
            }
          },
          (reason) => {
            console.log(`Password box dismissed with reason: ${reason}`);
          }
        );
    }
  }

  chooseDisplayOptions(numOptions: number): void {
    this.displayOptions = this.rankerAlg!.chooseDisplayOptions(
      this.NUM_DISPLAY_OPTIONS
    );
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
