import { ClassName } from './_class-name';
import { ActiveSkillModel, AtkSkillModel, CharacterBase, PassiveSkillModel } from './_character-base.abstract';

const jobBonusTable: Record<number, [number, number, number, number, number, number]> = {
  1: [1, 0, 0, 0, 0, 0],
  2: [1, 0, 0, 0, 1, 0],
  3: [1, 0, 0, 0, 1, 0],
  4: [1, 0, 0, 0, 1, 0],
  5: [1, 1, 0, 0, 1, 0],
  6: [1, 1, 0, 0, 1, 0],
  7: [1, 1, 0, 1, 1, 0],
  8: [2, 1, 0, 1, 1, 0],
  9: [2, 1, 0, 1, 1, 1],
  10: [2, 1, 0, 1, 1, 1],
  11: [2, 1, 0, 1, 2, 1],
  12: [3, 1, 0, 1, 2, 1],
  13: [3, 2, 0, 1, 2, 1],
  14: [3, 2, 0, 1, 2, 1],
  15: [3, 2, 0, 2, 2, 1],
  16: [3, 2, 0, 2, 2, 2],
  17: [3, 2, 1, 2, 2, 2],
  18: [3, 2, 1, 2, 2, 2],
  19: [4, 2, 1, 2, 2, 2],
  20: [4, 2, 1, 2, 3, 2],
  21: [4, 3, 1, 2, 3, 2],
  22: [4, 3, 1, 2, 3, 2],
  23: [5, 3, 1, 2, 3, 2],
  24: [5, 3, 2, 2, 3, 2],
  25: [5, 3, 2, 3, 3, 2],
  26: [5, 3, 2, 3, 3, 2],
  27: [5, 3, 2, 3, 4, 2],
  28: [5, 3, 2, 3, 4, 2],
  29: [5, 4, 2, 3, 4, 2],
  30: [5, 4, 2, 3, 5, 2],
  31: [6, 4, 2, 3, 5, 2],
  32: [6, 4, 2, 3, 5, 2],
  33: [6, 4, 2, 3, 5, 2],
  34: [6, 4, 2, 3, 6, 2],
  35: [6, 5, 2, 3, 6, 2],
  36: [6, 5, 2, 3, 6, 3],
  37: [6, 5, 3, 3, 6, 3],
  38: [6, 5, 3, 3, 7, 3],
  39: [7, 5, 3, 3, 7, 3],
  40: [7, 5, 3, 3, 7, 3],
  41: [7, 6, 3, 3, 7, 3],
  42: [7, 6, 4, 3, 7, 3],
  43: [8, 6, 4, 3, 7, 3],
  44: [8, 6, 4, 3, 7, 3],
  45: [8, 6, 4, 3, 8, 3],
  46: [8, 6, 4, 3, 8, 3],
  47: [8, 7, 4, 3, 8, 3],
  48: [9, 7, 4, 3, 8, 3],
  49: [9, 7, 4, 3, 8, 3],
  50: [9, 7, 4, 3, 9, 3],
  51: [9, 7, 4, 3, 9, 3],
  52: [9, 7, 4, 3, 9, 3],
  53: [9, 7, 4, 3, 9, 3],
  54: [9, 7, 4, 3, 9, 3],
  55: [9, 7, 4, 3, 9, 3],
  56: [10, 7, 4, 3, 9, 3],
  57: [10, 7, 4, 3, 9, 3],
  58: [10, 7, 4, 3, 9, 3],
  59: [10, 8, 4, 3, 9, 3],
  60: [10, 8, 4, 3, 9, 3],
  61: [10, 8, 4, 3, 9, 3],
  62: [10, 8, 4, 3, 9, 3],
  63: [10, 8, 4, 3, 9, 3],
  64: [10, 8, 4, 3, 9, 3],
  65: [10, 8, 4, 3, 9, 3],
};

export class StarEmperor extends CharacterBase {
  protected readonly CLASS_NAME = ClassName.StarEmperor;
  protected readonly JobBonusTable = jobBonusTable;

  protected readonly initialStatusPoint = 40;
  protected readonly classNames = ['Star Emperor', 'Star Emperor Cls', 'Star Emperor Class'];
  protected readonly _atkSkillList: AtkSkillModel[] = [];
  protected readonly _activeSkillList: ActiveSkillModel[] = [];
  protected readonly _passiveSkillList: PassiveSkillModel[] = [];
}
