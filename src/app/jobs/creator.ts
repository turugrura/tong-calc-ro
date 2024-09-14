import { ClassName } from './_class-name';
import { ActiveSkillModel, AtkSkillModel, PassiveSkillModel } from './_character-base.abstract';
import { Merchant } from './Merchant';

const jobBonusTable: Record<number, [number, number, number, number, number, number]> = {
  1: [0, 0, 0, 0, 1, 0],
  2: [0, 0, 0, 0, 1, 0],
  3: [0, 0, 0, 0, 1, 1],
  4: [0, 0, 0, 0, 1, 1],
  5: [0, 1, 0, 0, 1, 1],
  6: [1, 1, 0, 0, 1, 1],
  7: [1, 1, 0, 1, 1, 1],
  8: [1, 1, 0, 1, 1, 2],
  9: [1, 1, 1, 1, 1, 2],
  10: [1, 1, 1, 1, 2, 2],
  11: [1, 1, 1, 1, 2, 2],
  12: [1, 1, 1, 1, 2, 2],
  13: [1, 1, 1, 2, 2, 2],
  14: [1, 1, 1, 2, 2, 2],
  15: [1, 1, 1, 2, 3, 2],
  16: [1, 1, 1, 2, 3, 2],
  17: [1, 1, 1, 2, 3, 2],
  18: [1, 2, 1, 2, 3, 2],
  19: [1, 2, 1, 2, 3, 2],
  20: [1, 2, 1, 2, 3, 3],
  21: [1, 2, 1, 2, 3, 3],
  22: [1, 2, 1, 3, 3, 3],
  23: [1, 2, 1, 3, 4, 3],
  24: [1, 2, 1, 3, 4, 3],
  25: [1, 2, 1, 3, 4, 4],
  26: [1, 2, 1, 3, 4, 4],
  27: [1, 3, 1, 3, 4, 4],
  28: [1, 3, 1, 3, 4, 4],
  29: [1, 3, 1, 3, 4, 4],
  30: [1, 3, 1, 4, 4, 4],
  31: [2, 3, 1, 4, 4, 4],
  32: [2, 3, 1, 4, 4, 4],
  33: [2, 3, 2, 4, 4, 4],
  34: [2, 3, 2, 4, 4, 5],
  35: [2, 3, 2, 4, 5, 5],
  36: [2, 3, 2, 4, 5, 5],
  37: [2, 3, 2, 4, 5, 5],
  38: [2, 4, 2, 4, 5, 5],
  39: [2, 4, 2, 4, 5, 5],
  40: [2, 4, 2, 4, 5, 5],
  41: [2, 4, 2, 4, 6, 5],
  42: [2, 4, 2, 4, 7, 5],
  43: [2, 4, 2, 4, 8, 5],
  44: [2, 4, 2, 4, 8, 5],
  45: [2, 4, 2, 4, 8, 6],
  46: [2, 4, 2, 5, 8, 6],
  47: [2, 4, 2, 5, 9, 6],
  48: [2, 4, 2, 5, 9, 6],
  49: [2, 4, 2, 5, 10, 6],
  50: [2, 4, 2, 5, 10, 6],
  51: [2, 4, 2, 5, 10, 7],
  52: [2, 4, 2, 5, 10, 8],
  53: [3, 4, 2, 5, 10, 8],
  54: [3, 5, 2, 5, 10, 8],
  55: [3, 5, 2, 5, 10, 8],
  56: [3, 5, 2, 5, 11, 8],
  57: [3, 5, 2, 5, 12, 8],
  58: [3, 5, 2, 5, 12, 8],
  59: [3, 5, 2, 6, 12, 8],
  60: [3, 5, 2, 6, 12, 9],
  61: [3, 5, 3, 6, 12, 9],
  62: [3, 5, 3, 6, 12, 9],
  63: [3, 5, 3, 6, 13, 9],
  64: [3, 5, 3, 6, 13, 10],
  65: [3, 5, 3, 6, 13, 10],
  66: [4, 5, 3, 6, 13, 10],
  67: [4, 6, 3, 6, 13, 10],
  68: [4, 6, 3, 7, 13, 10],
  69: [4, 6, 3, 7, 13, 11],
  70: [4, 6, 3, 7, 14, 11],
};

export class Creator extends Merchant {
  protected override CLASS_NAME = ClassName.Creator;
  protected override JobBonusTable = jobBonusTable;
  protected override initialStatusPoint = 100;

  protected readonly classNamesHi = [ClassName.Alchemist, ClassName.HiClass, ClassName.Creator];
  protected readonly atkSkillListHi: AtkSkillModel[] = [];
  protected readonly activeSkillListHi: ActiveSkillModel[] = [];
  protected readonly passiveSkillListHi: PassiveSkillModel[] = [
    {
      label: 'Learn Potion',
      name: 'Learning Potion',
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
      label: 'Axe Mastery',
      name: 'Axe Mastery',
      inputType: 'dropdown',
      isMasteryAtk: true,
      dropdown: [
        { label: '-', isUse: false, value: 0 },
        { label: 'Lv 10', isUse: true, value: 10 },
      ],
    },
    {
      label: 'Acid Bomb',
      name: 'Acid Demonstration',
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
      label: 'Bio Cannibalize',
      name: 'Bio Cannibalize',
      inputType: 'dropdown',
      dropdown: [
        { label: '-', value: 0, isUse: false },
        { label: 'Lv 1', value: 1, skillLv: 1, isUse: true },
        { label: 'Lv 2', value: 2, skillLv: 2, isUse: true },
        { label: 'Lv 3', value: 3, skillLv: 3, isUse: true },
        { label: 'Lv 4', value: 4, skillLv: 4, isUse: true },
        { label: 'Lv 5', value: 5, skillLv: 5, isUse: true },
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
