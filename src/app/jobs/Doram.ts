import { ElementType } from '../constants/element-type.const';
import { ActiveSkillModel, AtkSkillFormulaInput, AtkSkillModel, CharacterBase, PassiveSkillModel } from './_character-base.abstract';
import { ClassName } from './_class-name';

const jobBonusTable: Record<number, [number, number, number, number, number, number]> = {
  1: [0, 0, 0, 0, 1, 0],
  2: [0, 0, 0, 0, 1, 0],
  3: [0, 0, 1, 0, 1, 0],
  4: [0, 0, 1, 0, 1, 0],
  5: [0, 0, 1, 0, 2, 0],
  6: [0, 0, 2, 0, 2, 0],
  7: [0, 0, 2, 0, 2, 0],
  8: [0, 1, 2, 0, 2, 0],
  9: [0, 1, 2, 1, 2, 0],
  10: [0, 1, 2, 1, 2, 0],
  11: [0, 2, 2, 1, 2, 0],
  12: [0, 2, 2, 2, 2, 0],
  13: [0, 2, 2, 2, 3, 0],
  14: [0, 2, 2, 2, 3, 0],
  15: [0, 3, 2, 2, 3, 0],
  16: [0, 3, 2, 3, 3, 0],
  17: [0, 3, 2, 3, 4, 0],
  18: [0, 3, 2, 3, 4, 0],
  19: [0, 4, 2, 3, 4, 0],
  20: [0, 4, 2, 4, 4, 0],
  21: [0, 4, 2, 4, 5, 0],
  22: [0, 4, 2, 4, 5, 0],
  23: [0, 4, 2, 4, 5, 1],
  24: [0, 4, 3, 4, 5, 1],
  25: [0, 4, 3, 4, 6, 1],
  26: [0, 4, 3, 4, 6, 1],
  27: [0, 5, 3, 4, 6, 1],
  28: [0, 5, 3, 4, 6, 1],
  29: [0, 5, 3, 4, 6, 2],
  30: [0, 5, 3, 4, 6, 2],
  31: [0, 5, 3, 5, 6, 2],
  32: [0, 5, 3, 5, 7, 2],
  33: [0, 5, 3, 5, 7, 2],
  34: [0, 5, 3, 5, 7, 3],
  35: [0, 5, 3, 5, 7, 3],
  36: [0, 5, 3, 6, 7, 3],
  37: [0, 5, 3, 6, 7, 4],
  38: [0, 5, 3, 6, 7, 4],
  39: [0, 6, 3, 6, 7, 4],
  40: [0, 6, 3, 6, 7, 4],
  41: [0, 6, 3, 6, 8, 4],
  42: [0, 6, 3, 7, 8, 4],
  43: [0, 6, 4, 7, 8, 4],
  44: [0, 6, 4, 7, 8, 4],
  45: [0, 6, 4, 7, 9, 4],
  46: [0, 6, 4, 7, 9, 5],
  47: [0, 6, 5, 7, 9, 5],
  48: [0, 7, 5, 7, 9, 5],
  49: [0, 7, 5, 7, 9, 5],
  50: [0, 7, 5, 7, 10, 5],
  51: [0, 7, 5, 7, 10, 5],
  52: [0, 7, 5, 7, 10, 5],
  53: [0, 7, 5, 7, 10, 5],
  54: [0, 7, 5, 7, 10, 5],
  55: [0, 7, 5, 7, 11, 5],
  56: [0, 7, 5, 7, 11, 5],
  57: [0, 7, 5, 7, 11, 5],
  58: [0, 7, 5, 7, 11, 5],
  59: [0, 7, 5, 7, 11, 5],
  60: [0, 7, 5, 9, 12, 5],
  61: [0, 7, 5, 9, 12, 5],
  62: [0, 7, 5, 9, 12, 5],
  63: [0, 7, 5, 9, 12, 5],
  64: [0, 7, 5, 9, 12, 5],
  65: [0, 7, 5, 9, 12, 5],
  66: [0, 7, 5, 9, 12, 5],
  67: [0, 7, 5, 9, 12, 5],
  68: [0, 7, 5, 9, 12, 5],
  69: [0, 7, 5, 9, 12, 5],
  70: [0, 7, 5, 9, 12, 5],
};

export const ColorOfHyunrokValue = {
  1: ElementType.Water,
  2: ElementType.Wind,
  3: ElementType.Earth,
  4: ElementType.Fire,
  5: ElementType.Dark,
  6: ElementType.Holy,
  7: ElementType.Neutral,
} as const;

export class Doram extends CharacterBase {
  protected override CLASS_NAME = ClassName.Doram;
  protected override JobBonusTable = jobBonusTable;
  protected override initialStatusPoint = 48;

  protected readonly classNames = [ClassName.Doram];

  protected readonly _atkSkillList: AtkSkillModel[] = [
    {
      name: 'Silvervine Stem Spear',
      label: 'Silvervine Stem Spear',
      value: 'Silvervine Stem Spear==1',
      acd: 1,
      fct: 0.5,
      vct: 2,
      cd: 1,
      isMatk: true,
      getElement: (skillValue) => {
        const map = {
          'Silvervine Stem Spear==1': ElementType.Earth,
          'Silvervine Stem Spear==2': ElementType.Fire,
          'Silvervine Stem Spear==3': ElementType.Water,
          'Silvervine Stem Spear==4': ElementType.Wind,
          'Silvervine Stem Spear==5': ElementType.Ghost,
        };
        return map[skillValue];
      },
      levelList: [
        { label: 'Silvervine Stem Spear Lv1 (Earth)', value: 'Silvervine Stem Spear==1' },
        { label: 'Silvervine Stem Spear Lv2 (Fire)', value: 'Silvervine Stem Spear==2' },
        { label: 'Silvervine Stem Spear Lv3 (Wind)', value: 'Silvervine Stem Spear==3' },
        { label: 'Silvervine Stem Spear Lv4 (Water)', value: 'Silvervine Stem Spear==4' },
        { label: 'Silvervine Stem Spear Lv5 (Ghost)', value: 'Silvervine Stem Spear==5' },
      ],
      formula: (_input: AtkSkillFormulaInput): number => {
        return 700;
      },
    },
    {
      label: 'Catnip Meteor Lv5',
      name: 'Catnip Meteor',
      value: 'Catnip Meteor==5',
      acd: 1,
      fct: 1.5,
      vct: 2,
      cd: 5,
      isMatk: true,
      totalHit: 7,
      getElement: () => ColorOfHyunrokValue[this.activeSkillLv('Colors of Hynrok')] || ElementType.Neutral,
      formula: (input: AtkSkillFormulaInput): number => {
        const { skillLevel, model, status } = input;
        const baseLevel = model.level;
        const { totalInt } = status;

        return (200 + skillLevel * 100 + totalInt * 5) * (baseLevel / 100);
      },
    },
    {
      label: 'Picky Peck Lv5',
      name: 'Picky Peck',
      value: 'Picky Peck==5',
      acd: 1,
      fct: 0,
      vct: 1,
      cd: 0,
      hit: 5,
      formula: (input: AtkSkillFormulaInput): number => {
        const { skillLevel } = input;
        const bonus = this.learnLv('Sprit Of Life') > 0 ? 2.2 : 1;

        return (200 + skillLevel * 100) * bonus;
      },
    },
    {
      label: 'Lunatic Carrot Beat Lv5',
      name: 'Lunatic Carrot Beat',
      value: 'Lunatic Carrot Beat==5',
      acd: 1,
      fct: 1,
      vct: 0,
      cd: 6,
      hit: 3,
      formula: (input: AtkSkillFormulaInput): number => {
        const { skillLevel, model, status } = input;
        const baseLevel = model.level;
        const { totalStr } = status;

        const bonus = this.learnLv('Sprit Of Life') > 0 ? 2.2 : 1;

        return (200 + skillLevel * 100 + totalStr * 5) * bonus * (baseLevel / 100);
      },
    },
  ];

  protected readonly _activeSkillList: ActiveSkillModel[] = [
    {
      label: 'Arclouse Dash',
      name: 'Arclouse Dash',
      inputType: 'dropdown',
      isEquipAtk: true,
      dropdown: [
        { label: '-', value: 0, isUse: false },
        { label: 'Lv 1', value: 1, isUse: true, bonus: { agi: 20, range: 10 } },
        { label: 'Lv 2', value: 2, isUse: true, bonus: { agi: 25, range: 10 } },
        { label: 'Lv 3', value: 3, isUse: true, bonus: { agi: 30, range: 10 } },
        { label: 'Lv 4', value: 4, isUse: true, bonus: { agi: 35, range: 10 } },
        { label: 'Lv 5', value: 5, isUse: true, bonus: { agi: 40, range: 10 } },
      ],
    },
    {
      label: 'Bunch of Shrimp 5',
      name: 'Bunch of Shrimp',
      inputType: 'selectButton',
      dropdown: [
        { label: 'Yes', value: 5, skillLv: 5, isUse: true, bonus: { atkPercent: 10, matkPercent: 10 } },
        { label: 'No', value: 0, isUse: false },
      ],
    },
  ];

  protected readonly _passiveSkillList: PassiveSkillModel[] = [
    {
      label: 'Power of Sea',
      name: 'Power of Sea',
      inputType: 'dropdown',
      dropdown: [
        { label: '-', value: 0, isUse: false },
        { label: 'Lv 1', value: 1, isUse: true, bonus: { hp: 1000, sp: 100, healPercent: 10 } },
        { label: '+ Bonus', value: 2, isUse: true, bonus: { hp: 3000, sp: 300, healPercent: 20 } },
      ],
    },
    {
      label: 'Power of Land',
      name: 'Power of Land',
      inputType: 'dropdown',
      dropdown: [
        { label: '-', value: 0, isUse: false },
        { label: 'Lv 1', value: 1, isUse: true, bonus: { int: 20 } },
        { label: '+ Bonus', value: 2, isUse: true, bonus: { int: 20, matkPercent: 20 } },
      ],
    },
    {
      label: 'Power of Life',
      name: 'Power of Life',
      inputType: 'dropdown',
      dropdown: [
        { label: '-', value: 0, isUse: false },
        { label: 'Lv 1', value: 1, isUse: true, bonus: { flee: 20, hit: 20, cri: 20 } },
        { label: '+ Bonus', value: 2, isUse: true, bonus: { flee: 20, hit: 20, cri: 20, range: 20 } },
      ],
    },
    {
      label: 'Nyang Grass',
      name: 'Nyang Grass',
      inputType: 'dropdown',
      dropdown: [
        { label: '-', value: 0, isUse: false },
        // { label: 'Lv 1', value: 1, skillLv: 1, isUse: true },
        // { label: 'Lv 2', value: 2, skillLv: 2, isUse: true },
        // { label: 'Lv 3', value: 3, skillLv: 3, isUse: true },
        // { label: 'Lv 4', value: 4, skillLv: 4, isUse: true },
        { label: 'Lv 5', value: 5, skillLv: 5, isUse: true },
      ],
    },
    {
      label: 'Meow Meow',
      name: 'Meow Meow',
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
      label: 'Chattering',
      name: 'Chattering',
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
      label: 'Scratch',
      name: 'Scratch',
      inputType: 'dropdown',
      dropdown: [
        { label: '-', value: 0, isUse: false },
        { label: 'Lv 1', value: 1, skillLv: 1, isUse: true },
        { label: 'Lv 2', value: 2, skillLv: 2, isUse: true },
        { label: 'Lv 3', value: 3, skillLv: 3, isUse: true },
      ],
    },
    {
      label: 'Hiss',
      name: 'Hiss',
      inputType: 'dropdown',
      dropdown: [
        { label: '-', value: 0, isUse: false },
        { label: 'Lv 1', value: 1, isUse: true },
        { label: 'Lv 2', value: 2, isUse: true },
        { label: 'Lv 3', value: 3, isUse: true },
        { label: 'Lv 4', value: 4, isUse: true },
        { label: 'Lv 5', value: 5, skillLv: 5, isUse: true },
      ],
    },
    {
      label: 'Power of Flock',
      name: 'Power of Flock',
      inputType: 'dropdown',
      dropdown: [
        { label: '-', value: 0, isUse: false },
        { label: 'Lv 1', value: 1, isUse: true },
        { label: 'Lv 2', value: 2, isUse: true },
        { label: 'Lv 3', value: 3, isUse: true },
        { label: 'Lv 4', value: 4, isUse: true },
        { label: 'Lv 5', value: 5, skillLv: 5, isUse: true },
      ],
    },
    {
      label: 'Spirit of Savage',
      name: 'Spirit of Savage',
      inputType: 'dropdown',
      dropdown: [
        { label: '-', value: 0, isUse: false },
        { label: 'Lv 1', value: 1, isUse: true },
        { label: 'Lv 2', value: 2, isUse: true },
        { label: 'Lv 3', value: 3, isUse: true },
        { label: 'Lv 4', value: 4, isUse: true },
        { label: 'Lv 5', value: 5, skillLv: 5, isUse: true },
      ],
    },
    {
      label: 'Silvervine Root Twist',
      name: 'Silvervine Root Twist',
      inputType: 'dropdown',
      dropdown: [
        { label: '-', value: 0, isUse: false },
        { label: 'Lv 1', value: 1, isUse: true },
        { label: 'Lv 2', value: 2, isUse: true },
        { label: 'Lv 3', value: 3, isUse: true },
        { label: 'Lv 4', value: 4, isUse: true },
        { label: 'Lv 5', value: 5, skillLv: 5, isUse: true },
      ],
    },
    {
      label: 'Sprit Of Life',
      name: 'Sprit Of Life',
      inputType: 'selectButton',
      dropdown: [
        { label: 'Yes', value: 1, skillLv: 1, isUse: true },
        { label: 'No', value: 0, isUse: false },
      ],
    },
    {
      label: 'Picky Peck',
      name: 'Picky Peck',
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
    {
      label: 'Silvervine Stem Spear',
      name: 'Silvervine Stem Spear',
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
    {
      label: 'Frash Shrimp',
      name: 'Frash Shrimp',
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
    {
      label: 'Arclouse Dash',
      name: 'Arclouse Dash',
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
}
