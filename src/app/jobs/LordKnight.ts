import { ClassName } from './_class-name';
import { ActiveSkillModel, AtkSkillModel, PassiveSkillModel } from './_character-base.abstract';
import { Swordman } from './Swordman';
import { SpearMastery } from '../constants/share-passive-skills';
import { CavalierMastery } from '../constants/share-passive-skills/cavalier-mastery';

const jobBonusTable: Record<number, [number, number, number, number, number, number]> = {
  1: [1, 0, 0, 0, 0, 0],
  2: [1, 1, 0, 0, 0, 0],
  3: [1, 1, 0, 0, 0, 1],
  4: [1, 1, 0, 0, 1, 1],
  5: [1, 1, 1, 0, 1, 1],
  6: [2, 1, 1, 0, 1, 1],
  7: [3, 1, 1, 0, 1, 1],
  8: [4, 1, 1, 0, 1, 1],
  9: [4, 1, 1, 0, 1, 1],
  10: [4, 2, 1, 0, 1, 1],
  11: [4, 2, 1, 0, 2, 1],
  12: [4, 2, 2, 0, 2, 1],
  13: [4, 2, 2, 1, 2, 1],
  14: [4, 3, 2, 1, 2, 1],
  15: [4, 3, 2, 1, 2, 1],
  16: [4, 3, 2, 1, 3, 1],
  17: [4, 4, 2, 1, 3, 1],
  18: [4, 4, 2, 1, 3, 1],
  19: [5, 4, 2, 1, 3, 1],
  20: [5, 4, 2, 1, 3, 1],
  21: [5, 4, 2, 1, 3, 1],
  22: [5, 4, 3, 1, 3, 1],
  23: [5, 4, 3, 1, 3, 1],
  24: [5, 4, 3, 1, 3, 1],
  25: [6, 4, 3, 1, 3, 1],
  26: [6, 4, 3, 1, 3, 1],
  27: [6, 4, 3, 1, 3, 2],
  28: [6, 4, 3, 1, 4, 2],
  29: [6, 4, 4, 1, 4, 2],
  30: [6, 4, 4, 1, 4, 2],
  31: [6, 4, 4, 1, 5, 2],
  32: [6, 4, 4, 1, 5, 2],
  33: [7, 4, 4, 1, 5, 2],
  34: [7, 4, 4, 1, 5, 2],
  35: [7, 4, 4, 1, 5, 2],
  36: [7, 4, 4, 1, 6, 2],
  37: [7, 5, 4, 1, 6, 2],
  38: [7, 5, 4, 1, 6, 3],
  39: [7, 5, 4, 1, 6, 3],
  40: [7, 5, 5, 1, 6, 3],
  41: [8, 5, 5, 1, 6, 3],
  42: [8, 5, 5, 1, 6, 3],
  43: [8, 5, 6, 1, 6, 3],
  44: [8, 5, 6, 1, 7, 3],
  45: [8, 5, 6, 1, 7, 3],
  46: [9, 5, 6, 1, 7, 3],
  47: [10, 5, 6, 1, 7, 3],
  48: [10, 5, 6, 1, 7, 3],
  49: [10, 5, 6, 1, 8, 3],
  50: [10, 5, 6, 1, 8, 3],
  51: [10, 5, 6, 1, 8, 3],
  52: [11, 5, 6, 1, 8, 3],
  53: [11, 6, 6, 1, 8, 3],
  54: [11, 6, 6, 1, 8, 3],
  55: [11, 6, 6, 1, 8, 3],
  56: [12, 6, 6, 1, 8, 3],
  57: [13, 6, 6, 1, 8, 3],
  58: [13, 6, 7, 1, 8, 3],
  59: [13, 6, 7, 1, 8, 3],
  60: [13, 7, 7, 1, 8, 3],
  61: [13, 7, 7, 1, 8, 3],
  62: [13, 7, 7, 1, 9, 3],
  63: [13, 7, 7, 1, 9, 3],
  64: [14, 7, 7, 1, 9, 3],
  65: [14, 8, 7, 1, 9, 3],
  66: [14, 8, 7, 1, 9, 3],
  67: [14, 8, 7, 2, 9, 3],
  68: [14, 8, 8, 2, 9, 3],
  69: [14, 8, 8, 2, 9, 3],
  70: [15, 8, 8, 2, 9, 3],
};

export class LordKnight extends Swordman {
  protected override CLASS_NAME = ClassName.LordKnight;
  protected override JobBonusTable = jobBonusTable;
  protected override initialStatusPoint = 100;

  protected readonly classNamesHi = [ClassName.Knight, ClassName.HiClass, ClassName.LordKnight];
  protected readonly atkSkillListHi: AtkSkillModel[] = [];
  protected readonly activeSkillListHi: ActiveSkillModel[] = [
    {
      label: 'Two hand Quick 10',
      name: 'Two hand Quicken',
      inputType: 'selectButton',
      dropdown: [
        { label: 'Yes', value: 10, skillLv: 10, isUse: true },
        { label: 'No', value: 0, isUse: false },
      ],
    },
    {
      name: 'Aura Blade',
      label: 'Aura Blade 5',
      inputType: 'selectButton',
      dropdown: [
        { label: 'Yes', value: 5, isUse: true },
        { label: 'No', value: 0, isUse: false },
      ],
    },
    {
      name: 'Spear Dynamo',
      label: 'Spear Dynamo 5',
      inputType: 'selectButton',
      dropdown: [
        { label: 'Yes', value: 5, isUse: true, bonus: { atkPercent: 15, hit: 50, defPercent: -15 } },
        { label: 'No', value: 0, isUse: false },
      ],
    },
  ];
  protected readonly passiveSkillListHi: PassiveSkillModel[] = [
    SpearMastery,
    CavalierMastery,
    {
      label: 'Two hand Quick',
      name: 'Two hand Quicken',
      inputType: 'dropdown',
      dropdown: [
        { label: '-', value: 0, isUse: false },
        { label: 'Lv 1', value: 1, isUse: true },
        { label: 'Lv 2', value: 2, isUse: true },
        { label: 'Lv 3', value: 3, isUse: true },
        { label: 'Lv 4', value: 4, isUse: true },
        { label: 'Lv 5', value: 5, isUse: true },
        { label: 'Lv 6', value: 6, isUse: true },
        { label: 'Lv 7', value: 7, isUse: true },
        { label: 'Lv 8', value: 8, isUse: true },
        { label: 'Lv 9', value: 9, isUse: true },
        { label: 'Lv 10', value: 10, isUse: true },
      ],
    },
    {
      label: 'Clashing Spiral',
      name: 'Clashing Spiral',
      inputType: 'dropdown',
      dropdown: [
        { label: '-', value: 0, isUse: false },
        { label: 'Lv 1', value: 1, isUse: true },
        { label: 'Lv 2', value: 2, isUse: true },
        { label: 'Lv 3', value: 3, isUse: true },
        { label: 'Lv 4', value: 4, isUse: true },
        { label: 'Lv 5', value: 5, isUse: true },
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
