import { ClassName } from './_class-name';
import { ActiveSkillModel, AtkSkillModel, CharacterBase, PassiveSkillModel } from './_character-base.abstract';

const jobBonusTable: Record<number, [number, number, number, number, number, number]> = {
  1: [0, 0, 0, 0, 0, 0],
  2: [0, 0, 1, 0, 0, 0],
  3: [0, 0, 1, 0, 0, 0],
  4: [0, 0, 1, 0, 0, 0],
  5: [0, 0, 1, 0, 0, 0],
  6: [0, 0, 1, 0, 1, 0],
  7: [0, 0, 1, 0, 1, 0],
  8: [0, 0, 1, 0, 1, 0],
  9: [0, 0, 1, 0, 1, 0],
  10: [1, 0, 1, 0, 1, 0],
  11: [1, 0, 1, 0, 1, 0],
  12: [1, 0, 1, 0, 1, 0],
  13: [1, 0, 1, 0, 1, 0],
  14: [1, 0, 1, 0, 2, 0],
  15: [1, 0, 1, 0, 2, 0],
  16: [1, 0, 1, 0, 2, 0],
  17: [1, 0, 1, 0, 2, 0],
  18: [1, 0, 2, 0, 2, 0],
  19: [1, 0, 2, 0, 2, 0],
  20: [1, 0, 2, 0, 2, 0],
  21: [1, 0, 2, 0, 2, 0],
  22: [2, 0, 2, 0, 2, 0],
  23: [2, 0, 2, 0, 2, 0],
  24: [2, 0, 2, 0, 2, 0],
  25: [2, 0, 2, 0, 2, 0],
  26: [2, 0, 2, 1, 2, 0],
  27: [2, 0, 2, 1, 2, 0],
  28: [2, 0, 2, 1, 2, 0],
  29: [2, 0, 2, 1, 2, 0],
  30: [2, 0, 3, 1, 2, 0],
  31: [2, 0, 3, 1, 2, 0],
  32: [2, 0, 3, 1, 2, 0],
  33: [2, 1, 3, 1, 2, 0],
  34: [2, 1, 3, 1, 2, 0],
  35: [2, 1, 3, 1, 2, 0],
  36: [2, 1, 3, 1, 2, 1],
  37: [2, 1, 3, 1, 2, 1],
  38: [2, 1, 3, 1, 3, 1],
  39: [2, 1, 3, 1, 3, 1],
  40: [3, 1, 3, 1, 3, 1],
  41: [3, 1, 3, 1, 3, 1],
  42: [3, 1, 3, 1, 4, 1],
  43: [3, 1, 3, 1, 4, 1],
  44: [4, 1, 3, 1, 4, 1],
  45: [4, 1, 3, 1, 4, 1],
  46: [4, 1, 3, 1, 4, 2],
  47: [4, 1, 4, 1, 4, 2],
  48: [4, 1, 4, 1, 4, 2],
  49: [5, 1, 4, 1, 4, 2],
  50: [5, 1, 4, 1, 5, 2],
  51: [5, 1, 4, 1, 5, 2],
  52: [5, 1, 4, 1, 5, 2],
  53: [5, 1, 4, 1, 5, 2],
  54: [5, 1, 4, 1, 5, 2],
  55: [5, 1, 4, 1, 5, 2],
  56: [5, 1, 4, 1, 5, 2],
  57: [5, 1, 4, 1, 5, 2],
  58: [5, 1, 4, 1, 5, 2],
  59: [5, 1, 4, 1, 5, 2],
  60: [5, 1, 4, 1, 5, 2],
  61: [5, 1, 4, 1, 5, 2],
  62: [5, 1, 4, 1, 5, 2],
  63: [5, 1, 4, 1, 5, 2],
  64: [5, 1, 4, 1, 5, 2],
  65: [5, 1, 4, 1, 5, 2],
  66: [5, 1, 4, 1, 5, 2],
  67: [5, 1, 4, 1, 5, 2],
  68: [5, 1, 4, 1, 5, 2],
  69: [5, 1, 4, 1, 5, 2],
  70: [5, 1, 4, 1, 5, 2],
};

const jobBonusTableHi: Record<number, [number, number, number, number, number, number]> = {
  1: [0, 0, 0, 0, 0, 0],
  2: [0, 0, 1, 0, 0, 0],
  3: [0, 0, 1, 0, 0, 0],
  4: [0, 0, 1, 0, 0, 0],
  5: [0, 0, 1, 0, 0, 0],
  6: [0, 0, 1, 0, 1, 0],
  7: [0, 0, 1, 0, 1, 0],
  8: [0, 0, 1, 0, 1, 0],
  9: [0, 0, 1, 0, 1, 0],
  10: [1, 0, 1, 0, 1, 0],
  11: [1, 0, 1, 0, 1, 0],
  12: [1, 0, 1, 0, 1, 0],
  13: [1, 0, 1, 0, 1, 0],
  14: [1, 0, 1, 0, 2, 0],
  15: [1, 0, 1, 0, 2, 0],
  16: [1, 0, 1, 0, 2, 0],
  17: [1, 0, 1, 0, 2, 0],
  18: [1, 0, 2, 0, 2, 0],
  19: [1, 0, 2, 0, 2, 0],
  20: [1, 0, 2, 0, 2, 0],
  21: [1, 0, 2, 0, 2, 0],
  22: [2, 0, 2, 0, 2, 0],
  23: [2, 0, 2, 0, 2, 0],
  24: [2, 0, 2, 0, 2, 0],
  25: [2, 0, 2, 0, 2, 0],
  26: [2, 0, 2, 1, 2, 0],
  27: [2, 0, 2, 1, 2, 0],
  28: [2, 0, 2, 1, 2, 0],
  29: [2, 0, 2, 1, 2, 0],
  30: [2, 0, 3, 1, 2, 0],
  31: [2, 0, 3, 1, 2, 0],
  32: [2, 0, 3, 1, 2, 0],
  33: [2, 1, 3, 1, 2, 0],
  34: [2, 1, 3, 1, 2, 0],
  35: [2, 1, 3, 1, 2, 0],
  36: [2, 1, 3, 1, 2, 1],
  37: [2, 1, 3, 1, 2, 1],
  38: [2, 1, 3, 1, 3, 1],
  39: [2, 1, 3, 1, 3, 1],
  40: [3, 1, 3, 1, 3, 1],
  41: [3, 1, 3, 1, 3, 1],
  42: [3, 1, 3, 1, 4, 1],
  43: [3, 1, 3, 1, 4, 1],
  44: [4, 1, 3, 1, 4, 1],
  45: [4, 1, 3, 1, 4, 1],
  46: [4, 1, 3, 1, 4, 2],
  47: [4, 1, 4, 1, 4, 2],
  48: [4, 1, 4, 1, 4, 2],
  49: [5, 1, 4, 1, 4, 2],
  50: [5, 1, 4, 1, 5, 2],
  51: [5, 1, 4, 1, 5, 2],
  52: [5, 1, 4, 1, 5, 2],
  53: [5, 1, 4, 1, 5, 2],
  54: [5, 1, 4, 1, 5, 2],
  55: [5, 1, 4, 1, 5, 2],
  56: [5, 1, 4, 1, 5, 2],
  57: [5, 1, 4, 1, 5, 2],
  58: [5, 1, 4, 1, 5, 2],
  59: [5, 1, 4, 1, 5, 2],
  60: [5, 1, 4, 1, 5, 2],
  61: [5, 1, 4, 1, 5, 2],
  62: [5, 1, 4, 1, 5, 2],
  63: [5, 1, 4, 1, 5, 2],
  64: [5, 1, 4, 1, 5, 2],
  65: [5, 1, 4, 1, 5, 2],
  66: [5, 1, 4, 1, 5, 2],
  67: [5, 1, 4, 1, 5, 2],
  68: [5, 1, 4, 1, 5, 2],
  69: [5, 1, 4, 1, 5, 2],
  70: [5, 1, 4, 1, 5, 2],
};

export class Merchant extends CharacterBase {
  protected override CLASS_NAME = ClassName.Merchant;
  protected override JobBonusTable = jobBonusTableHi;

  protected override initialStatusPoint = 40;
  protected readonly classNames = [ClassName.Merchant];

  protected readonly _atkSkillList: AtkSkillModel[] = [];

  protected readonly _activeSkillList: ActiveSkillModel[] = [
    {
      label: 'Crazy Uproar',
      name: 'Crazy Uproar',
      inputType: 'selectButton',
      isMasteryAtk: true,
      dropdown: [
        { label: 'Yes', value: 1, skillLv: 1, isUse: true, bonus: { str: 4, atk: 30 } },
        { label: 'No', value: 0, isUse: false },
      ],
    },
  ];

  protected readonly _passiveSkillList: PassiveSkillModel[] = [
    {
      label: 'Mammonite',
      name: 'Mammonite',
      inputType: 'dropdown',
      dropdown: [
        { label: '-', value: 0, isUse: false },
        { label: 'Lv 1', value: 1, skillLv: 1, isUse: true },
        { label: 'Lv 2', value: 2, skillLv: 2, isUse: true },
        { label: 'Lv 3', value: 3, skillLv: 3, isUse: true },
        { label: 'Lv 4', value: 4, skillLv: 4, isUse: true },
        { label: 'Lv 5', value: 5, skillLv: 5, isUse: true },
        { label: 'Lv 6', value: 6, skillLv: 6, isUse: true },
        { label: 'Lv 7', value: 7, skillLv: 7, isUse: true },
        { label: 'Lv 8', value: 8, skillLv: 8, isUse: true },
        { label: 'Lv 9', value: 9, skillLv: 9, isUse: true },
        { label: 'Lv 10', value: 10, skillLv: 10, isUse: true },
      ],
    },
  ];
}
