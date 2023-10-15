import { ClassName } from './_class-name';
import {
  ActiveSkillModel,
  AtkSkillFormulaInput,
  AtkSkillModel,
  CharacterBase,
  PassiveSkillModel,
} from './char-class.abstract';
import { Thief } from './thief';

const jobBonusTable: Record<number, [number, number, number, number, number, number]> = {
  1: [0, 0, 0, 0, 0, 1],
  2: [1, 0, 0, 0, 0, 1],
  3: [1, 0, 0, 0, 0, 1],
  4: [1, 0, 0, 0, 0, 1],
  5: [2, 0, 0, 0, 0, 1],
  6: [2, 0, 0, 0, 0, 1],
  7: [2, 0, 0, 0, 0, 2],
  8: [2, 1, 0, 0, 0, 2],
  9: [2, 1, 0, 0, 1, 2],
  10: [2, 1, 0, 1, 1, 2],
  11: [2, 1, 0, 1, 1, 2],
  12: [2, 1, 0, 1, 1, 2],
  13: [2, 1, 0, 2, 1, 2],
  14: [2, 1, 0, 2, 1, 3],
  15: [2, 1, 0, 2, 1, 3],
  16: [2, 1, 0, 2, 1, 3],
  17: [2, 2, 0, 2, 1, 3],
  18: [2, 2, 0, 2, 1, 3],
  19: [2, 2, 1, 2, 1, 3],
  20: [2, 2, 2, 2, 1, 3],
  21: [2, 2, 2, 3, 1, 3],
  22: [2, 2, 2, 3, 2, 3],
  23: [2, 2, 2, 3, 2, 3],
  24: [2, 2, 2, 3, 2, 3],
  25: [2, 2, 3, 3, 2, 3],
  26: [2, 2, 3, 3, 2, 4],
  27: [2, 2, 3, 3, 2, 4],
  28: [2, 2, 3, 3, 2, 4],
  29: [2, 2, 4, 3, 2, 4],
  30: [2, 2, 4, 3, 2, 4],
  31: [3, 2, 4, 3, 2, 4],
  32: [4, 2, 4, 3, 2, 4],
  33: [4, 2, 5, 3, 2, 4],
  34: [4, 2, 5, 3, 2, 5],
  35: [4, 2, 5, 3, 2, 5],
  36: [4, 2, 5, 3, 2, 5],
  37: [4, 2, 5, 4, 2, 5],
  38: [4, 2, 5, 5, 2, 5],
  39: [4, 2, 5, 5, 2, 5],
  40: [4, 2, 5, 5, 2, 5],
  41: [4, 2, 5, 5, 2, 5],
  42: [4, 2, 6, 5, 2, 5],
  43: [4, 2, 7, 5, 2, 5],
  44: [5, 2, 7, 5, 2, 5],
  45: [6, 2, 7, 5, 2, 5],
  46: [6, 2, 7, 5, 2, 5],
  47: [6, 2, 7, 5, 2, 5],
  48: [6, 2, 7, 5, 3, 5],
  49: [6, 3, 7, 5, 3, 5],
  50: [6, 3, 7, 5, 3, 5],
  51: [6, 3, 7, 6, 3, 5],
  52: [6, 3, 8, 6, 3, 5],
  53: [7, 3, 8, 6, 3, 5],
  54: [7, 4, 8, 6, 3, 5],
  55: [7, 4, 8, 6, 3, 5],
  56: [7, 4, 8, 6, 3, 6],
  57: [7, 4, 8, 6, 4, 6],
  58: [7, 4, 8, 6, 4, 6],
  59: [8, 4, 8, 6, 4, 6],
  60: [8, 5, 8, 6, 4, 6],
  61: [8, 5, 8, 6, 4, 6],
  62: [8, 5, 8, 6, 4, 6],
  63: [8, 5, 8, 6, 4, 6],
  64: [8, 5, 8, 6, 4, 6],
  65: [8, 7, 8, 6, 5, 6],
};

export class AssasinCross extends CharacterBase {
  protected readonly CLASS_NAME = ClassName.AssasinCross;
  protected readonly JobBonusTable = jobBonusTable;

  protected initialStatusPoint = 100;
  protected classNames = ['Hi-Class', 'Assassin', 'Assassin Cross', 'Assassin Cross Cls', 'Assassin Cross Class'];
  protected _atkSkillList: AtkSkillModel[] = [
    {
      name: 'Meteor Assault',
      label: 'Meteor Assault Lv 10',
      value: 'Meteor Assault==10',
      fct: 0.25,
      vct: 0.25,
      cd: 0.5,
      acd: 0,
      levelList: [],
      formular: (params: AtkSkillFormulaInput<{ extra: any }>): number => {
        const { baseLevel, skillLevel, extra } = params;
        const bonusStr = extra?.totalStr * 5;

        return (bonusStr + skillLevel * 120 + 200) * (baseLevel / 100);
      },
    },
  ];
  protected _activeSkillList: ActiveSkillModel[] = [
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
        { label: 'Yes', value: 1, isUse: true },
        { label: 'No', value: 0, isUse: false },
      ],
    },
  ];
  protected _passiveSkillList: PassiveSkillModel[] = [
    {
      inputType: 'dropdown',
      label: 'Katar Mastery',
      name: 'Katar Mastery',
      isMasteryAtk: true,
      dropdown: [
        { label: '-', isUse: false, value: 0 },
        { label: 'Lv 1', isUse: true, value: 1, bonus: { atk: 3 } },
        { label: 'Lv 2', isUse: true, value: 2, bonus: { atk: 6 } },
        { label: 'Lv 3', isUse: true, value: 3, bonus: { atk: 9 } },
        { label: 'Lv 4', isUse: true, value: 4, bonus: { atk: 12 } },
        { label: 'Lv 5', isUse: true, value: 5, bonus: { atk: 15 } },
        { label: 'Lv 6', isUse: true, value: 6, bonus: { atk: 18 } },
        { label: 'Lv 7', isUse: true, value: 7, bonus: { atk: 21 } },
        { label: 'Lv 8', isUse: true, value: 8, bonus: { atk: 24 } },
        { label: 'Lv 9', isUse: true, value: 9, bonus: { atk: 27 } },
        { label: 'Lv 10', isUse: true, value: 10, bonus: { atk: 30 } },
      ],
    },
    {
      inputType: 'dropdown',
      label: 'Adv Katar',
      name: 'Advanced Katar Mastery',
      dropdown: [
        { label: '-', isUse: false, value: 0 },
        { label: 'Lv 1', isUse: true, value: 1, bonus: { final: 12 } },
        { label: 'Lv 2', isUse: true, value: 2, bonus: { final: 14 } },
        { label: 'Lv 3', isUse: true, value: 3, bonus: { final: 16 } },
        { label: 'Lv 4', isUse: true, value: 4, bonus: { final: 18 } },
        { label: 'Lv 5', isUse: true, value: 5, bonus: { final: 20 } },
      ],
    },
  ];

  constructor() {
    super();

    this.inheritBaseClass(new Thief());
  }
}
