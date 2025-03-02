import { Taekwondo } from './Taekwondo';
import { ActiveSkillModel, AtkSkillModel, PassiveSkillModel } from './_character-base.abstract';
import { ClassName } from './_class-name';

const jobBonusTable: Record<number, [number, number, number, number, number, number]> = {
  1: [1, 0, 0, 0, 0, 0],
  2: [2, 0, 0, 0, 0, 0],
  3: [3, 0, 0, 0, 0, 0],
  4: [4, 0, 0, 0, 0, 0],
  5: [5, 0, 0, 0, 0, 0],
  6: [6, 0, 0, 0, 0, 0],
  7: [7, 0, 0, 0, 0, 0],
  8: [8, 0, 0, 0, 0, 0],
  9: [9, 0, 0, 0, 0, 0],
  10: [10, 0, 0, 0, 0, 0],
  11: [11, 0, 0, 0, 0, 0],
  12: [12, 0, 0, 0, 0, 0],
  13: [12, 0, 0, 0, 0, 0],
  14: [12, 0, 0, 0, 0, 0],
  15: [12, 0, 0, 0, 0, 0],
  16: [12, 0, 0, 0, 0, 0],
  17: [12, 0, 0, 0, 0, 0],
  18: [12, 0, 0, 0, 0, 0],
  19: [12, 0, 0, 0, 0, 0],
  20: [12, 0, 0, 0, 1, 0],
  21: [12, 0, 0, 0, 2, 0],
  22: [12, 0, 0, 0, 3, 0],
  23: [12, 0, 0, 0, 4, 0],
  24: [12, 0, 0, 0, 5, 0],
  25: [12, 0, 0, 0, 6, 0],
  26: [12, 0, 0, 0, 6, 0],
  27: [12, 0, 0, 0, 6, 0],
  28: [12, 0, 0, 0, 6, 0],
  29: [12, 0, 0, 0, 6, 0],
  30: [12, 0, 0, 0, 6, 0],
  31: [12, 0, 0, 0, 6, 0],
  32: [12, 0, 0, 0, 6, 0],
  33: [12, 0, 0, 0, 6, 0],
  34: [12, 0, 0, 0, 6, 0],
  35: [12, 0, 0, 0, 6, 0],
  36: [12, 0, 0, 0, 6, 0],
  37: [12, 0, 0, 0, 6, 0],
  38: [12, 0, 0, 0, 6, 0],
  39: [12, 1, 0, 0, 6, 0],
  40: [12, 2, 0, 0, 6, 0],
  41: [12, 3, 0, 0, 6, 0],
  42: [12, 4, 0, 0, 6, 0],
  43: [12, 5, 0, 0, 6, 0],
  44: [12, 6, 0, 0, 6, 0],
  45: [12, 7, 0, 0, 6, 0],
  46: [12, 8, 0, 0, 6, 0],
  47: [12, 9, 0, 0, 6, 0],
  48: [12, 10, 0, 0, 6, 0],
  49: [12, 11, 0, 0, 6, 0],
  50: [12, 12, 0, 0, 6, 0],
  51: [12, 12, 0, 0, 6, 0],
  52: [12, 12, 0, 0, 6, 0],
  53: [12, 12, 0, 0, 6, 0],
  54: [12, 12, 0, 0, 6, 0],
  55: [12, 12, 0, 0, 6, 0],
  56: [12, 12, 0, 0, 6, 0],
  57: [12, 12, 0, 0, 6, 0],
  58: [12, 12, 0, 0, 6, 0],
  59: [12, 12, 0, 0, 6, 0],
  60: [12, 12, 0, 0, 6, 0],
  61: [12, 12, 0, 0, 6, 0],
  62: [12, 12, 0, 0, 6, 0],
  63: [12, 12, 0, 0, 6, 0],
  64: [12, 12, 0, 0, 6, 0],
  65: [12, 12, 0, 0, 6, 0],
  66: [12, 12, 0, 0, 6, 0],
  67: [12, 12, 0, 0, 6, 0],
  68: [12, 12, 0, 0, 6, 0],
  69: [12, 12, 0, 0, 6, 0],
  70: [12, 12, 0, 0, 6, 0],
};

export class StarGladiator extends Taekwondo {
  protected override CLASS_NAME = ClassName.StarGladiator;
  protected override JobBonusTable = jobBonusTable;
  protected override initialStatusPoint = 40;

  protected readonly classNamesHi = [ClassName.StarGladiator];

  protected readonly atkSkillListHi: AtkSkillModel[] = [];

  protected readonly activeSkillListHi: ActiveSkillModel[] = [
    {
      label: 'Power',
      name: 'Power',
      inputType: 'dropdown',
      dropdown: [
        { label: '-', value: 0, isUse: false },
        // { label: 'Lv 1', value: 1, isUse: true },
        // { label: 'Lv 2', value: 2, isUse: true },
        // { label: 'Lv 3', value: 3, isUse: true },
        // { label: 'Lv 4', value: 4, isUse: true },
        { label: 'Lv 5', value: 5, isUse: true },
      ],
    },
    {
      label: 'Wrath of',
      name: 'Wrath of',
      inputType: 'selectButton',
      dropdown: [
        { label: 'Yes', value: 3, skillLv: 3, isUse: true },
        { label: 'No', value: 0, isUse: false },
      ],
    },
  ];
  protected readonly passiveSkillListHi: PassiveSkillModel[] = [
    {
      label: 'Power',
      name: 'Power',
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
      label: 'Knowledge of Sun',
      name: 'Knowledge of Sun, Moon and Star',
      inputType: 'dropdown',
      dropdown: [
        { label: '-', value: 0, isUse: false },
        { label: 'Lv 1', value: 1, isUse: true },
        { label: 'Lv 2', value: 2, isUse: true },
        { label: 'Lv 3', value: 3, isUse: true },
        { label: 'Lv 4', value: 4, isUse: true },
        { label: 'Lv 5', value: 5, isUse: true },
        { label: 'Lv 6', value: 6, isUse: true },
        { label: 'Lv 7', value: 7, isUse: true },
        { label: 'Lv 8', value: 8, isUse: true },
        { label: 'Lv 9', value: 9, isUse: true },
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
