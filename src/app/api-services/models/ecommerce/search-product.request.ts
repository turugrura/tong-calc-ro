export interface SearchProductRequest {
  skip: number;
  take: number;
  name?: string;
  storeId?: string;
  itemId?: number;
  type?: number;
  subType?: number;
}
