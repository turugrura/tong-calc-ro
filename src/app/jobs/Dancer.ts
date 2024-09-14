import { ClassName } from './_class-name';
import { ActiveSkillModel, AtkSkillModel, PassiveSkillModel } from './_character-base.abstract';
import { Archer } from './Archer';

const jobBonusTable: Record<number, [number, number, number, number, number, number]> = {
  1: [0, 0, 0, 0, 1, 0],
  2: [1, 0, 0, 0, 1, 0],
  3: [1, 0, 0, 0, 1, 0],
  4: [1, 1, 0, 0, 1, 0],
  5: [1, 1, 0, 0, 1, 0],
  6: [2, 1, 0, 0, 1, 0],
  7: [2, 1, 0, 0, 1, 0],
  8: [2, 1, 0, 1, 1, 0],
  9: [2, 1, 0, 1, 2, 0],
  10: [2, 1, 0, 1, 2, 0],
  11: [2, 2, 0, 1, 2, 0],
  12: [2, 3, 0, 1, 2, 0],
  13: [2, 4, 0, 1, 2, 0],
  14: [2, 4, 0, 1, 3, 0],
  15: [2, 4, 0, 1, 4, 0],
  16: [2, 4, 0, 1, 4, 0],
  17: [2, 4, 1, 1, 4, 0],
  18: [2, 4, 1, 1, 5, 0],
  19: [2, 4, 1, 1, 5, 0],
  20: [3, 4, 1, 1, 5, 0],
  21: [3, 4, 1, 1, 5, 0],
  22: [3, 4, 1, 1, 6, 0],
  23: [3, 4, 1, 1, 7, 0],
  24: [3, 4, 1, 1, 7, 0],
  25: [3, 5, 1, 1, 7, 0],
  26: [3, 5, 1, 2, 7, 0],
  27: [3, 5, 1, 2, 7, 1],
  28: [3, 5, 1, 2, 8, 1],
  29: [3, 5, 1, 2, 8, 1],
  30: [3, 5, 1, 2, 8, 1],
  31: [3, 6, 1, 2, 8, 1],
  32: [3, 6, 1, 2, 8, 1],
  33: [3, 6, 1, 2, 9, 1],
  34: [3, 6, 1, 2, 9, 1],
  35: [4, 6, 1, 2, 9, 1],
  36: [4, 6, 1, 2, 9, 1],
  37: [4, 6, 1, 2, 9, 1],
  38: [4, 7, 1, 2, 9, 1],
  39: [4, 7, 1, 3, 9, 1],
  40: [4, 7, 1, 3, 9, 1],
  41: [4, 7, 1, 3, 10, 1],
  42: [4, 7, 1, 3, 10, 1],
  43: [4, 7, 1, 3, 11, 1],
  44: [4, 7, 1, 3, 11, 1],
  45: [4, 7, 1, 3, 12, 1],
  46: [4, 7, 1, 3, 12, 1],
  47: [4, 8, 1, 3, 12, 1],
  48: [4, 8, 1, 3, 12, 1],
  49: [4, 8, 1, 3, 13, 1],
  50: [5, 8, 1, 3, 13, 1],
  51: [5, 8, 1, 3, 13, 1],
  52: [5, 9, 1, 3, 13, 1],
  53: [5, 9, 1, 4, 13, 1],
  54: [5, 9, 2, 4, 13, 1],
  55: [5, 9, 2, 4, 13, 1],
  56: [5, 9, 2, 4, 13, 1],
  57: [5, 10, 2, 4, 13, 1],
  58: [5, 10, 2, 4, 14, 1],
  59: [5, 10, 2, 4, 14, 1],
  60: [5, 10, 2, 5, 14, 1],
  61: [5, 11, 2, 5, 14, 1],
  62: [5, 12, 2, 5, 14, 1],
  63: [5, 12, 2, 5, 14, 2],
  64: [5, 12, 2, 5, 14, 2],
  65: [5, 12, 2, 5, 15, 2],
  66: [6, 12, 2, 5, 15, 2],
  67: [6, 13, 2, 5, 15, 2],
  68: [6, 13, 2, 5, 15, 2],
  69: [6, 13, 2, 5, 16, 2],
  70: [6, 14, 2, 5, 16, 2],
};

export class Dancer extends Archer {
  protected override CLASS_NAME = ClassName.Dancer;
  protected override JobBonusTable = jobBonusTable;
  protected override initialStatusPoint = 100;

  protected readonly classNamesHi = [ClassName.Dancer, ClassName.HiClass, ClassName.Gypsy];
  protected readonly atkSkillListHi: AtkSkillModel[] = [];
  protected readonly activeSkillListHi: ActiveSkillModel[] = [];
  protected readonly passiveSkillListHi: PassiveSkillModel[] = [];

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
