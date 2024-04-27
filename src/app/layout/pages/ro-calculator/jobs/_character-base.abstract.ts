import { environment } from 'src/environments/environment';
import { ElementType } from '../constants/element-type.const';
import { EquipmentSummaryModel } from '../models/equipment-summary.model';
import { InfoForClass } from '../models/info-for-class.model';
import { Weapon } from '../weapon';
import { AspdTable } from './_aspd-table';
import { ClassName } from './_class-name';
import { sortSkill } from '../utils';
import { WeaponTypeName } from '../constants/weapon-type-mapper';

export interface AtkSkillFormulaInput extends InfoForClass {
  skillLevel: number;
  maxHp: number;
  maxSp: number;
  currentHp?: number;
  currentSp?: number;
}

export interface DefForCalcModel {
  reducedHardDef: number;
  dmgReductionByHardDef: number;
  finalDmgReduction: number;
  finalSoftDef: number;
}

export interface AtkSkillModel {
  label: string;
  name: string;
  value: string;
  values?: string[];
  acd: number;
  fct: number;
  vct: number;
  cd: number;
  levelList?: { label: string; value: any }[];
  formula: (input: AtkSkillFormulaInput) => number;
  customFormula?: (
    input: AtkSkillFormulaInput & {
      baseSkillDamage: number;
      sizePenalty: number;
      propertyMultiplier: number;
    } & DefForCalcModel,
  ) => number;
  part2?: {
    label: string;
    element: ElementType;
    isIncludeMain: boolean;
    hit: number;
    isMatk: boolean;
    isMelee: boolean;
    formula: (input: AtkSkillFormulaInput) => number;
  };
  finalDmgFormula?: (input: AtkSkillFormulaInput & { damage: number }) => number;
  canCri?: boolean;
  baseCri?: number;
  /**
   * 0.3 => baseCri * 0.3
   */
  baseCriPercentage?: number;
  /**
   * 0.3 => criDmg * 0.3
   */
  criDmgPercentage?: number;
  /**
   * Will be round down
   */
  hit?: number;
  totalHit?: number | ((monsterSize: 's' | 'm' | 'l') => number);
  isMatk?: boolean;
  isMelee?: boolean | ((weaponType: WeaponTypeName) => boolean);
  isDevMode?: boolean;
  isIgnoreDef?: boolean;
  isHDefToSDef?: boolean;
  isHit100?: boolean;
  isExcludeCannanball?: boolean;
  isSudoElement?: boolean;
  currentHpFn?: (maxHp: number) => number;
  currentSpFn?: (maxSp: number) => number;
  /**
   * For DPS calucation
   * undefined = 1, 0.2 = 20 %
   */
  autoSpellChance?: number;
  element?: ElementType;
  getElement?: () => ElementType;
}
[];

export interface SkillModel {
  label: string;
  value: number;
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
  isDevMode?: boolean;
}
export type PassiveSkillModel = ActiveSkillModel;

export interface AspdInput {
  weapon: Weapon;
  weapon2: Weapon;
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
  /**
   * str, agi, vit, int, dex, luk
   */
  protected abstract readonly JobBonusTable: Record<number, [number, number, number, number, number, number]>;

  protected abstract initialStatusPoint: number;
  protected abstract classNames: string[];
  protected abstract _atkSkillList: AtkSkillModel[];
  protected abstract _activeSkillList: ActiveSkillModel[];
  protected abstract _passiveSkillList: PassiveSkillModel[];

  protected learnSkillMap = new Map<string, number>();
  protected activeSkillIds: number[] = [];
  protected activeBonus = new Map<string, Record<string, number>>();
  protected passiveSkillIds: number[] = [];
  protected passiveBonus = new Map<string, Record<string, number>>();
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
    const skills: AtkSkillModel[] = [
      ...this._atkSkillList,
      {
        name: 'Napalm Vulcan',
        label: 'Napalm Vulcan Lv4',
        value: 'Napalm Vulcan==4',
        fct: 0.3,
        vct: 0.5,
        acd: 0.5,
        cd: 1,
        isMatk: true,
        element: ElementType.Ghost,
        hit: 4,
        formula: (input: AtkSkillFormulaInput): number => {
          const { model, skillLevel } = input;
          const baseLevel = model.level;

          return skillLevel * 70 * (baseLevel / 100);
        },
        finalDmgFormula: (input) => {
          return input.damage * input.skillLevel;
        },
      },
    ];
    if (environment.production) {
      return skills.filter((a) => !a.isDevMode);
    }

    return skills;
  }

  get passiveSkills() {
    const sortedSkill = this._passiveSkillList.map((a) => {
      if (a.inputType === 'selectButton') return a;

      const sortedDropdown = a.dropdown.sort(sortSkill);

      return {
        ...a,
        dropdown: [...sortedDropdown],
      };
    });

    if (environment.production) {
      return sortedSkill.filter((a) => !a.isDevMode);
    }

    return sortedSkill;
  }

  get activeSkills() {
    const sortedSkill = this._activeSkillList.map((a) => {
      if (a.inputType === 'selectButton') return a;
      const sortedDropdown = a.dropdown.sort(sortSkill);

      return {
        ...a,
        dropdown: [...sortedDropdown],
      };
    });

    if (environment.production) {
      return sortedSkill.filter((a) => !a.isDevMode);
    }

    return sortedSkill;
  }

  get initialStatPoint() {
    return this.initialStatusPoint;
  }

  protected learnLv(skillName: string) {
    return this.bonuses.learnedSkillMap.get(skillName) || 0;
  }

  protected isSkillActive(skillName: string) {
    return this.bonuses.activeSkillNames.has(skillName);
  }

  protected activeSkillLv(skillName: string) {
    return this.bonuses.usedSkillMap.get(skillName) || 0;
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

    this.activeBonus.clear();
    this.passiveBonus.clear();

    this._activeSkillList.forEach((skill, index) => {
      const { bonus, isUse, skillLv, value } = skill.dropdown.find((x) => x.value === this.activeSkillIds[index]) ?? {};
      if (!isUse) return;

      usedSkillMap.set(skill.name, skillLv ?? Number(value));
      activeSkillNames.add(skill.name);
      if (!bonus) return;

      this.activeBonus.set(skill.name, bonus);
      const { isMasteryAtk } = skill;
      if (isMasteryAtk) {
        masteryAtks[skill.name] = bonus;
      } else {
        equipAtks[skill.name] = bonus;
      }
    });

    this._passiveSkillList.forEach((skill, index) => {
      const { bonus, isUse, value, skillLv } =
        (skill.dropdown as any[]).find((x) => x.value === this.passiveSkillIds[index]) ?? {};
      if (!isUse) return;

      learnedSkillMap.set(skill.name, skillLv ?? Number(value));
      if (!bonus) return;

      this.passiveBonus.set(skill.name, bonus);
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

  private calcLeftWeaponAspd(weaponSubType: string) {
    if (!weaponSubType) return 0;

    return AspdTable[this.className]?.[`left-${weaponSubType}`] || 0;
  }

  protected inheritBaseClass(baseClass: CharacterBase) {
    const { _atkSkillList, _passiveSkillList, _activeSkillList, classNames } = baseClass;

    this._atkSkillList = [..._atkSkillList, ...this._atkSkillList];
    this._activeSkillList = [..._activeSkillList, ...this._activeSkillList];
    this._passiveSkillList = [..._passiveSkillList, ...this._passiveSkillList];
    this.classNames = [...classNames, ...this.classNames];
  }

  protected getDynimicBonusFromSkill(prefix: string): Record<string, number> {
    const totalBonus = {};
    const addBonus = (key: string, val: number) => {
      if (totalBonus[key]) {
        totalBonus[key] += val;
      } else {
        totalBonus[key] = val;
      }
    };

    for (const bonus of [...this.passiveBonus.values(), ...this.activeBonus.values()]) {
      for (const [attr, val] of Object.entries(bonus)) {
        if (attr.startsWith(prefix)) {
          const actualAttr = attr.replace(prefix, '');
          addBonus(actualAttr, val);
        }
      }
    }

    return totalBonus;
  }

  protected getMasteryAtkByMonsterRace(race: string) {
    const allBonus = { ...(this.bonuses?.masteryAtks || {}), ...(this.bonuses?.equipAtks || {}) };

    const attrAtk = `x_race_${race}_atk`; // Demon Bane ex: x_race_demon_atk
    let totalAtk = 0;

    for (const [, bonus] of Object.entries(allBonus)) {
      totalAtk += bonus[attrAtk] || 0;
    }

    return { totalAtk };
  }

  protected getMasteryAtkByMonsterElement(element: string) {
    const allBonus = { ...(this.bonuses?.masteryAtks || {}), ...(this.bonuses?.equipAtks || {}) };

    const attrAtk = `x_element_${element}_atk`; // Demon Bane ex: x_element_undead_atk
    let totalAtk = 0;

    for (const [, bonus] of Object.entries(allBonus)) {
      totalAtk += bonus[attrAtk] || 0;
    }

    return { totalAtk };
  }

  protected calcHiddenMasteryAtk(_: InfoForClass, x?: { prefix?: string; suffix?: string }) {
    const allBonus = { ...(this.bonuses?.masteryAtks || {}), ...(this.bonuses?.equipAtks || {}) };

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

    let totalAtk = 0;
    let totalMatk = 0;
    for (const [, bonus] of Object.entries(allBonus)) {
      totalAtk += bonus[attrAtk] || 0;
      totalMatk += bonus[attrMatk] || 0;
    }

    return { totalAtk, totalMatk };
  }

  calcAspd(a: AspdInput): number {
    const { weapon, weapon2, isEquipShield, aspd, aspdPercent, totalAgi, totalDex, potionAspds, skillAspd } = a;
    const aspdByPotion = potionAspds.reduce(
      (total, potionAspd) => total + (AspdPotionFixBonus.get(potionAspd) || 0),
      0,
    );

    const { rangeType, subTypeName } = weapon.data;
    const { baseAspd, shieldPenalty } = this.calcBaseAspd(subTypeName);
    const leftWeapon = this.calcLeftWeaponAspd(weapon2?.data?.subTypeName);
    const isRange = rangeType === 'range';
    const statAspd = Math.sqrt((totalAgi * totalAgi) / 2 + (totalDex * totalDex) / (isRange ? 7 : 5)) / 4;
    const potionSkillAspd = ((aspdByPotion + skillAspd) * totalAgi) / 200;
    const rawCalcAspd = Math.floor(statAspd + potionSkillAspd + (isEquipShield ? shieldPenalty : 0));

    const baseAspd2 = baseAspd + leftWeapon + rawCalcAspd;
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

  calcSkillDmgByTotalHit(params: { finalDamage: number; skill: AtkSkillModel; info: InfoForClass }): number {
    const { finalDamage, skill } = params;
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

  /**
   * Not show in screen
   * @param info
   * @returns mastery atk
   */
  getMasteryAtk(_: InfoForClass) {
    return 0;
  }

  getMasteryMatk(_: InfoForClass) {
    return 0;
  }

  getUiMasteryAtk(_: InfoForClass) {
    return 0;
  }

  modifyFinalAtk(currentAtk: number, _: InfoForClass) {
    return currentAtk;
  }

  setAdditionalBonus(params: InfoForClass): EquipmentSummaryModel {
    return params.totalBonus;
  }
}
