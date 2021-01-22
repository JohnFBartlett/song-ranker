import { Hero } from './hero';

export interface Category {
  id?: number;
  name: string;
  createdAt?: Date;
  updatedAt?: Date;
  heroes: Hero[];
}
