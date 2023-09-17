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

  calcSkillDmgByTotalHit(finalDamage: number, skillName: string): number {
    const skillHit = this.atkSkills.find((a) => a.name === skillName)?.hit || 1;
    if (skillHit > 1) {
      return Math.floor(finalDamage / skillHit) * skillHit;
    }

    return finalDamage;
  }
}
