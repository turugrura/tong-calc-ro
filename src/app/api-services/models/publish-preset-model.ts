import { RoPresetModel } from './ro-preset-model';

export type PublishPresetModel = Pick<RoPresetModel, 'publishName' | 'model'> & {
  tags: Record<string, number>;
  liked: boolean;
  tagId: string;
  presetId: string;
  createdAt: string;
  publisherName: string;
};
