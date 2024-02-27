import { PresetModel } from './preset-model';

export interface RoPresetModel {
  id: string;
  userId: string;
  label: string;
  model: PresetModel;
  classId: number;
  createdAt: string;
  updatedAt: string;
  publishName: string;
  isPublished: boolean;
  publishedAt: string;
}
