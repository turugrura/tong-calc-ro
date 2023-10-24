import { ElementType } from '../constants/element-type.const';
import { EquipmentSummaryModel } from '../models/equipment-summary.model';
import { InfoForClass } from '../models/info-for-class.model';
import { PostCalcSkillModel } from '../models/post-calc-skill.model';
import { PreCalcSkillModel } from '../models/pre-calc-skill.model';
import { Weapon } from '../weapon';
import { AspdTable } from './_aspd-table';
import { ClassName } from './_class-name';

export interface AtkSkillFormulaInput extends InfoForClass {
  skillLevel: number;
  extra?: any;
}

export interface AtkSkillModel {
  label: string;
  name: string;
  value: string;
  acd: number;
  fct: number;
  vct: number;
  cd: number;
  levelList: { label: string; value: any }[];
  formular: (input: AtkSkillFormulaInput) => number;
  canCri?: boolean;
  cri?: number;
  hit?: number;
  totalHit?: number;
  isMatk?: boolean;
  isMelee?: boolean;
  isIgnoreDef?: boolean;
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

  protected learnSkillMap = new Map<string, number>();
  protected activeSkillIds: number[] = [];
  protected passiveSkillIds: number[] = [];
  protected bonuses: {
    activeSkillNames: Set<string>;
    equipAtks: Record<string, number>;
    masteryAtks: Record<string, number>;
    learnedSkillMap: Map<string, number>;
    usedSkillMap: Map<string, number>;
  };

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

  setLearnSkills(a: { activeSkillIds: number[]; passiveSkillIds: number[] }) {
    const { activeSkillIds, passiveSkillIds } = a;
    this.activeSkillIds = [...activeSkillIds];
    this.passiveSkillIds = [...passiveSkillIds];

    this.passiveSkillIds.forEach((skillLvl, idx) => {
      this.learnSkillMap.set(this.passiveSkills[idx].name, skillLvl);
    });

    return this;
  }

  getSkillBonusAndName() {
    const equipAtks: Record<string, any> = {};
    const masteryAtks: Record<string, any> = {};
    const activeSkillNames = new Set<string>();
    const learnedSkillMap = new Map<string, number>();
    const usedSkillMap = new Map<string, number>();

    this._activeSkillList.forEach((skill, index) => {
      const { bonus, isUse, skillLv, value } = skill.dropdown.find((x) => x.value === this.activeSkillIds[index]) ?? {};
      if (!isUse) return;

      usedSkillMap.set(skill.name, skillLv ?? Number(value));
      activeSkillNames.add(skill.name);
      if (!bonus) return;

      const { isMasteryAtk } = skill;
      if (isMasteryAtk) {
        masteryAtks[skill.name] = bonus;
      } else {
        equipAtks[skill.name] = bonus;
      }
    });

    this._passiveSkillList.forEach((skill, index) => {
      const { bonus, isUse, value, skillLv } = (skill.dropdown as any[]).find((x) => x.value === this.passiveSkillIds[index]) ?? {};
      if (!isUse) return;

      learnedSkillMap.set(skill.name, skillLv ?? Number(value));
      if (!bonus) return;

      const { isMasteryAtk } = skill;
      if (isMasteryAtk) {
        masteryAtks[skill.name] = bonus;
      } else {
        equipAtks[skill.name] = bonus;
      }
    });

    this.bonuses = { activeSkillNames, equipAtks, masteryAtks, learnedSkillMap, usedSkillMap };

    return { activeSkillNames, equipAtks, masteryAtks, learnedSkillMap, usedSkillMap };
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

  protected calcHiddenMasteryAtk(_: InfoForClass, x?: { prefix?: string; suffix?: string }) {
    if (!this.bonuses?.masteryAtks) return { totalAtk: 0, totalMatk: 0 };

    const bonuses = this.bonuses.masteryAtks || {};

    let totalAtk = 0;
    let totalMatk = 0;

    let attrAtk = 'x_atk';
    let attrMatk = 'x_matk';
    if (x?.prefix) {
      attrAtk = `${x.prefix}_atk`;
      attrMatk = `${x.prefix}_matk`;
    }
    if (x?.suffix) {
      attrAtk = `${attrAtk}_${x.suffix}`;
      attrMatk = `${attrMatk}_${x.suffix}`;
    }

    for (const [, bonus] of Object.entries(bonuses)) {
      totalAtk += bonus[attrAtk] || 0;
      totalMatk += bonus[attrMatk] || 0;
    }

    return { totalAtk, totalMatk };
  }

  calcAspd(a: AspdInput): number {
    const potion = { 645: 4, 656: 6, 657: 9 };
    const { weapon, isEquipShield, aspd, aspdPercent, totalAgi, totalDex, potionAspd, skillAspd } = a;
    const aspdByPotion = potion[potionAspd] || 0;

    const { rangeType, subTypeName: subTypeName } = weapon.data;
    const { baseAspd, shieldPenalty } = this.calcBaseAspd(subTypeName);
    const isRange = rangeType === 'range';
    const statAspd = Math.sqrt((totalAgi * totalAgi) / 2 + (totalDex * totalDex) / (isRange ? 7 : 5)) / 4;
    const potionSkillAspd = ((aspdByPotion + skillAspd) * totalAgi) / 200;
    const rawCalcAspd = Math.floor(statAspd + potionSkillAspd + (isEquipShield ? shieldPenalty : 0));

    const baseAspd2 = baseAspd + rawCalcAspd;
    const equip = Math.floor((195 - baseAspd2) * (aspdPercent * 0.01));
    const final = Math.min(baseAspd2 + equip + aspd, 193);

    // console.log({
    //   weapon,
    //   totalAgi,
    //   totalDex,
    //   baseAspd,
    //   aspd,
    //   aspdPercent,
    //   shieldPenalty,
    //   statAspd,
    //   potionSkillAspd,
    //   skillAspd,
    //   rawCalcAspd,
    //   baseAspd2,
    //   equip,
    //   final,
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

  getMasteryAtk(_: InfoForClass) {
    return 0;
  }

  setAdditionalBonus(params: InfoForClass): EquipmentSummaryModel {
    return params.totalBonus;
  }

  preCalcSkillDamage(_input: PreCalcSkillModel) {
    return;
  }

  postCalcSkillDamage(_input: PostCalcSkillModel) {
    return;
  }
}
