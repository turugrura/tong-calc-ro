import { ClassName } from './_class-name';
import { ActiveSkillModel, AtkSkillFormulaInput, AtkSkillModel, PassiveSkillModel } from './_character-base.abstract';
import { Mage } from './Mage';
import { ElementType } from '../constants';

const jobBonusTable: Record<number, [number, number, number, number, number, number]> = {
  1: [0, 0, 0, 1, 0, 0],
  2: [0, 0, 0, 1, 1, 0],
  3: [0, 0, 1, 1, 1, 0],
  4: [0, 0, 1, 1, 1, 0],
  5: [0, 0, 1, 2, 1, 0],
  6: [0, 0, 1, 2, 1, 0],
  7: [0, 0, 1, 2, 1, 0],
  8: [0, 1, 1, 2, 1, 0],
  9: [0, 1, 1, 2, 2, 0],
  10: [0, 1, 1, 3, 2, 0],
  11: [0, 1, 1, 3, 2, 0],
  12: [0, 1, 1, 3, 2, 1],
  13: [0, 1, 1, 3, 2, 1],
  14: [0, 1, 1, 4, 2, 1],
  15: [0, 1, 1, 4, 2, 1],
  16: [0, 1, 1, 4, 2, 1],
  17: [0, 1, 1, 4, 3, 1],
  18: [0, 2, 1, 4, 3, 1],
  19: [0, 2, 1, 5, 3, 1],
  20: [1, 2, 1, 5, 3, 1],
  21: [1, 2, 1, 5, 3, 1],
  22: [1, 2, 1, 5, 4, 1],
  23: [1, 2, 1, 5, 5, 1],
  24: [1, 2, 1, 6, 5, 1],
  25: [1, 2, 1, 6, 5, 1],
  26: [1, 3, 1, 6, 5, 1],
  27: [1, 3, 1, 6, 5, 1],
  28: [1, 3, 1, 7, 5, 1],
  29: [1, 3, 2, 7, 5, 1],
  30: [1, 3, 2, 7, 5, 1],
  31: [1, 3, 2, 7, 6, 1],
  32: [1, 3, 2, 8, 6, 1],
  33: [1, 3, 2, 8, 6, 1],
  34: [1, 4, 2, 8, 6, 1],
  35: [1, 4, 2, 8, 6, 1],
  36: [1, 4, 2, 8, 6, 1],
  37: [1, 4, 2, 9, 6, 1],
  38: [1, 4, 2, 10, 6, 1],
  39: [1, 4, 2, 11, 6, 1],
  40: [2, 4, 2, 11, 6, 1],
  41: [2, 4, 2, 11, 6, 2],
  42: [2, 4, 2, 11, 6, 2],
  43: [2, 4, 2, 11, 7, 2],
  44: [2, 4, 2, 11, 7, 2],
  45: [2, 4, 2, 11, 7, 2],
  46: [2, 4, 2, 12, 7, 2],
  47: [2, 4, 3, 12, 7, 2],
  48: [2, 4, 3, 12, 7, 2],
  49: [2, 4, 3, 13, 7, 2],
  50: [2, 5, 3, 13, 7, 2],
  51: [2, 5, 3, 13, 7, 2],
  52: [2, 5, 3, 13, 7, 2],
  53: [2, 5, 4, 13, 7, 2],
  54: [2, 5, 4, 13, 7, 2],
  55: [2, 5, 4, 14, 7, 2],
  56: [2, 6, 4, 14, 7, 2],
  57: [2, 6, 4, 14, 7, 3],
  58: [2, 6, 4, 14, 7, 3],
  59: [2, 6, 4, 15, 7, 3],
  60: [3, 6, 4, 15, 7, 3],
  61: [3, 6, 4, 15, 8, 3],
  62: [3, 6, 4, 16, 8, 3],
  63: [3, 6, 4, 16, 8, 3],
  64: [3, 6, 4, 16, 8, 3],
  65: [3, 7, 4, 16, 8, 3],
  66: [3, 7, 5, 16, 8, 3],
  67: [3, 7, 5, 16, 9, 3],
  68: [3, 7, 5, 16, 9, 3],
  69: [3, 8, 5, 16, 9, 3],
  70: [3, 8, 5, 17, 9, 3],
};

export class HighWizard extends Mage {
  protected override CLASS_NAME = ClassName.HighWizard;
  protected override JobBonusTable = jobBonusTable;
  protected override initialStatusPoint = 100;

  protected readonly classNamesHi = [ClassName.Wizard, ClassName.HiClass, ClassName.HighWizard];
  protected readonly atkSkillListHi: AtkSkillModel[] = [
    // {
    //   name: 'Soul Drain',
    //   label: 'Soul Drain Lv10',
    //   value: 'Soul Drain==10',
    //   acd: 0,
    //   fct: 0,
    //   vct: 0,
    //   cd: 0,
    //   isMatk: true,
    //   formula: (input: AtkSkillFormulaInput): number => {
    //     const { model, skillLevel } = input;
    //     const baseLevel = model.level;

    //     return (95 + skillLevel * 15) * (baseLevel / 100);
    //   },
    // },
    {
      name: 'Napalm Vulcan',
      label: 'Napalm Vulcan Lv5',
      value: 'Napalm Vulcan==5',
      fct: 0.3,
      vct: 0.5,
      acd: 0.5,
      cd: 1,
      isMatk: true,
      element: ElementType.Ghost,
      hit: 5,
      formula: (input: AtkSkillFormulaInput): number => {
        const { model, skillLevel } = input;
        const baseLevel = model.level;

        return skillLevel * 70 * (baseLevel / 100);
      },
      finalDmgFormula: (input) => {
        return input.damage * input.skillLevel;
      },
    },
    {
      name: 'Lord of Vermilion',
      label: 'Lord of Vermilion Lv10',
      value: 'Lord of Vermilion==10',
      acd: 5,
      fct: 1.68,
      vct: 6.72,
      cd: 5,
      isMatk: true,
      isDevMode: true,
      hit: 20,
      element: ElementType.Wind,
      formula: (input: AtkSkillFormulaInput): number => {
        const { skillLevel } = input;

        return 400 + skillLevel * 100;
      },
    },
    {
      label: "Heaven's Drive Lv5",
      name: "Heaven's Drive",
      value: "Heaven's Drive==5",
      fct: 0.8,
      vct: 1.9,
      acd: 0.5,
      cd: 0,
      isMatk: true,
      element: ElementType.Earth,
      totalHit: 5,
      formula: (): number => {
        return 125;
      },
    },
    {
      name: 'Meteor Storm',
      label: 'Meteor Storm Lv10',
      value: 'Meteor Storm==10',
      acd: 5,
      fct: 1.5,
      vct: 6.72,
      cd: 7,
      isMatk: true,
      isDevMode: true,
      element: ElementType.Fire,
      totalHit: 2,
      hit: 2,
      formula: (): number => {
        return 125;
      },
    },
    {
      name: 'Gravitational Field',
      label: 'Gravitational Field Lv5',
      value: 'Gravitational Field==5',
      acd: 1,
      fct: 1,
      vct: 5,
      cd: 5,
      isMatk: true,
      element: ElementType.Neutral,
      formula: (input: AtkSkillFormulaInput): number => {
        const { model, skillLevel } = input;
        const baseLevel = model.level;

        return skillLevel * 100 * (baseLevel / 100);
      },
      finalDmgFormula(input) {
        const totalHit = input.skillLevel * 2;

        return input.damage * totalHit;
      },
    },
  ];
  protected readonly activeSkillListHi: ActiveSkillModel[] = [
    {
      inputType: 'selectButton',
      label: 'Mystical Amp 10',
      name: 'Mystical Amplification',
      isEquipAtk: true,
      dropdown: [
        { label: 'Yes', isUse: true, value: 10, bonus: { mysticAmp: 50 } },
        { label: 'No', isUse: false, value: 0 },
      ],
    },
  ];
  protected readonly passiveSkillListHi: PassiveSkillModel[] = [
    {
      label: 'Soul Drain',
      name: 'Soul Drain',
      inputType: 'dropdown',
      dropdown: [
        { label: '-', isUse: false, value: 0 },
        { label: 'Lv 1', isUse: true, value: 1, bonus: { spPercent: 1 * 2 } },
        { label: 'Lv 2', isUse: true, value: 2, bonus: { spPercent: 2 * 2 } },
        { label: 'Lv 3', isUse: true, value: 3, bonus: { spPercent: 3 * 2 } },
        { label: 'Lv 4', isUse: true, value: 4, bonus: { spPercent: 4 * 2 } },
        { label: 'Lv 5', isUse: true, value: 5, bonus: { spPercent: 5 * 2 } },
        { label: 'Lv 6', isUse: true, value: 6, bonus: { spPercent: 6 * 2 } },
        { label: 'Lv 7', isUse: true, value: 7, bonus: { spPercent: 7 * 2 } },
        { label: 'Lv 8', isUse: true, value: 8, bonus: { spPercent: 8 * 2 } },
        { label: 'Lv 9', isUse: true, value: 9, bonus: { spPercent: 9 * 2 } },
        { label: 'Lv 10', isUse: true, value: 10, bonus: { spPercent: 10 * 2 } },
      ],
    },
    {
      label: 'Gravitational',
      name: 'Gravitational Field',
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
    {
      label: 'Mystical Amp',
      name: 'Mystical Amplification',
      inputType: 'dropdown',
      dropdown: [
        { label: '-', value: 0, isUse: false },
        { label: 'Lv 10', value: 10, isUse: true },
      ],
    },
  ];

  constructor() {
    super();

    this.inheritSkills({
      activeSkillList: this.activeSkillListHi,
      atkSkillList: this.atkSkillListHi,
      passiveSkillList: this.passiveSkillListHi,
      classNames: this.classNamesHi,
    });
  }
}
