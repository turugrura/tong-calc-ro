import { ElementType } from '../constants/element-type.const';
import { ClassName } from './_class-name';
import { ActiveSkillModel, AtkSkillFormulaInput, AtkSkillModel, PassiveSkillModel } from './_character-base.abstract';
import { SoulLinker } from './SoulLinker';
import { InfoForClass } from '../models/info-for-class.model';

const jobBonusTable: Record<number, [number, number, number, number, number, number]> = {
  1: [0, 0, 0, 1, 0, 0],
  2: [0, 0, 0, 1, 1, 0],
  3: [0, 0, 0, 1, 1, 0],
  4: [0, 0, 0, 1, 1, 0],
  5: [0, 0, 0, 2, 1, 0],
  6: [0, 0, 1, 2, 1, 0],
  7: [0, 0, 1, 2, 2, 0],
  8: [0, 0, 1, 2, 2, 0],
  9: [0, 0, 1, 2, 2, 0],
  10: [0, 0, 1, 2, 2, 0],
  11: [0, 0, 1, 2, 3, 0],
  12: [0, 0, 1, 3, 3, 0],
  13: [0, 1, 1, 3, 3, 0],
  14: [0, 1, 1, 3, 3, 0],
  15: [0, 1, 1, 3, 4, 0],
  16: [0, 1, 1, 4, 4, 0],
  17: [0, 1, 2, 4, 4, 0],
  18: [0, 1, 2, 4, 4, 0],
  19: [1, 1, 2, 4, 4, 0],
  20: [1, 1, 2, 4, 5, 0],
  21: [1, 2, 2, 4, 5, 0],
  22: [1, 2, 2, 4, 5, 0],
  23: [1, 2, 2, 4, 5, 0],
  24: [1, 2, 3, 4, 5, 0],
  25: [1, 2, 3, 5, 5, 0],
  26: [1, 2, 3, 5, 6, 0],
  27: [1, 2, 3, 5, 6, 0],
  28: [2, 2, 3, 5, 6, 0],
  29: [2, 3, 3, 5, 6, 0],
  30: [2, 3, 3, 5, 7, 0],
  31: [2, 3, 3, 6, 7, 0],
  32: [2, 3, 3, 6, 7, 0],
  33: [2, 3, 3, 6, 7, 0],
  34: [2, 3, 3, 6, 8, 0],
  35: [2, 4, 3, 6, 8, 0],
  36: [2, 4, 3, 6, 8, 0],
  37: [2, 4, 4, 6, 8, 0],
  38: [2, 4, 4, 6, 9, 0],
  39: [2, 4, 4, 7, 9, 0],
  40: [2, 4, 4, 7, 9, 0],
  41: [2, 5, 4, 7, 9, 0],
  42: [2, 5, 5, 7, 9, 0],
  43: [3, 5, 5, 7, 9, 0],
  44: [3, 5, 5, 8, 9, 0],
  45: [3, 5, 5, 8, 10, 0],
  46: [3, 5, 5, 8, 10, 0],
  47: [3, 6, 5, 8, 10, 0],
  48: [3, 6, 5, 8, 10, 0],
  49: [3, 6, 5, 9, 10, 0],
  50: [3, 6, 5, 9, 11, 0],
  51: [3, 6, 5, 9, 11, 0],
  52: [3, 7, 5, 9, 11, 0],
  53: [3, 7, 5, 9, 11, 0],
  54: [3, 7, 5, 10, 11, 0],
  55: [3, 7, 5, 10, 11, 0],
  56: [3, 7, 5, 10, 11, 0],
  57: [3, 7, 5, 10, 11, 0],
  58: [3, 7, 5, 10, 11, 0],
  59: [3, 7, 5, 11, 11, 0],
  60: [3, 7, 5, 11, 11, 0],
  61: [3, 7, 5, 11, 11, 0],
  62: [3, 7, 5, 11, 11, 0],
  63: [3, 7, 5, 11, 11, 0],
  64: [3, 7, 6, 11, 12, 0],
  65: [3, 7, 6, 11, 12, 1],
  66: [3, 7, 6, 11, 12, 1],
  67: [3, 7, 6, 11, 12, 1],
  68: [3, 7, 6, 11, 12, 1],
  69: [3, 7, 6, 11, 12, 1],
  70: [3, 7, 7, 11, 13, 2],
};

export class SoulReaper extends SoulLinker {
  protected override CLASS_NAME = ClassName.SoulReaper;
  protected override JobBonusTable = jobBonusTable;

  protected override initialStatusPoint = 48;
  protected readonly classNames3rd = [ClassName.SoulReaper];
  protected readonly atkSkillList3rd: AtkSkillModel[] = [
    {
      label: 'Espa Lv10',
      name: 'Espa',
      value: 'Espa==10',
      acd: 0,
      fct: 1,
      vct: 0.5,
      cd: 0,
      isMatk: true,
      formula: (input: AtkSkillFormulaInput): number => {
        const { model, skillLevel } = input;
        const baseLevel = model.level;

        return (500 + skillLevel * 250) * (baseLevel / 100);
      },
    },
    {
      label: 'Eswhoo Lv10',
      name: 'Eswhoo',
      value: 'Eswhoo==10',
      acd: 0,
      fct: 1,
      vct: 0.5,
      cd: 2,
      isMatk: true,
      formula: (input: AtkSkillFormulaInput): number => {
        const { model, skillLevel } = input;
        const baseLevel = model.level;

        return (1100 + skillLevel * 200) * (baseLevel / 100);
      },
    },
    {
      label: 'Curse Explosion Lv10',
      name: 'Curse Explosion',
      value: 'Curse Explosion==10',
      acd: 0,
      fct: 1,
      vct: 0.5,
      cd: 1,
      isMatk: true,
      element: ElementType.Dark,
      formula: (input: AtkSkillFormulaInput): number => {
        const { model, skillLevel } = input;
        const baseLevel = model.level;

        return (400 + skillLevel * 100) * (baseLevel / 100);
      },
    },
  ];
  protected readonly activeSkillList3rd: ActiveSkillModel[] = [
    // {
    //   inputType: 'dropdown',
    //   label: 'Fairy Soul',
    //   name: 'Fairy Soul',
    //   dropdown: [
    //     { label: '-', value: 0, isUse: false },
    //     { label: 'Lv 1', value: 1, skillLv: 1, isUse: true, bonus: { matk: 10, vct: 5 } },
    //     { label: 'Lv 2', value: 2, skillLv: 2, isUse: true, bonus: { matk: 20, vct: 5 } },
    //     { label: 'Lv 3', value: 3, skillLv: 3, isUse: true, bonus: { matk: 30, vct: 7 } },
    //     { label: 'Lv 4', value: 4, skillLv: 4, isUse: true, bonus: { matk: 40, vct: 7 } },
    //     { label: 'Lv 5', value: 5, skillLv: 5, isUse: true, bonus: { matk: 50, vct: 10 } },
    //   ],
    // },
    {
      inputType: 'dropdown',
      label: 'Total Soul',
      name: 'Total Soul',
      dropdown: [
        { label: '-', value: 0, isUse: false },
        { label: '5', value: 5, skillLv: 5, isUse: true, bonus: { x_matk: 5 * 3 } },
        { label: '10', value: 10, skillLv: 10, isUse: true, bonus: { x_matk: 10 * 3 } },
        { label: '15', value: 15, skillLv: 15, isUse: true, bonus: { x_matk: 15 * 3 } },
        { label: '20', value: 20, skillLv: 20, isUse: true, bonus: { x_matk: 20 * 3 } },
      ],
    },
  ];
  protected readonly passiveSkillList3rd: PassiveSkillModel[] = [
    {
      label: 'Espa',
      name: 'Espa',
      inputType: 'dropdown',
      dropdown: [
        { label: '-', isUse: false, value: 0 },
        { label: 'Lv 1', isUse: true, value: 1 },
        { label: 'Lv 2', isUse: true, value: 2 },
        { label: 'Lv 3', isUse: true, value: 3 },
        { label: 'Lv 4', isUse: true, value: 4 },
        { label: 'Lv 5', isUse: true, value: 5 },
        { label: 'Lv 6', isUse: true, value: 6 },
        { label: 'Lv 7', isUse: true, value: 7 },
        { label: 'Lv 8', isUse: true, value: 8 },
        { label: 'Lv 9', isUse: true, value: 9 },
        { label: 'Lv 10', isUse: true, value: 10 },
      ],
    },
    {
      label: 'Eswhoo',
      name: 'Eswhoo',
      inputType: 'dropdown',
      dropdown: [
        { label: '-', isUse: false, value: 0 },
        { label: 'Lv 1', isUse: true, value: 1 },
        { label: 'Lv 2', isUse: true, value: 2 },
        { label: 'Lv 3', isUse: true, value: 3 },
        { label: 'Lv 4', isUse: true, value: 4 },
        { label: 'Lv 5', isUse: true, value: 5 },
        { label: 'Lv 6', isUse: true, value: 6 },
        { label: 'Lv 7', isUse: true, value: 7 },
        { label: 'Lv 8', isUse: true, value: 8 },
        { label: 'Lv 9', isUse: true, value: 9 },
        { label: 'Lv 10', isUse: true, value: 10 },
      ],
    },
    {
      label: 'Evil Soul Curse',
      name: 'Evil Soul Curse',
      inputType: 'dropdown',
      dropdown: [
        { label: '-', isUse: false, value: 0 },
        { label: 'Lv 1', isUse: true, value: 1 },
        { label: 'Lv 2', isUse: true, value: 2 },
        { label: 'Lv 3', isUse: true, value: 3 },
        { label: 'Lv 4', isUse: true, value: 4 },
        { label: 'Lv 5', isUse: true, value: 5 },
      ],
    },
  ];

  constructor() {
    super();

    this.inheritSkills({
      activeSkillList: this.activeSkillList3rd,
      atkSkillList: this.atkSkillList3rd,
      passiveSkillList: this.passiveSkillList3rd,
      classNames: this.classNames3rd,
    });
  }

  override getMasteryMatk(info: InfoForClass): number {
    return this.calcHiddenMasteryAtk(info).totalMatk;
  }
}
