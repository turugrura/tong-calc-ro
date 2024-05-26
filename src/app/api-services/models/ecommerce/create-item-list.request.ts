import { ProductItemModel } from './product-item.model';

export type CreateItemListRequest = Omit<ProductItemModel, 'id'>[];
