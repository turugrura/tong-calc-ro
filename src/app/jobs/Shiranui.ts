import { JOB_4_MAX_JOB_LEVEL, JOB_4_MIN_MAX_LEVEL } from '../app-config';
import { ElementType } from '../constants';
import { genSkillList } from '../utils';
import { Oboro } from './Oboro';
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
  56: [4, 7, 7, 11, 13, 2],
  57: [4, 7, 8, 11, 13, 2],
  58: [4, 7, 8, 11, 13, 2],
  59: [5, 7, 8, 11, 13, 2],
  60: [5, 7, 8, 11, 13, 2],
  61: [5, 7, 8, 11, 13, 2],
  62: [5, 7, 8, 11, 13, 2],
  63: [5, 7, 8, 11, 13, 2],
  64: [5, 7, 8, 11, 13, 2],
  65: [5, 7, 8, 11, 13, 2],
  66: [5, 7, 8, 11, 13, 2],
  67: [5, 7, 8, 11, 13, 2],
  68: [5, 7, 8, 11, 13, 2],
  69: [5, 7, 8, 11, 13, 2],
  70: [5, 7, 8, 11, 13, 2],
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
  51: [11, 12, 2, 0, 5, 8],
  52: [11, 12, 2, 0, 6, 8],
  53: [11, 12, 3, 0, 6, 8],
  54: [11, 13, 3, 0, 6, 8],
  55: [11, 14, 3, 0, 6, 8],
  56: [11, 14, 3, 0, 6, 8],
  57: [11, 14, 4, 0, 6, 8],
  58: [11, 14, 4, 0, 6, 8],
  59: [11, 14, 4, 1, 6, 8],
  60: [11, 14, 4, 1, 6, 8],
  61: [11, 14, 4, 1, 6, 8],
  62: [11, 14, 4, 1, 6, 8],
  63: [11, 14, 4, 1, 6, 8],
  64: [11, 14, 4, 1, 6, 8],
  65: [11, 14, 4, 1, 6, 8],
  66: [11, 14, 4, 1, 6, 8],
  67: [11, 14, 4, 1, 6, 8],
  68: [11, 14, 4, 1, 6, 8],
  69: [11, 14, 4, 1, 6, 8],
  70: [11, 14, 4, 1, 6, 8],
};

export class Shiranui extends Oboro {
  protected override CLASS_NAME = ClassName.Shiranui;
  protected override JobBonusTable = jobBonusTable;
  protected override TraitBonusTable = traitBonusTable;

  protected override minMaxLevel = JOB_4_MIN_MAX_LEVEL;
  protected override maxJob = JOB_4_MAX_JOB_LEVEL;

  private readonly classNames4th = [ClassName.Only_4th, ClassName.Shiranui];
  private readonly atkSkillList4th: AtkSkillModel[] = [
    {
      name: 'Shadow Hunting',
      label: '[V2] Shadow Hunting Lv10',
      value: 'Shadow Hunting==10',
      acd: 0.15,
      fct: 0,
      vct: 0,
      cd: 0.3,
      isMelee: true,
      formula: (input: AtkSkillFormulaInput): number => {
        const { model, skillLevel, status } = input;
        const { totalPow } = status;
        const baseLevel = model.level;
        const skillBonusLv = this.learnLv('Shadow Flash');

        return (500 + skillLevel * (400 + skillBonusLv * 5) + totalPow * 3) * (baseLevel / 100);
      },
    },
    {
      name: 'Shadow Dance',
      label: '[V2] Shadow Dance Lv10',
      value: 'Shadow Dance==10',
      acd: 0.25,
      fct: 1,
      vct: 1,
      cd: 0.5,
      isMelee: true,
      hit: 5,
      formula: (input: AtkSkillFormulaInput): number => {
        const { model, skillLevel, status } = input;
        const { totalPow } = status;
        const baseLevel = model.level;
        const skillBonusLv = this.learnLv('Shadow Hunting');

        return (400 + skillLevel * (550 + skillBonusLv * 50) + totalPow * 4) * (baseLevel / 100);
      },
    },
    {
      name: 'Shadow Flash',
      label: '[V2] Shadow Flash Lv10',
      value: 'Shadow Flash==10',
      acd: 0.25,
      fct: 0,
      vct: 0,
      cd: 1,
      isMelee: true,
      formula: (input: AtkSkillFormulaInput): number => {
        const { model, skillLevel, status } = input;
        const { totalPow } = status;
        const baseLevel = model.level;
        const skillBonusLv = this.learnLv('Shadow Dance');

        return (1600 + skillLevel * (700 + skillBonusLv * 100) + totalPow * 5) * (baseLevel / 100);
      },
    },
    {
      name: 'Huuma Shuriken - Grasp',
      label: '[V2] Huuma Shuriken - Grasp Lv10',
      value: 'Huuma Shuriken - Grasp==10',
      acd: 0,
      fct: 1,
      vct: 1.2,
      cd: 1,
      hit: 20,
      formula: (input: AtkSkillFormulaInput): number => {
        const { model, skillLevel, status } = input;
        const { totalPow } = status;
        const baseLevel = model.level;
        const skillBonusLv = this.learnLv('Huuma Shuriken - Construct');

        return (700 + skillLevel * (200 + skillBonusLv * 5) + totalPow * 3) * (baseLevel / 100);
      },
    },
    {
      name: 'Huuma Shuriken - Construct',
      label: '[V2] Huuma Shuriken - Construct Lv10',
      value: 'Huuma Shuriken - Construct==10',
      acd: 0,
      fct: 1,
      vct: 1.2,
      cd: 1,
      hit: 20,
      formula: (input: AtkSkillFormulaInput): number => {
        const { model, skillLevel, status } = input;
        const { totalPow } = status;
        const baseLevel = model.level;
        const skillBonusLv = this.learnLv('Huuma Shuriken - Grasp');
        const primary = (600 + skillLevel * (400 + skillBonusLv * 30) + totalPow * 5) * (baseLevel / 100);
        const secondary = (800 + skillLevel * (600 + skillBonusLv * 30) + totalPow * 5) * (baseLevel / 100);

        return primary + secondary;
      },
    },
    {
      name: 'Kunai - Distortion',
      label: '[V2] Kunai - Distortion Lv10',
      value: 'Kunai - Distortion==10',
      acd: 0,
      fct: 0,
      vct: 0.2,
      cd: 0.35,
      hit: 2,
      formula: (input: AtkSkillFormulaInput): number => {
        const { model, skillLevel, status } = input;
        const { totalPow } = status;
        const baseLevel = model.level;
        const skillBonusLv = this.learnLv('Kunai - Refraction');

        return (300 + skillLevel * (600 + skillBonusLv * 10) + totalPow * 3) * (baseLevel / 100);
      },
    },
    {
      name: 'Kunai - Rotation',
      label: '[V2] Kunai - Rotation Lv5',
      value: 'Kunai - Rotation==5',
      acd: 0.5,
      fct: 0,
      vct: 0,
      cd: 2,
      totalHit: 4,
      formula: (input: AtkSkillFormulaInput): number => {
        const { model, skillLevel, status } = input;
        const { totalPow } = status;
        const baseLevel = model.level;
        const skillBonusLv = this.learnLv('Kunai - Distortion');

        return (800 + skillLevel * (700 + skillBonusLv * 70) + totalPow * 4) * (baseLevel / 100);
      },
    },
    {
      name: 'Kunai - Refraction',
      label: '[V2] Kunai - Refraction Lv10',
      value: 'Kunai - Refraction==10',
      acd: 0.5,
      fct: 0.5,
      vct: 1.5,
      cd: 2,
      totalHit: 8,
      formula: (input: AtkSkillFormulaInput): number => {
        const { model, skillLevel, status } = input;
        const { totalPow } = status;
        const baseLevel = model.level;
        const skillBonusLv = this.learnLv('Kunai - Rotation');

        return (200 + skillLevel * (360 + skillBonusLv * 10) + totalPow * 5) * (baseLevel / 100);
      },
    },
    {
      name: 'Red Flame Cannon',
      label: '[V2] Red Flame Cannon Lv10',
      value: 'Red Flame Cannon==10',
      acd: 0,
      fct: 1,
      vct: 2,
      cd: 0.7,
      element: ElementType.Fire,
      isMatk: true,
      hit: 3,
      formula: (input: AtkSkillFormulaInput): number => {
        const { model, skillLevel, status } = input;
        const { totalSpl } = status;
        const baseLevel = model.level;
        const skillBonusLv = this.learnLv('Darkening Cannon');

        return (850 + skillLevel * (1250 + skillBonusLv * 70) + totalSpl * 5) * (baseLevel / 100);
      },
    },
    {
      name: 'Cold Blooded Cannon',
      label: '[V2] Cold Blooded Cannon Lv10',
      value: 'Cold Blooded Cannon==10',
      acd: 0,
      fct: 1,
      vct: 3,
      cd: 0.5,
      element: ElementType.Water,
      isMatk: true,
      hit: 6,
      formula: (input: AtkSkillFormulaInput): number => {
        const { model, skillLevel, status } = input;
        const { totalSpl } = status;
        const baseLevel = model.level;
        const skillBonusLv = this.learnLv('Darkening Cannon');

        return (250 + skillLevel * (550 + skillBonusLv * 40) + totalSpl * 5) * (baseLevel / 100);
      },
    },
    {
      name: 'Thundering Cannon',
      label: '[V2] Thundering Cannon Lv10',
      value: 'Thundering Cannon==10',
      acd: 0,
      fct: 1,
      vct: 2,
      cd: 0.7,
      element: ElementType.Wind,
      isMatk: true,
      hit: 2,
      formula: (input: AtkSkillFormulaInput): number => {
        const { model, skillLevel, status } = input;
        const { totalSpl } = status;
        const baseLevel = model.level;
        const skillBonusLv = this.learnLv('Darkening Cannon');

        return (600 + skillLevel * (1300 + skillBonusLv * 70) + totalSpl * 5) * (baseLevel / 100);
      },
    },
    {
      name: 'Golden Dragon Cannon',
      label: '[V2] Golden Dragon Cannon Lv10',
      value: 'Golden Dragon Cannon==10',
      acd: 0,
      fct: 1,
      vct: 3,
      cd: 0.3,
      element: ElementType.Earth,
      isMatk: true,
      formula: (input: AtkSkillFormulaInput): number => {
        const { model, skillLevel, status } = input;
        const { totalSpl } = status;
        const baseLevel = model.level;
        const skillBonusLv = this.learnLv('Darkening Cannon');

        return (300 + skillLevel * (400 + skillBonusLv * 15) + totalSpl * 5) * (baseLevel / 100);
      },
    },
    {
      name: 'Darkening Cannon',
      label: '[V2] Darkening Cannon Lv10',
      value: 'Darkening Cannon==10',
      acd: 0,
      fct: 1,
      vct: 3,
      cd: 0.5,
      element: ElementType.Dark,
      isMatk: true,
      hit: 2,
      formula: (input: AtkSkillFormulaInput): number => {
        const { model, skillLevel, status } = input;
        const { totalSpl } = status;
        const baseLevel = model.level;

        return (450 + skillLevel * (950) + totalSpl * 5) * (baseLevel / 100);
      },
    },
  ];
  private readonly activeSkillList4th: ActiveSkillModel[] = [];
  private readonly passiveSkillList4th: PassiveSkillModel[] = [
    {
      name: 'Shadow Hunting',
      label: 'Shadow Hunting',
      inputType: 'dropdown',
      dropdown: genSkillList(10),
    },
    {
      name: 'Shadow Dance',
      label: 'Shadow Dance',
      inputType: 'dropdown',
      dropdown: genSkillList(10),
    },
    {
      name: 'Shadow Flash',
      label: 'Shadow Flash',
      inputType: 'dropdown',
      dropdown: genSkillList(10),
    },
    {
      name: 'Huuma Shuriken - Construct',
      label: 'Huuma - Construct',
      inputType: 'dropdown',
      dropdown: genSkillList(10),
    },
    {
      name: 'Huuma Shuriken - Grasp',
      label: 'Huuma - Grasp',
      inputType: 'dropdown',
      dropdown: genSkillList(10),
    },
    {
      name: 'Kunai - Distortion',
      label: 'Kunai - Distortion',
      inputType: 'dropdown',
      dropdown: genSkillList(10),
    },
    {
      name: 'Kunai - Rotation',
      label: 'Kunai - Rotation',
      inputType: 'dropdown',
      dropdown: genSkillList(5),
    },
    {
      name: 'Kunai - Refraction',
      label: 'Kunai - Refraction',
      inputType: 'dropdown',
      dropdown: genSkillList(10),
    },
    {
      name: 'Darkening Cannon',
      label: 'Darkening Cannon',
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
