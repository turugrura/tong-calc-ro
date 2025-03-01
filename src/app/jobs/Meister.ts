import { JOB_4_MAX_JOB_LEVEL, JOB_4_MIN_MAX_LEVEL } from '../app-config';
import { WeaponTypeName } from '../constants';
import { genSkillList } from '../utils';
import { Mechanic } from './Mechanic';
import { ActiveSkillModel, AtkSkillFormulaInput, AtkSkillModel, PassiveSkillModel } from './_character-base.abstract';
import { ClassName } from './_class-name';
import { genMeisterMonsterSkillList } from './summons';

const jobBonusTable: Record<number, [number, number, number, number, number, number]> = {
  1: [1, 0, 0, 0, 0, 0],
  2: [2, 0, 0, 0, 1, 0],
  3: [3, 0, 1, 0, 1, 0],
  4: [3, 0, 2, 1, 1, 0],
  5: [3, 0, 2, 2, 1, 1],
  6: [4, 0, 2, 2, 1, 1],
  7: [5, 0, 2, 2, 1, 1],
  8: [5, 0, 3, 2, 1, 1],
  9: [6, 0, 3, 2, 1, 2],
  10: [7, 0, 3, 2, 1, 2],
  11: [7, 0, 4, 2, 1, 2],
  12: [8, 0, 4, 2, 1, 2],
  13: [8, 0, 4, 3, 1, 2],
  14: [8, 1, 4, 3, 1, 2],
  15: [8, 2, 4, 3, 1, 3],
  16: [9, 2, 4, 3, 1, 3],
  17: [9, 3, 5, 3, 1, 3],
  18: [9, 3, 6, 3, 1, 3],
  19: [9, 3, 7, 4, 1, 3],
  20: [10, 3, 7, 4, 1, 3],
  21: [10, 3, 7, 5, 2, 3],
  22: [10, 3, 8, 5, 2, 3],
  23: [10, 3, 8, 6, 2, 3],
  24: [10, 4, 8, 6, 3, 3],
  25: [10, 5, 8, 6, 3, 3],
  26: [10, 5, 8, 6, 4, 3],
  27: [10, 5, 8, 6, 5, 3],
  28: [10, 6, 8, 6, 5, 4],
  29: [10, 6, 8, 6, 5, 5],
  30: [10, 6, 8, 6, 5, 5],
  31: [10, 6, 8, 6, 5, 5],
  32: [10, 6, 8, 6, 5, 5],
  33: [10, 6, 8, 6, 5, 5],
  34: [10, 6, 8, 6, 5, 5],
  35: [10, 6, 8, 6, 5, 5],
  36: [10, 6, 8, 6, 5, 6],
  37: [10, 6, 8, 6, 5, 6],
  38: [10, 6, 8, 6, 5, 6],
  39: [10, 6, 8, 6, 5, 6],
  40: [10, 6, 8, 6, 5, 6],
  41: [10, 6, 8, 6, 5, 6],
  42: [10, 6, 8, 6, 5, 6],
  43: [10, 6, 9, 6, 5, 6],
  44: [10, 6, 10, 6, 5, 6],
  45: [10, 6, 10, 6, 5, 6],
  46: [10, 6, 10, 6, 5, 6],
  47: [10, 6, 10, 6, 5, 6],
  48: [10, 6, 10, 6, 5, 6],
  49: [10, 6, 10, 6, 5, 6],
  50: [10, 6, 10, 6, 5, 6],
  51: [10, 6, 10, 6, 5, 6],
  52: [10, 6, 10, 6, 5, 6],
  53: [10, 6, 10, 6, 5, 6],
  54: [10, 6, 10, 6, 5, 6],
  55: [10, 6, 10, 6, 5, 6],
  56: [10, 6, 10, 6, 5, 6],
  57: [10, 6, 10, 6, 5, 6],
  58: [10, 6, 10, 6, 5, 6],
  59: [10, 6, 10, 6, 5, 6],
  60: [10, 6, 10, 6, 5, 6],
  61: [10, 6, 10, 6, 5, 6],
  62: [10, 6, 10, 6, 5, 6],
  63: [10, 6, 10, 6, 5, 6],
  64: [10, 6, 10, 6, 5, 6],
  65: [10, 6, 10, 6, 5, 6],
  66: [10, 6, 10, 6, 5, 6],
  67: [10, 6, 10, 6, 5, 6],
  68: [10, 6, 10, 6, 5, 6],
  69: [10, 6, 10, 6, 5, 6],
  70: [10, 6, 10, 6, 5, 6],
};

const traitBonusTable: Record<number, [number, number, number, number, number, number]> = {
  1: [0, 0, 0, 0, 0, 0],
  2: [0, 0, 0, 0, 0, 0],
  3: [0, 0, 0, 0, 0, 0],
  4: [0, 0, 0, 0, 0, 0],
  5: [0, 0, 0, 0, 0, 0],
  6: [1, 0, 0, 0, 0, 0],
  7: [1, 0, 0, 0, 0, 0],
  8: [1, 0, 0, 0, 0, 0],
  9: [1, 0, 0, 0, 0, 0],
  10: [1, 1, 0, 0, 0, 0],
  11: [1, 1, 0, 0, 0, 0],
  12: [2, 1, 0, 0, 0, 0],
  13: [2, 1, 0, 0, 0, 0],
  14: [2, 1, 0, 0, 0, 0],
  15: [2, 1, 0, 0, 0, 0],
  16: [2, 1, 0, 0, 0, 0],
  17: [2, 1, 0, 0, 0, 0],
  18: [2, 1, 0, 0, 0, 0],
  19: [2, 1, 0, 0, 0, 0],
  20: [2, 1, 0, 0, 0, 0],
  21: [2, 1, 0, 0, 0, 0],
  22: [2, 1, 0, 0, 0, 0],
  23: [2, 1, 0, 0, 0, 0],
  24: [2, 1, 0, 0, 0, 0],
  25: [2, 1, 0, 0, 0, 0],
  26: [2, 2, 0, 0, 0, 0],
  27: [2, 2, 0, 0, 0, 0],
  28: [2, 2, 0, 0, 0, 0],
  29: [2, 2, 0, 0, 0, 1],
  30: [3, 2, 0, 0, 0, 1],
  31: [3, 2, 1, 0, 0, 2],
  32: [3, 2, 1, 0, 0, 3],
  33: [3, 3, 1, 0, 1, 3],
  34: [4, 3, 1, 0, 1, 4],
  35: [4, 4, 1, 0, 1, 4],
  36: [4, 4, 1, 0, 1, 5],
  37: [4, 4, 2, 0, 1, 5],
  38: [5, 4, 3, 0, 1, 5],
  39: [5, 5, 3, 0, 1, 5],
  40: [5, 5, 3, 0, 2, 5],
  41: [5, 6, 3, 0, 2, 5],
  42: [5, 6, 3, 0, 3, 5],
  43: [5, 7, 3, 0, 3, 5],
  44: [5, 7, 3, 0, 3, 6],
  45: [5, 7, 3, 0, 4, 6],
  46: [5, 7, 3, 0, 5, 6],
  47: [6, 7, 3, 0, 5, 7],
  48: [6, 8, 3, 0, 6, 7],
  49: [6, 9, 3, 0, 6, 7],
  50: [7, 9, 4, 0, 6, 7],
  51: [8, 9, 4, 0, 6, 7],
  52: [8, 9, 4, 0, 7, 7],
  53: [8, 10, 5, 0, 7, 7],
  54: [8, 10, 5, 0, 7, 7],
  55: [9, 10, 5, 0, 7, 7],
  56: [9, 10, 5, 0, 7, 7],
  57: [9, 10, 6, 0, 7, 7],
  58: [9, 10, 6, 0, 7, 7],
  59: [10, 10, 6, 0, 7, 7],
  60: [10, 10, 6, 0, 7, 7],
  61: [10, 10, 6, 0, 7, 7],
  62: [10, 10, 6, 0, 7, 7],
  63: [10, 10, 6, 0, 7, 7],
  64: [10, 10, 6, 0, 7, 7],
  65: [10, 10, 6, 0, 7, 7],
  66: [10, 10, 6, 0, 7, 7],
  67: [10, 10, 6, 0, 7, 7],
  68: [10, 10, 6, 0, 7, 7],
  69: [10, 10, 6, 0, 7, 7],
  70: [10, 10, 6, 0, 7, 7],
};

export class Meister extends Mechanic {
  protected override CLASS_NAME = ClassName.Meister;
  protected override JobBonusTable = jobBonusTable;
  protected override TraitBonusTable = traitBonusTable;

  protected override minMaxLevel = JOB_4_MIN_MAX_LEVEL;
  protected override maxJob = JOB_4_MAX_JOB_LEVEL;

  private classNames4th = [ClassName.Only_4th, ClassName.Meister];
  private atkSkillList4th: AtkSkillModel[] = [
    {
      name: 'Axe Stomp',
      label: '[V3] Axe Stomp Lv5',
      value: 'Axe Stomp==5',
      acd: 0.25,
      fct: 0,
      vct: 0,
      cd: 0.7,
      isMelee: true,
      totalHit: ({ weapon }) => (weapon.isType('twohandAxe') ? 3 : 1),
      formula: (input: AtkSkillFormulaInput): number => {
        const { model, skillLevel, status } = input;
        const baseLevel = model.level;
        const { totalPow } = status;

        return (350 + skillLevel * 850 + totalPow * 5) * (baseLevel / 100);
      },
    },
    // {
    //   name: 'Rush Quake',
    //   label: '[V3] Rush Quake Lv10',
    //   value: 'Rush Quake==10',
    //   acd: 0.5,
    //   fct: 0,
    //   vct: 0,
    //   cd: 60,
    //   isMelee: true,
    //   formula: (input: AtkSkillFormulaInput): number => {
    //     const { model, skillLevel, status, monster } = input;
    //     const baseLevel = model.level;
    //     const { totalPow } = status;
    //     const raceBonus = monster.isRace('formless', 'insect') ? 350 : 0;

    //     return (skillLevel * (750 + raceBonus) + totalPow * 10) * (baseLevel / 100);
    //   },
    // },
    {
      name: 'Spark Blaster',
      label: '[V3] Spark Blaster Lv10',
      value: 'Spark Blaster==10',
      acd: 0.25,
      fct: 0.5,
      vct: 1.5,
      cd: 0.7,
      totalHit: 2,
      isIgnoreDef: true,
      isIgnoreSDef: true,
      formula: (input: AtkSkillFormulaInput): number => {
        const { model, skillLevel, status } = input;
        const baseLevel = model.level;
        const { totalPow } = status;

        return (250 + skillLevel * 750 + totalPow * 7) * (baseLevel / 100);
      },
    },
    {
      name: 'Triple Laser',
      label: '[V3] Triple Laser Lv5',
      value: 'Triple Laser==5',
      acd: 0.25,
      fct: 0.5,
      vct: 1.5,
      cd: 0.7,
      totalHit: 3,
      canCri: true,
      criDmgPercentage: 0.5,
      baseCriPercentage: 1,
      formula: (input: AtkSkillFormulaInput): number => {
        const { model, skillLevel, status } = input;
        const baseLevel = model.level;
        const { totalPow } = status;

        return (300 + skillLevel * 600 + totalPow * 10) * (baseLevel / 100);
      },
    },
    {
      name: 'Mighty Smash',
      label: '[V3] Mighty Smash Lv10',
      value: 'Mighty Smash==10',
      acd: 0,
      fct: 0,
      vct: 0,
      cd: 0.3,
      isMelee: true,
      totalHit: () => this.isSkillActive('Axe Stomp') ? 5 : 3,
      verifyItemFn: ({ weapon }) => {
        const requires: WeaponTypeName[] = ['axe', 'twohandAxe'];
        if (requires.some(wType => weapon.isType(wType))) return '';

        return requires.join(', ');
      },
      formula: (input: AtkSkillFormulaInput): number => {
        const { model, skillLevel, status } = input;
        const baseLevel = model.level;
        const { totalPow } = status;

        return (100 + skillLevel * 300 + totalPow * 7) * (baseLevel / 100);
      },
    },
  ];
  private activeSkillList4th: ActiveSkillModel[] = [
    {
      name: '_Meister_Rush',
      label: 'Rush 10',
      inputType: 'selectButton',
      dropdown: [
        { label: 'Yes', value: 10, isUse: true, bonus: { range: 10 * 5, melee: 10 * 5 } },
        { label: 'No', value: 0, isUse: false },
      ],
    },
    {
      name: '_Meister_ABR_List',
      label: 'ABR Summon',
      inputType: 'dropdown',
      dropdown: genMeisterMonsterSkillList(),
    },
    {
      name: 'Axe Stomp',
      label: 'Axe Stomp',
      inputType: 'selectButton',
      dropdown: [
        { label: 'Yes', value: 5, isUse: true },
        { label: 'No', value: 0, isUse: false },
      ],
    },
  ];
  private passiveSkillList4th: PassiveSkillModel[] = [
    {
      name: 'Two Hand Defending',
      label: 'Two Hand Defending',
      inputType: 'dropdown',
      dropdown: genSkillList(10),
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
