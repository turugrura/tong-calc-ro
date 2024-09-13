import { ClassName } from './_class-name';
import { ActiveSkillModel, AtkSkillFormulaInput, AtkSkillModel, PassiveSkillModel } from './_character-base.abstract';
import { Ranger } from './ranger';

const jobBonusTable: Record<number, [number, number, number, number, number, number]> = {
  1: [0, 0, 0, 0, 1, 0],
  2: [0, 0, 1, 0, 1, 0],
  3: [0, 1, 1, 0, 1, 0],
  4: [0, 1, 1, 1, 1, 0],
  5: [0, 2, 1, 1, 1, 0],
  6: [0, 2, 2, 1, 1, 0],
  7: [0, 2, 2, 1, 1, 0],
  8: [0, 2, 2, 1, 2, 0],
  9: [0, 2, 3, 1, 2, 0],
  10: [0, 3, 3, 1, 2, 0],
  11: [0, 3, 4, 1, 2, 0],
  12: [0, 4, 4, 1, 2, 0],
  13: [0, 5, 4, 1, 2, 0],
  14: [0, 5, 4, 1, 2, 1],
  15: [0, 5, 4, 1, 3, 1],
  16: [0, 5, 4, 2, 3, 1],
  17: [0, 5, 4, 2, 3, 1],
  18: [0, 5, 4, 2, 3, 2],
  19: [0, 6, 4, 2, 3, 2],
  20: [0, 6, 5, 2, 3, 2],
  21: [0, 6, 5, 3, 3, 2],
  22: [0, 6, 5, 3, 4, 2],
  23: [1, 6, 5, 3, 4, 2],
  24: [1, 6, 5, 3, 4, 2],
  25: [1, 6, 6, 3, 4, 2],
  26: [1, 7, 6, 4, 4, 2],
  27: [1, 7, 6, 4, 4, 3],
  28: [1, 7, 6, 4, 4, 3],
  29: [1, 7, 6, 4, 5, 3],
  30: [1, 7, 6, 4, 5, 3],
  31: [1, 7, 6, 4, 5, 4],
  32: [1, 7, 6, 4, 5, 4],
  33: [1, 8, 6, 4, 5, 4],
  34: [1, 8, 6, 5, 5, 4],
  35: [1, 8, 7, 5, 5, 4],
  36: [1, 8, 7, 5, 6, 4],
  37: [1, 8, 7, 6, 6, 4],
  38: [1, 9, 7, 7, 6, 4],
  39: [1, 10, 7, 7, 6, 4],
  40: [1, 10, 7, 7, 6, 4],
  41: [1, 11, 7, 7, 6, 4],
  42: [1, 11, 7, 7, 6, 4],
  43: [1, 11, 7, 7, 7, 4],
  44: [1, 11, 7, 7, 7, 4],
  45: [2, 11, 7, 8, 7, 4],
  46: [2, 11, 7, 8, 7, 4],
  47: [2, 12, 7, 8, 7, 4],
  48: [2, 12, 7, 9, 7, 4],
  49: [2, 12, 8, 9, 7, 4],
  50: [2, 12, 8, 9, 8, 4],
  51: [2, 12, 8, 9, 8, 4],
  52: [2, 12, 8, 9, 8, 4],
  53: [2, 12, 8, 9, 8, 4],
  54: [2, 12, 8, 9, 8, 4],
  55: [2, 12, 8, 9, 8, 4],
};

const traitBonusTable: Record<number, [number, number, number, number, number, number]> = {
  1: [0, 0, 0, 0, 0, 0],
  2: [0, 0, 0, 0, 0, 0],
  3: [0, 0, 0, 0, 1, 0],
  4: [0, 0, 0, 0, 1, 0],
  5: [1, 0, 0, 0, 1, 0],
  6: [1, 0, 0, 0, 1, 0],
  7: [1, 0, 0, 0, 2, 0],
  8: [1, 0, 0, 1, 2, 0],
  9: [1, 0, 1, 1, 2, 0],
  10: [1, 0, 1, 1, 2, 0],
  11: [1, 0, 1, 1, 3, 0],
  12: [1, 0, 1, 1, 3, 0],
  13: [2, 0, 1, 1, 3, 0],
  14: [2, 0, 1, 1, 4, 0],
  15: [2, 0, 1, 2, 4, 0],
  16: [2, 1, 1, 2, 4, 0],
  17: [2, 1, 1, 2, 4, 1],
  18: [2, 1, 1, 2, 5, 1],
  19: [2, 1, 1, 2, 5, 1],
  20: [2, 1, 1, 2, 5, 1],
  21: [2, 1, 2, 2, 5, 1],
  22: [2, 1, 2, 2, 5, 1],
  23: [2, 2, 2, 2, 5, 1],
  24: [3, 2, 2, 2, 5, 1],
  25: [3, 2, 2, 2, 5, 1],
  26: [3, 2, 2, 2, 5, 1],
  27: [3, 2, 2, 2, 5, 1],
  28: [3, 2, 2, 2, 6, 1],
  29: [3, 2, 2, 2, 7, 1],
  30: [3, 3, 2, 2, 7, 1],
  31: [3, 3, 2, 2, 7, 2],
  32: [3, 3, 2, 3, 7, 2],
  33: [3, 3, 3, 3, 7, 2],
  34: [4, 3, 3, 3, 7, 2],
  35: [4, 3, 3, 3, 7, 2],
  36: [4, 3, 4, 3, 7, 2],
  37: [4, 3, 4, 3, 7, 2],
  38: [4, 3, 4, 3, 7, 2],
  39: [4, 3, 4, 3, 7, 2],
  40: [5, 3, 4, 3, 7, 3],
  41: [5, 3, 4, 4, 7, 3],
  42: [6, 4, 4, 4, 7, 3],
  43: [6, 4, 4, 4, 7, 3],
  44: [6, 4, 5, 4, 8, 3],
  45: [6, 4, 5, 4, 8, 3],
  46: [6, 4, 5, 4, 8, 4],
  47: [7, 4, 5, 4, 8, 4],
  48: [7, 4, 5, 4, 8, 4],
  49: [7, 4, 5, 4, 8, 4],
  50: [7, 4, 5, 4, 9, 4],
  51: [7, 4, 5, 4, 10, 4],
  52: [8, 4, 5, 4, 11, 4],
  53: [8, 5, 5, 4, 11, 4],
  54: [8, 5, 5, 4, 11, 4],
  55: [9, 5, 5, 4, 11, 4],
};

export class Windhawk extends Ranger {
  protected override CLASS_NAME = ClassName.Windhawk;
  protected override JobBonusTable = jobBonusTable;
  protected override TraitBonusTable = traitBonusTable;

  protected override minMaxLevel: [number, number] = [200, 260];
  protected override maxJob = 50;

  // protected readonly initialStatusPoint = 100;
  protected classNames4 = [ClassName.Only_4th, ClassName.Windhawk];
  protected atkSkillList4: AtkSkillModel[] = [
    {
      name: 'Crescive Bolt',
      label: '[V2] Crescive Bolt Lv10',
      value: 'Crescive Bolt==10',
      acd: 0.5,
      fct: 1,
      vct: 1,
      cd: 0.15,
      maxStack: 3,
      canCri: true,
      criDmgPercentage: 1,
      baseCriPercentage: 1,
      formula: (input: AtkSkillFormulaInput): number => {
        const { model, skillLevel, status, stack } = input;
        const baseLevel = model.level;
        const totalStack = stack;

        return (skillLevel * 300 + status.totalCon * 10) * (baseLevel / 100) * (1 + 0.1 * totalStack);
      },
    },
    {
      name: 'Gale Storm',
      label: '[V2] Gale Storm Lv10',
      value: 'Gale Storm==10',
      acd: 0.15,
      fct: 0.5,
      vct: 1,
      cd: 2,
      hit: 5,
      formula: (input: AtkSkillFormulaInput): number => {
        const { model, skillLevel, status } = input;
        const baseLevel = model.level;

        return (skillLevel * 250 + status.totalCon * 5) * (baseLevel / 100);
      },
    },
  ];
  protected activeSkillList4: ActiveSkillModel[] = [];
  protected passiveSkillList4: PassiveSkillModel[] = [];

  constructor() {
    super();

    // this._atkSkillList.push(...this.this_atkSkillList);
    // this._activeSkillList.push(...this._activeSkillList);
    // this._passiveSkillList.push(...this._passiveSkillList);
    // this.classNames = [...this.this_classNames, ...this.classNames];
    this.inheritSkills({
      activeSkillList: this.activeSkillList4,
      atkSkillList: this.atkSkillList4,
      passiveSkillList: this.passiveSkillList4,
      classNames: this.classNames4,
    });
  }
}
