import { ClassName } from './_class-name';
import { ActiveSkillModel, AtkSkillModel, PassiveSkillModel } from './_character-base.abstract';
import { Taekwondo } from './Taekwondo';

const jobBonusTable: Record<number, [number, number, number, number, number, number]> = {
  1: [0, 0, 0, 1, 0, 0],
  2: [0, 0, 0, 2, 0, 0],
  3: [0, 0, 0, 3, 0, 0],
  4: [0, 0, 0, 4, 0, 0],
  5: [0, 0, 0, 5, 0, 0],
  6: [0, 0, 0, 6, 0, 0],
  7: [0, 0, 0, 7, 0, 0],
  8: [0, 0, 0, 8, 0, 0],
  9: [0, 0, 0, 9, 0, 0],
  10: [0, 0, 0, 10, 0, 0],
  11: [0, 0, 0, 11, 0, 0],
  12: [0, 0, 0, 12, 0, 0],
  13: [0, 0, 0, 12, 0, 0],
  14: [0, 0, 0, 12, 0, 0],
  15: [0, 0, 0, 12, 0, 0],
  16: [0, 0, 0, 12, 0, 0],
  17: [0, 0, 0, 12, 0, 0],
  18: [0, 0, 0, 12, 0, 0],
  19: [0, 0, 0, 12, 0, 0],
  20: [0, 0, 1, 12, 0, 0],
  21: [0, 0, 2, 12, 0, 0],
  22: [0, 0, 3, 12, 0, 0],
  23: [0, 0, 4, 12, 0, 0],
  24: [0, 0, 5, 12, 0, 0],
  25: [0, 0, 6, 12, 0, 0],
  26: [0, 0, 6, 12, 0, 0],
  27: [0, 0, 6, 12, 0, 0],
  28: [0, 0, 6, 12, 0, 0],
  29: [0, 0, 6, 12, 0, 0],
  30: [0, 0, 6, 12, 0, 0],
  31: [0, 0, 6, 12, 0, 0],
  32: [0, 0, 6, 12, 0, 0],
  33: [0, 0, 6, 12, 0, 0],
  34: [0, 0, 6, 12, 0, 0],
  35: [0, 0, 6, 12, 0, 0],
  36: [0, 0, 6, 12, 0, 0],
  37: [0, 0, 6, 12, 0, 0],
  38: [0, 0, 6, 12, 0, 0],
  39: [0, 0, 6, 12, 1, 0],
  40: [0, 0, 6, 12, 2, 0],
  41: [0, 0, 6, 12, 3, 0],
  42: [0, 0, 6, 12, 4, 0],
  43: [0, 0, 6, 12, 5, 0],
  44: [0, 0, 6, 12, 6, 0],
  45: [0, 0, 6, 12, 7, 0],
  46: [0, 0, 6, 12, 8, 0],
  47: [0, 0, 6, 12, 9, 0],
  48: [0, 0, 6, 12, 10, 0],
  49: [0, 0, 6, 12, 11, 0],
  50: [0, 0, 6, 12, 12, 0],
  51: [0, 0, 6, 12, 12, 0],
  52: [0, 0, 6, 12, 12, 0],
  53: [0, 0, 6, 12, 12, 0],
  54: [0, 0, 6, 12, 12, 0],
  55: [0, 0, 6, 12, 12, 0],
  56: [0, 0, 6, 12, 12, 0],
  57: [0, 0, 6, 12, 12, 0],
  58: [0, 0, 6, 12, 12, 0],
  59: [0, 0, 6, 12, 12, 0],
  60: [0, 0, 6, 12, 12, 0],
  61: [0, 0, 6, 12, 12, 0],
  62: [0, 0, 6, 12, 12, 0],
  63: [0, 0, 6, 12, 12, 0],
  64: [0, 0, 6, 12, 12, 0],
  65: [0, 0, 6, 12, 12, 0],
  66: [0, 0, 6, 12, 12, 0],
  67: [0, 0, 6, 12, 12, 0],
  68: [0, 0, 6, 12, 12, 0],
  69: [0, 0, 6, 12, 12, 0],
  70: [0, 0, 6, 12, 12, 0],
};

export class SoulLinker extends Taekwondo {
  protected override CLASS_NAME = ClassName.SoulLinker;
  protected override JobBonusTable = jobBonusTable;
  protected override initialStatusPoint = 40;

  protected readonly classNamesHi = [ClassName.SoulLinker];
  protected readonly atkSkillListHi: AtkSkillModel[] = [];
  protected readonly activeSkillListHi: ActiveSkillModel[] = [
    {
      label: 'Esma Lv10',
      name: 'Esma',
      inputType: 'selectButton',
      dropdown: [
        { label: 'Yes', value: 10, skillLv: 10, isUse: true },
        { label: 'No', value: 0, isUse: false },
      ],
    },
  ];
  protected readonly passiveSkillListHi: PassiveSkillModel[] = [
    {
      inputType: 'dropdown',
      label: 'Kaahi',
      name: 'Kaahi',
      dropdown: [
        { label: '-', value: 0, isUse: false },
        { label: 'Lv 1', value: 1, skillLv: 1, isUse: true },
        { label: 'Lv 2', value: 2, skillLv: 2, isUse: true },
        { label: 'Lv 3', value: 3, skillLv: 3, isUse: true },
        { label: 'Lv 4', value: 4, skillLv: 4, isUse: true },
        { label: 'Lv 5', value: 5, skillLv: 5, isUse: true },
        { label: 'Lv 6', value: 6, skillLv: 6, isUse: true },
        { label: 'Lv 7', value: 7, skillLv: 7, isUse: true },
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
