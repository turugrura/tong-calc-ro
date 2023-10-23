import { ClassName } from './_class-name';
import { ActiveSkillModel, AtkSkillModel, CharacterBase, PassiveSkillModel } from './_character-base.abstract';

const jobBonusTable: Record<number, [number, number, number, number, number, number]> = {
  1: [0, 0, 0, 0, 1, 0],
  2: [0, 0, 0, 1, 1, 0],
  3: [0, 0, 0, 2, 1, 0],
  4: [0, 1, 0, 2, 1, 0],
  5: [0, 1, 0, 2, 1, 0],
  6: [0, 1, 0, 2, 1, 0],
  7: [0, 2, 0, 2, 1, 0],
  8: [0, 2, 0, 2, 2, 0],
  9: [0, 2, 0, 3, 2, 0],
  10: [0, 2, 0, 3, 2, 0],
  11: [0, 2, 0, 3, 2, 0],
  12: [0, 2, 1, 3, 2, 0],
  13: [0, 2, 2, 3, 2, 0],
  14: [0, 2, 3, 3, 2, 0],
  15: [0, 2, 3, 3, 2, 0],
  16: [0, 2, 3, 3, 2, 0],
  17: [0, 2, 3, 3, 3, 0],
  18: [0, 3, 3, 3, 3, 0],
  19: [0, 3, 3, 3, 3, 0],
  20: [0, 3, 3, 3, 3, 0],
  21: [0, 3, 3, 4, 3, 0],
  22: [0, 3, 4, 4, 3, 0],
  23: [0, 3, 4, 4, 4, 0],
  24: [0, 3, 4, 4, 4, 0],
  25: [0, 3, 4, 4, 4, 0],
  26: [1, 3, 4, 4, 4, 0],
  27: [2, 3, 4, 4, 4, 0],
  28: [2, 3, 4, 4, 4, 0],
  29: [2, 3, 4, 4, 4, 0],
  30: [2, 3, 4, 4, 5, 0],
  31: [2, 4, 4, 4, 5, 0],
  32: [2, 4, 5, 4, 5, 0],
  33: [2, 4, 5, 4, 5, 0],
  34: [2, 4, 5, 4, 5, 0],
  35: [2, 4, 5, 4, 5, 0],
  36: [2, 4, 5, 5, 5, 0],
  37: [2, 4, 5, 6, 5, 0],
  38: [2, 4, 5, 7, 5, 0],
  39: [2, 5, 5, 7, 5, 0],
  40: [2, 5, 5, 7, 5, 0],
  41: [2, 5, 5, 7, 5, 0],
  42: [2, 5, 5, 7, 5, 0],
  43: [2, 6, 5, 7, 5, 0],
  44: [2, 6, 5, 7, 6, 0],
  45: [2, 7, 5, 7, 6, 0],
  46: [2, 7, 5, 7, 6, 0],
  47: [2, 7, 5, 7, 6, 0],
  48: [2, 7, 5, 7, 6, 0],
  49: [2, 7, 5, 8, 6, 0],
  50: [2, 8, 5, 8, 6, 0],
  51: [3, 8, 5, 8, 6, 0],
  52: [3, 8, 6, 8, 6, 0],
  53: [3, 8, 6, 8, 7, 0],
  54: [3, 8, 6, 8, 7, 0],
  55: [3, 8, 6, 8, 7, 1],
  56: [3, 8, 6, 9, 7, 1],
  57: [3, 8, 6, 9, 7, 1],
  58: [3, 8, 7, 9, 7, 1],
  59: [3, 9, 7, 9, 7, 1],
  60: [3, 9, 7, 9, 8, 1],
  61: [3, 9, 7, 9, 8, 1],
  62: [3, 9, 7, 9, 8, 1],
  63: [3, 9, 7, 9, 8, 1],
  64: [3, 9, 7, 9, 8, 1],
  65: [5, 9, 7, 9, 8, 2],
};

export class Wanderer extends CharacterBase {
  protected readonly CLASS_NAME = ClassName.Wanderer;
  protected readonly JobBonusTable = jobBonusTable;

  protected readonly initialStatusPoint = 40;
  protected readonly classNames = ['Thief'];
  protected readonly _atkSkillList: AtkSkillModel[] = [];
  protected readonly _activeSkillList: ActiveSkillModel[] = [];
  protected readonly _passiveSkillList: PassiveSkillModel[] = [];
}
