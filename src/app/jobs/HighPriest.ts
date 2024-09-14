import { ClassName } from './_class-name';
import { ActiveSkillModel, AtkSkillModel, PassiveSkillModel } from './_character-base.abstract';
import { Acolyte } from './Acolyte';

const jobBonusTable: Record<number, [number, number, number, number, number, number]> = {
  1: [0, 0, 0, 1, 0, 0],
  2: [0, 0, 0, 1, 0, 0],
  3: [0, 1, 0, 1, 0, 0],
  4: [0, 1, 1, 1, 0, 0],
  5: [1, 1, 1, 1, 0, 0],
  6: [1, 1, 1, 1, 0, 0],
  7: [1, 1, 1, 2, 0, 0],
  8: [1, 2, 1, 2, 0, 0],
  9: [1, 2, 1, 2, 0, 0],
  10: [1, 2, 1, 2, 0, 0],
  11: [1, 2, 1, 3, 0, 0],
  12: [2, 2, 1, 3, 0, 0],
  13: [2, 2, 1, 3, 1, 0],
  14: [2, 2, 1, 3, 1, 0],
  15: [2, 2, 1, 3, 1, 0],
  16: [2, 2, 1, 3, 2, 0],
  17: [2, 2, 1, 3, 2, 0],
  18: [2, 2, 1, 3, 2, 0],
  19: [2, 3, 1, 3, 2, 0],
  20: [2, 3, 1, 4, 2, 0],
  21: [3, 3, 1, 4, 2, 0],
  22: [3, 3, 2, 4, 2, 0],
  23: [3, 3, 2, 5, 2, 0],
  24: [3, 3, 2, 6, 2, 0],
  25: [3, 3, 2, 6, 2, 0],
  26: [3, 3, 2, 6, 3, 0],
  27: [3, 3, 2, 6, 3, 0],
  28: [3, 3, 2, 6, 4, 0],
  29: [3, 4, 2, 6, 4, 0],
  30: [3, 4, 3, 6, 4, 0],
  31: [4, 4, 3, 6, 4, 0],
  32: [4, 4, 3, 6, 4, 0],
  33: [4, 4, 3, 6, 4, 0],
  34: [4, 4, 3, 7, 4, 0],
  35: [4, 4, 3, 7, 4, 0],
  36: [4, 4, 3, 7, 4, 0],
  37: [4, 4, 3, 7, 5, 0],
  38: [5, 4, 3, 7, 5, 0],
  39: [5, 4, 3, 7, 5, 0],
  40: [5, 4, 3, 7, 5, 1],
  41: [5, 4, 3, 7, 5, 1],
  42: [5, 5, 3, 7, 5, 1],
  43: [5, 5, 3, 7, 6, 1],
  44: [5, 5, 3, 7, 6, 1],
  45: [6, 5, 3, 7, 6, 1],
  46: [6, 5, 3, 7, 7, 1],
  47: [6, 5, 3, 8, 7, 1],
  48: [6, 5, 3, 8, 7, 1],
  49: [6, 5, 3, 8, 7, 2],
  50: [6, 5, 4, 8, 7, 2],
  51: [6, 5, 5, 8, 7, 2],
  52: [6, 5, 5, 8, 7, 2],
  53: [6, 5, 5, 8, 7, 2],
  54: [6, 5, 5, 8, 7, 2],
  55: [6, 6, 5, 8, 7, 2],
  56: [6, 6, 5, 8, 8, 2],
  57: [6, 6, 5, 9, 8, 2],
  58: [6, 6, 6, 9, 8, 2],
  59: [6, 6, 6, 9, 8, 2],
  60: [7, 6, 6, 9, 8, 2],
  61: [7, 6, 6, 10, 8, 2],
  62: [7, 6, 6, 10, 9, 2],
  63: [7, 6, 6, 10, 9, 2],
  64: [7, 6, 6, 10, 9, 2],
  65: [7, 7, 6, 10, 9, 2],
  66: [7, 7, 6, 11, 9, 2],
  67: [7, 7, 7, 11, 9, 2],
  68: [7, 8, 7, 11, 9, 2],
  69: [7, 8, 7, 11, 9, 2],
  70: [7, 8, 7, 12, 9, 2],
};

export class HighPriest extends Acolyte {
  protected override CLASS_NAME = ClassName.HighPriest;
  protected override JobBonusTable = jobBonusTable;
  protected override initialStatusPoint = 100;

  protected readonly classNamesHi = [ClassName.HiClass, ClassName.Priest, ClassName.HighPriest];
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
