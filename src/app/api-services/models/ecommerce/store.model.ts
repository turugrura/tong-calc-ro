export interface StoreModel {
  id: string;
  name: string;
  description: string;
  ownerId: string;
  review: Record<string, number>;
  rating: number;
  fb: string;
  characterName: string;
  createdAt: string;
  updatedAt: string;
}
