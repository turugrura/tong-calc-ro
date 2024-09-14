import { ClassName } from './_class-name';
import { ActiveSkillModel, AtkSkillModel, PassiveSkillModel } from './_character-base.abstract';
import { Archer } from './Archer';

const jobBonusTable: Record<number, [number, number, number, number, number, number]> = {
  1: [0, 1, 0, 0, 0, 0],
  2: [0, 1, 0, 0, 1, 0],
  3: [0, 1, 0, 0, 1, 0],
  4: [0, 2, 0, 0, 1, 0],
  5: [1, 2, 0, 0, 1, 0],
  6: [1, 2, 0, 0, 1, 0],
  7: [1, 2, 0, 0, 2, 0],
  8: [1, 2, 0, 1, 2, 0],
  9: [1, 3, 0, 1, 2, 0],
  10: [2, 3, 0, 1, 2, 0],
  11: [2, 3, 0, 1, 2, 1],
  12: [2, 3, 0, 1, 2, 1],
  13: [2, 4, 0, 1, 2, 1],
  14: [2, 4, 0, 1, 2, 1],
  15: [2, 4, 0, 1, 3, 1],
  16: [2, 4, 1, 1, 3, 1],
  17: [2, 4, 1, 1, 3, 1],
  18: [2, 4, 1, 1, 3, 2],
  19: [3, 4, 1, 1, 3, 2],
  20: [3, 4, 1, 1, 3, 2],
  21: [3, 4, 1, 2, 3, 2],
  22: [3, 4, 1, 2, 3, 2],
  23: [3, 4, 1, 2, 4, 2],
  24: [3, 5, 1, 2, 4, 2],
  25: [3, 5, 1, 2, 4, 2],
  26: [3, 5, 1, 2, 4, 3],
  27: [3, 5, 1, 2, 4, 3],
  28: [3, 5, 1, 3, 4, 3],
  29: [3, 5, 1, 3, 4, 3],
  30: [3, 5, 1, 3, 5, 3],
  31: [3, 5, 1, 3, 5, 3],
  32: [3, 6, 1, 3, 5, 3],
  33: [4, 6, 1, 3, 5, 3],
  34: [4, 6, 1, 3, 5, 3],
  35: [4, 6, 1, 3, 5, 3],
  36: [4, 7, 1, 3, 5, 3],
  37: [4, 7, 1, 3, 5, 3],
  38: [4, 7, 1, 3, 5, 3],
  39: [4, 7, 1, 3, 6, 3],
  40: [4, 7, 1, 3, 7, 3],
  41: [4, 7, 1, 4, 7, 3],
  42: [4, 7, 1, 4, 7, 3],
  43: [4, 7, 1, 4, 8, 3],
  44: [4, 7, 1, 4, 8, 3],
  45: [5, 7, 1, 4, 8, 3],
  46: [5, 7, 1, 4, 8, 3],
  47: [5, 7, 1, 4, 8, 4],
  48: [5, 7, 1, 4, 8, 4],
  49: [5, 8, 1, 4, 8, 4],
  50: [5, 8, 1, 4, 9, 4],
  51: [5, 8, 1, 4, 9, 4],
  52: [5, 8, 1, 4, 9, 4],
  53: [5, 9, 1, 4, 9, 4],
  54: [6, 9, 1, 4, 9, 4],
  55: [6, 9, 1, 4, 9, 4],
  56: [6, 9, 1, 4, 10, 4],
  57: [6, 9, 1, 4, 11, 4],
  58: [6, 10, 1, 4, 11, 4],
  59: [6, 10, 2, 4, 11, 4],
  60: [6, 10, 2, 4, 11, 4],
  61: [6, 10, 2, 4, 12, 4],
  62: [7, 10, 2, 4, 12, 4],
  63: [7, 10, 2, 4, 13, 4],
  64: [7, 10, 2, 4, 13, 4],
  65: [7, 11, 2, 4, 13, 4],
  66: [7, 11, 2, 4, 14, 4],
  67: [7, 11, 2, 4, 14, 4],
  68: [7, 12, 2, 4, 14, 4],
  69: [7, 12, 2, 5, 14, 4],
  70: [8, 12, 2, 5, 14, 4],
};

export class Bard extends Archer {
  protected override CLASS_NAME = ClassName.Bard;
  protected override JobBonusTable = jobBonusTable;
  protected override initialStatusPoint = 100;

  protected readonly classNamesHi = [ClassName.Bard, ClassName.HiClass, ClassName.Clown];
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
