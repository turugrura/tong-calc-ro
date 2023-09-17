export type AtkSkillFormulaInput<T extends {} = {}> = T & {
  baseLevel: number;
  skillLevel: number;
  usedSkillSet?: Set<string>;
};

export interface AtkSkillModel<T = any> {
  label: string;
  name: string;
  value: string;
  acd: number;
  fct: number;
  vct: number;
  cd: number;
  levelList: { label: string; value: any }[];
  formular: (input: AtkSkillFormulaInput<T>) => number;
  canCri?: boolean;
  cri?: number;
  hit?: number;
}
[];

export interface SkillModel {
  label: string;
  value: number | string;
  /**
   * Determine whether the level is using skill or not
   */
  isUse: boolean;
  skillLv?: number;
  bonus?: any;
}

export interface ActiveSkillModel {
  isEquipAtk?: boolean;
  isMasteryAtk?: boolean;
  inputType: 'dropdown' | 'selectButton';
  label: string;
  name: string;
  dropdown: SkillModel[];
}
export type PassiveSkillModel = ActiveSkillModel;

export interface SkillBonusResult {
  skillNames: any[];
  equipAtks: Record<string, any>;
  masteryAtks: Record<string, any>;
  learnedSkillMap: Map<string, number>;
}

export interface AspdInput {
  weaponType: string;
  aspd: number;
  aspdPercent: number;
  totalAgi: number;
  totalDex: number;
  potionAspd: number;
  potionAspdPercent: number;
  skillAspd: number;
  skillAspdPercent: number;
}

export abstract class CharacterBase {
  protected abstract initialStatusPoint: number;

  abstract get atkSkills(): AtkSkillModel[];

  abstract get passiveSkills(): ActiveSkillModel[];

  abstract get activeSkills(): PassiveSkillModel[];

  abstract getSkillBonusAndName(params: { activeIds: number[]; passiveIds: number[] }): SkillBonusResult;

  abstract getJobBonusStatus(jobLevel: number): {
    str: number;
    agi: number;
    vit: number;
    int: number;
    dex: number;
    luk: number;
  };

  protected abstract calcBaseAspd(weaponType: string): { baseAspd: number; shieldPenalty: number };

  calcAspd(a: AspdInput): number {
    const potion = { yellow: 4, green: 6, red: 9 };
    const { weaponType, aspd, aspdPercent, totalAgi, totalDex, potionAspd, skillAspd } = a;
    const { baseAspd, shieldPenalty } = this.calcBaseAspd(weaponType);
    const statAspd = Math.sqrt((totalAgi * totalAgi) / 2 + (totalDex * totalDex) / 5) / 4;
    const potionSkillAspd = ((potionAspd + skillAspd) * totalAgi) / 200;
    const rawCalcAspd = Math.floor(statAspd + potionSkillAspd + shieldPenalty);
    const baseAspd2 = baseAspd + rawCalcAspd;
    const equip = Math.floor((195 - (baseAspd2 + aspd)) * (aspdPercent * 0.01));
    const final = baseAspd2 + equip + aspd;

    console.log({
      baseAspd,
      aspd,
      aspdPercent,
      shieldPenalty,
      statAspd,
      potionSkillAspd,
      rawCalcAspd,
      baseAspd2,
      equip,
    });

    return final;
  }

  calcSkillDmgByTotalHit(finalDamage: number, skill: AtkSkillModel): number {
    const skillHit = skill?.hit || 1;
    if (skillHit > 1) {
      return Math.floor(finalDamage / skillHit) * skillHit;
    }

    return finalDamage;
  }
}
