import { ClassName } from './_class-name';
import {
  ActiveSkillModel,
  AtkSkillFormulaInput,
  AtkSkillModel,
  CharacterBase,
  PassiveSkillModel,
} from './_character-base.abstract';
import { Paladin } from './paladin';
import { ElementType } from '../constants/element-type.const';
import { InfoForClass } from '../models/info-for-class.model';

const jobBonusTable: Record<number, [number, number, number, number, number, number]> = {
  1: [0, 0, 0, 0, 0, 0],
  2: [0, 0, 1, 0, 0, 0],
  3: [0, 0, 1, 1, 0, 0],
  4: [1, 0, 1, 1, 0, 0],
  5: [1, 0, 1, 2, 0, 0],
  6: [1, 0, 1, 2, 1, 0],
  7: [1, 0, 1, 2, 1, 0],
  8: [1, 0, 1, 2, 1, 0],
  9: [1, 0, 2, 2, 1, 0],
  10: [1, 0, 2, 2, 1, 0],
  11: [1, 0, 2, 3, 1, 0],
  12: [1, 0, 2, 3, 1, 0],
  13: [2, 0, 2, 3, 1, 0],
  14: [2, 0, 2, 3, 2, 0],
  15: [2, 0, 2, 3, 2, 0],
  16: [2, 0, 2, 3, 2, 1],
  17: [2, 0, 2, 3, 2, 1],
  18: [2, 0, 2, 3, 2, 1],
  19: [2, 0, 2, 4, 2, 1],
  20: [2, 0, 2, 4, 3, 1],
  21: [2, 0, 2, 4, 3, 1],
  22: [2, 0, 2, 4, 3, 1],
  23: [2, 1, 2, 4, 3, 1],
  24: [2, 1, 2, 5, 3, 1],
  25: [2, 1, 2, 5, 3, 1],
  26: [2, 1, 2, 6, 3, 1],
  27: [2, 1, 3, 6, 3, 1],
  28: [2, 1, 3, 6, 3, 1],
  29: [2, 1, 3, 6, 3, 1],
  30: [3, 1, 3, 6, 3, 1],
  31: [3, 1, 3, 6, 4, 1],
  32: [3, 1, 3, 6, 4, 1],
  33: [3, 1, 3, 6, 4, 2],
  34: [3, 2, 3, 6, 4, 2],
  35: [3, 2, 3, 6, 4, 2],
  36: [3, 2, 3, 6, 4, 2],
  37: [3, 2, 3, 7, 4, 2],
  38: [3, 2, 3, 8, 4, 2],
  39: [3, 2, 3, 8, 4, 2],
  40: [4, 2, 3, 8, 4, 2],
  41: [4, 2, 4, 8, 4, 2],
  42: [4, 2, 5, 8, 4, 2],
  43: [4, 2, 5, 8, 4, 2],
  44: [4, 2, 5, 8, 5, 2],
  45: [5, 2, 5, 8, 5, 2],
  46: [5, 2, 5, 9, 5, 2],
  47: [5, 2, 5, 9, 5, 2],
  48: [6, 2, 5, 9, 5, 2],
  49: [6, 2, 5, 9, 6, 2],
  50: [6, 2, 5, 9, 6, 2],
  51: [6, 3, 5, 9, 6, 2],
  52: [6, 3, 5, 9, 6, 2],
  53: [6, 3, 6, 9, 6, 2],
  54: [6, 3, 6, 9, 6, 3],
  55: [6, 3, 6, 9, 6, 3],
  56: [6, 3, 6, 9, 7, 3],
  57: [6, 3, 6, 9, 7, 3],
  58: [7, 3, 6, 9, 7, 3],
  59: [7, 3, 7, 9, 7, 3],
  60: [7, 3, 7, 10, 7, 3],
  61: [7, 3, 7, 10, 7, 3],
  62: [7, 3, 7, 10, 7, 3],
  63: [7, 3, 7, 10, 7, 3],
  64: [7, 3, 7, 10, 7, 3],
  65: [8, 3, 8, 10, 8, 3],
};

export class RoyalGuard extends CharacterBase {
  protected readonly CLASS_NAME = ClassName.RoyalGuard;
  protected readonly JobBonusTable = jobBonusTable;

  protected readonly initialStatusPoint = 100;
  protected readonly classNames = ['Only 3rd Cls', 'Royal Guard', 'Royal Guard Cls', 'Royal Guard Class'];
  protected readonly _atkSkillList: AtkSkillModel[] = [
    {
      label: 'Banishing Point Lv10',
      name: 'Banishing Point',
      value: 'Banishing Point==10',
      acd: 0,
      fct: 0,
      vct: 0,
      cd: 0,
      levelList: [{ label: 'Lv 10', value: 'Banishing Point==10' }],
      formular: (input: AtkSkillFormulaInput): number => {
        const { model, skillLevel } = input;
        const baseLevel = model.level;
        const learnedBashLv = this.bonuses.learnedSkillMap.get('Bash') || 0;
        const bonus = learnedBashLv * 30;

        return (bonus + skillLevel * 50) * (baseLevel / 100);
      },
    },
    {
      label: 'Genesis Ray Lv10',
      name: 'Genesis Ray',
      value: 'Genesis Ray==10',
      acd: 1,
      fct: 0.5,
      vct: 6,
      cd: 2,
      isMatk: true,
      element: ElementType.Holy,
      levelList: [{ label: 'Lv 10', value: 'Genesis Ray==10' }],
      formular: (input: AtkSkillFormulaInput): number => {
        const { model, skillLevel } = input;
        const baseLevel = model.level;

        return skillLevel * 200 * (baseLevel / 100);
      },
    },
    {
      label: 'Over Brand Lv5',
      name: 'Over Brand',
      value: 'Over Brand==5',
      acd: 2,
      fct: 0,
      vct: 0.5,
      cd: 0,
      isMelee: true,
      levelList: [{ label: 'Lv 5', value: 'Over Brand==5' }],
      formular: (input: AtkSkillFormulaInput): number => {
        const { model, skillLevel } = input;
        const baseLevel = model.level;
        const bonusLevel = baseLevel / 100;

        const spearQuicBonus = 50 * (this.bonuses.learnedSkillMap.get('Spear Quicken') || 0);
        const pierceDmg = Math.floor((skillLevel * 200 + spearQuicBonus) * bonusLevel);

        const {
          status: { totalStr, totalDex },
        } = input;
        const swingDmg = Math.floor((skillLevel * 100 + totalStr + totalDex) * bonusLevel);

        return pierceDmg + swingDmg;
      },
    },
    {
      label: 'Shield Press Lv10',
      name: 'Shield Press',
      value: 'Shield Press==10',
      acd: 0,
      fct: 0,
      vct: 0,
      cd: 2,
      isMelee: true,
      hit: 5,
      levelList: [],
      formular: (input: AtkSkillFormulaInput): number => {
        const { model, skillLevel, status, extra } = input;
        const baseLevel = model.level;
        const { totalStr, totalVit } = status;
        const { shieldWeight = 0, shieldRefine = 0 } = extra || {};

        return (totalStr + shieldWeight + skillLevel * 200) * (baseLevel / 100) + totalVit * shieldRefine;
      },
    },
  ];

  protected readonly _activeSkillList: ActiveSkillModel[] = [
    {
      label: 'Earth Drive',
      name: 'Earth Drive',
      inputType: 'selectButton',
      isMasteryAtk: true,
      dropdown: [
        { label: 'Yes', value: 5, skillLv: 5, isUse: true },
        { label: 'No', value: 0, isUse: false },
      ],
    },
  ];
  protected readonly _passiveSkillList: PassiveSkillModel[] = [];

  constructor() {
    super();

    this.inheritBaseClass(new Paladin());
  }

  override getMasteryAtk(info: InfoForClass): number {
    const { weapon } = info;
    const weaponType = weapon?.data?.typeName;
    const bonuses = this.bonuses?.masteryAtks || {};

    let sum = 0;
    for (const [, bonus] of Object.entries(bonuses)) {
      sum += bonus[`x_${weaponType}_atk`] || 0; // x_spear_atk
    }

    return sum;
  }

  override setAdditionalBonus(params: InfoForClass) {
    const { totalBonus, weapon } = params;
    const { typeName } = weapon.data;

    const { masteryAtks, equipAtks } = this.bonuses;

    const prefixCondition = `${typeName}_`;
    for (const [_skillName, bonus] of Object.entries({ ...(masteryAtks || {}), ...(equipAtks || {}) })) {
      for (const [attr, value] of Object.entries(bonus)) {
        if (attr.startsWith(prefixCondition)) {
          const actualAttr = attr.replace(prefixCondition, '');
          totalBonus[actualAttr] += value;
        }
      }
    }

    return totalBonus;
  }
}
