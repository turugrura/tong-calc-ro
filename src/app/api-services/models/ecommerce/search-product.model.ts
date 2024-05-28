import { ItemAndStoreModel } from './item-and-store.model';

export interface SearchProductModel {
  items: ItemAndStoreModel[];
  totalItem: number;
  skip: number;
  take: number;
}
