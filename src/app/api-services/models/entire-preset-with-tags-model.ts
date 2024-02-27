import { PresetTagModel } from './preset-tag.model';
import { RoPresetModel } from './ro-preset-model';

export interface EntirePresetWithTagsModel extends RoPresetModel {
  tags: PresetTagModel[];
}
