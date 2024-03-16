import { ClassName } from './_class-name';
import {
  ActiveSkillModel,
  AtkSkillFormulaInput,
  AtkSkillModel,
  CharacterBase,
  PassiveSkillModel,
} from './_character-base.abstract';
import { DarkClawFn, NoLimit, ShieldSpellFn } from '../constants/share-active-skills';
import { Thief } from './thief';
import { InfoForClass } from '../models/info-for-class.model';
import { ElementType } from '../constants/element-type.const';
import { DoubleStrafeFn, SnatcherFn, VulturesEyeFn } from '../constants/share-passive-skills';

const jobBonusTable: Record<number, [number, number, number, number, number, number]> = {
  1: [0, 0, 0, 0, 0, 1],
  2: [1, 0, 0, 0, 0, 1],
  3: [1, 0, 0, 0, 0, 1],
  4: [1, 0, 0, 0, 0, 1],
  5: [2, 0, 0, 0, 0, 1],
  6: [2, 0, 0, 0, 0, 1],
  7: [2, 0, 0, 0, 0, 2],
  8: [2, 1, 0, 0, 0, 2],
  9: [2, 1, 0, 0, 1, 2],
  10: [2, 1, 0, 1, 1, 2],
  11: [2, 1, 0, 1, 1, 2],
  12: [2, 1, 0, 1, 1, 2],
  13: [2, 1, 0, 2, 1, 2],
  14: [2, 1, 0, 2, 1, 3],
  15: [2, 1, 0, 2, 1, 3],
  16: [2, 1, 0, 2, 1, 3],
  17: [2, 2, 0, 2, 1, 3],
  18: [2, 2, 0, 2, 1, 3],
  19: [2, 2, 1, 2, 1, 3],
  20: [2, 2, 2, 2, 1, 3],
  21: [2, 2, 2, 3, 1, 3],
  22: [2, 2, 2, 3, 2, 3],
  23: [2, 2, 2, 3, 2, 3],
  24: [2, 2, 2, 3, 2, 3],
  25: [2, 2, 3, 3, 2, 3],
  26: [2, 2, 3, 3, 2, 4],
  27: [2, 2, 3, 3, 2, 4],
  28: [2, 2, 3, 3, 2, 4],
  29: [2, 2, 4, 3, 2, 4],
  30: [2, 2, 4, 3, 2, 4],
  31: [3, 2, 4, 3, 2, 4],
  32: [4, 2, 4, 3, 2, 4],
  33: [4, 2, 5, 3, 2, 4],
  34: [4, 2, 5, 3, 2, 5],
  35: [4, 2, 5, 3, 2, 5],
  36: [4, 2, 5, 3, 2, 5],
  37: [4, 2, 5, 4, 2, 5],
  38: [4, 2, 5, 5, 2, 5],
  39: [4, 2, 5, 5, 2, 5],
  40: [4, 2, 5, 5, 2, 5],
  41: [4, 2, 5, 5, 2, 5],
  42: [4, 2, 6, 5, 2, 5],
  43: [4, 2, 7, 5, 2, 5],
  44: [5, 2, 7, 5, 2, 5],
  45: [6, 2, 7, 5, 2, 5],
  46: [6, 2, 7, 5, 2, 5],
  47: [6, 2, 7, 5, 2, 5],
  48: [6, 2, 7, 5, 3, 5],
  49: [6, 3, 7, 5, 3, 5],
  50: [6, 3, 7, 5, 3, 5],
  51: [6, 3, 7, 6, 3, 5],
  52: [6, 3, 8, 6, 3, 5],
  53: [7, 3, 8, 6, 3, 5],
  54: [7, 4, 8, 6, 3, 5],
  55: [7, 4, 8, 6, 3, 5],
  56: [7, 4, 8, 6, 3, 6],
  57: [7, 4, 8, 6, 4, 6],
  58: [7, 4, 8, 6, 4, 6],
  59: [8, 4, 8, 6, 4, 6],
  60: [8, 5, 8, 6, 4, 6],
  61: [8, 5, 8, 6, 4, 6],
  62: [8, 5, 8, 6, 4, 6],
  63: [8, 5, 8, 6, 4, 6],
  64: [8, 5, 8, 6, 4, 6],
  65: [8, 7, 8, 6, 5, 6],
  66: [8, 7, 8, 6, 5, 6],
  67: [8, 7, 8, 6, 5, 6],
  68: [8, 7, 8, 6, 5, 6],
  69: [8, 7, 8, 6, 5, 6],
  70: [8, 9, 8, 6, 6, 6],
};

export class ShadowChaser extends CharacterBase {
  protected readonly CLASS_NAME = ClassName.ShadowChaser;
  protected readonly JobBonusTable = jobBonusTable;

  protected initialStatusPoint = 100;
  protected classNames = [
    'Hi-Class',
    'Shadow Chaser',
    'Shadow Chaser Cls',
    'Shadow Chaser Class',
    'Rogue',
    'Rogue Cls',
    'Rogue Class',
    'Stalker',
    'Stalker Cls',
    'Stalker Class',
    'Only 3rd Cls',
  ];
  protected _atkSkillList: AtkSkillModel[] = [
    {
      label: 'Fatal Manace Lv10',
      name: 'Fatal Manace',
      value: 'Fatal Manace==10',
      acd: 0.5,
      fct: 0,
      vct: 0,
      cd: 0,
      isMelee: true,
      formula: (input: AtkSkillFormulaInput): number => {
        const { model, skillLevel } = input;
        const baseLevel = model.level;

        return (100 + skillLevel * 100) * (baseLevel / 100);
      },
    },
    {
      label: 'Triangle Shot Lv10',
      name: 'Triangle Shot',
      value: 'Triangle Shot==10',
      acd: 0.5,
      fct: 0,
      vct: 1,
      cd: 0,
      hit: 3,
      formula: (input: AtkSkillFormulaInput): number => {
        const { model, skillLevel, status } = input;
        const baseLevel = model.level;
        const { totalAgi } = status;

        return (300 + (skillLevel - 1) * 0.5 * totalAgi) * (baseLevel / 120);
      },
    },
    {
      label: '[Improved] Triangle Shot Lv10',
      name: 'Triangle Shot',
      value: '[Improved] Triangle Shot==10',
      acd: 0.32,
      fct: 0,
      vct: 0,
      cd: 0.2,
      hit: 3,
      formula: (input: AtkSkillFormulaInput): number => {
        const { model, skillLevel, status } = input;
        const baseLevel = model.level;
        const { totalAgi } = status;

        return (230 * skillLevel + 3 * totalAgi) * (baseLevel / 100);
      },
    },
    {
      label: 'Feint Bomb Lv10',
      name: 'Feint Bomb',
      value: 'Feint Bomb==10',
      acd: 0,
      fct: 0,
      vct: 1,
      cd: 5,
      isMelee: true,
      formula: (input: AtkSkillFormulaInput): number => {
        const { model, skillLevel, status } = input;
        const { level: baseLevel, jobLevel } = model;
        const { totalDex } = status;

        return (1 + skillLevel) * (totalDex / 2) * (jobLevel / 10) * (baseLevel / 120);
      },
    },
    {
      label: 'Arrow Storm Lv10',
      name: 'Arrow Storm',
      value: 'Arrow Storm==10',
      acd: 0,
      fct: 0, // 0.3 future
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
      name: 'Psychic Wave',
      label: 'Psychic Wave Lv1',
      value: 'Psychic Wave==1',
      fct: 1,
      vct: 8,
      cd: 5,
      acd: 1,
      totalHit: 3,
      isMatk: true,
      formula: (input: AtkSkillFormulaInput): number => {
        const { model, skillLevel, status } = input;
        const baseLevel = model.level;
        const totalInt = status.totalInt;

        return (70 * skillLevel + 3 * totalInt) * (baseLevel / 100);
      },
    },
    {
      name: 'Psychic Wave',
      label: 'Psychic Wave Lv3',
      value: 'Psychic Wave==3',
      fct: 0.8,
      vct: 10,
      cd: 5,
      acd: 1,
      totalHit: 7,
      isMatk: true,
      formula: (input: AtkSkillFormulaInput): number => {
        const { model, skillLevel, status } = input;
        const baseLevel = model.level;
        const totalInt = status.totalInt;

        return (70 * skillLevel + 3 * totalInt) * (baseLevel / 100);
      },
    },
    {
      name: 'Psychic Wave',
      label: 'Psychic Wave Lv4',
      value: 'Psychic Wave==4',
      fct: 0.7,
      vct: 11,
      cd: 5,
      acd: 1,
      totalHit: 7,
      isMatk: true,
      formula: (input: AtkSkillFormulaInput): number => {
        const { model, skillLevel, status } = input;
        const baseLevel = model.level;
        const totalInt = status.totalInt;

        return (70 * skillLevel + 3 * totalInt) * (baseLevel / 100);
      },
    },
    {
      name: 'Psychic Wave',
      label: 'Psychic Wave Lv5',
      value: 'Psychic Wave==5',
      fct: 0.6,
      vct: 12,
      cd: 5,
      acd: 1,
      totalHit: 7,
      isMatk: true,
      formula: (input: AtkSkillFormulaInput): number => {
        const { model, skillLevel, status } = input;
        const baseLevel = model.level;
        const totalInt = status.totalInt;

        return (70 * skillLevel + 3 * totalInt) * (baseLevel / 100);
      },
    },
    {
      label: 'Comet Lv5',
      name: 'Comet',
      value: 'Comet==5',
      acd: 1.5,
      fct: 2,
      vct: 10,
      cd: 20,
      isMatk: true,
      hit: 10,
      element: ElementType.Neutral,
      formula: (input: AtkSkillFormulaInput): number => {
        const { model, skillLevel } = input;
        const baseLevel = model.level;

        return (1500 + skillLevel * 700) * (baseLevel / 100);
      },
    },
    {
      label: 'Meteor Storm Lv3',
      name: 'Meteor Storm',
      value: 'Meteor Storm==3',
      acd: 1,
      fct: 1.5,
      vct: 6.3,
      cd: 3.5,
      isMatk: true,
      element: ElementType.Fire,
      totalHit: 3,
      formula: (): number => {
        return 125;
      },
    },
    {
      label: 'Meteor Storm Lv5',
      name: 'Meteor Storm',
      value: 'Meteor Storm==5',
      acd: 1,
      fct: 1.5,
      vct: 6.3,
      cd: 4.5,
      isMatk: true,
      element: ElementType.Fire,
      totalHit: 4,
      formula: (): number => {
        return 125;
      },
    },
    {
      label: 'Meteor Storm Lv7',
      name: 'Meteor Storm',
      value: 'Meteor Storm==7',
      acd: 1,
      fct: 1.5,
      vct: 6.3,
      cd: 5.5,
      isMatk: true,
      element: ElementType.Fire,
      totalHit: 5,
      formula: (): number => {
        return 125;
      },
    },
  ];

  protected _activeSkillList: ActiveSkillModel[] = [
    {
      label: 'Preserve',
      name: 'Preserve',
      inputType: 'selectButton',
      dropdown: [
        { label: 'Yes', value: 10, skillLv: 10, isUse: true },
        { label: 'No', value: 0, isUse: false },
      ],
    },
    {
      label: 'Shadow Spell Lv10',
      name: 'Shadow Spell',
      inputType: 'selectButton',
      isMasteryAtk: true,
      dropdown: [
        { label: 'Yes', value: 10, skillLv: 10, isUse: true },
        { label: 'No', value: 0, isUse: false },
      ],
    },
    ShieldSpellFn(),
    DarkClawFn(),
    NoLimit,
  ];

  protected _passiveSkillList: PassiveSkillModel[] = [
    VulturesEyeFn(),
    DoubleStrafeFn(),
    {
      inputType: 'dropdown',
      label: 'Sword Mastery',
      name: 'Sword Mastery',
      isMasteryAtk: true,
      dropdown: [
        { label: '-', value: 0, isUse: false },
        { label: 'Lv 1', value: 1, skillLv: 1, isUse: true, bonus: { atk: 4 } },
        { label: 'Lv 2', value: 2, skillLv: 2, isUse: true, bonus: { atk: 8 } },
        { label: 'Lv 3', value: 3, skillLv: 3, isUse: true, bonus: { atk: 12 } },
        { label: 'Lv 4', value: 4, skillLv: 4, isUse: true, bonus: { atk: 16 } },
        { label: 'Lv 5', value: 5, skillLv: 5, isUse: true, bonus: { atk: 20 } },
        { label: 'Lv 6', value: 6, skillLv: 6, isUse: true, bonus: { atk: 24 } },
        { label: 'Lv 7', value: 7, skillLv: 7, isUse: true, bonus: { atk: 28 } },
        { label: 'Lv 8', value: 8, skillLv: 8, isUse: true, bonus: { atk: 32 } },
        { label: 'Lv 9', value: 9, skillLv: 9, isUse: true, bonus: { atk: 36 } },
        { label: 'Lv 10', value: 10, skillLv: 10, isUse: true, bonus: { atk: 40 } },
      ],
    },
    SnatcherFn(),
    {
      inputType: 'dropdown',
      label: 'Plagiarism',
      name: 'Plagiarism',
      isEquipAtk: true,
      dropdown: [
        { label: '-', value: 0, isUse: false },
        { label: 'Lv 1', value: 1, skillLv: 1, isUse: true, bonus: { aspdPercent: 1 } },
        { label: 'Lv 2', value: 2, skillLv: 2, isUse: true, bonus: { aspdPercent: 2 } },
        { label: 'Lv 3', value: 3, skillLv: 3, isUse: true, bonus: { aspdPercent: 3 } },
        { label: 'Lv 4', value: 4, skillLv: 4, isUse: true, bonus: { aspdPercent: 4 } },
        { label: 'Lv 5', value: 5, skillLv: 5, isUse: true, bonus: { aspdPercent: 5 } },
        { label: 'Lv 6', value: 6, skillLv: 6, isUse: true, bonus: { aspdPercent: 6 } },
        { label: 'Lv 7', value: 7, skillLv: 7, isUse: true, bonus: { aspdPercent: 7 } },
        { label: 'Lv 8', value: 8, skillLv: 8, isUse: true, bonus: { aspdPercent: 8 } },
        { label: 'Lv 9', value: 9, skillLv: 9, isUse: true, bonus: { aspdPercent: 9 } },
        { label: 'Lv 10', value: 10, skillLv: 10, isUse: true, bonus: { aspdPercent: 10 } },
      ],
    },
    {
      inputType: 'dropdown',
      label: 'Maelstrom',
      name: 'Maelstrom',
      dropdown: [
        { label: '-', value: 0, isUse: false },
        { label: 'Lv 1', value: 1, skillLv: 1, isUse: true },
        { label: 'Lv 2', value: 2, skillLv: 2, isUse: true },
        { label: 'Lv 3', value: 3, skillLv: 3, isUse: true },
      ],
    },
    {
      inputType: 'dropdown',
      label: 'Feint Bomb',
      name: 'Feint Bomb',
      dropdown: [
        { label: '-', value: 0, isUse: false },
        { label: 'Lv 1', value: 1, skillLv: 1, isUse: true },
        { label: 'Lv 2', value: 2, skillLv: 2, isUse: true },
        { label: 'Lv 3', value: 3, skillLv: 3, isUse: true },
        { label: 'Lv 4', value: 4, skillLv: 4, isUse: true },
        { label: 'Lv 5', value: 5, skillLv: 5, isUse: true },
        { label: 'Lv 6', value: 6, skillLv: 6, isUse: true },
        { label: 'Lv 7', value: 7, skillLv: 7, isUse: true },
        { label: 'Lv 8', value: 8, skillLv: 8, isUse: true },
        { label: 'Lv 9', value: 9, skillLv: 9, isUse: true },
        { label: 'Lv 10', value: 10, skillLv: 10, isUse: true },
      ],
    },
    {
      inputType: 'dropdown',
      label: 'Urgent Escape',
      name: 'Urgent Escape',
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
      inputType: 'dropdown',
      label: 'Shadow Formation',
      name: 'Shadow Formation',
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
      inputType: 'dropdown',
      label: 'Reproduce',
      name: 'Reproduce',
      dropdown: [
        { label: '-', value: 0, isUse: false },
        { label: 'Lv 1', value: 1, skillLv: 1, isUse: true },
        { label: 'Lv 2', value: 2, skillLv: 2, isUse: true },
        { label: 'Lv 3', value: 3, skillLv: 3, isUse: true },
        { label: 'Lv 4', value: 4, skillLv: 4, isUse: true },
        { label: 'Lv 5', value: 5, skillLv: 5, isUse: true },
        { label: 'Lv 6', value: 6, skillLv: 6, isUse: true },
        { label: 'Lv 7', value: 7, skillLv: 7, isUse: true },
        { label: 'Lv 8', value: 8, skillLv: 8, isUse: true },
        { label: 'Lv 9', value: 9, skillLv: 9, isUse: true },
        { label: 'Lv 10', value: 10, skillLv: 10, isUse: true },
      ],
    },
  ];

  constructor() {
    super();

    this.inheritBaseClass(new Thief());
  }

  override calcSkillDmgByTotalHit(params: { finalDamage: number; skill: AtkSkillModel; info: InfoForClass }) {
    const { finalDamage, skill, info } = params;
    const isDagger = info.weapon.data?.typeName === 'dagger';
    if (skill.name === 'Fatal Manace' && isDagger) {
      return finalDamage * 2;
    }

    return super.calcSkillDmgByTotalHit(params);
  }
}
