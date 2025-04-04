import { JOB_4_MAX_JOB_LEVEL, JOB_4_MIN_MAX_LEVEL } from '../app-config';
import { ElementType } from '../constants';
import { EquipmentSummaryModel } from '../models/equipment-summary.model';
import { AdditionalBonusInput } from '../models/info-for-class.model';
import { addBonus, floor, genSkillList } from '../utils';
import { Warlock } from './Warlock';
import { ActiveSkillModel, AtkSkillFormulaInput, AtkSkillModel, PassiveSkillModel } from './_character-base.abstract';
import { ClassName } from './_class-name';

const jobBonusTable: Record<number, [number, number, number, number, number, number]> = {
  1: [0, 0, 0, 1, 0, 0],
  2: [0, 0, 0, 1, 1, 0],
  3: [0, 0, 0, 1, 1, 0],
  4: [0, 0, 1, 1, 1, 0],
  5: [0, 0, 2, 2, 1, 0],
  6: [0, 0, 2, 2, 1, 1],
  7: [0, 0, 2, 2, 1, 1],
  8: [0, 1, 2, 2, 1, 1],
  9: [1, 2, 2, 2, 1, 1],
  10: [1, 2, 2, 2, 1, 1],
  11: [1, 2, 2, 3, 1, 1],
  12: [1, 2, 3, 4, 1, 1],
  13: [1, 2, 3, 4, 2, 1],
  14: [1, 2, 3, 4, 2, 1],
  15: [1, 2, 3, 4, 2, 2],
  16: [1, 3, 3, 5, 2, 2],
  17: [1, 3, 3, 5, 2, 2],
  18: [1, 3, 3, 6, 3, 2],
  19: [1, 3, 3, 7, 3, 2],
  20: [1, 3, 4, 8, 3, 2],
  21: [1, 3, 4, 8, 3, 3],
  22: [1, 3, 4, 8, 3, 3],
  23: [1, 4, 4, 8, 3, 3],
  24: [1, 4, 4, 8, 4, 3],
  25: [1, 4, 4, 9, 5, 3],
  26: [1, 4, 4, 10, 5, 3],
  27: [1, 4, 4, 10, 5, 3],
  28: [1, 5, 4, 10, 5, 3],
  29: [1, 5, 4, 10, 5, 4],
  30: [1, 5, 4, 10, 5, 4],
  31: [1, 6, 4, 10, 6, 4],
  32: [1, 6, 4, 10, 7, 4],
  33: [1, 6, 4, 10, 7, 4],
  34: [1, 6, 4, 11, 7, 4],
  35: [1, 6, 4, 12, 7, 4],
  36: [1, 6, 4, 12, 7, 4],
  37: [1, 6, 5, 12, 7, 4],
  38: [1, 7, 5, 13, 7, 4],
  39: [1, 7, 5, 13, 8, 4],
  40: [1, 7, 6, 13, 8, 4],
  41: [1, 7, 7, 13, 8, 4],
  42: [1, 7, 7, 13, 8, 4],
  43: [1, 7, 8, 13, 8, 4],
  44: [1, 7, 8, 14, 8, 4],
  45: [1, 7, 8, 14, 8, 4],
  46: [1, 7, 8, 15, 8, 4],
  47: [1, 7, 8, 15, 8, 4],
  48: [1, 7, 8, 15, 8, 4],
  49: [1, 7, 8, 15, 8, 4],
  50: [1, 7, 8, 15, 8, 4],
  51: [1, 7, 8, 15, 8, 4],
  52: [1, 7, 8, 15, 8, 4],
  53: [1, 7, 8, 15, 8, 4],
  54: [1, 7, 8, 15, 8, 4],
  55: [1, 7, 8, 15, 8, 4],
  56: [1, 7, 8, 15, 8, 4],
  57: [1, 7, 8, 15, 8, 4],
  58: [1, 7, 8, 15, 8, 4],
  59: [1, 7, 8, 15, 8, 4],
  60: [1, 7, 8, 15, 8, 4],
  61: [1, 7, 8, 15, 8, 4],
  62: [1, 7, 8, 15, 8, 4],
  63: [1, 7, 8, 15, 8, 4],
  64: [1, 7, 8, 15, 8, 4],
  65: [1, 7, 8, 15, 8, 4],
  66: [1, 7, 8, 15, 8, 4],
  67: [1, 7, 8, 15, 8, 4],
  68: [1, 7, 8, 15, 8, 4],
  69: [1, 7, 8, 15, 8, 4],
  70: [1, 7, 8, 15, 8, 4],
};

const traitBonusTable: Record<number, [number, number, number, number, number, number]> = {
  1: [0, 0, 0, 1, 0, 0],
  2: [0, 0, 0, 1, 0, 0],
  3: [0, 0, 1, 1, 0, 0],
  4: [0, 0, 1, 2, 0, 0],
  5: [0, 0, 1, 2, 0, 0],
  6: [0, 0, 1, 2, 0, 0],
  7: [0, 0, 2, 2, 1, 0],
  8: [0, 0, 2, 2, 1, 0],
  9: [0, 0, 2, 2, 1, 0],
  10: [0, 0, 3, 2, 1, 0],
  11: [0, 0, 3, 2, 1, 0],
  12: [0, 0, 3, 2, 1, 0],
  13: [0, 0, 3, 3, 1, 0],
  14: [0, 1, 3, 3, 2, 0],
  15: [0, 1, 3, 3, 2, 0],
  16: [0, 1, 3, 3, 2, 0],
  17: [0, 2, 3, 3, 2, 0],
  18: [0, 2, 3, 3, 2, 0],
  19: [0, 2, 3, 3, 2, 0],
  20: [0, 2, 3, 3, 2, 0],
  21: [0, 2, 3, 4, 2, 0],
  22: [0, 2, 3, 4, 3, 0],
  23: [0, 3, 3, 4, 3, 0],
  24: [0, 3, 3, 4, 3, 0],
  25: [0, 3, 3, 4, 3, 0],
  26: [0, 3, 3, 5, 3, 0],
  27: [0, 3, 3, 5, 4, 0],
  28: [0, 3, 3, 5, 4, 0],
  29: [0, 3, 3, 6, 4, 0],
  30: [0, 3, 3, 6, 4, 1],
  31: [0, 3, 3, 6, 4, 1],
  32: [0, 3, 3, 6, 4, 1],
  33: [0, 3, 3, 6, 5, 1],
  34: [0, 3, 3, 6, 6, 1],
  35: [0, 3, 3, 6, 6, 1],
  36: [0, 3, 3, 7, 6, 1],
  37: [0, 3, 3, 8, 6, 1],
  38: [0, 3, 3, 8, 6, 1],
  39: [0, 3, 3, 8, 6, 1],
  40: [0, 3, 3, 8, 6, 1],
  41: [0, 4, 3, 8, 6, 1],
  42: [0, 4, 3, 8, 7, 1],
  43: [0, 4, 3, 9, 7, 1],
  44: [0, 5, 3, 9, 7, 1],
  45: [0, 5, 4, 9, 7, 1],
  46: [0, 5, 4, 10, 7, 1],
  47: [0, 5, 4, 11, 7, 1],
  48: [0, 6, 5, 11, 7, 1],
  49: [0, 6, 5, 11, 8, 1],
  50: [0, 7, 6, 11, 8, 1],
  51: [0, 7, 6, 11, 8, 1],
  52: [0, 7, 6, 12, 8, 1],
  53: [0, 7, 6, 12, 9, 1],
  54: [0, 8, 7, 12, 9, 1],
  55: [0, 8, 7, 13, 9, 1],
  56: [0, 8, 7, 13, 9, 1],
  57: [0, 8, 8, 13, 9, 1],
  58: [0, 8, 8, 13, 9, 1],
  59: [0, 8, 8, 14, 9, 1],
  60: [0, 8, 8, 14, 9, 1],
  61: [0, 8, 8, 14, 9, 1],
  62: [0, 8, 8, 14, 9, 1],
  63: [0, 8, 8, 14, 9, 1],
  64: [0, 8, 8, 14, 9, 1],
  65: [0, 8, 8, 14, 9, 1],
  66: [0, 8, 8, 14, 9, 1],
  67: [0, 8, 8, 14, 9, 1],
  68: [0, 8, 8, 14, 9, 1],
  69: [0, 8, 8, 14, 9, 1],
  70: [0, 8, 8, 14, 9, 1],
};

export class ArchMage extends Warlock {
  protected override CLASS_NAME = ClassName.ArchMage;
  protected override JobBonusTable = jobBonusTable;
  protected override TraitBonusTable = traitBonusTable;

  protected override minMaxLevel = JOB_4_MIN_MAX_LEVEL;
  protected override maxJob = JOB_4_MAX_JOB_LEVEL;

  private readonly classNames4th = [ClassName.Only_4th, ClassName.ArchMage];
  private readonly atkSkillList4th: AtkSkillModel[] = [
    {
      name: 'Soul Vulcan Strike',
      label: '[V3] Soul Vulcan Strike Lv5',
      value: 'Soul Vulcan Strike==5',
      acd: 0.5,
      fct: 1,
      vct: 3,
      cd: 0.7,
      isMatk: true,
      element: ElementType.Ghost,
      totalHit: ({ skillLevel }) => skillLevel + 2,
      formula: (input: AtkSkillFormulaInput): number => {
        const { model, skillLevel, status } = input;
        const { totalSpl } = status;
        const { level: baseLevel } = model;

        return (skillLevel * 250 + totalSpl * 3) * (baseLevel / 100);
      }
    },
    {
      name: 'Mystery Illusion',
      label: '[V3] Mystery Illusion Lv5',
      value: 'Mystery Illusion==5',
      acd: 0.5,
      fct: 1.5,
      vct: 4,
      cd: 4,
      isMatk: true,
      element: ElementType.Dark,
      totalHit: ({ skillLevel }) => [0, 7, 7, 10, 10, 14][skillLevel],
      formula: (input: AtkSkillFormulaInput): number => {
        const { model, skillLevel, status } = input;
        const { totalSpl } = status;
        const { level: baseLevel } = model;

        return (skillLevel * 950 + totalSpl * 5) * (baseLevel / 100);
      }
    },
    {
      name: 'Floral Flare Road',
      label: '[V3] Floral Flare Road Lv5',
      value: 'Floral Flare Road==5',
      acd: 0.25,
      fct: 1.5,
      vct: 3,
      cd: 5,
      isMatk: true,
      element: ElementType.Fire,
      totalHit: 10,
      formula: (input: AtkSkillFormulaInput): number => {
        const { model, skillLevel, status } = input;
        const { totalSpl } = status;
        const { level: baseLevel } = model;

        return (50 + skillLevel * 740 + totalSpl * 5) * (baseLevel / 100);
      },
    },
    {
      name: 'Rain of Crystal',
      label: '[V3] Rain of Crystal Lv5',
      value: 'Rain of Crystal==5',
      acd: 0.25,
      fct: 1.5,
      vct: 3,
      cd: 5,
      isMatk: true,
      element: ElementType.Water,
      totalHit: 8,
      formula: (input: AtkSkillFormulaInput): number => {
        const { model, skillLevel, status } = input;
        const { totalSpl } = status;
        const { level: baseLevel } = model;

        return (180 + skillLevel * 760 + totalSpl * 5) * (baseLevel / 100);
      },
    },
    {
      name: 'Tornado Storm',
      label: '[V3] Tornado Storm Lv5',
      value: 'Tornado Storm==5',
      acd: 0.25,
      fct: 1.5,
      vct: 3,
      cd: 5,
      isMatk: true,
      element: ElementType.Wind,
      totalHit: 10,
      formula: (input: AtkSkillFormulaInput): number => {
        const { model, skillLevel, status } = input;
        const { totalSpl } = status;
        const { level: baseLevel } = model;

        return (100 + skillLevel * 760 + totalSpl * 5) * (baseLevel / 100);
      },
    },
    {
      name: 'Stratum Tremor',
      label: '[V3] Stratum Tremor Lv5',
      value: 'Stratum Tremor==5',
      acd: 0.25,
      fct: 1.5,
      vct: 3,
      cd: 4,
      isMatk: true,
      element: ElementType.Earth,
      totalHit: 10,
      formula: (input: AtkSkillFormulaInput): number => {
        const { model, skillLevel, status } = input;
        const { totalSpl } = status;
        const { level: baseLevel } = model;

        return (100 + skillLevel * 730 + totalSpl * 5) * (baseLevel / 100);
      },
    },
    {
      name: 'Crimson Arrow',
      label: '[V3] Crimson Arrow Lv5',
      value: 'Crimson Arrow==5',
      acd: 0.5,
      fct: 1.5,
      vct: 4,
      cd: 0.3,
      isMatk: true,
      element: ElementType.Fire,
      formula: (input: AtkSkillFormulaInput): number => {
        const { model, skillLevel, status } = input;
        const { totalSpl } = status;
        const { level: baseLevel } = model;
        const blimaxBonus = this.isSkillActive('Climax') ? 600 : 0;

        const directDmg = floor((skillLevel * 300 + totalSpl * 3) * (baseLevel / 100));
        const bomDmg = floor((skillLevel * (600 + blimaxBonus) + totalSpl * 5) * (baseLevel / 100));

        return directDmg + bomDmg;
      },
    },
    {
      name: 'Frozen Slash',
      label: '[V3] Frozen Slash Lv5',
      value: 'Frozen Slash==5',
      acd: 0.5,
      fct: 1.5,
      vct: 4,
      cd: 0.45,
      isMatk: true,
      element: ElementType.Water,
      hit: 3,
      formula: (input: AtkSkillFormulaInput): number => {
        const { model, skillLevel, status } = input;
        const { totalSpl } = status;
        const { level: baseLevel } = model;
        if (this.isSkillActive('Climax')) {
          return (400 + skillLevel * 1250 + totalSpl * 5) * (baseLevel / 100);
        }

        return (250 + skillLevel * 900 + totalSpl * 5) * (baseLevel / 100);
      },
    },
    {
      name: 'Storm Cannon',
      label: '[V3] Storm Cannon Lv5',
      value: 'Storm Cannon==5',
      acd: 0.5,
      fct: 1.5,
      vct: 4,
      cd: 0.3,
      isMatk: true,
      element: ElementType.Wind,
      hit: 2,
      formula: (input: AtkSkillFormulaInput): number => {
        const { model, skillLevel, status } = input;
        const { totalSpl } = status;
        const { level: baseLevel } = model;
        if (this.isSkillActive('Climax')) {
          return (skillLevel * 1250 + totalSpl * 5) * (baseLevel / 100);
        }

        return (skillLevel * 950 + totalSpl * 5) * (baseLevel / 100);
      },
    },
    {
      name: 'Rock Down',
      label: '[V3] Rock Down Lv5',
      value: 'Rock Down==5',
      acd: 0.5,
      fct: 1.5,
      vct: 4,
      cd: 0.3,
      isMatk: true,
      element: ElementType.Earth,
      hit: 5,
      formula: (input: AtkSkillFormulaInput): number => {
        const { model, skillLevel, status } = input;
        const { totalSpl } = status;
        const { level: baseLevel } = model;
        if (this.isSkillActive('Climax')) {
          return (skillLevel * 1250 + totalSpl * 5) * (baseLevel / 100);
        }

        return (skillLevel * 950 + totalSpl * 5) * (baseLevel / 100);
      },
    },
    {
      name: 'All Bloom',
      label: '[V3] All Bloom Lv5 (1 hit)',
      value: 'All Bloom==5',
      acd: 0.5,
      fct: 1.5,
      vct: 4,
      cd: 6,
      isMatk: true,
      element: ElementType.Fire,
      formula: (input: AtkSkillFormulaInput): number => {
        const { model, skillLevel, status } = input;
        const { totalSpl } = status;
        const { level: baseLevel } = model;
        const climaxBonus = this.activeSkillLv('Climax') === 3 ? 300 : 0;

        return (200 + skillLevel * 1200 + totalSpl * 5) * (baseLevel / 100) + climaxBonus;
      },
    },
    {
      name: 'Violent Quake',
      label: '[V3] Violent Quake Lv5 (1 hit)',
      value: 'Violent Quake==5',
      acd: 0.5,
      fct: 1.5,
      vct: 4,
      cd: 6,
      isMatk: true,
      element: ElementType.Earth,
      formula: (input: AtkSkillFormulaInput): number => {
        const { model, skillLevel, status } = input;
        const { totalSpl } = status;
        const { level: baseLevel } = model;
        const climaxBonus = this.activeSkillLv('Climax') === 3 ? 200 : 0;

        return (200 + skillLevel * 1200 + totalSpl * 5) * (baseLevel / 100) + climaxBonus;
      },
    },
    // {
    //   name: 'Astral Strike',
    //   label: '[V2] Astral Strike Lv10',
    //   value: 'Astral Strike==10',
    //   acd: 0.5,
    //   fct: 1.5,
    //   vct: 4,
    //   cd: 60,
    //   isMatk: true,
    //   element: ElementType.Neutral,
    //   formula: (input: AtkSkillFormulaInput): number => {
    //     const { model, skillLevel, status, monster } = input;
    //     const { totalSpl } = status;
    //     const { level: baseLevel } = model;
    //     const raceBonus = monster.isRace('undead', 'dragon') ? 600 : 0;

    //     const primary = floor((skillLevel * (500 + raceBonus) + totalSpl * 10) * (baseLevel / 100));
    //     const second = floor((skillLevel * 200 + totalSpl * 10) * (baseLevel / 100));

    //     return primary + second * 50;
    //   },
    // },
  ];
  private readonly activeSkillList4th: ActiveSkillModel[] = [
    {
      name: 'Climax',
      label: 'Climax',
      inputType: 'dropdown',
      dropdown: [
        { label: '-', value: 0, isUse: false },
        { label: 'Lv 1', value: 1, isUse: true },
        { label: 'Lv 2', value: 2, isUse: true },
        { label: 'Lv 3', value: 3, isUse: true },
        { label: 'Lv 4', value: 4, isUse: true },
        { label: 'Lv 5', value: 5, isUse: true },
      ],
    },
  ];
  private readonly passiveSkillList4th: PassiveSkillModel[] = [
    {
      name: 'Two hand Staff Mastery',
      label: 'Two hand Staff Mastery',
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

  override setAdditionalBonus(params: AdditionalBonusInput): EquipmentSummaryModel {
    super.setAdditionalBonus(params);

    const { totalBonus, weapon } = params;

    const tHandStaffLv = this.learnLv('Two hand Staff Mastery');
    if (tHandStaffLv > 0 && weapon.isType('twohandRod')) {
      addBonus(totalBonus, 'sMatk', tHandStaffLv * 2);
    }

    return totalBonus;
  }
}
