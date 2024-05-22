export interface ProductItemModel {
  id: string;
  storeId: string;
  itemId: number;
  bundleId: string;
  name: string;
  desc: string;
  enchantIds: null;
  opts: null;
  baht: number;
  m: number;
  quantity: number;
  type: number;
  subType: number;
  isPublished: boolean;
  expDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface SearchProductModel {
  items: ProductItemModel[];
  totalItem: number;
  skip: number;
  take: number;
}
