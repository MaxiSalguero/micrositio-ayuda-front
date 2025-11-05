import { Category } from './post.model';

export interface ITaxonomy {
  id: number;
  category: Category;
  parent: Category;
}
