import { ClassName } from './_class-name';
import { ActiveSkillModel, AtkSkillModel, PassiveSkillModel } from './_character-base.abstract';
import { Acolyte } from './Acolyte';

const jobBonusTable: Record<number, [number, number, number, number, number, number]> = {
  1: [1, 0, 0, 0, 0, 0],
  2: [1, 0, 0, 1, 0, 0],
  3: [1, 0, 1, 1, 0, 0],
  4: [1, 1, 1, 1, 0, 0],
  5: [1, 1, 1, 1, 0, 0],
  6: [1, 1, 1, 1, 1, 0],
  7: [1, 1, 1, 1, 1, 0],
  8: [1, 1, 1, 1, 1, 0],
  9: [2, 1, 1, 1, 1, 0],
  10: [2, 1, 1, 1, 1, 0],
  11: [2, 1, 1, 2, 1, 0],
  12: [2, 2, 1, 2, 1, 0],
  13: [2, 2, 1, 2, 1, 1],
  14: [2, 2, 1, 2, 1, 1],
  15: [2, 2, 2, 2, 1, 1],
  16: [2, 2, 2, 2, 2, 1],
  17: [3, 2, 2, 2, 2, 1],
  18: [3, 2, 2, 2, 2, 1],
  19: [3, 2, 2, 2, 2, 1],
  20: [3, 3, 2, 2, 2, 1],
  21: [3, 4, 2, 2, 2, 1],
  22: [3, 4, 2, 2, 3, 1],
  23: [3, 4, 2, 2, 3, 1],
  24: [3, 4, 3, 2, 3, 1],
  25: [3, 4, 3, 2, 3, 1],
  26: [3, 4, 3, 2, 3, 1],
  27: [4, 4, 3, 2, 3, 1],
  28: [4, 4, 3, 2, 3, 1],
  29: [4, 5, 3, 2, 3, 1],
  30: [4, 5, 3, 2, 4, 1],
  31: [4, 5, 3, 2, 4, 1],
  32: [4, 5, 3, 2, 4, 1],
  33: [4, 5, 3, 3, 4, 1],
  34: [4, 5, 3, 3, 4, 2],
  35: [4, 5, 3, 3, 4, 2],
  36: [4, 5, 3, 3, 4, 2],
  37: [5, 5, 3, 3, 4, 2],
  38: [5, 5, 3, 3, 5, 2],
  39: [5, 5, 4, 3, 5, 2],
  40: [5, 5, 4, 3, 5, 2],
  41: [5, 5, 4, 3, 5, 2],
  42: [5, 5, 5, 3, 5, 2],
  43: [5, 5, 5, 3, 5, 2],
  44: [5, 5, 5, 3, 6, 2],
  45: [5, 6, 5, 3, 6, 2],
  46: [5, 6, 5, 3, 6, 3],
  47: [5, 6, 5, 4, 6, 3],
  48: [6, 6, 5, 4, 6, 3],
  49: [6, 6, 5, 4, 6, 3],
  50: [6, 6, 5, 4, 7, 3],
  51: [6, 6, 5, 4, 7, 3],
  52: [6, 7, 5, 4, 7, 3],
  53: [6, 7, 5, 4, 8, 3],
  54: [6, 7, 5, 4, 8, 3],
  55: [6, 7, 5, 4, 8, 3],
  56: [6, 7, 5, 5, 8, 3],
  57: [6, 7, 5, 5, 8, 3],
  58: [6, 7, 6, 5, 8, 3],
  59: [7, 7, 6, 5, 8, 3],
  60: [7, 7, 6, 5, 9, 3],
  61: [7, 7, 6, 5, 9, 3],
  62: [7, 8, 6, 5, 9, 3],
  63: [7, 8, 6, 5, 9, 3],
  64: [7, 8, 6, 6, 9, 3],
  65: [8, 8, 6, 6, 9, 3],
  66: [9, 8, 6, 6, 9, 3],
  67: [9, 8, 6, 6, 10, 3],
  68: [9, 8, 7, 6, 10, 3],
  69: [9, 8, 7, 7, 10, 3],
  70: [9, 9, 7, 7, 10, 3],
};

export class Champion extends Acolyte {
  protected override CLASS_NAME = ClassName.Champion;
  protected override JobBonusTable = jobBonusTable;
  protected override initialStatusPoint = 100;

  protected readonly classNamesHi = [ClassName.Monk, ClassName.HiClass, ClassName.Champion];
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
