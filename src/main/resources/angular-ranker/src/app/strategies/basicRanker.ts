import { OptionScore } from '../models/optionScore';
import { RankSession } from '../models/rankSession';
import { Ranker } from './ranker';

export class BasicRanker extends Ranker {
  optionScores: OptionScore[] = [];

  constructor(private rankSession: RankSession) {
    super();
    this.optionScores = rankSession.optionScores;
  }

  // state variables
  twiceRankedCondion = false;
  totalQuotaCondition = false;

  name = 'Basic';

  choicePicked(winner: OptionScore, loser: OptionScore): void {
    console.log('choice picked');
    winner.score++;
    this.rankSession.numRanks++;
  }

  calculateCompletenessScore() {
    console.log(`totalRanks: ${this.rankSession.numRanks}`);
    console.log(`optionScores: ${this.optionScores}`);
    console.log(
      `calculating completeness: ${
        (this.rankSession.numRanks / 5) * this.optionScores.length * 100
      }`
    );
    return (this.rankSession.numRanks / 5) * this.optionScores.length * 100;
  }

  chooseDisplayOptions(numOptions: number): OptionScore[] {
    let displayOptions = [];
    let choosingArray = [...this.optionScores];

    for (var i = 0; i < numOptions; i++) {
      if (choosingArray.length == 0) break;
      const index = Math.floor(Math.random() * choosingArray.length);
      displayOptions.push(choosingArray[index]);
      choosingArray.splice(index, 1);
    }
    return choosingArray;
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
}
