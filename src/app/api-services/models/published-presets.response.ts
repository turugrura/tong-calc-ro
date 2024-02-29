import { RoPresetModel } from './ro-preset-model';

export interface PublishPresetsReponse {
  items: (Pick<RoPresetModel, 'id' | 'publishName' | 'model' | 'createdAt'> & {
    tags: Record<string, number>;
    liked: boolean;
  })[];
  totalItem: number;
  skip: number;
  take: number;
}
