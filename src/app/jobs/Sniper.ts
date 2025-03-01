import { ClassName } from './_class-name';
import { ActiveSkillModel, AtkSkillFormulaInput, AtkSkillModel, PassiveSkillModel } from './_character-base.abstract';
import { BeastBaneFn } from '../constants/share-passive-skills';
import { Archer } from './Archer';

const jobBonusTable: Record<number, [number, number, number, number, number, number]> = {
  1: [0, 0, 0, 0, 1, 0],
  2: [0, 1, 0, 0, 1, 0],
  3: [0, 1, 0, 0, 2, 0],
  4: [0, 1, 0, 0, 3, 0],
  5: [0, 1, 0, 1, 3, 0],
  6: [0, 2, 0, 1, 3, 0],
  7: [0, 2, 0, 1, 3, 0],
  8: [1, 2, 0, 1, 3, 0],
  9: [1, 2, 0, 1, 3, 0],
  10: [1, 3, 0, 1, 3, 0],
  11: [1, 4, 0, 1, 3, 0],
  12: [1, 4, 1, 1, 3, 0],
  13: [1, 4, 1, 1, 3, 0],
  14: [1, 4, 1, 1, 3, 1],
  15: [1, 4, 1, 1, 3, 1],
  16: [1, 4, 1, 1, 4, 1],
  17: [1, 4, 1, 1, 5, 1],
  18: [1, 4, 1, 1, 5, 1],
  19: [1, 4, 1, 1, 5, 1],
  20: [1, 4, 1, 2, 5, 1],
  21: [1, 5, 1, 2, 5, 1],
  22: [1, 5, 1, 2, 6, 1],
  23: [1, 5, 1, 2, 6, 1],
  24: [2, 5, 1, 2, 6, 1],
  25: [2, 5, 1, 2, 6, 2],
  26: [2, 5, 1, 2, 7, 2],
  27: [2, 5, 1, 2, 7, 2],
  28: [2, 6, 1, 2, 7, 2],
  29: [2, 6, 1, 2, 7, 2],
  30: [2, 6, 1, 2, 8, 2],
  31: [2, 6, 1, 2, 8, 3],
  32: [2, 6, 2, 2, 8, 3],
  33: [2, 7, 2, 2, 8, 3],
  34: [2, 7, 2, 2, 8, 3],
  35: [2, 7, 2, 2, 9, 3],
  36: [2, 7, 2, 2, 9, 4],
  37: [2, 7, 2, 2, 9, 4],
  38: [2, 8, 2, 2, 9, 4],
  39: [2, 8, 2, 2, 9, 4],
  40: [2, 8, 2, 2, 10, 4],
  41: [2, 8, 2, 2, 10, 4],
  42: [2, 8, 2, 3, 10, 4],
  43: [2, 9, 2, 3, 10, 4],
  44: [2, 9, 2, 3, 10, 4],
  45: [3, 9, 2, 3, 10, 4],
  46: [3, 9, 2, 3, 11, 4],
  47: [3, 9, 2, 3, 11, 4],
  48: [3, 10, 2, 3, 11, 4],
  49: [3, 10, 2, 3, 11, 4],
  50: [3, 10, 2, 3, 11, 5],
  51: [3, 10, 2, 3, 12, 5],
  52: [3, 10, 2, 3, 12, 5],
  53: [3, 10, 2, 3, 12, 5],
  54: [3, 10, 2, 4, 12, 5],
  55: [3, 10, 3, 4, 12, 5],
  56: [3, 10, 3, 4, 12, 5],
  57: [3, 10, 3, 4, 12, 6],
  58: [3, 11, 3, 4, 12, 6],
  59: [3, 11, 3, 4, 12, 6],
  60: [3, 11, 3, 4, 13, 6],
  61: [4, 11, 3, 4, 13, 6],
  62: [4, 11, 3, 4, 13, 7],
  63: [4, 11, 3, 4, 13, 7],
  64: [4, 11, 3, 4, 13, 7],
  65: [4, 11, 3, 5, 13, 7],
  66: [4, 11, 3, 5, 13, 7],
  67: [4, 11, 3, 5, 13, 7],
  68: [4, 11, 3, 5, 13, 7],
  69: [4, 11, 3, 5, 14, 7],
  70: [4, 11, 3, 5, 14, 8],
};

export class Sniper extends Archer {
  protected override CLASS_NAME = ClassName.Sniper;
  protected override JobBonusTable = jobBonusTable;
  protected override initialStatusPoint = 100;

  private readonly classNamesHi = [ClassName.Hunter, ClassName.HiClass, ClassName.Sniper];
  private readonly atkSkillListHi: AtkSkillModel[] = [
    {
      name: 'Focused Arrow Strike',
      label: 'Focused Arrow Lv5',
      value: 'Focused Arrow Strike==5',
      values: ['[Improved] Focused Arrow Strike==5'],
      acd: 0.5,
      fct: 0.5,
      vct: 0.5,
      cd: 0.15,
      canCri: true,
      baseCri: 50,
      criDmgPercentage: 0.5,
      formula: (input: AtkSkillFormulaInput): number => {
        const { model, skillLevel } = input;
        const baseLevel = model.level;

        return (300 + skillLevel * 300) * (baseLevel / 100);
      },
    },
  ];
  private readonly activeSkillListHi: ActiveSkillModel[] = [
    {
      isEquipAtk: true,
      inputType: 'selectButton',
      label: 'Wind Walk 5',
      name: 'Wind Walk',
      dropdown: [
        { label: 'Yes', value: 5, skillLv: 5, isUse: true, bonus: { flee: 5 } },
        { label: 'No', value: 0, isUse: false },
      ],
    },
    {
      isEquipAtk: true,
      inputType: 'selectButton',
      label: 'Falcon Eyes 10',
      name: 'Falcon Eyes',
      dropdown: [
        { label: 'Yes', value: 10, skillLv: 10, isUse: true, bonus: { flatDmg: 20, hit: 30, cri: 10, allStatus: 5 } },
        { label: 'No', value: 0, isUse: false },
      ],
    },
  ];
  private passiveSkillListHi: PassiveSkillModel[] = [
    BeastBaneFn(),
    {
      label: 'Steel Crow',
      name: 'Steel Crow',
      inputType: 'dropdown',
      isMasteryAtk: true,
      dropdown: [
        { label: '-', value: 0, isUse: false },
        { label: 'Lv 1', value: 1, isUse: true, bonus: { falconDmg: 6 } },
        { label: 'Lv 2', value: 2, isUse: true, bonus: { falconDmg: 12 } },
        { label: 'Lv 3', value: 3, isUse: true, bonus: { falconDmg: 18 } },
        { label: 'Lv 4', value: 4, isUse: true, bonus: { falconDmg: 24 } },
        { label: 'Lv 5', value: 5, isUse: true, bonus: { falconDmg: 30 } },
        { label: 'Lv 6', value: 6, isUse: true, bonus: { falconDmg: 36 } },
        { label: 'Lv 7', value: 7, isUse: true, bonus: { falconDmg: 42 } },
        { label: 'Lv 8', value: 8, isUse: true, bonus: { falconDmg: 48 } },
        { label: 'Lv 9', value: 9, isUse: true, bonus: { falconDmg: 54 } },
        { label: 'Lv 10', value: 10, isUse: true, bonus: { falconDmg: 60 } },
      ],
    },
    {
      inputType: 'dropdown',
      label: 'Falcon Eyes',
      name: 'Falcon Eyes',
      dropdown: [
        { label: '-', value: 0, isUse: false },
        { label: 'Lv 10', value: 10, isUse: true },
      ],
    },
  ];

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
