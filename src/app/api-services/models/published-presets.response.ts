import { PublishPresetModel } from './publish-preset-model';

export interface PublishPresetsReponse {
  items: PublishPresetModel[];
  totalItem: number;
  skip: number;
  take: number;
}
