import { ClassName } from './_class-name';
import { ActiveSkillModel, AtkSkillModel, PassiveSkillModel } from './_character-base.abstract';
import { Merchant } from './Merchant';
import { HiltBindingFn } from '../constants/share-passive-skills';

const jobBonusTable: Record<number, [number, number, number, number, number, number]> = {
  1: [0, 0, 0, 0, 1, 0],
  2: [1, 0, 0, 0, 1, 0],
  3: [2, 0, 0, 0, 1, 0],
  4: [2, 0, 0, 1, 1, 0],
  5: [2, 0, 0, 1, 1, 0],
  6: [2, 0, 0, 1, 2, 0],
  7: [2, 1, 0, 1, 2, 0],
  8: [2, 1, 0, 1, 2, 1],
  9: [2, 1, 1, 1, 2, 1],
  10: [2, 1, 1, 1, 2, 1],
  11: [2, 1, 1, 1, 2, 1],
  12: [2, 1, 1, 1, 3, 1],
  13: [2, 1, 2, 1, 3, 1],
  14: [2, 1, 2, 1, 3, 1],
  15: [2, 1, 2, 2, 3, 1],
  16: [2, 1, 2, 2, 3, 2],
  17: [3, 1, 2, 2, 3, 2],
  18: [3, 1, 2, 2, 3, 2],
  19: [3, 2, 2, 2, 3, 2],
  20: [3, 3, 2, 2, 3, 2],
  21: [3, 3, 2, 2, 3, 2],
  22: [3, 3, 2, 3, 3, 2],
  23: [3, 3, 2, 3, 4, 2],
  24: [3, 3, 2, 3, 4, 2],
  25: [3, 3, 2, 3, 4, 2],
  26: [4, 3, 2, 3, 4, 2],
  27: [4, 3, 2, 3, 4, 2],
  28: [4, 3, 2, 3, 4, 3],
  29: [4, 3, 3, 3, 4, 3],
  30: [4, 3, 3, 3, 4, 3],
  31: [4, 4, 3, 3, 4, 3],
  32: [4, 4, 3, 3, 5, 3],
  33: [5, 4, 3, 3, 5, 3],
  34: [5, 4, 3, 4, 5, 3],
  35: [5, 4, 3, 4, 5, 3],
  36: [5, 5, 3, 4, 5, 3],
  37: [5, 5, 3, 4, 5, 3],
  38: [5, 5, 3, 4, 6, 3],
  39: [5, 5, 3, 4, 6, 4],
  40: [5, 5, 3, 4, 6, 4],
  41: [5, 5, 3, 4, 7, 4],
  42: [5, 5, 3, 4, 7, 4],
  43: [5, 5, 3, 4, 7, 4],
  44: [5, 5, 3, 4, 7, 5],
  45: [5, 5, 3, 4, 7, 6],
  46: [5, 5, 3, 4, 7, 6],
  47: [5, 5, 3, 4, 8, 6],
  48: [5, 5, 4, 4, 8, 6],
  49: [5, 5, 4, 4, 8, 6],
  50: [5, 5, 4, 5, 8, 6],
  51: [5, 5, 4, 5, 8, 6],
  52: [6, 5, 4, 5, 8, 6],
  53: [6, 5, 4, 5, 8, 6],
  54: [6, 5, 4, 5, 8, 6],
  55: [6, 5, 4, 5, 9, 6],
  56: [6, 5, 4, 5, 10, 6],
  57: [6, 5, 4, 5, 10, 6],
  58: [6, 6, 4, 5, 10, 6],
  59: [6, 6, 4, 5, 10, 6],
  60: [6, 6, 5, 5, 10, 6],
  61: [6, 6, 5, 6, 10, 6],
  62: [6, 6, 5, 6, 11, 6],
  63: [6, 6, 5, 6, 11, 6],
  64: [6, 7, 5, 6, 11, 6],
  65: [6, 7, 6, 6, 11, 6],
  66: [6, 7, 6, 6, 11, 7],
  67: [6, 7, 6, 6, 11, 8],
  68: [6, 7, 6, 6, 11, 8],
  69: [6, 7, 6, 6, 11, 8],
  70: [6, 7, 6, 6, 12, 8],
};

export class Whitesmith extends Merchant {
  protected override CLASS_NAME = ClassName.Whitesmith;
  protected override JobBonusTable = jobBonusTable;
  protected override initialStatusPoint = 100;

  protected readonly classNamesHi = [ClassName.Blacksmith, ClassName.HiClass, ClassName.Whitesmith];
  protected readonly atkSkillListHi: AtkSkillModel[] = [];
  protected readonly activeSkillListHi: ActiveSkillModel[] = [
    {
      label: 'Adrenaline Lv5',
      name: 'Adrenaline Rush',
      inputType: 'selectButton',
      dropdown: [
        {
          label: 'Yes',
          value: 5,
          isUse: true,
          bonus: {
            axe_hit: 20,
            axe_aspdPercent: 10,
            axe_skillAspd: 7,
            twohandAxe_hit: 20,
            twohandAxe_aspdPercent: 10,
            twohandAxe_skillAspd: 7,
            mace_hit: 20,
            mace_aspdPercent: 10,
            mace_skillAspd: 7,
            twohandMace_hit: 20,
            twohandMace_aspdPercent: 10,
            twohandMace_skillAspd: 7,
          },
        },
        { label: 'No', value: 0, isUse: false },
      ],
    },
    {
      label: 'Power Thrust Lv5',
      name: 'Power Thrust',
      inputType: 'selectButton',
      dropdown: [
        { label: 'Yes', value: 5, isUse: true, bonus: { flatDmg: 25 } },
        { label: 'No', value: 0, isUse: false },
      ],
    },
    {
      label: 'Weapon Perfect Lv5',
      name: 'Weapon Perfection',
      inputType: 'selectButton',
      dropdown: [
        { label: 'Yes', value: 5, isUse: true, bonus: { ignore_size_penalty: 1 } },
        { label: 'No', value: 0, isUse: false },
      ],
    },
    {
      label: 'P.Maximize Lv5',
      name: 'Power Maximize',
      inputType: 'selectButton',
      dropdown: [
        { label: 'Yes', value: 5, isUse: true, bonus: { weapon_maximize: 1 } },
        { label: 'No', value: 0, isUse: false },
      ],
    },
  ];
  protected readonly passiveSkillListHi: PassiveSkillModel[] = [
    HiltBindingFn(),
    {
      label: 'Skin Tempering',
      name: 'Skin Tempering',
      inputType: 'dropdown',
      isMasteryAtk: true,
      dropdown: [
        { label: '-', value: 0, isUse: false },
        { label: 'Lv 1', value: 1, isUse: true, bonus: { x_resist_fire: 4, x_resist_neutral: 1 } },
        { label: 'Lv 2', value: 2, isUse: true, bonus: { x_resist_fire: 8, x_resist_neutral: 2 } },
        { label: 'Lv 3', value: 3, isUse: true, bonus: { x_resist_fire: 12, x_resist_neutral: 3 } },
        { label: 'Lv 4', value: 4, isUse: true, bonus: { x_resist_fire: 16, x_resist_neutral: 4 } },
        { label: 'Lv 5', value: 5, isUse: true, bonus: { x_resist_fire: 20, x_resist_neutral: 5 } },
      ],
    },
    {
      label: 'Weaponry Research',
      name: 'Weaponry Research',
      inputType: 'dropdown',
      isMasteryAtk: true,
      dropdown: [
        { label: '-', value: 0, isUse: false },
        { label: 'Lv 1', value: 1, isUse: true, bonus: { x_atk: 2 } },
        { label: 'Lv 2', value: 2, isUse: true, bonus: { x_atk: 4 } },
        { label: 'Lv 3', value: 3, isUse: true, bonus: { x_atk: 6 } },
        { label: 'Lv 4', value: 4, isUse: true, bonus: { x_atk: 8 } },
        { label: 'Lv 5', value: 5, isUse: true, bonus: { x_atk: 10 } },
        { label: 'Lv 6', value: 6, isUse: true, bonus: { x_atk: 12 } },
        { label: 'Lv 7', value: 7, isUse: true, bonus: { x_atk: 14 } },
        { label: 'Lv 8', value: 8, isUse: true, bonus: { x_atk: 16 } },
        { label: 'Lv 9', value: 9, isUse: true, bonus: { x_atk: 18 } },
        { label: 'Lv 10', value: 10, isUse: true, bonus: { x_atk: 20 } },
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
