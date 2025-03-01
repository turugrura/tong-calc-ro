import { ClassName } from './_class-name';
import { ActiveSkillModel, AtkSkillFormulaInput, AtkSkillModel, PassiveSkillModel } from './_character-base.abstract';
import { Swordman } from './Swordman';
import { DemonBane, FaithFn, Heal, SpearMastery } from '../constants/share-passive-skills';
import { CavalierMastery } from '../constants/share-passive-skills/cavalier-mastery';
import { ElementType } from '../constants/element-type.const';

const jobBonusTable: Record<number, [number, number, number, number, number, number]> = {
  1: [0, 0, 1, 0, 0, 0],
  2: [1, 0, 1, 0, 0, 0],
  3: [1, 1, 1, 0, 0, 0],
  4: [1, 1, 1, 0, 0, 0],
  5: [1, 1, 1, 0, 0, 0],
  6: [1, 1, 1, 0, 1, 0],
  7: [1, 1, 1, 1, 1, 0],
  8: [1, 2, 1, 1, 1, 0],
  9: [1, 2, 2, 1, 1, 0],
  10: [2, 2, 2, 1, 1, 0],
  11: [2, 2, 2, 1, 1, 0],
  12: [2, 2, 2, 1, 2, 0],
  13: [2, 2, 2, 1, 2, 0],
  14: [2, 2, 2, 2, 2, 0],
  15: [2, 2, 3, 2, 2, 0],
  16: [2, 3, 3, 2, 2, 0],
  17: [2, 3, 3, 2, 3, 0],
  18: [3, 3, 3, 2, 3, 0],
  19: [3, 3, 3, 2, 3, 0],
  20: [3, 3, 3, 2, 3, 0],
  21: [3, 3, 4, 2, 3, 0],
  22: [3, 3, 4, 2, 3, 0],
  23: [3, 3, 4, 2, 4, 0],
  24: [3, 4, 4, 2, 4, 0],
  25: [3, 4, 4, 2, 4, 0],
  26: [4, 4, 4, 2, 4, 0],
  27: [4, 4, 4, 2, 4, 0],
  28: [4, 4, 4, 2, 4, 0],
  29: [4, 4, 4, 3, 4, 0],
  30: [4, 4, 5, 3, 4, 0],
  31: [4, 4, 5, 3, 4, 0],
  32: [4, 4, 5, 3, 4, 0],
  33: [5, 4, 5, 3, 4, 0],
  34: [5, 4, 5, 3, 4, 0],
  35: [5, 4, 5, 3, 4, 0],
  36: [5, 4, 5, 3, 5, 0],
  37: [5, 5, 5, 3, 5, 0],
  38: [5, 5, 5, 3, 5, 0],
  39: [5, 5, 5, 3, 5, 1],
  40: [6, 5, 5, 3, 5, 1],
  41: [6, 5, 5, 3, 5, 1],
  42: [6, 5, 6, 3, 5, 1],
  43: [6, 5, 6, 4, 5, 1],
  44: [6, 5, 6, 4, 5, 1],
  45: [6, 5, 6, 4, 6, 1],
  46: [6, 5, 6, 4, 6, 1],
  47: [6, 5, 6, 4, 6, 1],
  48: [7, 5, 6, 4, 6, 1],
  49: [7, 5, 7, 4, 6, 1],
  50: [7, 5, 7, 4, 6, 1],
  51: [7, 5, 7, 4, 6, 1],
  52: [7, 6, 7, 4, 6, 1],
  53: [7, 6, 8, 4, 6, 1],
  54: [7, 6, 8, 5, 6, 1],
  55: [8, 6, 8, 5, 6, 1],
  56: [8, 6, 8, 5, 6, 1],
  57: [8, 6, 8, 5, 7, 1],
  58: [8, 6, 8, 5, 7, 1],
  59: [8, 6, 8, 5, 7, 2],
  60: [8, 7, 8, 5, 7, 2],
  61: [8, 7, 8, 6, 7, 2],
  62: [8, 7, 8, 6, 7, 2],
  63: [8, 7, 9, 6, 7, 2],
  64: [9, 7, 9, 6, 7, 2],
  65: [9, 7, 9, 7, 7, 2],
  66: [9, 7, 9, 7, 7, 2],
  67: [9, 7, 9, 7, 7, 3],
  68: [9, 7, 9, 7, 8, 3],
  69: [9, 7, 10, 7, 8, 3],
  70: [9, 8, 10, 7, 8, 3],
};

export class Paladin extends Swordman {
  protected override CLASS_NAME = ClassName.Paladin;
  protected override JobBonusTable = jobBonusTable;
  protected override initialStatusPoint = 100;

  protected readonly classNamesHi = [ClassName.Crusader, ClassName.HiClass, ClassName.Paladin];
  protected readonly atkSkillListHi: AtkSkillModel[] = [
    {
      label: 'Gloria Domini Lv5',
      name: 'Gloria Domini',
      value: 'Gloria Domini==5',
      acd: 1,
      fct: 1,
      vct: 1,
      cd: 0,
      isMatk: true,
      element: ElementType.Holy,
      formula: (input: AtkSkillFormulaInput): number => {
        const { model, skillLevel } = input;
        const baseLevel = model.level;

        return (500 + skillLevel * 150) * (baseLevel / 100);
      },
    },
    {
      name: 'Shield Chain',
      label: 'Shield Chain Lv5',
      value: 'Shield Chain==5',
      fct: 0.2,
      vct: 0.8,
      cd: 0,
      acd: 1,
      verifyItemFn: ({ model }) => !model.shield ? 'Shield' : '',
      formula: (input: AtkSkillFormulaInput): number => {
        const { model, skillLevel, equipmentBonus } = input;
        const baseLevel = model.level;
        const { refine = 0, weight = 0 } = equipmentBonus.shield;

        if (this.isSkillActive('Shield Shooting')) {
          const shieldMastLv = this.learnLv('Shield Mastery');
          return (300 + skillLevel * (650 + shieldMastLv * 15) + refine * 4 + weight) * (baseLevel / 100);
        }

        return (300 + skillLevel * 200 + refine * 4 + weight) * (baseLevel / 100);
      },
    },
  ];
  protected readonly activeSkillListHi: ActiveSkillModel[] = [
    {
      label: 'Spear Quick 10',
      name: 'Spear Quicken',
      inputType: 'selectButton',
      isMasteryAtk: true,
      dropdown: [
        { label: 'Yes', value: 10, isUse: true },
        { label: 'No', value: 0, isUse: false },
      ],
    },
  ];
  protected readonly passiveSkillListHi: PassiveSkillModel[] = [
    DemonBane,
    FaithFn(),
    Heal,
    SpearMastery,
    CavalierMastery,
    {
      label: 'Spear Quicken',
      name: 'Spear Quicken',
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
      label: 'Auto Guard',
      name: 'Auto Guard',
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
      label: 'Grand Cross',
      name: 'Grand Cross',
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
