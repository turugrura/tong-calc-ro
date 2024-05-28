export interface PatchProductItem {
  id: string;
  baht?: number;
  zeny?: number;
  quantity?: number;
  isPublished?: boolean;
}

export type PatchProductItemRequest = PatchProductItem[];
