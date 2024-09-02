import { OptionScore } from '../data/models/optionScore';

export abstract class Ranker {
  abstract name: string;

  abstract choicePicked(winner: OptionScore, loser: OptionScore): void;

  abstract calculateCompletenessScore(): number;

  abstract chooseDisplayOptions(numOptions: number): OptionScore[];

  abstract checkIfDone(): boolean;
}
