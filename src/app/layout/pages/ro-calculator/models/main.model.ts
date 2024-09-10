import { ElementType } from '../constants/element-type.const';
import { EquipmentModel } from '../constants/item-type.enum';

export interface MainModel extends Partial<EquipmentModel> {
  class: number;
  level: number;
  jobLevel: number;

  str: number;
  jobStr?: number;
  agi: number;
  jobAgi?: number;
  vit: number;
  jobVit?: number;
  int: number;
  jobInt?: number;
  dex: number;
  jobDex?: number;
  luk: number;
  jobLuk?: number;

  pow: number;
  jobPow: number;
  sta: number;
  jobSta: number;
  wis: number;
  jobWis: number;
  spl: number;
  jobSpl: number;
  con: number;
  jobCon: number;
  crt: number;
  jobCrt: number;

  selectedAtkSkill?: string;
  propertyAtk?: ElementType;
  rawOptionTxts: string[];

  skillBuffs: number[];
  skillBuffMap: Record<string, number>;

  activeSkills: number[];
  activeSkillMap: Record<string, number>;
  passiveSkills: number[];
  passiveSkillMap: Record<string, number>;
  consumables: number[];
  consumables2: number[];
  aspdPotion?: number;
  aspdPotions: number[];
}
