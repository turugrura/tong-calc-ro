import { ClassName } from './_class-name';
import {
  ActiveSkillModel,
  AtkSkillFormulaInput,
  AtkSkillModel,
  CharacterBase,
  PassiveSkillModel,
} from './_character-base.abstract';
import { Acolyte } from './acolyte';
import { InfoForClass } from '../models/info-for-class.model';

const jobBonusTable: Record<number, [number, number, number, number, number, number]> = {
  1: [0, 1, 0, 0, 0, 0],
  2: [0, 1, 0, 0, 1, 0],
  3: [0, 1, 0, 0, 1, 0],
  4: [1, 1, 0, 0, 1, 0],
  5: [2, 1, 0, 0, 1, 0],
  6: [2, 1, 0, 0, 1, 0],
  7: [2, 1, 0, 0, 1, 0],
  8: [2, 1, 0, 0, 1, 0],
  9: [3, 1, 0, 0, 1, 0],
  10: [3, 2, 0, 0, 1, 0],
  11: [3, 2, 0, 0, 2, 0],
  12: [3, 2, 0, 0, 2, 0],
  13: [3, 2, 0, 0, 2, 0],
  14: [3, 2, 1, 0, 2, 0],
  15: [3, 2, 2, 0, 2, 0],
  16: [4, 2, 2, 0, 2, 0],
  17: [4, 2, 2, 0, 2, 0],
  18: [4, 2, 2, 0, 2, 0],
  19: [4, 2, 3, 0, 2, 0],
  20: [5, 2, 3, 0, 2, 0],
  21: [5, 2, 3, 0, 2, 0],
  22: [5, 2, 3, 0, 2, 0],
  23: [5, 3, 3, 0, 2, 0],
  24: [5, 4, 3, 0, 2, 0],
  25: [5, 4, 3, 0, 3, 0],
  26: [5, 4, 3, 0, 3, 0],
  27: [5, 4, 3, 0, 3, 0],
  28: [5, 4, 3, 1, 3, 0],
  29: [5, 4, 3, 2, 3, 0],
  30: [6, 4, 3, 2, 3, 0],
  31: [6, 4, 4, 2, 3, 0],
  32: [6, 4, 4, 2, 3, 0],
  33: [6, 4, 4, 2, 3, 0],
  34: [6, 4, 4, 2, 3, 0],
  35: [6, 5, 4, 2, 3, 0],
  36: [6, 5, 4, 2, 4, 0],
  37: [6, 5, 4, 2, 5, 0],
  38: [6, 5, 4, 2, 5, 0],
  39: [6, 5, 4, 2, 5, 0],
  40: [6, 5, 4, 2, 5, 0],
  41: [6, 5, 4, 3, 5, 0],
  42: [6, 5, 5, 3, 5, 0],
  43: [6, 6, 5, 3, 5, 0],
  44: [6, 7, 5, 3, 5, 0],
  45: [6, 7, 5, 3, 5, 0],
  46: [6, 7, 5, 3, 5, 0],
  47: [6, 7, 5, 3, 5, 0],
  48: [6, 7, 5, 4, 5, 0],
  49: [6, 7, 5, 4, 6, 0],
  50: [6, 7, 5, 4, 7, 0],
  51: [7, 7, 5, 4, 7, 0],
  52: [7, 7, 5, 4, 7, 0],
  53: [7, 8, 5, 4, 7, 0],
  54: [7, 8, 5, 5, 7, 0],
  55: [7, 8, 5, 5, 7, 1],
  56: [7, 8, 6, 5, 7, 1],
  57: [7, 8, 6, 5, 7, 1],
  58: [7, 8, 6, 5, 8, 1],
  59: [8, 8, 6, 5, 8, 1],
  60: [8, 8, 6, 6, 8, 1],
  61: [9, 8, 6, 6, 8, 1],
  62: [9, 8, 6, 6, 8, 1],
  63: [9, 8, 6, 6, 8, 1],
  64: [9, 8, 6, 6, 8, 1],
  65: [9, 9, 6, 7, 8, 1],
  66: [9, 9, 6, 7, 8, 1],
  67: [9, 9, 6, 7, 8, 1],
  68: [9, 9, 6, 7, 8, 1],
  69: [9, 9, 6, 7, 8, 1],
  70: [10, 10, 6, 8, 8, 1],
};

export class Sura extends CharacterBase {
  protected readonly CLASS_NAME = ClassName.Sura;
  protected readonly JobBonusTable = jobBonusTable;

  protected readonly initialStatusPoint = 100;
  protected readonly classNames = [
    'Only 3rd Cls',
    'Hi-Class',
    'Monk',
    'Monk Cls',
    'Monk Class',
    'Champion',
    'Champion Cls',
    'Champion Class',
    'Sura',
    'Sura Cls',
    'Sura Class',
  ];
  protected readonly _atkSkillList: AtkSkillModel[] = [
    {
      label: 'Rampage Blast Lv5',
      name: 'Rampage Blast',
      fct: 0,
      vct: 0,
      acd: 1,
      cd: 10,
      value: 'Rampage Blast==5',
      levelList: [],
      formula: (input: AtkSkillFormulaInput): number => {
        const { model, skillLevel } = input;
        const baseLevel = model.level;
        const vigorLv = this.learnLv('Vigor Explosion');

        let totalDmg = 0;
        if (this.isSkillActive('Earth Shaker')) {
          totalDmg = (vigorLv * 300 + skillLevel * 550) * (baseLevel / 100);
        } else {
          totalDmg = (vigorLv * 200 + skillLevel * 350) * (baseLevel / 100);
        }

        if (this.isSkillActive('Gentle Touch - Opposite')) {
          totalDmg = totalDmg * 1.3;
        }

        return totalDmg;
      },
    },
  ];

  protected readonly _activeSkillList: ActiveSkillModel[] = [
    {
      label: 'Rising Dragon 10',
      name: 'Rising Dragon',
      inputType: 'selectButton',
      dropdown: [
        { label: 'Yes', value: 10, isUse: true, bonus: { hpPercent: 12, spPercent: 12 } },
        { label: 'No', value: 0, isUse: false },
      ],
    },
    {
      label: 'GT-Opposite 5',
      name: 'Gentle Touch - Opposite',
      inputType: 'selectButton',
      dropdown: [
        { label: 'Yes', value: 5, isUse: true, bonus: { atk: 40, atkPercent: 5 } },
        { label: 'No', value: 0, isUse: false },
      ],
    },
    {
      label: 'GT-Alive 5',
      name: 'Gentle Touch - Alive',
      inputType: 'selectButton',
      dropdown: [
        { label: 'Yes', value: 5, isUse: true, bonus: { hpPercent: 10, def: 100 } },
        { label: 'No', value: 0, isUse: false },
      ],
    },
    {
      label: '[Debuff] Earth Shaker',
      name: 'Earth Shaker',
      inputType: 'selectButton',
      dropdown: [
        { label: 'Yes', value: 5, isUse: true },
        { label: 'No', value: 0, isUse: false },
      ],
    },
  ];

  protected readonly _passiveSkillList: PassiveSkillModel[] = [
    {
      label: 'Divine Protec 10',
      name: 'Divine Protection',
      inputType: 'selectButton',
      dropdown: [
        { label: 'Yes', value: 10, isUse: true },
        { label: 'No', value: 0, isUse: false },
      ],
    },
    {
      label: 'Iron Hand',
      name: 'Iron Hand',
      inputType: 'dropdown',
      isMasteryAtk: true,
      dropdown: [
        { label: '-', value: 0, isUse: false },
        { label: 'Lv 1', value: 1, isUse: true, bonus: { x_fist_atk: 1 * 3 } },
        { label: 'Lv 2', value: 2, isUse: true, bonus: { x_fist_atk: 2 * 3 } },
        { label: 'Lv 3', value: 3, isUse: true, bonus: { x_fist_atk: 3 * 3 } },
        { label: 'Lv 4', value: 4, isUse: true, bonus: { x_fist_atk: 4 * 3 } },
        { label: 'Lv 5', value: 5, isUse: true, bonus: { x_fist_atk: 5 * 3 } },
        { label: 'Lv 6', value: 6, isUse: true, bonus: { x_fist_atk: 6 * 3 } },
        { label: 'Lv 7', value: 7, isUse: true, bonus: { x_fist_atk: 7 * 3 } },
        { label: 'Lv 8', value: 8, isUse: true, bonus: { x_fist_atk: 8 * 3 } },
        { label: 'Lv 9', value: 9, isUse: true, bonus: { x_fist_atk: 9 * 3 } },
        { label: 'Lv 10', value: 10, isUse: true, bonus: { x_fist_atk: 10 * 3 } },
      ],
    },
    {
      label: 'Dodge 10',
      name: 'Dodge',
      inputType: 'selectButton',
      dropdown: [
        { label: 'Yes', value: 10, isUse: true, bonus: { flee: 15 } },
        { label: 'No', value: 0, isUse: false },
      ],
    },
    {
      label: 'Vigor Explosion',
      name: 'Vigor Explosion',
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
    // {
    //   label: 'Vigor Recovery',
    //   name: 'Vigor Recovery',
    //   inputType: 'selectButton',
    //   dropdown: [
    //     {label: 'Lv 5', value: 5, isUse: true},
    //     {label: '-', value: 0, isUse: false},
    //   ]
    // },
  ];

  constructor() {
    super();

    this.inheritBaseClass(new Acolyte());
  }

  override getMasteryAtk(info: InfoForClass): number {
    const { weapon } = info;
    const wTypeName = weapon.data?.typeName;

    return this.calcHiddenMasteryAtk(info, { prefix: wTypeName }).totalAtk;
  }
}
