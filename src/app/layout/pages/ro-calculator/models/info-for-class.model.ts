import { StatusSummary } from './status-summary.model';
import { PreparedMonsterModel } from './prepared-monster.model';
import { Weapon } from '../weapon';
import { MainModel } from './main.model';
import { EquipmentSummaryModel } from './equipment-summary.model';
import { ItemTypeEnum } from '../constants/item-type.enum';

export interface InfoForClass {
  weapon: Weapon;
  monster: PreparedMonsterModel;
  model: Partial<MainModel>;
  status: StatusSummary;
  totalBonus: EquipmentSummaryModel;
  equipmentBonus: Partial<Record<ItemTypeEnum, EquipmentSummaryModel>>;
  skillName: string;
}
