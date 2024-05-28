import { ProductItemModel } from './product-item.model';
import { StoreModel } from './store.model';

type MiniProductItemModel = Omit<
  ProductItemModel,
  'bundleId' | 'name' | 'bundleId' | 'type' | 'subType' | 'createdAt' | 'updatedAt'
>;

export interface ItemAndStoreModel extends MiniProductItemModel {
  store: Pick<StoreModel, 'characterName' | 'description' | 'fb' | 'name' | 'rating'>;
}
