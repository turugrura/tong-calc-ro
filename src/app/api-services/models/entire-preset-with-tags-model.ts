import { PresetTagModel } from './preset-tag.model';
import { RoPresetModel } from './ro-preset-model';

export interface EntirePresetWithTagsModel extends Omit<RoPresetModel, 'classId' | 'userId'> {
  tags: PresetTagModel[];
}
