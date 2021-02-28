import { Category } from './category';
import { OptionScore } from './optionScore';

export interface RankSession {
  id?: number;
  createdAt?: Date;
  ranker?: string;
  updatedAt?: Date;
  category: Category;
  optionScores: OptionScore[];
  password?: string; // base64 encoded
  completenessScore: number;
  numRanks: number;
  algorithmType: string;
}
