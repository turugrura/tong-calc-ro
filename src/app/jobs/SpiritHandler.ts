import { JOB_4_MAX_JOB_LEVEL, JOB_4_MIN_MAX_LEVEL } from '../app-config';
import { ElementType } from '../constants';
import { floor, genSkillList } from '../utils';
import { ColorOfHyunrokValue, Doram } from './Doram';
import { ActiveSkillModel, AtkSkillFormulaInput, AtkSkillModel, PassiveSkillModel } from './_character-base.abstract';
import { ClassName } from './_class-name';

const jobBonusTable: Record<number, [number, number, number, number, number, number]> = {
  1: [0, 0, 0, 0, 1, 0],
  2: [0, 0, 0, 1, 2, 0],
  3: [0, 0, 0, 2, 2, 0],
  4: [1, 0, 0, 2, 2, 0],
  5: [1, 0, 1, 2, 3, 0],
  6: [1, 0, 1, 2, 4, 0],
  7: [1, 1, 1, 2, 4, 0],
  8: [1, 1, 1, 3, 4, 1],
  9: [1, 2, 1, 3, 4, 1],
  10: [2, 2, 1, 3, 4, 1],
  11: [2, 2, 1, 3, 5, 1],
  12: [2, 2, 2, 3, 5, 1],
  13: [2, 3, 2, 3, 5, 1],
  14: [2, 3, 2, 3, 6, 1],
  15: [2, 3, 2, 4, 6, 1],
  16: [2, 3, 2, 4, 7, 1],
  17: [2, 3, 2, 5, 7, 1],
  18: [2, 3, 2, 5, 8, 1],
  19: [2, 4, 2, 5, 8, 1],
  20: [2, 5, 2, 5, 8, 1],
  21: [2, 5, 2, 5, 9, 1],
  22: [2, 5, 3, 5, 9, 1],
  23: [3, 5, 3, 5, 9, 1],
  24: [3, 5, 3, 6, 9, 1],
  25: [3, 5, 3, 7, 9, 1],
  26: [3, 5, 4, 7, 9, 1],
  27: [3, 5, 4, 7, 9, 2],
  28: [3, 5, 4, 7, 9, 3],
  29: [3, 5, 4, 7, 10, 3],
  30: [3, 5, 4, 8, 10, 3],
  31: [4, 5, 4, 8, 10, 3],
  32: [4, 5, 4, 8, 11, 3],
  33: [4, 6, 4, 8, 11, 3],
  34: [4, 6, 5, 8, 11, 3],
  35: [4, 6, 5, 8, 12, 3],
  36: [5, 6, 5, 8, 12, 3],
  37: [5, 6, 5, 9, 12, 3],
  38: [5, 6, 5, 9, 12, 4],
  39: [5, 6, 5, 9, 12, 4],
  40: [5, 6, 5, 9, 12, 5],
  41: [5, 6, 5, 9, 12, 5],
  42: [5, 6, 5, 9, 12, 5],
  43: [5, 7, 5, 9, 12, 5],
  44: [5, 7, 5, 9, 12, 5],
  45: [5, 7, 5, 9, 12, 5],
  46: [5, 7, 5, 9, 12, 5],
  47: [5, 7, 5, 9, 12, 5],
  48: [5, 7, 5, 9, 12, 5],
  49: [5, 7, 5, 9, 12, 5],
  50: [5, 7, 5, 9, 12, 5],
  51: [5, 7, 5, 9, 12, 5],
  52: [5, 7, 5, 9, 12, 5],
  53: [5, 7, 5, 9, 12, 5],
  54: [5, 7, 5, 9, 12, 5],
  55: [5, 7, 5, 9, 12, 5],
  56: [5, 7, 5, 9, 12, 5],
  57: [5, 7, 5, 9, 12, 5],
  58: [5, 7, 5, 9, 12, 5],
  59: [5, 7, 5, 9, 12, 5],
  60: [5, 7, 5, 9, 12, 5],
  61: [5, 7, 5, 9, 12, 5],
  62: [5, 7, 5, 9, 12, 5],
  63: [5, 7, 5, 9, 12, 5],
  64: [5, 7, 5, 9, 12, 5],
  65: [5, 7, 5, 9, 12, 5],
  66: [5, 7, 5, 9, 12, 5],
  67: [5, 7, 5, 9, 12, 5],
  68: [5, 7, 5, 9, 12, 5],
  69: [5, 7, 5, 9, 12, 5],
  70: [5, 7, 5, 9, 12, 5],
};

const traitBonusTable: Record<number, [number, number, number, number, number, number]> = {
  1: [0, 0, 0, 0, 0, 0],
  2: [0, 0, 0, 0, 0, 0],
  3: [0, 0, 0, 0, 0, 1],
  4: [0, 1, 0, 0, 0, 1],
  5: [0, 1, 0, 0, 0, 1],
  6: [0, 1, 0, 0, 0, 1],
  7: [0, 1, 0, 0, 0, 1],
  8: [0, 1, 0, 0, 0, 1],
  9: [0, 1, 0, 1, 0, 1],
  10: [1, 2, 0, 1, 0, 1],
  11: [1, 2, 0, 1, 0, 2],
  12: [1, 2, 0, 1, 1, 2],
  13: [1, 2, 0, 1, 1, 2],
  14: [1, 2, 0, 1, 1, 2],
  15: [1, 2, 0, 2, 1, 2],
  16: [1, 2, 0, 2, 1, 2],
  17: [1, 2, 0, 2, 1, 2],
  18: [1, 2, 1, 2, 1, 2],
  19: [1, 2, 1, 2, 1, 2],
  20: [2, 2, 1, 2, 1, 2],
  21: [2, 2, 1, 2, 1, 2],
  22: [2, 2, 1, 3, 1, 2],
  23: [2, 3, 1, 3, 1, 2],
  24: [2, 3, 1, 3, 2, 2],
  25: [2, 3, 1, 3, 2, 3],
  26: [2, 3, 1, 3, 2, 3],
  27: [2, 3, 2, 3, 2, 3],
  28: [2, 3, 2, 3, 2, 3],
  29: [2, 3, 2, 3, 2, 3],
  30: [2, 3, 2, 4, 2, 3],
  31: [2, 4, 2, 4, 2, 3],
  32: [2, 4, 2, 4, 3, 3],
  33: [3, 4, 2, 4, 3, 3],
  34: [3, 4, 2, 4, 3, 3],
  35: [3, 4, 2, 4, 3, 3],
  36: [3, 5, 2, 4, 3, 3],
  37: [3, 5, 2, 4, 3, 3],
  38: [3, 5, 2, 5, 3, 3],
  39: [4, 5, 2, 5, 4, 3],
  40: [4, 5, 2, 5, 4, 3],
  41: [5, 5, 2, 5, 4, 3],
  42: [5, 5, 3, 6, 4, 3],
  43: [5, 5, 3, 6, 4, 3],
  44: [6, 5, 3, 6, 4, 3],
  45: [6, 5, 3, 7, 5, 3],
  46: [6, 5, 3, 7, 5, 3],
  47: [6, 5, 4, 7, 6, 3],
  48: [6, 5, 4, 7, 6, 3],
  49: [6, 5, 4, 7, 6, 4],
  50: [7, 5, 4, 7, 6, 4],
  51: [7, 5, 4, 7, 7, 4],
  52: [8, 5, 4, 7, 7, 4],
  53: [8, 5, 4, 8, 7, 4],
  54: [8, 5, 5, 8, 7, 4],
  55: [8, 6, 5, 8, 7, 4],
  56: [8, 6, 5, 8, 7, 4],
  57: [8, 6, 5, 9, 7, 4],
  58: [8, 6, 5, 9, 7, 4],
  59: [9, 6, 5, 9, 7, 4],
  60: [9, 6, 5, 9, 7, 4],
  61: [9, 6, 5, 9, 7, 4],
  62: [9, 6, 5, 9, 7, 4],
  63: [9, 6, 5, 9, 7, 4],
  64: [9, 6, 5, 9, 7, 4],
  65: [9, 6, 5, 9, 7, 4],
  66: [9, 6, 5, 9, 7, 4],
  67: [9, 6, 5, 9, 7, 4],
  68: [9, 6, 5, 9, 7, 4],
  69: [9, 6, 5, 9, 7, 4],
  70: [9, 6, 5, 9, 7, 4],
};

export class SpiritHandler extends Doram {
  protected override CLASS_NAME = ClassName.SpiritHandler;
  protected override JobBonusTable = jobBonusTable;
  protected override TraitBonusTable = traitBonusTable;

  protected override minMaxLevel = JOB_4_MIN_MAX_LEVEL;
  protected override maxJob = JOB_4_MAX_JOB_LEVEL;

  private readonly classNames4th = [ClassName.Only_4th, ClassName.SpiritHandler];
  private readonly atkSkillList4th: AtkSkillModel[] = [
    {
      name: 'Chulho Sonic Claw',
      label: '[V2] Chulho Sonic Claw Lv7',
      value: 'Chulho Sonic Claw==7',
      acd: 0.5,
      fct: 0,
      vct: 0,
      cd: 0.25,
      hit: 2,
      canCri: () => this.learnLv('Commune with Chulho') >= 1,
      criDmgPercentage: 0.5,
      baseCriPercentage: 1,
      formula: (input: AtkSkillFormulaInput): number => {
        const { model, skillLevel, status } = input;
        const { totalPow } = status;
        const baseLevel = model.level;
        const skillBonusLv = this.learnLv('Mystical Creature Mastery');
        if (this.learnLv('Commune with Chulho')) {
          return (500 + skillLevel * (850) + skillBonusLv * 100 + totalPow * 5) * (baseLevel / 100);
        }

        return (400 + skillLevel * (750) + skillBonusLv * 50 + totalPow * 5) * (baseLevel / 100);
      },
    },
    {
      name: 'Howling of Chulho',
      label: '[V2] Howling of Chulho Lv7',
      value: 'Howling of Chulho==7',
      acd: 0,
      fct: 1,
      vct: 0,
      cd: 1,
      formula: (input: AtkSkillFormulaInput): number => {
        const { model, skillLevel, status } = input;
        const { totalPow } = status;
        const baseLevel = model.level;
        const skillBonusLv = this.learnLv('Mystical Creature Mastery');
        if (this.learnLv('Commune with Chulho')) {
          return (700 + skillLevel * (1150) + skillBonusLv * 100 + totalPow * 5) * (baseLevel / 100);
        }

        return (600 + skillLevel * (1050) + skillBonusLv * 50 + totalPow * 5) * (baseLevel / 100);
      },
    },
    {
      name: 'Hogogong Strike',
      label: '[V2] Hogogong Strike Lv7',
      value: 'Hogogong Strike==7',
      acd: 0,
      fct: 1,
      vct: 0,
      cd: 0.35,
      hit: 3,
      canCri: () => true,
      criDmgPercentage: 0.5,
      baseCriPercentage: 1,
      formula: (input: AtkSkillFormulaInput): number => {
        const { model, skillLevel, status } = input;
        const { totalPow } = status;
        const baseLevel = model.level;
        const skillBonusLv = this.learnLv('Mystical Creature Mastery');
        if (this.learnLv('Commune with Chulho')) {
          return (250 + skillLevel * (350) + skillBonusLv * 20 + totalPow * 5) * (baseLevel / 100);
        }

        return (180 + skillLevel * (200) + skillBonusLv * 10 + totalPow * 5) * (baseLevel / 100);
      },
    },
    {
      name: 'Hyunrok Breeze',
      label: '[V2] Hyunrok Breeze Lv7',
      value: 'Hyunrok Breeze==7',
      acd: 0.5,
      fct: 1.5,
      vct: 3,
      cd: 4.5,
      isMatk: true,
      getElement: () => ColorOfHyunrokValue[this.activeSkillLv('Colors of Hynrok')] || ElementType.Neutral,
      formula: (input: AtkSkillFormulaInput): number => {
        const { model, skillLevel, status } = input;
        const { totalSpl } = status;
        const baseLevel = model.level;
        const skillBonusLv = this.learnLv('Mystical Creature Mastery');
        if (this.learnLv('Commune with Hyunrok')) {
          return (700 + skillLevel * 800 + skillBonusLv * 40 + totalSpl * 5) * (baseLevel / 100);
        }

        return (600 + skillLevel * 600 + skillBonusLv * 20 + totalSpl * 5) * (baseLevel / 100);
      },
    },
    {
      name: 'Hyunrok Cannon',
      label: '[V2] Hyunrok Cannon Lv7',
      value: 'Hyunrok Cannon==7',
      acd: 0,
      fct: 1.5,
      vct: 2,
      cd: 0.3,
      isMatk: true,
      getElement: () => ColorOfHyunrokValue[this.activeSkillLv('Colors of Hynrok')] || ElementType.Neutral,
      formula: (input: AtkSkillFormulaInput): number => {
        const { model, skillLevel, status } = input;
        const { totalSpl } = status;
        const baseLevel = model.level;
        const skillBonusLv = this.learnLv('Mystical Creature Mastery');
        if (this.learnLv('Commune with Hyunrok')) {
          return (800 + skillLevel * 1100 + skillBonusLv * 75 + totalSpl * 5) * (baseLevel / 100);
        }

        return (700 + skillLevel * 950 + skillBonusLv * 50 + totalSpl * 5) * (baseLevel / 100);
      },
    },
  ];
  private readonly activeSkillList4th: ActiveSkillModel[] = [
    {
      label: 'Colors of Hynrok',
      name: 'Colors of Hynrok',
      inputType: 'dropdown',
      dropdown: [
        { label: '-', value: 0, isUse: false },
        { label: 'Water', value: 1, isUse: true, },
        { label: 'Wind', value: 2, isUse: true, },
        { label: 'Earth', value: 3, isUse: true, },
        { label: 'Fire', value: 4, isUse: true, },
        { label: 'Darkness', value: 5, isUse: true, },
        { label: 'Holy', value: 6, isUse: true, },
        { label: 'Nuetral', value: 7, isUse: true, },
      ],
    },
  ];
  private readonly passiveSkillList4th: PassiveSkillModel[] = [
    {
      name: 'Commune with Chulho',
      label: 'Commune Chulho',
      inputType: 'dropdown',
      dropdown: [
        { label: '-', value: 0, isUse: false },
        { label: 'Lv 1', value: 1, isUse: true },
      ],
    },
    {
      name: 'Commune with Hyunrok',
      label: 'Commune Hyunrok',
      inputType: 'dropdown',
      dropdown: [
        { label: '-', value: 0, isUse: false },
        { label: 'Lv 1', value: 1, isUse: true },
      ],
    },
    {
      name: 'Mystical Creature Mastery',
      label: 'Mystical Cre Mastery',
      inputType: 'dropdown',
      dropdown: genSkillList(10, lv => ({ pAtk: floor(lv * 1.5), sMatk: floor(lv * 1.5) }))
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
