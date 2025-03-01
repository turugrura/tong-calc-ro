import { ClassName } from './_class-name';
import { ActiveSkillModel, AtkSkillModel, PassiveSkillModel } from './_character-base.abstract';
import { Thief } from './Thief';

const jobBonusTable: Record<number, [number, number, number, number, number, number]> = {
  1: [1, 0, 0, 0, 0, 0],
  2: [1, 1, 0, 0, 0, 0],
  3: [1, 1, 0, 0, 0, 0],
  4: [1, 1, 0, 0, 0, 1],
  5: [1, 1, 0, 1, 0, 1],
  6: [1, 1, 1, 1, 0, 1],
  7: [1, 1, 1, 1, 0, 1],
  8: [1, 1, 1, 1, 0, 1],
  9: [1, 2, 1, 1, 0, 1],
  10: [1, 2, 1, 1, 1, 1],
  11: [2, 2, 1, 1, 1, 1],
  12: [2, 3, 1, 1, 1, 1],
  13: [2, 3, 1, 1, 1, 1],
  14: [2, 3, 1, 1, 1, 1],
  15: [2, 3, 2, 1, 1, 1],
  16: [2, 3, 2, 1, 2, 1],
  17: [2, 3, 2, 1, 3, 1],
  18: [2, 3, 2, 1, 3, 1],
  19: [2, 3, 2, 1, 3, 1],
  20: [2, 3, 2, 1, 3, 2],
  21: [2, 4, 2, 1, 3, 2],
  22: [3, 4, 2, 1, 3, 2],
  23: [3, 4, 2, 1, 3, 2],
  24: [3, 4, 2, 1, 3, 3],
  25: [3, 4, 2, 1, 3, 3],
  26: [3, 4, 2, 1, 4, 3],
  27: [3, 5, 2, 1, 4, 3],
  28: [3, 5, 2, 1, 4, 3],
  29: [3, 5, 2, 1, 5, 3],
  30: [3, 5, 2, 1, 5, 3],
  31: [3, 5, 2, 1, 5, 4],
  32: [4, 5, 2, 1, 5, 4],
  33: [4, 5, 2, 1, 5, 4],
  34: [4, 6, 2, 1, 5, 4],
  35: [4, 6, 2, 1, 5, 4],
  36: [4, 6, 2, 1, 5, 4],
  37: [4, 6, 2, 1, 6, 4],
  38: [4, 6, 2, 1, 7, 4],
  39: [4, 6, 2, 1, 7, 4],
  40: [4, 6, 2, 1, 7, 4],
  41: [4, 7, 2, 1, 7, 4],
  42: [4, 7, 3, 1, 7, 4],
  43: [5, 7, 3, 1, 7, 4],
  44: [5, 7, 3, 2, 7, 4],
  45: [5, 8, 3, 2, 7, 4],
  46: [5, 8, 3, 2, 7, 4],
  47: [6, 8, 3, 2, 7, 4],
  48: [6, 8, 3, 2, 7, 4],
  49: [6, 8, 3, 2, 8, 4],
  50: [6, 8, 3, 2, 8, 5],
  51: [6, 8, 3, 2, 8, 5],
  52: [6, 8, 3, 2, 9, 5],
  53: [7, 8, 3, 2, 9, 5],
  54: [7, 8, 3, 2, 9, 5],
  55: [7, 8, 3, 2, 9, 5],
  56: [7, 8, 3, 2, 10, 5],
  57: [7, 8, 3, 3, 10, 5],
  58: [7, 9, 3, 3, 10, 5],
  59: [7, 9, 3, 3, 10, 6],
  60: [7, 9, 3, 3, 11, 6],
  61: [7, 9, 3, 3, 11, 6],
  62: [8, 9, 3, 3, 11, 6],
  63: [8, 9, 4, 3, 11, 6],
  64: [8, 10, 4, 3, 11, 6],
  65: [8, 10, 4, 3, 11, 6],
  66: [8, 10, 4, 3, 12, 6],
  67: [9, 10, 4, 3, 12, 6],
  68: [9, 10, 4, 3, 12, 6],
  69: [9, 10, 4, 3, 12, 6],
  70: [9, 11, 4, 3, 12, 6],
};

export class Stalker extends Thief {
  protected override CLASS_NAME = ClassName.Stalker;
  protected override JobBonusTable = jobBonusTable;
  protected override initialStatusPoint = 100;

  protected readonly classNamesHi = [ClassName.Rogue, ClassName.HiClass, ClassName.Stalker];
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
