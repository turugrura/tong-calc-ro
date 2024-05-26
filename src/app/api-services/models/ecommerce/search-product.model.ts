import { ProductItemModel } from './product-item.model';

export interface SearchProductModel {
  items: ProductItemModel[];
  totalItem: number;
  skip: number;
  take: number;
}
