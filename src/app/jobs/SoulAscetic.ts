import { JOB_4_MAX_JOB_LEVEL, JOB_4_MIN_MAX_LEVEL } from '../app-config';
import { genSkillList } from '../utils';
import { SoulReaper } from './SoulReaper';
import { ActiveSkillModel, AtkSkillFormulaInput, AtkSkillModel, PassiveSkillModel } from './_character-base.abstract';
import { ClassName } from './_class-name';

const jobBonusTable: Record<number, [number, number, number, number, number, number]> = {
  1: [0, 0, 1, 1, 0, 0],
  2: [0, 0, 1, 2, 1, 0],
  3: [0, 1, 1, 2, 1, 0],
  4: [0, 1, 1, 3, 2, 0],
  5: [0, 1, 1, 4, 3, 0],
  6: [0, 1, 1, 4, 4, 0],
  7: [0, 1, 1, 5, 5, 0],
  8: [0, 1, 2, 5, 6, 0],
  9: [0, 1, 2, 6, 6, 0],
  10: [0, 1, 3, 6, 7, 0],
  11: [0, 2, 3, 7, 7, 0],
  12: [0, 2, 3, 8, 8, 0],
  13: [0, 2, 3, 8, 8, 0],
  14: [0, 2, 3, 9, 8, 1],
  15: [0, 2, 4, 10, 8, 1],
  16: [0, 2, 5, 10, 8, 1],
  17: [0, 2, 5, 10, 9, 1],
  18: [0, 2, 5, 10, 9, 1],
  19: [0, 2, 5, 10, 9, 1],
  20: [0, 2, 5, 10, 9, 1],
  21: [0, 2, 5, 10, 10, 1],
  22: [0, 2, 5, 10, 11, 1],
  23: [0, 2, 5, 11, 11, 2],
  24: [0, 2, 5, 11, 11, 2],
  25: [0, 3, 5, 11, 11, 2],
  26: [0, 3, 5, 11, 11, 2],
  27: [1, 3, 5, 11, 11, 2],
  28: [1, 4, 6, 11, 11, 2],
  29: [2, 5, 6, 11, 11, 2],
  30: [2, 5, 6, 11, 11, 2],
  31: [2, 5, 6, 11, 11, 2],
  32: [2, 6, 6, 11, 12, 2],
  33: [2, 6, 6, 11, 12, 2],
  34: [2, 7, 6, 11, 12, 2],
  35: [2, 7, 7, 11, 13, 2],
  36: [3, 7, 7, 11, 13, 2],
  37: [3, 7, 7, 11, 13, 2],
  38: [3, 7, 7, 11, 13, 2],
  39: [3, 7, 7, 11, 13, 2],
  40: [3, 7, 7, 11, 13, 2],
  41: [3, 7, 7, 11, 13, 2],
  42: [3, 7, 7, 11, 13, 2],
  43: [3, 7, 7, 11, 13, 2],
  44: [3, 7, 7, 11, 13, 2],
  45: [3, 7, 7, 11, 13, 2],
  46: [3, 7, 7, 11, 13, 2],
  47: [3, 7, 7, 11, 13, 2],
  48: [3, 7, 7, 11, 13, 2],
  49: [3, 7, 7, 11, 13, 2],
  50: [3, 7, 7, 11, 13, 2],
  51: [3, 7, 7, 11, 13, 2],
  52: [3, 7, 7, 11, 13, 2],
  53: [3, 7, 7, 11, 13, 2],
  54: [3, 7, 7, 11, 13, 2],
  55: [3, 7, 7, 11, 13, 2],
  56: [3, 7, 7, 11, 13, 2],
  57: [3, 7, 7, 11, 13, 2],
  58: [3, 7, 7, 11, 13, 2],
  59: [3, 7, 7, 11, 13, 2],
  60: [3, 7, 7, 11, 13, 2],
  61: [3, 7, 7, 11, 13, 2],
  62: [3, 7, 7, 11, 13, 2],
  63: [3, 7, 7, 11, 13, 2],
  64: [3, 7, 7, 11, 13, 2],
  65: [3, 7, 7, 11, 13, 2],
  66: [3, 7, 7, 11, 13, 2],
  67: [3, 7, 7, 11, 13, 2],
  68: [3, 7, 7, 11, 13, 2],
  69: [3, 7, 7, 11, 13, 2],
  70: [3, 7, 7, 11, 13, 2],
};

const traitBonusTable: Record<number, [number, number, number, number, number, number]> = {
  1: [0, 0, 0, 0, 0, 0],
  2: [0, 0, 0, 0, 0, 0],
  3: [0, 0, 0, 1, 0, 0],
  4: [0, 0, 0, 1, 0, 0],
  5: [0, 0, 0, 1, 0, 0],
  6: [0, 0, 0, 2, 0, 0],
  7: [0, 0, 0, 2, 0, 0],
  8: [0, 0, 0, 2, 0, 0],
  9: [0, 0, 0, 3, 0, 0],
  10: [0, 0, 0, 3, 0, 0],
  11: [0, 0, 0, 3, 0, 0],
  12: [0, 0, 0, 3, 0, 0],
  13: [0, 0, 1, 3, 1, 0],
  14: [0, 0, 1, 3, 1, 0],
  15: [0, 0, 1, 3, 1, 0],
  16: [0, 0, 1, 3, 1, 1],
  17: [0, 0, 1, 3, 1, 1],
  18: [0, 0, 1, 3, 2, 1],
  19: [0, 0, 2, 3, 2, 1],
  20: [0, 0, 2, 3, 2, 1],
  21: [0, 0, 2, 3, 2, 1],
  22: [0, 0, 2, 4, 2, 1],
  23: [0, 0, 2, 4, 2, 1],
  24: [0, 0, 2, 4, 2, 1],
  25: [0, 0, 2, 4, 2, 1],
  26: [0, 0, 2, 5, 2, 1],
  27: [0, 1, 2, 5, 2, 1],
  28: [0, 1, 2, 5, 2, 1],
  29: [0, 2, 2, 5, 2, 1],
  30: [0, 2, 2, 6, 2, 1],
  31: [0, 2, 3, 6, 2, 1],
  32: [0, 2, 3, 6, 2, 1],
  33: [0, 2, 3, 6, 3, 1],
  34: [0, 2, 3, 6, 3, 1],
  35: [0, 2, 3, 6, 3, 1],
  36: [0, 3, 3, 6, 3, 1],
  37: [0, 3, 3, 7, 3, 1],
  38: [0, 3, 3, 7, 3, 1],
  39: [0, 3, 3, 7, 3, 1],
  40: [0, 3, 3, 7, 3, 2],
  41: [0, 3, 3, 7, 3, 2],
  42: [0, 3, 3, 7, 3, 2],
  43: [0, 3, 4, 7, 4, 2],
  44: [0, 3, 5, 8, 4, 2],
  45: [0, 3, 5, 9, 4, 2],
  46: [0, 3, 5, 9, 5, 2],
  47: [0, 3, 5, 10, 5, 2],
  48: [0, 3, 5, 10, 5, 3],
  49: [0, 3, 5, 10, 6, 3],
  50: [0, 3, 6, 11, 6, 3],
  51: [0, 3, 6, 12, 6, 3],
  52: [0, 3, 6, 12, 7, 3],
  53: [0, 3, 7, 12, 7, 3],
  54: [0, 4, 7, 12, 7, 3],
  55: [0, 4, 7, 13, 7, 3],
  56: [0, 4, 8, 13, 7, 3],
  57: [0, 4, 8, 13, 7, 3],
  58: [0, 4, 8, 13, 7, 3],
  59: [0, 4, 8, 13, 8, 3],
  60: [0, 4, 8, 13, 8, 3],
  61: [0, 4, 8, 13, 8, 3],
  62: [0, 4, 8, 13, 8, 3],
  63: [0, 4, 8, 13, 8, 3],
  64: [0, 4, 8, 13, 8, 3],
  65: [0, 4, 8, 13, 8, 3],
  66: [0, 4, 8, 13, 8, 3],
  67: [0, 4, 8, 13, 8, 3],
  68: [0, 4, 8, 13, 8, 3],
  69: [0, 4, 8, 13, 8, 3],
  70: [0, 4, 8, 13, 8, 3],
};

const BlessingValue = {
  East: 1,
  South: 2,
  West: 3,
  North: 4,
  Four_Directions: 5,
} as const;

type BlessingValueT = typeof BlessingValue[keyof typeof BlessingValue];

export class SoulAscetic extends SoulReaper {
  protected override CLASS_NAME = ClassName.SoulAscetic;
  protected override JobBonusTable = jobBonusTable;
  protected override TraitBonusTable = traitBonusTable;

  protected override minMaxLevel = JOB_4_MIN_MAX_LEVEL;
  protected override maxJob = JOB_4_MAX_JOB_LEVEL;

  private readonly classNames4th = [ClassName.Only_4th, ClassName.SoulAscetic];
  private readonly atkSkillList4th: AtkSkillModel[] = [
    {
      name: 'Exorcism of Malicious Soul',
      label: '[V2] Exorcism of Malicious Soul Lv5',
      value: 'Exorcism of Malicious Soul==5',
      acd: 0,
      fct: 1.5,
      vct: 2.2,
      cd: 1,
      isMatk: true,
      hit: 5,
      formula: (input: AtkSkillFormulaInput): number => {
        const { model, skillLevel, status } = input;
        const { totalSpl } = status;
        const baseLevel = model.level;
        const soulMasteryLv = this.learnLv('Soul Mastery');
        const totalSoul = this.activeSkillLv('Total Soul') || 1;

        if (this.isSkillActive('Totem of Tutelary')) {
          return (150 * skillLevel + soulMasteryLv * 2 + totalSpl) * totalSoul * (baseLevel / 100);

        }

        return (250 * skillLevel + soulMasteryLv * 2 + totalSpl) * totalSoul * (baseLevel / 100);
      },
    },
    {
      name: 'Talisman of Blue Dragon',
      label: '[V2] Talisman of Blue Dragon Lv5',
      value: 'Talisman of Blue Dragon==5',
      acd: 0,
      fct: 1.5,
      vct: 1,
      cd: 0.3,
      isMatk: true,
      formula: (input: AtkSkillFormulaInput): number => {
        const { model, skillLevel, status } = input;
        const { totalSpl } = status;
        const baseLevel = model.level;
        const talisMaster = this.learnLv('Talisman Mastery');

        if (this.isSkillActive('Talisman of Five Elements')) {
          return (350 + skillLevel * (1650 + talisMaster * 15) + totalSpl * 5) * (baseLevel / 100);

        }

        return (250 + skillLevel * (1450 + talisMaster * 15) + totalSpl * 5) * (baseLevel / 100);
      },
    },
    {
      name: 'Talisman of White Tiger',
      label: '[V2] Talisman of White Tiger Lv5',
      value: 'Talisman of White Tiger==5',
      acd: 0,
      fct: 1.5,
      vct: 1,
      cd: 0.4,
      isMatk: true,
      hit: 2,
      formula: (input: AtkSkillFormulaInput): number => {
        const { model, skillLevel, status } = input;
        const { totalSpl } = status;
        const baseLevel = model.level;
        const talisMaster = this.learnLv('Talisman Mastery');

        if (this.isSkillActive('Talisman of Five Elements')) {
          return (350 + skillLevel * (1350 + talisMaster * 15) + totalSpl * 5) * (baseLevel / 100);

        }

        return (350 + skillLevel * (950 + talisMaster * 15) + totalSpl * 5) * (baseLevel / 100);
      },
    },
    {
      name: 'Talisman of Red Phoenix',
      label: '[V2] Talisman of Red Phoenix Lv5',
      value: 'Talisman of Red Phoenix==5',
      acd: 0,
      fct: 1.5,
      vct: 1,
      cd: 0.5,
      isMatk: true,
      hit: 3,
      formula: (input: AtkSkillFormulaInput): number => {
        const { model, skillLevel, status } = input;
        const { totalSpl } = status;
        const baseLevel = model.level;
        const talisMaster = this.learnLv('Talisman Mastery');

        if (this.isSkillActive('Talisman of Five Elements')) {
          return (1200 + skillLevel * (1300 + talisMaster * 15) + totalSpl * 5) * (baseLevel / 100);

        }

        return (1000 + skillLevel * (900 + talisMaster * 15) + totalSpl * 5) * (baseLevel / 100);
      },
    },
    {
      name: 'Talisman of Black Tortoise',
      label: '[V2] Talisman of Black Tortoise Lv5',
      value: 'Talisman of Black Tortoise==5',
      acd: 0,
      fct: 1.5,
      vct: 1,
      cd: 0.75,
      isMatk: true,
      hit: 3,
      formula: (input: AtkSkillFormulaInput): number => {
        const { model, skillLevel, status } = input;
        const { totalSpl } = status;
        const baseLevel = model.level;
        const talisMaster = this.learnLv('Talisman Mastery');

        if (this.isSkillActive('Talisman of Five Elements')) {
          return (1850 + skillLevel * (1850 + talisMaster * 15) + totalSpl * 5) * (baseLevel / 100);

        }

        return (2150 + skillLevel * (1450 + talisMaster * 15) + totalSpl * 5) * (baseLevel / 100);
      },
    },
    {
      name: 'Talisman of Four Bearing God',
      label: '[V2] Talisman of Four Bearing God Lv5',
      value: 'Talisman of Four Bearing God==5',
      acd: 0,
      fct: 1.5,
      vct: 1.5,
      cd: 1,
      isMatk: true,
      totalHit: () => {
        const blessing = this.activeSkillLv('_SoulAscetic_Blessing') as BlessingValueT;
        const hitMap = {
          [BlessingValue.East]: 2,
          [BlessingValue.South]: 3,
          [BlessingValue.West]: 4,
          [BlessingValue.North]: 5,
          [BlessingValue.Four_Directions]: 7,
        };

        return hitMap[blessing] || (this.isSkillActive('Talisman of Five Elements') ? 7 : 1);
      },
      formula: (input: AtkSkillFormulaInput): number => {
        const { model, skillLevel, status } = input;
        const { totalSpl } = status;
        const baseLevel = model.level;
        const talisMaster = this.learnLv('Talisman Mastery');

        return (50 + skillLevel * (250 + talisMaster * 15) + totalSpl * 5) * (baseLevel / 100);
      },
    },
  ];
  private readonly activeSkillList4th: ActiveSkillModel[] = [
    {
      name: 'Talisman of Five Elements',
      label: 'Five Elements',
      inputType: 'dropdown',
      dropdown: genSkillList(5, lv => ({
        p_element_water: lv * 4,
        p_element_wind: lv * 4,
        p_element_earth: lv * 4,
        p_element_fire: lv * 4,
        p_element_neutral: lv * 4,
        m_element_water: lv * 4,
        m_element_wind: lv * 4,
        m_element_earth: lv * 4,
        m_element_fire: lv * 4,
        m_element_neutral: lv * 4,
      })),
    },
    {
      name: '_SoulAscetic_Blessing',
      label: 'Blessing of',
      inputType: 'dropdown',
      dropdown: [
        { label: '-', value: 0, isUse: false },
        { label: 'East', value: BlessingValue.East, isUse: true },
        { label: 'South', value: BlessingValue.South, isUse: true },
        { label: 'West', value: BlessingValue.West, isUse: true },
        { label: 'North', value: BlessingValue.North, isUse: true },
        { label: 'Four Directions', value: BlessingValue.Four_Directions, isUse: true },
      ],
    },
    {
      name: 'Totem of Tutelary',
      label: 'Totem of Tutelary',
      inputType: 'dropdown',
      dropdown: [
        { label: '-', value: 0, isUse: false },
        { label: 'Lv 5', value: 1, isUse: true },
      ],
    },
  ];
  private readonly passiveSkillList4th: PassiveSkillModel[] = [
    {
      name: 'Talisman Mastery',
      label: 'Talisman Mastery',
      inputType: 'dropdown',
      dropdown: genSkillList(10, lv => ({ sMatk: lv })),
    },
    {
      name: 'Soul Mastery',
      label: 'Soul Mastery',
      inputType: 'dropdown',
      dropdown: genSkillList(10, lv => ({ spl: lv })),
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
}
