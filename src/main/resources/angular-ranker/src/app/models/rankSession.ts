import { Category } from './category';
import { OptionScore } from './optionScore';

export interface RankSession {
  id?: number;
  createdAt?: Date;
  ranker?: string;
  updatedAt?: Date;
  category: Category;
  optionScores: OptionScore[];
}
