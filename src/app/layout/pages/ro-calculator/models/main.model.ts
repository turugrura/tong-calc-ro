import { ElementType } from '../constants/element-type.const';
import { EquipmentModel } from '../constants/item-type.enum';

export interface MainModel extends Partial<EquipmentModel> {
  class: number;
  level: number;
  jobLevel: number;

  str: number;
  itemStr?: number;
  jobStr?: number;
  agi: number;
  itemAgi?: number;
  jobAgi?: number;
  vit: number;
  itemVit?: number;
  jobVit?: number;
  int: number;
  itemInt?: number;
  jobInt?: number;
  dex: number;
  itemDex?: number;
  jobDex?: number;
  luk: number;
  itemLuk?: number;
  jobLuk?: number;

  selectedAtkSkill?: string;
  propertyAtk?: ElementType;
  rawOptionTxts: string[];

  skillBuffs: number[];

  activeSkills: number[];
  passiveSkills: number[];
  consumables: number[];
  consumables2: number[];
  aspdPotion?: number;
  aspdPotions: number[];
}
