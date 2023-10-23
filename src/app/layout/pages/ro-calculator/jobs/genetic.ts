import { ClassName } from './_class-name';
import { ActiveSkillModel, AtkSkillModel, CharacterBase, PassiveSkillModel } from './_character-base.abstract';

const jobBonusTable: Record<number, [number, number, number, number, number, number]> = {
  1: [0, 0, 0, 1, 0, 0],
  2: [0, 0, 0, 2, 0, 0],
  3: [0, 0, 0, 2, 1, 0],
  4: [0, 0, 0, 2, 1, 0],
  5: [0, 0, 0, 2, 1, 0],
  6: [0, 0, 0, 2, 2, 0],
  7: [0, 0, 0, 3, 2, 0],
  8: [0, 1, 0, 3, 2, 0],
  9: [0, 1, 0, 3, 2, 0],
  10: [0, 1, 0, 3, 2, 0],
  11: [0, 1, 0, 3, 2, 0],
  12: [0, 1, 0, 4, 2, 0],
  13: [0, 1, 0, 4, 3, 0],
  14: [0, 1, 0, 4, 3, 0],
  15: [0, 1, 1, 4, 3, 0],
  16: [0, 1, 1, 4, 3, 0],
  17: [0, 1, 1, 4, 3, 0],
  18: [0, 1, 2, 4, 3, 0],
  19: [0, 1, 2, 4, 4, 0],
  20: [0, 2, 2, 4, 4, 0],
  21: [0, 2, 2, 4, 4, 0],
  22: [0, 2, 2, 4, 4, 0],
  23: [0, 2, 2, 5, 4, 0],
  24: [0, 2, 3, 5, 4, 0],
  25: [0, 2, 4, 5, 4, 0],
  26: [0, 2, 4, 5, 4, 0],
  27: [0, 2, 4, 5, 4, 0],
  28: [0, 2, 4, 5, 5, 0],
  29: [0, 3, 4, 5, 5, 0],
  30: [0, 3, 4, 5, 5, 0],
  31: [0, 3, 4, 5, 5, 1],
  32: [0, 3, 4, 5, 5, 1],
  33: [0, 3, 4, 5, 5, 1],
  34: [1, 3, 4, 5, 5, 1],
  35: [1, 3, 4, 6, 5, 1],
  36: [1, 3, 4, 7, 5, 1],
  37: [1, 3, 4, 7, 5, 1],
  38: [1, 3, 4, 7, 5, 1],
  39: [1, 3, 4, 7, 6, 1],
  40: [1, 4, 4, 7, 6, 1],
  41: [1, 4, 4, 8, 6, 1],
  42: [1, 4, 4, 8, 6, 1],
  43: [1, 4, 4, 8, 6, 1],
  44: [1, 4, 4, 9, 6, 1],
  45: [1, 4, 4, 10, 6, 1],
  46: [1, 4, 4, 10, 6, 1],
  47: [1, 5, 4, 10, 6, 1],
  48: [1, 5, 4, 10, 6, 1],
  49: [1, 5, 4, 10, 6, 1],
  50: [1, 5, 4, 11, 6, 1],
  51: [2, 5, 4, 11, 6, 1],
  52: [2, 5, 5, 11, 6, 1],
  53: [2, 5, 5, 11, 7, 1],
  54: [2, 5, 5, 11, 7, 1],
  55: [2, 6, 5, 11, 7, 1],
  56: [3, 6, 5, 11, 7, 1],
  57: [3, 6, 6, 11, 7, 1],
  58: [3, 6, 6, 11, 7, 2],
  59: [3, 6, 6, 11, 8, 2],
  60: [3, 6, 6, 12, 8, 2],
  61: [3, 6, 6, 12, 8, 2],
  62: [3, 6, 6, 12, 8, 2],
  63: [3, 6, 6, 12, 8, 2],
  64: [3, 6, 6, 12, 8, 2],
  65: [4, 6, 7, 12, 8, 3],
};

export class Genetic extends CharacterBase {
  protected readonly CLASS_NAME = ClassName.Genetic;
  protected readonly JobBonusTable = jobBonusTable;

  protected readonly initialStatusPoint = 40;
  protected readonly classNames = ['Genetic'];
  protected readonly _atkSkillList: AtkSkillModel[] = [];
  protected readonly _activeSkillList: ActiveSkillModel[] = [];
  protected readonly _passiveSkillList: PassiveSkillModel[] = [];
}
