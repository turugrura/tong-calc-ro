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
  pAtk: number;
  sMatk: number;
  cRate: number;
  requireTxt?: string;
}

export enum SkillType {
  MELEE = 'Melee',
  RANGE = 'Range',
  MAGICAL = 'Magical',
}

export interface SkillDamageSummaryModel {
  skillDamageLabel: string;
  skillNoStackDamageLabel: string;
  baseSkillDamage: number;
  dmgType: SkillType;
  isAutoSpell: boolean;
  skillSizePenalty: number;
  skillCanCri: boolean;
  skillPropertyAtk: ElementType;
  skillPropertyMultiplier: number;
  skillTotalPene: number;
  skillTotalPeneLabel: string;
  skillTotalPeneRes: number;
  skillTotalPeneResLabel: string;
  skillMinDamage: number;
  skillMaxDamage: number;
  skillMaxDamageNoCri: number;
  skillMinDamageNoCri: number;
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
  isUsedCurrentHP: boolean;
  isUsedCurrentSP: boolean;
  currentHp: number;
  currentSp: number;

  maxStack: number;
  noStackMinDamage: number;
  noStackMaxDamage: number;
  noStackMinCriDamage: number;
  noStackMaxCriDamage: number;

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

  /**
   * Secondary damage
   */
  secondSkillMinDamageLabel?: string;
  secondSkillMinDamage?: number;
  secondSkillMaxDamage?: number;
  secondSkillMaxDamageNoCri?: number;
  secondSkillMinDamageNoCri?: number;
  secondSkillTotalHit?: number;
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
