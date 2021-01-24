import { Option } from './option';

export interface Category {
  id?: number;
  name: string;
  createdAt?: Date;
  updatedAt?: Date;
  options: Option[];
}
