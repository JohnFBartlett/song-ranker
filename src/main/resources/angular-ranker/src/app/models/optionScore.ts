import { Option } from './option';

export interface OptionScore {
  id?: number;
  createdAt?: Date;
  updatedAt?: Date;
  option: Option;
  timesRanked: number;
  score: number;
  matchups: OptionScore[];
}
