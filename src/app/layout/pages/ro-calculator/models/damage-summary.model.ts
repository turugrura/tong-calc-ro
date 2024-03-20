import { ElementType } from '../constants/element-type.const';

export interface BasicDamageSummaryModel {
  basicMinDamage: number;
  basicMaxDamage: number;
  criMinDamage: number;
  criMaxDamage: number;
  sizePenalty: number;
  propertyAtk: ElementType;
  propertyMultiplier: number;
  basicCriRate: number;
  criRateToMonster: number;
  totalPene: number;
  accuracy: number;
  basicDps: number;
}

export enum SkillType {
  MELEE = 'Melee',
  RANGE = 'Range',
  MAGICAL = 'Magical',
}

export interface SkillDamageSummaryModel {
  baseSkillDamage: number;
  dmgType: SkillType;
  isAutoSpell: boolean;
  skillSizePenalty: number;
  skillCanCri: boolean;
  skillPropertyAtk: ElementType;
  skillPropertyMultiplier: number;
  skillTotalPene: number;
  skillMinDamage: number;
  skillMaxDamage: number;
  skillTotalHit: number;
  skillHit: number;
  skillAccuracy: number;
  skillDps: number;
  skillHitKill: number;
  skillCriRateToMonster: number;
  skillCriDmgToMonster: number;
  skillPart2Label: string;
  skillMinDamage2: number;
  skillMaxDamage2: number;
  skillBonusFromEquipment: number;

  /**
   * Calculated damage including chances bonus
   */
  effectedBasicDamageMin?: number;
  effectedBasicDamageMax?: number;
  effectedBasicCriDamageMin?: number;
  effectedBasicCriDamageMax?: number;
  effectedBasicHitsPerSec?: number;
  effectedBasicDps?: number;
  effectedSkillDamageMin?: number;
  effectedSkillDamageMax?: number;
  effectedSkillHitsPerSec?: number;
  effectedSkillDps?: number;
}

export interface SkillAspdModel {
  cd: number;
  reducedCd: number;
  vct: number;
  sumDex2Int1: number;
  vctByStat: number;
  vctSkill: number;
  reducedVct: number;
  fct: number;
  reducedFct: number;
  acd: number;
  reducedAcd: number;
  castPeriod: number;
  hitPeriod: number;
  totalHitPerSec: number;
}

export interface BasicAspdModel {
  totalAspd: number;
  hitsPerSec: number;
}

export interface MiscModel {
  totalHit: number;
  totalPerfectHit: number;
  accuracy: number;
  totalFlee: number;
  totalPerfectDodge: number;
}

export interface DamageSummaryModel {
  basicDmg: BasicDamageSummaryModel;
  misc: MiscModel;
  basicAspd: BasicAspdModel;
  skillDmg?: SkillDamageSummaryModel;
  skillAspd?: SkillAspdModel;
}
