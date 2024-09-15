import { StatusSummary } from './status-summary.model';
import { PreparedMonsterModel } from './prepared-monster.model';
import { MainModel } from './main.model';
import { EquipmentSummaryModel } from './equipment-summary.model';
import { ItemTypeEnum } from '../constants/item-type.enum';
import { ElementType } from '../constants/element-type.const';
import { SKILL_NAME } from '../jobs/_skill_names';
import { Weapon } from '../domain';

export interface InfoForClass {
  weapon: Weapon;
  ammoElement: ElementType;
  monster: PreparedMonsterModel;
  model: Partial<MainModel>;
  status: StatusSummary;
  totalBonus: EquipmentSummaryModel;
  equipmentBonus: Partial<Record<ItemTypeEnum, EquipmentSummaryModel>>;
  skillName: SKILL_NAME;
}
