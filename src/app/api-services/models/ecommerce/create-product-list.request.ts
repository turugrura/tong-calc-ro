export interface CreateProductItem {
  itemId: number;
  name: string;
  type: number;
  subType: number;
}

export type CreateProductListRequest = CreateProductItem[];
