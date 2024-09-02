import { first } from 'rxjs/operators';
import { Option } from '../data/models/option';
import { OptionScore } from '../data/models/optionScore';
import { RankSession } from '../data/models/rankSession';
import { Ranker } from './ranker';

interface ActiveChoice {
  option: OptionScore;
  tier: number;
}

export class AdvancedRanker extends Ranker {
  name = 'Advanced';

  // state variables
  optionScores: OptionScore[] = [];
  totalRanks = 0;
  numTiers = 0;
  maxTiers: number;
  numToTierUpgrade: number;
  completeness: number = 0;

  activeChoices: ActiveChoice[] = [];
  tiersArray: OptionScore[][] = [];

  constructor(rankSession: RankSession) {
    super();

    console.log(`RankSession: numRanks = ${rankSession.numRanks}`);

    this.optionScores = rankSession.optionScores;
    this.totalRanks = rankSession.numRanks;
    this.numToTierUpgrade = Math.max(
      Math.floor(rankSession.optionScores.length / 3),
      1
    );
    this.maxTiers = Math.min(15, rankSession.optionScores.length);

    this.numTiers = Math.floor(this.totalRanks / this.numToTierUpgrade);
    this.reindex();
  }

  choicePicked(winner: OptionScore, loser: OptionScore): void {
    this.totalRanks++;

    // assign score updates
    const winnerChoice = this.activeChoices.find(
      (choice) => choice.option == winner
    )!;
    const loserChoice = this.activeChoices.find(
      (choice) => choice.option == loser
    )!;

    // bigger gaps means bigger consequences if the higher one loses
    const scoreChange =
      (this.numTiers - (winnerChoice.tier - loserChoice.tier)) / this.numTiers;
    console.log(`Score change: ${scoreChange}`);
    winnerChoice.option.score += scoreChange;
    loserChoice.option.score -= scoreChange;

    if (
      winnerChoice.option.score == null ||
      winnerChoice.option.score == null
    ) {
      console.error(
        `Of of the score is null somehow: winner: ${JSON.stringify(
          winnerChoice,
          null,
          4
        )}\n loser: ${JSON.stringify(loserChoice, null, 4)}`
      );
    }

    console.log(
      `there have been ${this.totalRanks}, upgrade interval is ${this.numToTierUpgrade}`
    );
    if (this.totalRanks % this.numToTierUpgrade == 0) {
      this.reindex();
    }
  }

  reindex(): void {
    console.log('reindexing...');
    console.log(`There are ${this.optionScores.length} optionScores`);
    if (this.numTiers < this.maxTiers) {
      this.numTiers++;
    }
    console.log(`Array with ${this.numTiers} tiers`);
    const newTiersArray = new Array<OptionScore[]>(this.numTiers);
    this.optionScores.sort((a, b) => (a.score > b.score ? 1 : -1));
    this.optionScores.forEach((optionScore, index) => {
      const tierIndex = Math.floor(
        (index * this.numTiers) / this.optionScores.length
      );
      if (newTiersArray[tierIndex] == undefined) {
        newTiersArray[tierIndex] = [optionScore];
      } else {
        const selectedArray = newTiersArray[tierIndex];
        selectedArray.push(optionScore);
      }
    });
    this.tiersArray = newTiersArray;
    console.log(`Finished reindexing, now there are ${this.numTiers} tiers`);
    console.log(`Here is the whole structure`);
    this.printTiers();
  }

  tierString(
    index: number,
    tier: OptionScore[],
    names: boolean = false
  ): string {
    if (tier) {
      let optionDisplay = `[ ${tier.length} items]`;
      if (names) {
        optionDisplay = JSON.stringify(
          tier.map((option) => option.option.name),
          null,
          4
        );
      }

      return `tier ${index}: ${optionDisplay}`;
    } else {
      return `tier ${index} is undefined`;
    }
  }

  printTiers() {
    console.log('*******');
    // for (let i = this.tiersArray.length - 1; i >= 0; i--) {
    //   let options = this.tiersArray[i];
    //   console.log(this.tierString(i, options, true));
    // }
    // console.log('*******');
  }

  calculateCompletenessScore() {
    const goalRanks = this.maxTiers * this.numToTierUpgrade;
    console.log(`Calculating completeness: ${this.totalRanks} / ${goalRanks}`);
    this.completeness = Math.round((this.totalRanks / goalRanks) * 1000) / 10;
    return this.completeness;
  }

  chooseDisplayOptions(_numOptions: number): OptionScore[] {
    console.log('picking display options');

    // first pick a tier
    const tierIndex = Math.floor(Math.random() * this.tiersArray.length);
    const tier = this.tiersArray[tierIndex];
    console.log(`looking at index ${tierIndex} of whole tier array`);
    console.log(`looking at tier: ${this.tierString(tierIndex, tier)}`);

    const firstChoice = {
      option: tier[Math.floor(Math.random() * tier.length)],
      tier: tierIndex,
    };
    const secondChoice = this.chooseSecondOption(firstChoice);
    this.activeChoices = [firstChoice, secondChoice];

    return [firstChoice.option, secondChoice.option];
  }

  chooseSecondOption(firstOption: ActiveChoice): ActiveChoice {
    console.log('Choosing second option');
    // choose relative tier between -2 and 2
    const tierOptions = this.range(
      Math.max(0, firstOption.tier - 2),
      Math.min(this.tiersArray.length - 1, firstOption.tier + 2)
    );
    let secondOption = null;
    let choiceIndex = -1;

    let tries = 0;
    while (secondOption == null && tries < 400) {
      // get center-weighted index
      let choiceIndexIndex = Math.floor(Math.random() * tierOptions.length);
      choiceIndex = tierOptions[choiceIndexIndex];
      console.log(`Tier index for second option: ${choiceIndex}`);
      const tier = this.tiersArray[choiceIndex];

      let tierIndexes = this.range(0, tier.length - 1);
      secondOption = this.getOptionFromTier(firstOption, tier);
      if (secondOption == null) {
        tierOptions.splice(choiceIndexIndex, 1);
        if (tierOptions.length === 0) {
          throw new Error('No other options to pick!');
        }
      }
      tries++;
    }
    if (tries >= 400) {
      console.log('[chooseSecondOption] too many tries');
      // throw new Error('Error while picking second option');
      secondOption = firstOption.option;
    }

    const secondChoice = {
      option: secondOption!,
      tier: choiceIndex,
    };
    return secondChoice;
  }

  getOptionFromTier(
    firstChoice: ActiveChoice,
    tier: OptionScore[]
  ): OptionScore | null {
    const tierIndex = Math.floor(Math.random() * tier.length);
    console.log(`[getOptionFromTier] tierIndex: ${tierIndex}`);
    const secondOption = tier[tierIndex];
    if (secondOption == firstChoice.option) {
      console.log(
        `Removing option ${firstChoice.option.option.name} from tier (tier length ${tier.length}`
      );
      tier.splice(tierIndex, 1);
      console.log(`new spliced tier: ${this.tierString(tierIndex, tier)}`);
      if (tier.length === 0) {
        console.log('[getOptionFromTier] No more options in this tier');
        return null;
      }
      console.log(
        '[getOptionFromTier] Same option picked, trying a different option'
      );
      return this.getOptionFromTier(firstChoice, tier);
    }
    return secondOption;
  }

  range(start: number, end: number): number[] {
    var list = [];
    for (var i = start; i <= end; i++) {
      list.push(i);
    }
    return list;
  }

  // done when min(10, numOptions) tiers
  checkIfDone(): boolean {
    return this.completeness >= 100;
  }
}
