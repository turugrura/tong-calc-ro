import { JOB_4_MAX_JOB_LEVEL, JOB_4_MIN_MAX_LEVEL } from '../app-config';
import { ElementType } from '../constants';
import { genSkillList } from '../utils';
import { Kagerou } from './Kagerou';
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
  56: [12, 10, 6, 4, 10, 3],
  57: [12, 10, 6, 4, 10, 3],
  58: [12, 10, 6, 4, 10, 3],
  59: [12, 10, 6, 5, 10, 3],
  60: [12, 10, 6, 5, 10, 3],
  61: [12, 10, 6, 5, 10, 3],
  62: [12, 10, 6, 5, 10, 3],
  63: [12, 10, 6, 5, 10, 3],
  64: [12, 10, 6, 5, 10, 3],
  65: [12, 10, 6, 5, 10, 3],
  66: [12, 10, 6, 5, 10, 3],
  67: [12, 10, 6, 5, 10, 3],
  68: [12, 10, 6, 5, 10, 3],
  69: [12, 10, 6, 5, 10, 3],
  70: [12, 10, 6, 5, 10, 3],
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

export class Shinkiro extends Kagerou {
  protected override CLASS_NAME = ClassName.Shinkiro;
  protected override JobBonusTable = jobBonusTable;
  protected override TraitBonusTable = traitBonusTable;

  protected override minMaxLevel = JOB_4_MIN_MAX_LEVEL;
  protected override maxJob = JOB_4_MAX_JOB_LEVEL;

  private readonly classNames4th = [ClassName.Only_4th, ClassName.Shinkiro];
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
