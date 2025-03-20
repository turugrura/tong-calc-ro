import { JOB_4_MAX_JOB_LEVEL, JOB_4_MIN_MAX_LEVEL } from '../app-config';
import { EquipmentSummaryModel } from '../models/equipment-summary.model';
import { AdditionalBonusInput } from '../models/info-for-class.model';
import { addBonus, genSkillList } from '../utils';
import { StarEmperor } from './StarEmperor';
import { ActiveSkillModel, AtkSkillFormulaInput, AtkSkillModel, PassiveSkillModel } from './_character-base.abstract';
import { ClassName } from './_class-name';

const jobBonusTable: Record<number, [number, number, number, number, number, number]> = {
  1: [1, 0, 0, 0, 1, 0],
  2: [2, 0, 0, 0, 1, 0],
  3: [2, 1, 0, 1, 1, 0],
  4: [3, 2, 0, 1, 2, 0],
  5: [4, 2, 0, 2, 2, 0],
  6: [5, 2, 0, 2, 2, 0],
  7: [6, 2, 0, 2, 3, 0],
  8: [6, 2, 0, 2, 4, 0],
  9: [6, 3, 1, 2, 4, 0],
  10: [6, 3, 1, 2, 5, 0],
  11: [6, 3, 2, 3, 5, 0],
  12: [7, 3, 2, 3, 5, 1],
  13: [8, 3, 3, 3, 5, 1],
  14: [8, 3, 3, 3, 5, 1],
  15: [8, 3, 3, 3, 5, 1],
  16: [9, 3, 3, 3, 5, 1],
  17: [10, 4, 3, 3, 5, 1],
  18: [10, 4, 3, 3, 5, 1],
  19: [10, 4, 3, 3, 5, 1],
  20: [11, 4, 3, 3, 5, 1],
  21: [11, 4, 3, 3, 6, 1],
  22: [11, 5, 3, 3, 6, 1],
  23: [11, 6, 3, 3, 6, 1],
  24: [12, 6, 3, 3, 7, 1],
  25: [12, 7, 3, 3, 7, 1],
  26: [12, 7, 3, 3, 8, 2],
  27: [12, 7, 3, 3, 8, 2],
  28: [12, 8, 3, 3, 8, 2],
  29: [12, 8, 4, 3, 9, 2],
  30: [12, 8, 4, 3, 9, 3],
  31: [12, 9, 5, 3, 9, 3],
  32: [12, 10, 5, 3, 9, 3],
  33: [12, 10, 6, 3, 9, 3],
  34: [12, 10, 6, 3, 9, 3],
  35: [12, 10, 6, 3, 9, 3],
  36: [12, 10, 6, 3, 9, 3],
  37: [12, 10, 6, 3, 9, 3],
  38: [12, 10, 6, 3, 9, 3],
  39: [12, 10, 6, 3, 9, 3],
  40: [12, 10, 6, 3, 9, 3],
  41: [12, 10, 6, 3, 9, 3],
  42: [12, 10, 6, 3, 9, 3],
  43: [12, 10, 6, 3, 9, 3],
  44: [12, 10, 6, 3, 9, 3],
  45: [12, 10, 6, 3, 9, 3],
  46: [12, 10, 6, 3, 9, 3],
  47: [12, 10, 6, 3, 9, 3],
  48: [12, 10, 6, 3, 9, 3],
  49: [12, 10, 6, 3, 9, 3],
  50: [12, 10, 6, 3, 9, 3],
  51: [12, 10, 6, 3, 9, 3],
  52: [12, 10, 6, 3, 9, 3],
  53: [12, 10, 6, 3, 9, 3],
  54: [12, 10, 6, 3, 9, 3],
  55: [12, 10, 6, 3, 9, 3],
  56: [12, 10, 6, 3, 9, 3],
  57: [12, 10, 6, 3, 9, 3],
  58: [12, 10, 6, 3, 9, 3],
  59: [12, 10, 6, 3, 9, 3],
  60: [12, 10, 6, 3, 9, 3],
  61: [12, 10, 6, 3, 9, 3],
  62: [12, 10, 6, 3, 9, 3],
  63: [12, 10, 6, 3, 9, 3],
  64: [12, 10, 6, 3, 9, 3],
  65: [12, 10, 6, 3, 9, 3],
  66: [12, 10, 6, 3, 9, 3],
  67: [12, 10, 6, 3, 9, 3],
  68: [12, 10, 6, 3, 9, 3],
  69: [12, 10, 6, 3, 9, 3],
  70: [12, 10, 6, 3, 9, 3],
};

const traitBonusTable: Record<number, [number, number, number, number, number, number]> = {
  1: [0, 1, 0, 0, 0, 0],
  2: [1, 2, 0, 0, 0, 0],
  3: [1, 2, 0, 0, 0, 0],
  4: [1, 3, 0, 0, 0, 0],
  5: [2, 4, 0, 0, 0, 0],
  6: [2, 5, 0, 0, 0, 0],
  7: [2, 6, 0, 0, 0, 0],
  8: [2, 6, 0, 0, 0, 1],
  9: [2, 6, 0, 0, 0, 1],
  10: [2, 6, 0, 0, 0, 1],
  11: [2, 6, 0, 0, 0, 1],
  12: [2, 7, 0, 0, 0, 1],
  13: [2, 8, 0, 0, 0, 1],
  14: [2, 8, 0, 0, 0, 2],
  15: [2, 8, 1, 0, 0, 2],
  16: [2, 9, 1, 0, 0, 2],
  17: [2, 10, 1, 0, 0, 2],
  18: [2, 10, 1, 0, 0, 2],
  19: [3, 10, 1, 0, 0, 2],
  20: [3, 11, 1, 0, 0, 2],
  21: [3, 11, 1, 0, 0, 2],
  22: [3, 11, 1, 0, 0, 2],
  23: [3, 11, 1, 0, 0, 2],
  24: [3, 12, 1, 0, 0, 2],
  25: [3, 12, 1, 0, 0, 2],
  26: [3, 12, 1, 0, 0, 2],
  27: [3, 12, 1, 0, 1, 2],
  28: [4, 12, 1, 0, 1, 2],
  29: [4, 12, 1, 0, 1, 2],
  30: [4, 12, 1, 0, 2, 2],
  31: [4, 12, 1, 0, 2, 2],
  32: [4, 12, 1, 0, 2, 2],
  33: [4, 12, 1, 0, 2, 2],
  34: [5, 12, 1, 0, 2, 2],
  35: [5, 12, 1, 0, 3, 2],
  36: [6, 12, 1, 0, 3, 2],
  37: [6, 12, 1, 0, 4, 2],
  38: [6, 12, 1, 0, 4, 3],
  39: [6, 12, 1, 0, 4, 3],
  40: [7, 12, 1, 0, 4, 3],
  41: [8, 12, 1, 0, 4, 3],
  42: [8, 12, 1, 0, 4, 4],
  43: [8, 12, 1, 0, 4, 4],
  44: [9, 12, 1, 0, 4, 4],
  45: [9, 12, 1, 0, 4, 5],
  46: [9, 12, 1, 0, 4, 6],
  47: [10, 12, 2, 0, 4, 6],
  48: [10, 12, 2, 0, 4, 6],
  49: [10, 12, 2, 0, 5, 6],
  50: [11, 12, 2, 0, 5, 7],
  51: [11, 13, 2, 0, 6, 7],
  52: [11, 13, 2, 0, 6, 7],
  53: [11, 14, 2, 0, 6, 7],
  54: [11, 14, 2, 0, 6, 7],
  55: [12, 14, 2, 0, 7, 7],
  56: [12, 14, 2, 0, 7, 7],
  57: [12, 14, 3, 0, 7, 7],
  58: [12, 14, 3, 0, 7, 7],
  59: [12, 14, 3, 0, 8, 7],
  60: [12, 14, 3, 0, 8, 7],
  61: [12, 14, 3, 0, 8, 7],
  62: [12, 14, 3, 0, 8, 7],
  63: [12, 14, 3, 0, 8, 7],
  64: [12, 14, 3, 0, 8, 7],
  65: [12, 14, 3, 0, 8, 7],
  66: [12, 14, 3, 0, 8, 7],
  67: [12, 14, 3, 0, 8, 7],
  68: [12, 14, 3, 0, 8, 7],
  69: [12, 14, 3, 0, 8, 7],
  70: [12, 14, 3, 0, 8, 7],
};

const RisingSun = {
  Sunrise: 1,
  Noon: 2,
  Sunset: 3,
} as const;
const RisingMoon = {
  Moonrise: 1,
  Midnight: 2,
  Moonset: 3,
} as const;

export class SkyEmperor extends StarEmperor {
  protected override CLASS_NAME = ClassName.SkyEmperor;
  protected override JobBonusTable = jobBonusTable;
  protected override TraitBonusTable = traitBonusTable;

  protected override minMaxLevel = JOB_4_MIN_MAX_LEVEL;
  protected override maxJob = JOB_4_MAX_JOB_LEVEL;

  private readonly classNames4th = [ClassName.Only_4th, ClassName.SkyEmperor];
  private readonly atkSkillList4th: AtkSkillModel[] = [
    {
      name: 'Noon Blast',
      label: '[V2] Noon Blast Lv5',
      value: 'Noon Blast==5',
      acd: 0.5,
      fct: 0,
      vct: 0,
      cd: 0.7,
      isMelee: true,
      hit: 2,
      canCri: () => this.activeSkillLv('_SkyEmperor_Rising_Sun') === RisingSun.Noon,
      criDmgPercentage: 0.5,
      baseCriPercentage: 1,
      formula: (input: AtkSkillFormulaInput): number => {
        const { model, skillLevel, status } = input;
        const { totalPow } = status;
        const baseLevel = model.level;
        const skillBonusLv = this.learnLv('Sky Mastery');

        return (1600 + skillLevel * (1250 + skillBonusLv * 5) + totalPow * 5) * (baseLevel / 100);
      },
    },
    {
      name: 'Sunset Blast',
      label: '[V2] Sunset Blast Lv5',
      value: 'Sunset Blast==5',
      acd: 0.5,
      fct: 0,
      vct: 0,
      cd: 0.3,
      isMelee: true,
      hit: 2,
      canCri: () => this.activeSkillLv('_SkyEmperor_Rising_Sun') === RisingSun.Sunset,
      criDmgPercentage: 0.5,
      baseCriPercentage: 1,
      formula: (input: AtkSkillFormulaInput): number => {
        const { model, skillLevel, status } = input;
        const { totalPow } = status;
        const baseLevel = model.level;
        const skillBonusLv = this.learnLv('Sky Mastery');

        return (950 + skillLevel * (400 + skillBonusLv * 5) + totalPow * 5) * (baseLevel / 100);
      },
    },
    {
      name: 'Midnight Kick',
      label: '[V2] Midnight Kick Lv5',
      value: 'Midnight Kick==5',
      acd: 0,
      fct: 0.5,
      vct: 1,
      cd: 0.7,
      isMelee: true,
      hit: 2,
      criDmgPercentage: 0.5,
      formula: (input: AtkSkillFormulaInput): number => {
        const { model, skillLevel, status } = input;
        const { totalPow } = status;
        const baseLevel = model.level;
        const skillBonusLv = this.learnLv('Sky Mastery');

        if (this.activeSkillLv('_SkyEmperor_Rising_Moon') === RisingMoon.Midnight) {
          return (1550 + skillLevel * (1450 + skillBonusLv * 5) + totalPow * 5) * (baseLevel / 100);
        }

        return (600 + skillLevel * (1200 + skillBonusLv * 5) + totalPow * 5) * (baseLevel / 100);
      },
    },
    {
      name: 'Dawn Break',
      label: '[V2] Dawn Break Lv5',
      value: 'Dawn Break==5',
      acd: 0,
      fct: 0.5,
      vct: 1,
      cd: 0.3,
      isMelee: true,
      hit: 2,
      criDmgPercentage: 0.5,
      formula: (input: AtkSkillFormulaInput): number => {
        const { model, skillLevel, status } = input;
        const { totalPow } = status;
        const baseLevel = model.level;
        const skillBonusLv = this.learnLv('Sky Mastery');

        if (this.activeSkillLv('_SkyEmperor_Rising_Moon') === RisingMoon.Moonset) {
          return (400 + skillLevel * (600 + skillBonusLv * 5) + totalPow * 5) * (baseLevel / 100);
        }

        return (400 + skillLevel * (400 + skillBonusLv * 5) + totalPow * 5) * (baseLevel / 100);
      },
    },
    {
      name: 'Star Cannon',
      label: '[V2] Star Cannon Lv5 (1 hit)',
      value: 'Star Cannon==5',
      acd: 0,
      fct: 0.5,
      vct: 1,
      cd: 0.3,
      isMelee: true,
      criDmgPercentage: 0.5,
      formula: (input: AtkSkillFormulaInput): number => {
        const { model, skillLevel, status } = input;
        const { totalPow } = status;
        const baseLevel = model.level;
        const skillBonusLv = this.learnLv('Sky Mastery');

        return (200 + skillLevel * (500 + skillBonusLv * 5) + totalPow * 5) * (baseLevel / 100);
      },
    },
  ];
  private readonly activeSkillList4th: ActiveSkillModel[] = [
    {
      name: '_SkyEmperor_Rising_Sun',
      label: 'Rising Sun',
      inputType: 'dropdown',
      dropdown: [
        { label: '-', value: 0, isUse: false },
        { label: 'Sunrise', value: RisingSun.Sunrise, isUse: true },
        { label: 'Noon', value: RisingSun.Noon, isUse: true },
        { label: 'Sunset', value: RisingSun.Sunset, isUse: true },
      ]
    },
    {
      name: '_SkyEmperor_Rising_Moon',
      label: 'Rising Moon',
      inputType: 'dropdown',
      dropdown: [
        { label: '-', value: 0, isUse: false },
        { label: 'Moonrise', value: RisingMoon.Moonrise, isUse: true },
        { label: 'Midnight', value: RisingMoon.Midnight, isUse: true },
        { label: 'Moonset', value: RisingMoon.Moonset, isUse: true },
      ]
    },
  ];
  private readonly passiveSkillList4th: PassiveSkillModel[] = [
    {
      name: 'Sky Mastery',
      label: 'Sky Mastery',
      inputType: 'dropdown',
      dropdown: genSkillList(10)
    },
    {
      name: 'War Book Mastery',
      label: 'War Book Mastery',
      inputType: 'dropdown',
      dropdown: genSkillList(10)
    },
  ];

  constructor() {
    super();

    this.inheritSkills({
      activeSkillList: this.activeSkillList4th,
      atkSkillList: this.atkSkillList4th,
      passiveSkillList: this.passiveSkillList4th,
      classNames: this.classNames4th,
    });
  }

  override setAdditionalBonus(params: AdditionalBonusInput): EquipmentSummaryModel {
    super.setAdditionalBonus(params);

    const { totalBonus, weapon } = params;

    const warMastLv = this.learnLv('War Book Mastery');
    if (warMastLv > 0 && weapon.isType('book')) {
      addBonus(totalBonus, 'pAtk', warMastLv + 2);
      addBonus(totalBonus, 'hit', warMastLv * 3);
    }

    return totalBonus;
  }
}
