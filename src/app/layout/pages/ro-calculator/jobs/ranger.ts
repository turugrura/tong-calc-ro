import { ClassName } from './_class-name';
import {
  ActiveSkillModel,
  AtkSkillFormulaInput,
  AtkSkillModel,
  CharacterBase,
  PassiveSkillModel,
} from './_character-base.abstract';
import { Archer } from './archer';
import { NoLimit } from '../constants/share-active-skills';
import { InfoForClass } from '../models/info-for-class.model';

const jobBonusTable: Record<number, [number, number, number, number, number, number]> = {
  1: [0, 0, 0, 0, 1, 0],
  2: [0, 0, 0, 1, 1, 0],
  3: [0, 0, 0, 2, 1, 0],
  4: [0, 1, 0, 2, 1, 0],
  5: [0, 1, 0, 2, 1, 0],
  6: [0, 1, 0, 2, 1, 0],
  7: [0, 2, 0, 2, 1, 0],
  8: [0, 2, 0, 2, 2, 0],
  9: [0, 2, 0, 3, 2, 0],
  10: [0, 2, 0, 3, 2, 0],
  11: [0, 2, 0, 3, 2, 0],
  12: [0, 2, 1, 3, 2, 0],
  13: [0, 2, 2, 3, 2, 0],
  14: [0, 2, 3, 3, 2, 0],
  15: [0, 2, 3, 3, 2, 0],
  16: [0, 2, 3, 3, 2, 0],
  17: [0, 2, 3, 3, 3, 0],
  18: [0, 3, 3, 3, 3, 0],
  19: [0, 3, 3, 3, 3, 0],
  20: [0, 3, 3, 3, 3, 0],
  21: [0, 3, 3, 4, 3, 0],
  22: [0, 3, 4, 4, 3, 0],
  23: [0, 3, 4, 4, 4, 0],
  24: [0, 3, 4, 4, 4, 0],
  25: [0, 3, 4, 4, 4, 0],
  26: [1, 3, 4, 4, 4, 0],
  27: [2, 3, 4, 4, 4, 0],
  28: [2, 3, 4, 4, 4, 0],
  29: [2, 3, 4, 4, 4, 0],
  30: [2, 3, 4, 4, 5, 0],
  31: [2, 4, 4, 4, 5, 0],
  32: [2, 4, 5, 4, 5, 0],
  33: [2, 4, 5, 4, 5, 0],
  34: [2, 4, 5, 4, 5, 0],
  35: [2, 4, 5, 4, 5, 0],
  36: [2, 4, 5, 5, 5, 0],
  37: [2, 4, 5, 6, 5, 0],
  38: [2, 4, 5, 7, 5, 0],
  39: [2, 5, 5, 7, 5, 0],
  40: [2, 5, 5, 7, 5, 0],
  41: [2, 5, 5, 7, 5, 0],
  42: [2, 5, 5, 7, 5, 0],
  43: [2, 6, 5, 7, 5, 0],
  44: [2, 6, 5, 7, 6, 0],
  45: [2, 7, 5, 7, 6, 0],
  46: [2, 7, 5, 7, 6, 0],
  47: [2, 7, 5, 7, 6, 0],
  48: [2, 7, 5, 7, 6, 0],
  49: [2, 7, 5, 8, 6, 0],
  50: [2, 8, 5, 8, 6, 0],
  51: [2, 8, 5, 8, 6, 1],
  52: [2, 8, 5, 8, 7, 1],
  53: [2, 8, 5, 8, 7, 1],
  54: [2, 8, 5, 9, 7, 1],
  55: [2, 9, 5, 9, 7, 1],
  56: [2, 9, 5, 9, 7, 1],
  57: [2, 9, 6, 9, 7, 1],
  58: [2, 9, 6, 9, 7, 2],
  59: [2, 9, 6, 9, 8, 2],
  60: [2, 10, 6, 9, 8, 2],
  61: [2, 10, 6, 9, 8, 2],
  62: [2, 10, 6, 9, 8, 2],
  63: [2, 10, 6, 9, 8, 2],
  64: [2, 11, 7, 9, 8, 2],
  65: [2, 11, 7, 9, 8, 3],
  66: [2, 11, 7, 9, 8, 3],
  67: [2, 11, 7, 9, 8, 3],
  68: [2, 11, 7, 9, 8, 3],
  69: [2, 11, 7, 9, 8, 3],
  70: [2, 12, 8, 9, 8, 4],
};

export class Ranger extends CharacterBase {
  protected readonly CLASS_NAME = ClassName.Ranger;
  protected readonly JobBonusTable = jobBonusTable;

  protected initialStatusPoint = 100;
  protected classNames = [
    'Hi-Class',
    'Only 3rd Cls',
    'Ranger',
    'Ranger Cls',
    'Ranger Class',
    'Sniper',
    'Sniper Cls',
    'Sniper Class',
    'Hunter',
    'Hunter Cls',
    'Hunter Class',
  ];
  protected _atkSkillList: AtkSkillModel[] = [
    {
      label: 'Arrow Storm Lv10',
      name: 'Arrow Storm',
      value: 'Arrow Storm==10',
      acd: 0,
      fct: 0,
      vct: 2,
      cd: 3.2,
      hit: 3,
      formula: (input: AtkSkillFormulaInput): number => {
        const { model, skillLevel } = input;
        const baseLevel = model.level;

        return (1000 + 80 * skillLevel) * (baseLevel / 100);
      },
    },
    {
      label: '[Improved] Arrow Storm Lv10',
      name: 'Arrow Storm',
      value: '[Improved] Arrow Storm==10',
      acd: 0,
      fct: 0.3,
      vct: 2,
      cd: 3.2,
      hit: 3,
      formula: (input: AtkSkillFormulaInput): number => {
        const { model, skillLevel } = input;
        const baseLevel = model.level;
        const fearBreezeBonus = this.isSkillActive('Fear Breeze') ? 70 : 0;

        return (200 + (180 + fearBreezeBonus) * skillLevel) * (baseLevel / 100);
      },
    },
    {
      label: 'Focused Arrow Lv5',
      name: 'Focused Arrow Strike',
      value: 'Focused Arrow Strike==5',
      acd: 0.5,
      fct: 0.5,
      vct: 0.5,
      cd: 0.15,
      canCri: true,
      baseCri: 50,
      formula: (input: AtkSkillFormulaInput): number => {
        const { model, skillLevel } = input;
        const baseLevel = model.level;

        return (150 + skillLevel * 200) * (baseLevel / 100);
      },
    },
    {
      label: 'Aimed Bolt Lv10',
      name: 'Aimed Bolt',
      value: 'Aimed Bolt==10',
      acd: 2,
      fct: 1,
      vct: 2,
      cd: 1,
      totalHit: (monsterSize) => {
        const map = {
          s: 3,
          m: 4,
          l: 5,
        } as const;

        return map[monsterSize];
      },
      levelList: [],
      formula: (input: AtkSkillFormulaInput): number => {
        const { model, skillLevel } = input;
        const baseLevel = model.level;

        return (500 + skillLevel * 20) * (baseLevel / 100);
      },
    },
    {
      label: '[Improved] Aimed Bolt Lv10',
      name: 'Aimed Bolt',
      value: '[Improved] Aimed Bolt==10',
      acd: 1,
      fct: 1,
      vct: 0,
      cd: 1,
      totalHit: 5,
      levelList: [],
      formula: (input: AtkSkillFormulaInput): number => {
        const { model, skillLevel } = input;
        const baseLevel = model.level;
        if (this.isSkillActive('Fear Breeze')) {
          return (800 + skillLevel * 35) * (baseLevel / 100);
        }

        return (500 + skillLevel * 20) * (baseLevel / 100);
      },
    },
  ];
  protected _activeSkillList: ActiveSkillModel[] = [
    {
      isEquipAtk: true,
      inputType: 'selectButton',
      label: 'Wind Walk 5',
      name: 'Wind Walk',
      dropdown: [
        { label: 'Yes', value: 'Wind Walk==5', skillLv: 5, isUse: true, bonus: { flee: 5 } },
        { label: 'No', value: 0, isUse: false },
      ],
    },
    {
      isEquipAtk: true,
      inputType: 'selectButton',
      label: 'Falcon Eyes 10',
      name: 'Falcon Eyes',
      dropdown: [
        {
          label: 'Yes',
          value: 'Falcon Eyes==10',
          skillLv: 10,
          isUse: true,
          bonus: { flatDmg: 20, hit: 30, cri: 10, allStatus: 5 },
        },
        { label: 'No', value: 0, isUse: false },
      ],
    },
    {
      label: 'Fear Breeze 10',
      name: 'Fear Breeze',
      inputType: 'selectButton',
      isMasteryAtk: true,
      dropdown: [
        { label: 'Yes', value: 10, skillLv: 10, isUse: true },
        { label: 'No', value: 0, isUse: false },
      ],
    },
    NoLimit,
  ];

  protected _passiveSkillList: PassiveSkillModel[] = [
    {
      label: 'Beast Bane',
      name: 'Beast Bane',
      inputType: 'dropdown',
      isMasteryAtk: true,
      dropdown: [
        { label: '0', value: 0, isUse: false },
        { label: '1', value: 1, skillLv: 1, isUse: true, bonus: { x_race_brute_atk: 4, x_race_insect_atk: 4 } },
        { label: '2', value: 2, skillLv: 2, isUse: true, bonus: { x_race_brute_atk: 8, x_race_insect_atk: 8 } },
        { label: '3', value: 3, skillLv: 3, isUse: true, bonus: { x_race_brute_atk: 12, x_race_insect_atk: 12 } },
        { label: '4', value: 4, skillLv: 4, isUse: true, bonus: { x_race_brute_atk: 16, x_race_insect_atk: 16 } },
        { label: '5', value: 5, skillLv: 5, isUse: true, bonus: { x_race_brute_atk: 20, x_race_insect_atk: 20 } },
        { label: '6', value: 6, skillLv: 6, isUse: true, bonus: { x_race_brute_atk: 24, x_race_insect_atk: 24 } },
        { label: '7', value: 7, skillLv: 7, isUse: true, bonus: { x_race_brute_atk: 28, x_race_insect_atk: 28 } },
        { label: '8', value: 8, skillLv: 8, isUse: true, bonus: { x_race_brute_atk: 32, x_race_insect_atk: 32 } },
        { label: '9', value: 9, skillLv: 9, isUse: true, bonus: { x_race_brute_atk: 36, x_race_insect_atk: 36 } },
        { label: '10', value: 10, skillLv: 10, isUse: true, bonus: { x_race_brute_atk: 40, x_race_insect_atk: 40 } },
      ],
    },
    {
      label: 'Steel Crow',
      name: 'Steel Crow',
      inputType: 'dropdown',
      isMasteryAtk: true,
      dropdown: [
        { label: '0', value: 0, isUse: false },
        { label: '1', value: 1, skillLv: 1, isUse: true, bonus: { falconDmg: 6 } },
        { label: '2', value: 2, skillLv: 2, isUse: true, bonus: { falconDmg: 12 } },
        { label: '3', value: 3, skillLv: 3, isUse: true, bonus: { falconDmg: 18 } },
        { label: '4', value: 4, skillLv: 4, isUse: true, bonus: { falconDmg: 24 } },
        { label: '5', value: 5, skillLv: 5, isUse: true, bonus: { falconDmg: 30 } },
        { label: '6', value: 6, skillLv: 6, isUse: true, bonus: { falconDmg: 36 } },
        { label: '7', value: 7, skillLv: 7, isUse: true, bonus: { falconDmg: 42 } },
        { label: '8', value: 8, skillLv: 8, isUse: true, bonus: { falconDmg: 48 } },
        { label: '9', value: 9, skillLv: 9, isUse: true, bonus: { falconDmg: 54 } },
        { label: '10', value: 10, skillLv: 10, isUse: true, bonus: { falconDmg: 60 } },
      ],
    },
    {
      inputType: 'selectButton',
      label: 'Falcon Eyes 10',
      name: 'Falcon Eyes',
      dropdown: [
        { label: 'Yes', value: 10, skillLv: 10, isUse: true },
        { label: 'No', value: 0, isUse: false },
      ],
    },
    {
      isMasteryAtk: true,
      inputType: 'dropdown',
      label: 'Main Ranger',
      name: 'Main Ranger',
      dropdown: [
        { label: '0', value: 0, isUse: false },
        {
          label: '1',
          value: 1,
          skillLv: 1,
          isUse: true,
          bonus: { x_race_brute_atk: 5, x_race_plant_atk: 5, x_race_fish_atk: 5 },
        },
        {
          label: '2',
          value: 2,
          skillLv: 2,
          isUse: true,
          bonus: { x_race_brute_atk: 10, x_race_plant_atk: 10, x_race_fish_atk: 10 },
        },
        {
          label: '3',
          value: 3,
          skillLv: 3,
          isUse: true,
          bonus: { x_race_brute_atk: 15, x_race_plant_atk: 15, x_race_fish_atk: 15 },
        },
        {
          label: '4',
          value: 4,
          skillLv: 4,
          isUse: true,
          bonus: { x_race_brute_atk: 20, x_race_plant_atk: 20, x_race_fish_atk: 20 },
        },
        {
          label: '5',
          value: 5,
          skillLv: 5,
          isUse: true,
          bonus: { x_race_brute_atk: 25, x_race_plant_atk: 25, x_race_fish_atk: 25 },
        },
        {
          label: '6',
          value: 6,
          skillLv: 6,
          isUse: true,
          bonus: { x_race_brute_atk: 30, x_race_plant_atk: 30, x_race_fish_atk: 30 },
        },
        {
          label: '7',
          value: 7,
          skillLv: 7,
          isUse: true,
          bonus: { x_race_brute_atk: 35, x_race_plant_atk: 35, x_race_fish_atk: 35 },
        },
        {
          label: '8',
          value: 8,
          skillLv: 8,
          isUse: true,
          bonus: { x_race_brute_atk: 40, x_race_plant_atk: 40, x_race_fish_atk: 40 },
        },
        {
          label: '9',
          value: 9,
          skillLv: 9,
          isUse: true,
          bonus: { x_race_brute_atk: 45, x_race_plant_atk: 45, x_race_fish_atk: 45 },
        },
        {
          label: '10',
          value: 10,
          skillLv: 10,
          isUse: true,
          bonus: { x_race_brute_atk: 50, x_race_plant_atk: 50, x_race_fish_atk: 50 },
        },
      ],
    },
    {
      label: 'Trap Research',
      name: 'Trap Research',
      inputType: 'dropdown',
      isEquipAtk: true,
      dropdown: [
        { label: '0', value: 0, isUse: false },
        { label: '1', value: 1, skillLv: 1, isUse: true, bonus: { int: 1, sp: 220 } },
        { label: '2', value: 2, skillLv: 2, isUse: true, bonus: { int: 2, sp: 240 } },
        { label: '3', value: 3, skillLv: 3, isUse: true, bonus: { int: 3, sp: 260 } },
        { label: '4', value: 4, skillLv: 4, isUse: true, bonus: { int: 4, sp: 280 } },
        { label: '5', value: 5, skillLv: 5, isUse: true, bonus: { int: 5, sp: 300 } },
        { label: '6', value: 6, skillLv: 6, isUse: true, bonus: { int: 6, sp: 320 } },
        { label: '7', value: 7, skillLv: 7, isUse: true, bonus: { int: 7, sp: 340 } },
        { label: '8', value: 8, skillLv: 8, isUse: true, bonus: { int: 8, sp: 360 } },
        { label: '9', value: 9, skillLv: 9, isUse: true, bonus: { int: 9, sp: 380 } },
        { label: '10', value: 10, skillLv: 10, isUse: true, bonus: { int: 10, sp: 400 } },
      ],
    },
    {
      label: 'Wug Strike',
      name: 'Wug Strike',
      inputType: 'dropdown',
      dropdown: [
        { label: '0', value: 0, isUse: false },
        { label: '1', value: 1, skillLv: 1, isUse: true },
        { label: '2', value: 2, skillLv: 2, isUse: true },
        { label: '3', value: 3, skillLv: 3, isUse: true },
        { label: '4', value: 4, skillLv: 4, isUse: true },
        { label: '5', value: 5, skillLv: 5, isUse: true },
      ],
    },
  ];

  constructor() {
    super();

    this.inheritBaseClass(new Archer());
  }

  override getMasteryAtk(info: InfoForClass): number {
    const { monster } = info;

    return this.calcHiddenMasteryAtk(info, { prefix: `x_race_${monster.race}` }).totalAtk;
  }
}
