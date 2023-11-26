import { ClassName } from './_class-name';
import {
  ActiveSkillModel,
  AtkSkillFormulaInput,
  AtkSkillModel,
  CharacterBase,
  PassiveSkillModel,
} from './_character-base.abstract';
import { Ninja } from './ninja';
import { ShadowWarrior } from '../constants/share-active-skills/shadow-warrior';
import { ElementType } from '../constants/element-type.const';
import { InfoForClass } from '../models/info-for-class.model';
import { floor } from '../utils';
import { DistortedCrescent, S16thNight } from '../constants/share-active-skills';

const jobBonusTable: Record<number, [number, number, number, number, number, number]> = {
  1: [0, 0, 0, 0, 1, 0],
  2: [0, 0, 0, 0, 1, 0],
  3: [0, 0, 0, 1, 1, 0],
  4: [0, 0, 0, 1, 1, 0],
  5: [0, 1, 0, 1, 1, 0],
  6: [0, 1, 1, 1, 1, 0],
  7: [0, 1, 1, 1, 1, 0],
  8: [1, 1, 1, 1, 1, 0],
  9: [1, 1, 1, 1, 1, 1],
  10: [1, 1, 1, 1, 1, 1],
  11: [1, 1, 1, 1, 2, 1],
  12: [2, 1, 1, 1, 2, 1],
  13: [2, 2, 1, 1, 2, 1],
  14: [2, 2, 1, 1, 2, 1],
  15: [2, 2, 1, 2, 2, 1],
  16: [2, 2, 1, 2, 2, 2],
  17: [2, 2, 2, 2, 2, 2],
  18: [2, 2, 2, 2, 2, 2],
  19: [3, 2, 2, 2, 2, 2],
  20: [3, 2, 2, 2, 3, 2],
  21: [3, 3, 2, 2, 3, 2],
  22: [3, 3, 2, 2, 3, 2],
  23: [3, 3, 2, 2, 3, 3],
  24: [3, 3, 3, 2, 3, 3],
  25: [3, 3, 3, 3, 3, 3],
  26: [3, 3, 3, 3, 3, 3],
  27: [3, 3, 3, 3, 4, 3],
  28: [3, 3, 3, 3, 4, 3],
  29: [3, 4, 3, 3, 4, 3],
  30: [3, 4, 3, 3, 4, 3],
  31: [4, 4, 3, 3, 4, 3],
  32: [4, 4, 3, 4, 4, 3],
  33: [4, 4, 3, 4, 4, 3],
  34: [4, 4, 3, 4, 5, 3],
  35: [4, 4, 3, 5, 5, 3],
  36: [4, 4, 3, 5, 5, 3],
  37: [4, 4, 4, 5, 5, 3],
  38: [4, 4, 4, 5, 6, 3],
  39: [5, 4, 4, 5, 6, 3],
  40: [5, 4, 4, 5, 6, 3],
  41: [5, 5, 4, 5, 6, 3],
  42: [5, 5, 4, 6, 6, 3],
  43: [6, 5, 4, 6, 6, 3],
  44: [6, 5, 4, 6, 6, 3],
  45: [6, 5, 4, 6, 7, 3],
  46: [6, 5, 4, 6, 7, 4],
  47: [6, 6, 4, 6, 7, 4],
  48: [7, 6, 4, 6, 7, 4],
  49: [7, 6, 4, 6, 7, 4],
  50: [7, 6, 4, 6, 8, 4],
  51: [7, 6, 4, 6, 8, 4],
  52: [7, 6, 4, 6, 8, 4],
  53: [7, 6, 4, 6, 8, 4],
  54: [7, 6, 4, 6, 8, 4],
  55: [7, 6, 4, 6, 8, 4],
  56: [7, 6, 4, 6, 8, 4],
  57: [7, 6, 4, 6, 8, 4],
  58: [7, 6, 4, 6, 8, 4],
  59: [7, 6, 4, 6, 8, 4],
  60: [7, 6, 4, 6, 8, 4],
  61: [7, 6, 4, 6, 8, 4],
  62: [7, 6, 4, 6, 8, 4],
  63: [7, 6, 4, 6, 8, 4],
  64: [7, 6, 4, 6, 8, 4],
  65: [7, 6, 4, 6, 8, 4],
};

export class Oboro extends CharacterBase {
  protected readonly CLASS_NAME = ClassName.Oboro;
  protected readonly JobBonusTable = jobBonusTable;

  protected readonly initialStatusPoint = 48;
  protected readonly classNames = ['Oboro', 'Oboro Cls', 'Oboro Class'];

  protected readonly _atkSkillList: AtkSkillModel[] = [
    {
      label: 'Flaming Petals Lv10',
      name: 'Flaming Petals',
      value: 'Flaming Petals==10',
      acd: 0,
      fct: 1.4,
      vct: 5.6,
      cd: 0,
      element: ElementType.Fire,
      isMatk: true,
      totalHit: 10,
      formula: (): number => {
        return 90;
      },
    },
    {
      label: 'Freezing Spear Lv10',
      name: 'Freezing Spear',
      value: 'Freezing Spear==10',
      acd: 0,
      fct: 1.4,
      vct: 5.6,
      cd: 0,
      element: ElementType.Water,
      isMatk: true,
      totalHit: 12,
      formula: (input: AtkSkillFormulaInput): number => {
        const { skillLevel } = input;

        return 70 + skillLevel * 2;
      },
    },
    {
      label: 'Wind Blade Lv10',
      name: 'Wind Blade',
      value: 'Wind Blade==10',
      acd: 0,
      fct: 1.1,
      vct: 4.4,
      cd: 0,
      element: ElementType.Wind,
      isMatk: true,
      totalHit: 6,
      formula: (): number => {
        return 150;
      },
    },
    {
      label: 'Exploding Dragon Lv5',
      name: 'Exploding Dragon',
      value: 'Exploding Dragon==5',
      acd: 0.5,
      fct: 0.8,
      vct: 2,
      cd: 0.3,
      element: ElementType.Fire,
      isMatk: true,
      hit: 3,
      formula: (input: AtkSkillFormulaInput): number => {
        const { skillLevel } = input;

        return 150 + skillLevel * 150;
      },
    },
    {
      label: 'Snow Flake Draft Lv5',
      name: 'Snow Flake Draft',
      value: 'Snow Flake Draft==5',
      acd: 0.5,
      fct: 0.8,
      vct: 2.5,
      cd: 0.3,
      element: ElementType.Water,
      isMatk: true,
      hit: 5,
      formula: (input: AtkSkillFormulaInput): number => {
        const { skillLevel } = input;

        return 150 + skillLevel * 150;
      },
    },
    {
      label: 'First Wind Lv5',
      name: 'First Wind',
      value: 'First Wind==5',
      acd: 0.5,
      fct: 0.8,
      vct: 2.5,
      cd: 0.3,
      element: ElementType.Wind,
      isMatk: true,
      hit: 5,
      formula: (input: AtkSkillFormulaInput): number => {
        const { skillLevel } = input;

        return 100 + skillLevel * 100;
      },
    },
  ];

  protected readonly _activeSkillList: ActiveSkillModel[] = [ShadowWarrior, S16thNight, DistortedCrescent];

  protected readonly _passiveSkillList: PassiveSkillModel[] = [
    {
      label: 'Flaming Petals 10',
      name: 'Flaming Petals',
      inputType: 'selectButton',
      dropdown: [
        { label: 'Yes', value: 10, skillLv: 10, isUse: true },
        { label: 'No', value: 0, isUse: false },
      ],
    },
    {
      label: 'Freezing Spear 10',
      name: 'Freezing Spear',
      inputType: 'selectButton',
      dropdown: [
        { label: 'Yes', value: 10, skillLv: 10, isUse: true },
        { label: 'No', value: 0, isUse: false },
      ],
    },
    {
      label: 'Wind Blade 10',
      name: 'Wind Blade',
      inputType: 'selectButton',
      dropdown: [
        { label: 'Yes', value: 10, skillLv: 10, isUse: true },
        { label: 'No', value: 0, isUse: false },
      ],
    },
    {
      label: 'Illusion-Bewitch',
      name: 'Illusion - Bewitch',
      inputType: 'dropdown',
      dropdown: [
        { label: '-', value: 0, isUse: false },
        { label: 'Lv 1', value: 1, skillLv: 1, isUse: true },
        { label: 'Lv 2', value: 2, skillLv: 2, isUse: true },
        { label: 'Lv 3', value: 3, skillLv: 3, isUse: true },
        { label: 'Lv 4', value: 4, skillLv: 4, isUse: true },
        { label: 'Lv 5', value: 5, skillLv: 5, isUse: true },
      ],
    },
    {
      label: 'Illusion-Death',
      name: 'Illusion - Death',
      inputType: 'dropdown',
      dropdown: [
        { label: '-', value: 0, isUse: false },
        { label: 'Lv 1', value: 1, skillLv: 1, isUse: true },
        { label: 'Lv 2', value: 2, skillLv: 2, isUse: true },
        { label: 'Lv 3', value: 3, skillLv: 3, isUse: true },
        { label: 'Lv 4', value: 4, skillLv: 4, isUse: true },
        { label: 'Lv 5', value: 5, skillLv: 5, isUse: true },
      ],
    },
    {
      label: 'Illusion-Shock',
      name: 'Illusion - Shock',
      inputType: 'dropdown',
      dropdown: [
        { label: '-', value: 0, isUse: false },
        { label: 'Lv 1', value: 1, skillLv: 1, isUse: true },
        { label: 'Lv 2', value: 2, skillLv: 2, isUse: true },
        { label: 'Lv 3', value: 3, skillLv: 3, isUse: true },
        { label: 'Lv 4', value: 4, skillLv: 4, isUse: true },
        { label: 'Lv 5', value: 5, skillLv: 5, isUse: true },
      ],
    },
    {
      label: 'Moonlight Fantasy',
      name: 'Moonlight Fantasy',
      inputType: 'dropdown',
      dropdown: [
        { label: '-', value: 0, isUse: false },
        { label: 'Lv 1', value: 1, skillLv: 1, isUse: true },
        { label: 'Lv 2', value: 2, skillLv: 2, isUse: true },
        { label: 'Lv 3', value: 3, skillLv: 3, isUse: true },
        { label: 'Lv 4', value: 4, skillLv: 4, isUse: true },
        { label: 'Lv 5', value: 5, skillLv: 5, isUse: true },
      ],
    },
  ];

  constructor() {
    super();

    this.inheritBaseClass(new Ninja());
  }

  override getMasteryAtk(info: InfoForClass): number {
    return this.calcHiddenMasteryAtk(info).totalAtk;
  }

  override getMasteryMatk(info: InfoForClass): number {
    const _16Night = this.activeSkillLv('16th Night');
    if (_16Night <= 0) return 0;

    const { model } = info;

    return floor((model.jobLevel * _16Night) / 2);
  }

  override setAdditionalBonus(params: InfoForClass) {
    const { totalBonus, model } = params;
    if (this.isSkillActive('Distorted Crescent')) {
      const bonus = floor(model.level / 3) + 100;
      totalBonus.atk += bonus;
      totalBonus.matk += bonus;
    }

    return totalBonus;
  }
}
