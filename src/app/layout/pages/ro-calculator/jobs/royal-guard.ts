import { ClassName } from './_class-name';
import { ActiveSkillModel, AtkSkillFormulaInput, AtkSkillModel, CharacterBase, PassiveSkillModel } from './_character-base.abstract';
import { Paladin } from './paladin';
import { ElementType } from '../constants/element-type.const';
import { InfoForClass } from '../models/info-for-class.model';

const jobBonusTable: Record<number, [number, number, number, number, number, number]> = {
  1: [0, 0, 0, 0, 1, 0],
  2: [0, 0, 0, 1, 1, 0],
  3: [0, 0, 0, 2, 1, 0],
  4: [0, 1, 0, 2, 1, 0],
  5: [0, 1, 0, 2, 1, 0],
  6: [0, 1, 0, 2, 1, 0],
  7: [0, 2, 0, 2, 1, 0],
  8: [0, 2, 0, 2, 2, 0],
  9: [0, 2, 0, 3, 2, 0],
  10: [0, 2, 0, 3, 2, 0],
  11: [0, 2, 0, 3, 2, 0],
  12: [0, 2, 1, 3, 2, 0],
  13: [0, 2, 2, 3, 2, 0],
  14: [0, 2, 3, 3, 2, 0],
  15: [0, 2, 3, 3, 2, 0],
  16: [0, 2, 3, 3, 2, 0],
  17: [0, 2, 3, 3, 3, 0],
  18: [0, 3, 3, 3, 3, 0],
  19: [0, 3, 3, 3, 3, 0],
  20: [0, 3, 3, 3, 3, 0],
  21: [0, 3, 3, 4, 3, 0],
  22: [0, 3, 4, 4, 3, 0],
  23: [0, 3, 4, 4, 4, 0],
  24: [0, 3, 4, 4, 4, 0],
  25: [0, 3, 4, 4, 4, 0],
  26: [1, 3, 4, 4, 4, 0],
  27: [2, 3, 4, 4, 4, 0],
  28: [2, 3, 4, 4, 4, 0],
  29: [2, 3, 4, 4, 4, 0],
  30: [2, 3, 4, 4, 5, 0],
  31: [2, 4, 4, 4, 5, 0],
  32: [2, 4, 5, 4, 5, 0],
  33: [2, 4, 5, 4, 5, 0],
  34: [2, 4, 5, 4, 5, 0],
  35: [2, 4, 5, 4, 5, 0],
  36: [2, 4, 5, 5, 5, 0],
  37: [2, 4, 5, 6, 5, 0],
  38: [2, 4, 5, 7, 5, 0],
  39: [2, 5, 5, 7, 5, 0],
  40: [2, 5, 5, 7, 5, 0],
  41: [2, 5, 5, 7, 5, 0],
  42: [2, 5, 5, 7, 5, 0],
  43: [2, 6, 5, 7, 5, 0],
  44: [2, 6, 5, 7, 6, 0],
  45: [2, 7, 5, 7, 6, 0],
  46: [2, 7, 5, 7, 6, 0],
  47: [2, 7, 5, 7, 6, 0],
  48: [2, 7, 5, 7, 6, 0],
  49: [2, 7, 5, 8, 6, 0],
  50: [2, 8, 5, 8, 6, 0],
  51: [2, 8, 5, 8, 6, 1],
  52: [2, 8, 5, 8, 7, 1],
  53: [2, 8, 5, 8, 7, 1],
  54: [2, 8, 5, 9, 7, 1],
  55: [2, 9, 5, 9, 7, 1],
  56: [2, 9, 5, 9, 7, 1],
  57: [2, 9, 6, 9, 7, 1],
  58: [2, 9, 6, 9, 7, 2],
  59: [2, 9, 6, 9, 8, 2],
  60: [2, 10, 6, 9, 8, 2],
  61: [2, 10, 6, 9, 8, 2],
  62: [2, 10, 6, 9, 8, 2],
  63: [2, 10, 6, 9, 8, 2],
  64: [2, 11, 7, 9, 8, 2],
  65: [8, 3, 8, 10, 8, 3],
};

export class RoyalGuard extends CharacterBase {
  protected readonly CLASS_NAME = ClassName.RoyalGuard;
  protected readonly JobBonusTable = jobBonusTable;

  protected readonly initialStatusPoint = 100;
  protected readonly classNames = [
    'Only 3rd Cls',
    'Royal Guard',
    'Royal Guard Cls',
    'Royal Guard Class'
  ];
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
        const learnedBashLv = this.bonuses.learnedSkillMap.get('Bash') || 0
        const bonus = learnedBashLv * 30

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

        return (skillLevel * 200) * (baseLevel / 100);
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
        const bonusLevel = (baseLevel / 100)

        const spearQuicBonus = 50 * (this.bonuses.learnedSkillMap.get('Spear Quicken') || 0)
        const pierceDmg = Math.floor((skillLevel * 200 + spearQuicBonus) * bonusLevel)

        const { status: { totalStr, totalDex } } = input
        const swingDmg = Math.floor((skillLevel * 100 + totalStr + totalDex) * bonusLevel)

        return (pierceDmg + swingDmg);
      },
    },
  ];

  protected readonly _activeSkillList: ActiveSkillModel[] = [

  ];
  protected readonly _passiveSkillList: PassiveSkillModel[] = [

  ];

  constructor() {
    super()

    this.inheritBaseClass(new Paladin())
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
