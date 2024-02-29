import { PresetTagModel } from './preset-tag.model';
import { RoPresetModel } from './ro-preset-model';

export interface PresetWithTagsModel extends Omit<RoPresetModel, 'model' | 'userId' | 'classId'> {
  tags: PresetTagModel[];
}
