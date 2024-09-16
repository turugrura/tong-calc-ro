import { StatusSummary } from './status-summary.model';
import { MainModel } from './main.model';
import { EquipmentSummaryModel } from './equipment-summary.model';
import { ItemTypeEnum } from '../constants/item-type.enum';
import { ElementType } from '../constants/element-type.const';
import { Monster, Weapon } from '../domain';
import { SKILL_NAME } from '../constants/skill-name';

export interface InfoForClass {
  weapon: Weapon;
  ammoElement: ElementType;
  monster: Monster;
  model: Partial<MainModel>;
  status: StatusSummary;
  totalBonus: EquipmentSummaryModel;
  equipmentBonus: Partial<Record<ItemTypeEnum, EquipmentSummaryModel>>;
  skillName: SKILL_NAME;
}
