import { ClassName } from './_class-name';
import { ActiveSkillModel, AtkSkillModel, CharacterBase, PassiveSkillModel } from './_character-base.abstract';

const jobBonusTable: Record<number, [number, number, number, number, number, number]> = {
  1: [0, 0, 0, 1, 0, 0],
  2: [0, 0, 0, 1, 0, 0],
  3: [0, 0, 1, 1, 0, 0],
  4: [0, 0, 1, 1, 0, 0],
  5: [0, 0, 1, 1, 1, 0],
  6: [0, 0, 1, 1, 1, 0],
  7: [0, 0, 1, 2, 1, 0],
  8: [0, 0, 1, 3, 1, 0],
  9: [0, 0, 1, 3, 1, 0],
  10: [0, 0, 2, 3, 1, 0],
  11: [0, 0, 3, 3, 1, 0],
  12: [0, 0, 3, 3, 1, 0],
  13: [0, 0, 3, 3, 1, 0],
  14: [0, 0, 3, 3, 2, 0],
  15: [0, 0, 3, 3, 3, 0],
  16: [0, 0, 3, 3, 3, 0],
  17: [0, 0, 3, 3, 3, 0],
  18: [1, 0, 3, 3, 3, 0],
  19: [2, 0, 3, 3, 3, 0],
  20: [2, 0, 3, 3, 3, 0],
  21: [2, 0, 3, 3, 3, 0],
  22: [2, 0, 3, 4, 3, 0],
  23: [2, 0, 3, 4, 3, 0],
  24: [3, 0, 3, 4, 3, 0],
  25: [3, 0, 3, 4, 3, 0],
  26: [3, 1, 3, 4, 3, 0],
  27: [3, 2, 3, 4, 3, 0],
  28: [4, 2, 3, 4, 3, 0],
  29: [4, 2, 3, 4, 3, 0],
  30: [4, 2, 3, 4, 3, 0],
  31: [4, 2, 3, 4, 3, 0],
  32: [4, 2, 3, 5, 3, 0],
  33: [4, 2, 3, 5, 3, 0],
  34: [4, 2, 4, 5, 3, 0],
  35: [4, 2, 4, 5, 3, 0],
  36: [4, 2, 4, 5, 4, 0],
  37: [4, 2, 4, 5, 4, 0],
  38: [4, 3, 4, 5, 4, 0],
  39: [4, 4, 4, 5, 4, 0],
  40: [4, 4, 4, 6, 4, 0],
  41: [4, 4, 4, 7, 4, 0],
  42: [4, 4, 4, 7, 4, 0],
  43: [4, 4, 4, 7, 4, 0],
  44: [4, 4, 4, 7, 5, 0],
  45: [4, 4, 5, 7, 5, 0],
  46: [5, 4, 5, 7, 5, 0],
  47: [5, 4, 5, 7, 5, 0],
  48: [5, 4, 5, 7, 5, 0],
  49: [5, 4, 5, 8, 5, 0],
  50: [5, 4, 5, 8, 6, 0],
  51: [5, 5, 5, 8, 6, 0],
  52: [5, 5, 6, 8, 6, 0],
  53: [6, 5, 6, 8, 6, 0],
  54: [6, 5, 6, 8, 6, 1],
  55: [6, 5, 6, 8, 6, 1],
  56: [6, 5, 6, 8, 7, 1],
  57: [6, 5, 7, 8, 7, 1],
  58: [7, 5, 7, 8, 7, 1],
  59: [7, 5, 7, 9, 7, 1],
  60: [7, 5, 7, 9, 8, 1],
  61: [7, 5, 7, 9, 8, 1],
  62: [7, 5, 7, 9, 8, 1],
  63: [7, 5, 7, 9, 8, 1],
  64: [7, 5, 7, 9, 8, 1],
  65: [7, 6, 7, 9, 9, 2],
};

export class Minstrel extends CharacterBase {
  protected readonly CLASS_NAME = ClassName.Minstrel;
  protected readonly JobBonusTable = jobBonusTable;

  protected readonly initialStatusPoint = 40;
  protected readonly classNames = ['Thief'];
  protected readonly _atkSkillList: AtkSkillModel[] = [];
  protected readonly _activeSkillList: ActiveSkillModel[] = [];
  protected readonly _passiveSkillList: PassiveSkillModel[] = [];
}
