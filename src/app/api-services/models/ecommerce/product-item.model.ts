export interface ProductItemModel {
  id: string;
  storeId: string;
  itemId: number;
  bundleId: string;
  name: string;
  desc: string;
  refine: number;
  enchantIds: number[];
  cardIds: number[];
  opts: string[];
  baht: number;
  zeny: number;
  quantity: number;
  type: number;
  subType: number;
  isPublished: boolean;
  expDate: string;
  createdAt: string;
  updatedAt: string;
}
