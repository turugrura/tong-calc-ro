import { ElementType } from '../element-type.const';
import { Weapon } from '../weapon';
import { AspdTable } from './_aspd-table';
import { ClassName } from './_class-name';

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
  isMatk?: boolean;
  isMelee?: boolean;
  element?: ElementType;
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
  weapon: Weapon;
  isEquipShield?: boolean;
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
  private allClass = 'all';

  protected abstract readonly CLASS_NAME: ClassName;
  protected abstract readonly JobBonusTable: Record<number, [number, number, number, number, number, number]>;

  protected abstract initialStatusPoint: number;
  protected abstract classNames: string[];
  protected abstract _atkSkillList: AtkSkillModel[];
  protected abstract _activeSkillList: ActiveSkillModel[];
  protected abstract _passiveSkillList: PassiveSkillModel[];

  /**
   * For item bonus condition
   */
  get className() {
    return this.CLASS_NAME;
  }

  /**
   * For suitable item
   */
  get classNameSet() {
    return new Set([this.allClass, ...this.classNames]);
  }

  get atkSkills() {
    return this._atkSkillList;
  }

  get passiveSkills() {
    return this._passiveSkillList;
  }

  get activeSkills() {
    return this._activeSkillList;
  }

  get initialStatPoint() {
    return this.initialStatusPoint;
  }

  getSkillBonusAndName(params: { activeIds: number[]; passiveIds: number[] }) {
    const equipAtks: Record<string, any> = {};
    const masteryAtks: Record<string, any> = {};
    const skillNames = [];
    const learnedSkillMap = new Map<string, number>();

    const { activeIds, passiveIds } = params;
    this._activeSkillList.forEach((skill, index) => {
      const { bonus, isUse, skillLv, value } = skill.dropdown.find((x) => x.value === activeIds[index]) ?? {};
      if (!isUse) return;

      learnedSkillMap.set(skill.name, skillLv ?? Number(value));
      skillNames.push(skill.name);
      if (!bonus) return;

      const { isEquipAtk, isMasteryAtk } = skill;
      if (isMasteryAtk) {
        masteryAtks[skill.name] = bonus;
      } else {
        equipAtks[skill.name] = bonus;
      }
    });

    this._passiveSkillList.forEach((skill, index) => {
      const { bonus, isUse, value, skillLv } =
        (skill.dropdown as any[]).find((x) => x.value === passiveIds[index]) ?? {};
      if (!isUse) return;

      learnedSkillMap.set(skill.name, skillLv ?? Number(value));
      skillNames.push(skill.name);
      if (!bonus) return;

      const { isEquipAtk, isMasteryAtk } = skill;
      if (isMasteryAtk) {
        masteryAtks[skill.name] = bonus;
      } else {
        equipAtks[skill.name] = bonus;
      }
    });

    return { skillNames, equipAtks, masteryAtks, learnedSkillMap };
  }

  private calcBaseAspd(weaponSubType: string): { baseAspd: number; shieldPenalty: number } {
    const data = AspdTable[this.className] || { base: 156, shield: 0 };

    return {
      baseAspd: data.base + (data[weaponSubType] || 0),
      shieldPenalty: data.shield,
    };
  }

  protected inheritBaseClass(baseClass: CharacterBase) {
    const { _atkSkillList, _passiveSkillList, _activeSkillList, classNames } = baseClass;

    this._atkSkillList = [..._atkSkillList, ...this._atkSkillList];
    this._activeSkillList = [..._activeSkillList, ...this._activeSkillList];
    this._passiveSkillList = [..._passiveSkillList, ...this._passiveSkillList];
    this.classNames = [...classNames, ...this.classNames];
  }

  calcAspd(a: AspdInput): number {
    const potion = { 645: 4, 656: 6, 657: 9 };
    const { weapon, isEquipShield, aspd, aspdPercent, totalAgi, totalDex, potionAspd, skillAspd } = a;
    const aspdByPotion = potion[potionAspd] || 0;

    const { rangeType, typeName } = weapon.data;
    const { baseAspd, shieldPenalty } = this.calcBaseAspd(typeName);
    const isRange = rangeType === 'range';
    const statAspd = Math.sqrt((totalAgi * totalAgi) / 2 + (totalDex * totalDex) / (isRange ? 7 : 5)) / 4;
    const potionSkillAspd = ((aspdByPotion + skillAspd) * totalAgi) / 200;
    const rawCalcAspd = Math.floor(statAspd + potionSkillAspd + (isEquipShield ? shieldPenalty : 0));
    const baseAspd2 = baseAspd + rawCalcAspd;
    const equip = Math.floor((195 - baseAspd2) * (aspdPercent * 0.01));
    const final = Math.min(baseAspd2 + equip + aspd, 193);

    // console.log({
    //   weapon,
    //   baseAspd,
    //   aspd,
    //   aspdPercent,
    //   shieldPenalty,
    //   statAspd,
    //   potionSkillAspd,
    //   rawCalcAspd,
    //   baseAspd2,
    //   equip,
    // });

    return final;
  }

  calcSkillDmgByTotalHit(finalDamage: number, skill: AtkSkillModel): number {
    const skillHit = skill?.hit || 1;
    if (skillHit > 1) {
      return Math.floor(finalDamage / skillHit) * skillHit;
    }

    return finalDamage;
  }

  getJobBonusStatus(jobLevel: number) {
    const [str, agi, vit, int, dex, luk] = this.JobBonusTable[jobLevel];

    return {
      str,
      agi,
      vit,
      int,
      dex,
      luk,
    };
  }

  getMasteryAtk(a: any) {
    return 0;
  }
}
