import { Option } from './option';

export interface Category {
  id?: number;
  name: string;
  type?: string;
  createdAt?: Date;
  updatedAt?: Date;
  options: Option[];
}
