import { ClassName } from './_class-name';
import {
  ActiveSkillModel,
  AtkSkillFormulaInput,
  AtkSkillModel,
  CharacterBase,
  PassiveSkillModel,
} from './_character-base.abstract';
import { CartBoost } from '../constants/share-active-skills';
import { Creator } from './creator';
import { InfoForClass } from '../models/info-for-class.model';

const jobBonusTable: Record<number, [number, number, number, number, number, number]> = {
  1: [0, 0, 0, 1, 0, 0],
  2: [0, 0, 0, 2, 0, 0],
  3: [0, 0, 0, 2, 1, 0],
  4: [0, 0, 0, 2, 1, 0],
  5: [0, 0, 0, 2, 1, 0],
  6: [0, 0, 0, 2, 2, 0],
  7: [0, 0, 0, 3, 2, 0],
  8: [0, 1, 0, 3, 2, 0],
  9: [0, 1, 0, 3, 2, 0],
  10: [0, 1, 0, 3, 2, 0],
  11: [0, 1, 0, 3, 2, 0],
  12: [0, 1, 0, 4, 2, 0],
  13: [0, 1, 0, 4, 3, 0],
  14: [0, 1, 0, 4, 3, 0],
  15: [0, 1, 1, 4, 3, 0],
  16: [0, 1, 1, 4, 3, 0],
  17: [0, 1, 1, 4, 3, 0],
  18: [0, 1, 2, 4, 3, 0],
  19: [0, 1, 2, 4, 4, 0],
  20: [0, 2, 2, 4, 4, 0],
  21: [0, 2, 2, 4, 4, 0],
  22: [0, 2, 2, 4, 4, 0],
  23: [0, 2, 2, 5, 4, 0],
  24: [0, 2, 3, 5, 4, 0],
  25: [0, 2, 4, 5, 4, 0],
  26: [0, 2, 4, 5, 4, 0],
  27: [0, 2, 4, 5, 4, 0],
  28: [0, 2, 4, 5, 5, 0],
  29: [0, 3, 4, 5, 5, 0],
  30: [0, 3, 4, 5, 5, 0],
  31: [0, 3, 4, 5, 5, 1],
  32: [0, 3, 4, 5, 5, 1],
  33: [0, 3, 4, 5, 5, 1],
  34: [1, 3, 4, 5, 5, 1],
  35: [1, 3, 4, 6, 5, 1],
  36: [1, 3, 4, 7, 5, 1],
  37: [1, 3, 4, 7, 5, 1],
  38: [1, 3, 4, 7, 5, 1],
  39: [1, 3, 4, 7, 6, 1],
  40: [1, 4, 4, 7, 6, 1],
  41: [1, 4, 4, 8, 6, 1],
  42: [1, 4, 4, 8, 6, 1],
  43: [1, 4, 4, 8, 6, 1],
  44: [1, 4, 4, 9, 6, 1],
  45: [1, 4, 4, 10, 6, 1],
  46: [1, 4, 4, 10, 6, 1],
  47: [1, 5, 4, 10, 6, 1],
  48: [1, 5, 4, 10, 6, 1],
  49: [1, 5, 4, 10, 6, 1],
  50: [1, 5, 4, 11, 6, 1],
  51: [2, 5, 4, 11, 6, 1],
  52: [2, 5, 5, 11, 6, 1],
  53: [2, 5, 5, 11, 7, 1],
  54: [2, 5, 5, 11, 7, 1],
  55: [2, 6, 5, 11, 7, 1],
  56: [3, 6, 5, 11, 7, 1],
  57: [3, 6, 6, 11, 7, 1],
  58: [3, 6, 6, 11, 7, 2],
  59: [3, 6, 6, 11, 8, 2],
  60: [3, 6, 6, 12, 8, 2],
  61: [3, 6, 6, 12, 8, 2],
  62: [4, 6, 6, 12, 8, 3],
  63: [4, 6, 6, 12, 8, 3],
  64: [4, 6, 6, 12, 8, 3],
  65: [4, 6, 7, 12, 8, 3],
  66: [4, 6, 7, 12, 8, 3],
  67: [4, 6, 7, 12, 8, 3],
  68: [4, 6, 7, 12, 8, 3],
  69: [4, 6, 7, 12, 8, 3],
  70: [5, 6, 8, 12, 8, 4],
};

export class Genetic extends CharacterBase {
  protected readonly CLASS_NAME = ClassName.Genetic;
  protected readonly JobBonusTable = jobBonusTable;

  protected readonly initialStatusPoint = 100;
  protected readonly classNames = ['Only 3rd Cls', 'Genetic', 'Genetic Cls', 'Genetic Class'];
  protected readonly _atkSkillList: AtkSkillModel[] = [
    {
      label: 'Cart Cannon Lv5',
      name: 'Cart Cannon',
      value: 'Cart Cannon==5',
      acd: 0.5,
      fct: 0,
      vct: 3,
      cd: 0,
      isHit100: true,
      isHDefToSDef: true,
      formula: (input: AtkSkillFormulaInput): number => {
        const {
          skillLevel,
          status: { totalInt },
        } = input;
        const cartModelingLv = this.learnLv('Cart Remodeling');

        return skillLevel * 60 + cartModelingLv * 50 * (totalInt / 40);
      },
    },
    {
      label: 'Cart Tornado Lv10',
      name: 'Cart Tornado',
      value: 'Cart Tornado==10',
      acd: 1,
      fct: 0,
      vct: 0,
      cd: 2,
      isMelee: true,
      formula: (input: AtkSkillFormulaInput): number => {
        const { skillLevel, status } = input;
        const { baseStr } = status;

        const cartModelingLv = this.learnLv('Cart Remodeling');
        const cartWeight = this.bonuses.usedSkillMap.get('Cart Weight') || 0;

        return skillLevel * 100 + cartModelingLv * 50 + cartWeight / (150 - baseStr);
      },
    },
  ];

  protected readonly _activeSkillList: ActiveSkillModel[] = [
    CartBoost,
    {
      label: 'Cart Weight',
      name: 'Cart Weight',
      inputType: 'dropdown',
      dropdown: [
        { label: '-', value: 0, isUse: false },
        { label: '1000', value: 1000, isUse: true },
        { label: '2000', value: 2000, isUse: true },
        { label: '3000', value: 3000, isUse: true },
        { label: '4000', value: 4000, isUse: true },
        { label: '5000', value: 5000, isUse: true },
        { label: '6000', value: 6000, isUse: true },
        { label: '7000', value: 7000, isUse: true },
        { label: '8000', value: 8000, isUse: true },
        { label: '9000', value: 9000, isUse: true },
        { label: '10000', value: 10000, isUse: true },
        { label: '10500', value: 10500, isUse: true },
      ],
    },
    {
      label: 'Pyroclastic 10',
      name: 'Pyroclastic',
      inputType: 'dropdown',
      isEquipAtk: true,
      dropdown: [
        { label: '-', value: 0, isUse: false },
        { label: 'Lv 100', value: 100, isUse: true, bonus: { atk: 100 + 100 } },
        { label: 'Lv 110', value: 110, isUse: true, bonus: { atk: 100 + 110 } },
        { label: 'Lv 120', value: 120, isUse: true, bonus: { atk: 100 + 120 } },
        { label: 'Lv 130', value: 130, isUse: true, bonus: { atk: 100 + 130 } },
        { label: 'Lv 140', value: 140, isUse: true, bonus: { atk: 100 + 140 } },
        { label: 'Lv 150', value: 150, isUse: true, bonus: { atk: 100 + 150 } },
        { label: 'Lv 160', value: 160, isUse: true, bonus: { atk: 100 + 160 } },
        { label: 'Lv 170', value: 170, isUse: true, bonus: { atk: 100 + 170 } },
        { label: 'Lv 180', value: 180, isUse: true, bonus: { atk: 100 + 180 } },
        { label: 'Lv 190', value: 190, isUse: true, bonus: { atk: 100 + 190 } },
        { label: 'Lv 200', value: 200, isUse: true, bonus: { atk: 100 + 200 } },
      ],
    },
  ];

  protected readonly _passiveSkillList: PassiveSkillModel[] = [
    {
      label: 'Sword Mastery 10',
      name: 'Sword Mastery',
      inputType: 'selectButton',
      isMasteryAtk: true,
      dropdown: [
        {
          label: 'Yes',
          value: 10,
          skillLv: 10,
          isUse: true,
          bonus: { x_dagger_atk: 50, x_dagger_hit: 15, x_sword_atk: 50, x_sword_hit: 15 },
        },
        { label: 'No', value: 0, isUse: false },
      ],
    },
    {
      label: 'Cart Remodel 5',
      name: 'Cart Remodeling',
      inputType: 'selectButton',
      isMasteryAtk: true,
      dropdown: [
        {
          label: 'Yes',
          value: 5,
          skillLv: 5,
          isUse: true,
          bonus: { weight: 2500, 'hit__Cart Revolution': 20, 'hit__Cart Tornado': 20, 'hit__Cart Cannon': 20 },
        },
        { label: 'No', value: 0, isUse: false },
      ],
    },
    {
      label: 'Mandragora',
      name: 'Mandragora Howling',
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

    this.inheritBaseClass(new Creator());
  }

  override getMasteryAtk(info: InfoForClass): number {
    const { weapon } = info;
    const weaponType = weapon?.data?.typeName;
    if (weaponType !== 'sword' && weaponType !== 'axe') return 0;

    return this.calcHiddenMasteryAtk(info, { prefix: `x_${weaponType}` }).totalAtk;
  }
}
