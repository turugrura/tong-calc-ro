import { ClassName } from './_class-name';
import { ActiveSkillModel, AtkSkillFormulaInput, AtkSkillModel, PassiveSkillModel } from './_character-base.abstract';
import { Thief } from './Thief';

const jobBonusTable: Record<number, [number, number, number, number, number, number]> = {
  1: [0, 1, 0, 0, 0, 0],
  2: [1, 1, 0, 0, 0, 0],
  3: [1, 1, 0, 0, 0, 1],
  4: [1, 2, 0, 0, 0, 1],
  5: [1, 3, 0, 0, 0, 1],
  6: [1, 3, 0, 0, 0, 1],
  7: [2, 3, 0, 0, 0, 1],
  8: [2, 3, 0, 0, 0, 2],
  9: [2, 3, 1, 0, 0, 2],
  10: [2, 3, 1, 0, 1, 2],
  11: [2, 3, 1, 0, 1, 2],
  12: [3, 3, 1, 0, 1, 2],
  13: [3, 3, 1, 0, 1, 2],
  14: [3, 3, 1, 0, 1, 2],
  15: [3, 4, 1, 0, 1, 2],
  16: [3, 4, 1, 0, 1, 3],
  17: [3, 4, 1, 0, 1, 3],
  18: [3, 4, 1, 0, 1, 4],
  19: [3, 4, 1, 0, 1, 4],
  20: [3, 5, 1, 0, 1, 4],
  21: [4, 5, 1, 0, 1, 4],
  22: [4, 5, 1, 0, 1, 4],
  23: [4, 5, 1, 0, 2, 4],
  24: [4, 6, 1, 0, 2, 4],
  25: [4, 7, 1, 0, 2, 4],
  26: [4, 7, 1, 0, 2, 5],
  27: [4, 7, 1, 0, 2, 5],
  28: [4, 7, 1, 0, 2, 5],
  29: [5, 7, 1, 0, 2, 5],
  30: [5, 7, 1, 0, 2, 5],
  31: [5, 8, 1, 0, 2, 5],
  32: [5, 9, 1, 0, 2, 5],
  33: [5, 10, 1, 0, 2, 5],
  34: [5, 10, 1, 0, 2, 6],
  35: [5, 10, 1, 0, 2, 6],
  36: [5, 10, 1, 0, 2, 6],
  37: [5, 10, 1, 0, 3, 6],
  38: [6, 10, 1, 0, 3, 6],
  39: [6, 10, 1, 0, 4, 6],
  40: [6, 10, 1, 0, 4, 6],
  41: [6, 10, 1, 0, 4, 6],
  42: [6, 11, 1, 0, 4, 6],
  43: [6, 11, 1, 0, 5, 6],
  44: [6, 11, 1, 0, 5, 6],
  45: [6, 11, 1, 0, 5, 6],
  46: [6, 12, 1, 0, 5, 6],
  47: [6, 12, 2, 0, 5, 6],
  48: [6, 12, 2, 0, 5, 7],
  49: [6, 12, 2, 0, 5, 7],
  50: [7, 12, 2, 0, 5, 7],
  51: [7, 13, 2, 0, 5, 7],
  52: [7, 13, 2, 0, 5, 7],
  53: [7, 13, 2, 0, 6, 7],
  54: [8, 13, 2, 0, 6, 7],
  55: [8, 13, 2, 0, 6, 7],
  56: [8, 14, 2, 0, 6, 7],
  57: [8, 14, 2, 0, 7, 7],
  58: [8, 14, 2, 0, 7, 7],
  59: [8, 14, 2, 0, 7, 7],
  60: [8, 14, 2, 0, 7, 7],
  61: [8, 14, 2, 0, 8, 7],
  62: [8, 15, 2, 0, 8, 7],
  63: [8, 15, 2, 0, 8, 7],
  64: [8, 15, 2, 0, 9, 7],
  65: [8, 15, 2, 0, 9, 8],
  66: [9, 15, 2, 0, 9, 8],
  67: [9, 15, 2, 0, 9, 8],
  68: [9, 15, 2, 0, 9, 8],
  69: [9, 15, 3, 0, 9, 8],
  70: [9, 15, 3, 0, 10, 8],
};

export class AssassinCross extends Thief {
  protected override CLASS_NAME = ClassName.AssassinCross;
  protected override JobBonusTable = jobBonusTable;
  protected override initialStatusPoint = 100;

  protected readonly classNamesHi = [ClassName.Assassin, ClassName.HiClass, ClassName.AssassinCross];
  protected readonly atkSkillListHi: AtkSkillModel[] = [
    {
      name: 'Meteor Assault',
      label: 'Meteor Assault Lv10',
      value: 'Meteor Assault==10',
      fct: 0.3,
      vct: 0.25,
      cd: 0.5,
      acd: 0,
      isMelee: true,
      formula: (input: AtkSkillFormulaInput): number => {
        const { model, skillLevel, status } = input;
        const baseLevel = model.level;
        const bonusStr = status.totalStr * 5;

        return (bonusStr + skillLevel * 120 + 200) * (baseLevel / 100);
      },
    },
  ];
  protected readonly activeSkillListHi: ActiveSkillModel[] = [
    {
      inputType: 'dropdown',
      label: 'Venom Imp',
      name: 'Venom Impression',
      isEquipAtk: true,
      dropdown: [
        { label: '-', value: 0, isUse: false },
        { label: 'Lv 1', value: 1, isUse: true, bonus: { vi: 10 } },
        { label: 'Lv 2', value: 2, isUse: true, bonus: { vi: 20 } },
        { label: 'Lv 3', value: 3, isUse: true, bonus: { vi: 30 } },
        { label: 'Lv 4', value: 4, isUse: true, bonus: { vi: 40 } },
        { label: 'Lv 5', value: 5, isUse: true, bonus: { vi: 50 } },
      ],
    },
    {
      inputType: 'selectButton',
      label: 'EDP',
      name: 'Enchant Deadly Poison',
      dropdown: [
        { label: 'Yes', value: 1, isUse: true, bonus: { edp: 1 } },
        { label: 'No', value: 0, isUse: false },
      ],
    },
  ];
  protected readonly passiveSkillListHi: PassiveSkillModel[] = [
    {
      inputType: 'dropdown',
      label: 'Katar Mastery',
      name: 'Katar Mastery',
      isMasteryAtk: true,
      dropdown: [
        { label: '-', isUse: false, value: 0 },
        { label: 'Lv 1', isUse: true, value: 1, bonus: { x_katar_atk: 3 } },
        { label: 'Lv 2', isUse: true, value: 2, bonus: { x_katar_atk: 6 } },
        { label: 'Lv 3', isUse: true, value: 3, bonus: { x_katar_atk: 9 } },
        { label: 'Lv 4', isUse: true, value: 4, bonus: { x_katar_atk: 12 } },
        { label: 'Lv 5', isUse: true, value: 5, bonus: { x_katar_atk: 15 } },
        { label: 'Lv 6', isUse: true, value: 6, bonus: { x_katar_atk: 18 } },
        { label: 'Lv 7', isUse: true, value: 7, bonus: { x_katar_atk: 21 } },
        { label: 'Lv 8', isUse: true, value: 8, bonus: { x_katar_atk: 24 } },
        { label: 'Lv 9', isUse: true, value: 9, bonus: { x_katar_atk: 27 } },
        { label: 'Lv 10', isUse: true, value: 10, bonus: { x_katar_atk: 30 } },
      ],
    },
    {
      inputType: 'dropdown',
      label: 'Adv Katar',
      name: 'Advanced Katar Mastery',
      dropdown: [
        { label: '-', isUse: false, value: 0 },
        { label: 'Lv 1', isUse: true, value: 1, bonus: { advKatar: 12 } },
        { label: 'Lv 2', isUse: true, value: 2, bonus: { advKatar: 14 } },
        { label: 'Lv 3', isUse: true, value: 3, bonus: { advKatar: 16 } },
        { label: 'Lv 4', isUse: true, value: 4, bonus: { advKatar: 18 } },
        { label: 'Lv 5', isUse: true, value: 5, bonus: { advKatar: 20 } },
      ],
    },
    {
      inputType: 'dropdown',
      label: 'Lefthand Mastery',
      name: 'Lefthand Mastery',
      dropdown: [
        { label: '-', isUse: false, value: 0 },
        { label: 'Lv 1', isUse: true, value: 1, bonus: { weapon_left: 40 } },
        { label: 'Lv 2', isUse: true, value: 2, bonus: { weapon_left: 50 } },
        { label: 'Lv 3', isUse: true, value: 3, bonus: { weapon_left: 60 } },
        { label: 'Lv 4', isUse: true, value: 4, bonus: { weapon_left: 70 } },
        { label: 'Lv 5', isUse: true, value: 5, bonus: { weapon_left: 80 } },
      ],
    },
    {
      inputType: 'dropdown',
      label: 'Soul Destroyer',
      name: 'Soul Destroyer',
      isMasteryAtk: true,
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
