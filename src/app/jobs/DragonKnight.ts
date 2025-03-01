import { JOB_4_MAX_JOB_LEVEL, JOB_4_MIN_MAX_LEVEL } from '../app-config';
import { WeaponTypeName } from '../constants';
import { RuneKnight } from './RuneKnight';
import { ActiveSkillModel, AtkSkillFormulaInput, AtkSkillModel, PassiveSkillModel } from './_character-base.abstract';
import { ClassName } from './_class-name';

const jobBonusTable: Record<number, [number, number, number, number, number, number]> = {
  1: [1, 0, 0, 0, 0, 0],
  2: [1, 0, 0, 0, 1, 0],
  3: [1, 1, 0, 0, 1, 0],
  4: [1, 1, 0, 0, 2, 0],
  5: [1, 2, 1, 0, 2, 0],
  6: [1, 2, 1, 0, 2, 0],
  7: [1, 2, 1, 0, 2, 1],
  8: [1, 2, 1, 1, 2, 1],
  9: [2, 2, 1, 1, 2, 1],
  10: [2, 2, 1, 1, 3, 1],
  11: [2, 2, 1, 2, 3, 1],
  12: [2, 3, 1, 2, 3, 1],
  13: [2, 3, 1, 2, 3, 1],
  14: [2, 3, 2, 2, 3, 2],
  15: [2, 3, 2, 2, 3, 2],
  16: [3, 3, 2, 2, 3, 2],
  17: [3, 3, 2, 2, 4, 2],
  18: [3, 3, 2, 3, 4, 2],
  19: [3, 4, 3, 3, 4, 2],
  20: [3, 4, 3, 3, 4, 2],
  21: [3, 4, 3, 3, 4, 3],
  22: [3, 4, 3, 3, 4, 3],
  23: [3, 5, 3, 3, 5, 3],
  24: [4, 5, 3, 3, 5, 3],
  25: [4, 5, 4, 3, 5, 3],
  26: [4, 5, 4, 4, 5, 3],
  27: [4, 5, 4, 4, 6, 3],
  28: [4, 5, 4, 4, 6, 4],
  29: [4, 5, 4, 4, 6, 4],
  30: [5, 5, 4, 4, 6, 4],
  31: [5, 5, 4, 5, 6, 5],
  32: [5, 5, 5, 5, 6, 5],
  33: [5, 6, 5, 5, 6, 5],
  34: [5, 6, 5, 5, 6, 5],
  35: [5, 6, 5, 5, 7, 5],
  36: [6, 6, 5, 5, 7, 5],
  37: [6, 6, 5, 6, 7, 5],
  38: [6, 7, 5, 6, 7, 5],
  39: [6, 7, 5, 6, 7, 5],
  40: [6, 7, 5, 6, 7, 6],
  41: [6, 7, 5, 6, 7, 6],
  42: [6, 7, 6, 6, 7, 6],
  43: [6, 7, 6, 7, 7, 6],
  44: [6, 7, 6, 7, 8, 6],
  45: [6, 7, 6, 7, 8, 6],
  46: [6, 7, 6, 7, 8, 6],
  47: [6, 7, 6, 8, 8, 6],
  48: [6, 7, 6, 8, 8, 6],
  49: [6, 8, 6, 8, 8, 6],
  50: [6, 8, 7, 8, 8, 6],
  51: [6, 8, 7, 8, 8, 6],
  52: [6, 8, 7, 8, 8, 6],
  53: [6, 8, 7, 8, 8, 6],
  54: [6, 8, 7, 8, 8, 6],
  55: [6, 8, 7, 8, 8, 6],
  56: [6, 8, 7, 8, 8, 6],
  57: [6, 8, 7, 8, 8, 6],
  58: [6, 8, 7, 8, 8, 6],
  59: [6, 8, 7, 8, 8, 6],
  60: [6, 8, 7, 8, 8, 6],
  61: [6, 8, 7, 8, 8, 6],
  62: [6, 8, 7, 8, 8, 6],
  63: [6, 8, 7, 8, 8, 6],
  64: [6, 8, 7, 8, 8, 6],
  65: [6, 8, 7, 8, 8, 6],
  66: [6, 8, 7, 8, 8, 6],
  67: [6, 8, 7, 8, 8, 6],
  68: [6, 8, 7, 8, 8, 6],
  69: [6, 8, 7, 8, 8, 6],
  70: [6, 8, 7, 8, 8, 6],
};

const TraitBonusTable: Record<number, [number, number, number, number, number, number]> = {
  1: [1, 0, 0, 0, 0, 0],
  2: [1, 0, 0, 1, 0, 0],
  3: [1, 0, 0, 1, 0, 1],
  4: [1, 0, 0, 1, 0, 1],
  5: [1, 0, 0, 1, 1, 1],
  6: [1, 0, 0, 1, 1, 1],
  7: [1, 0, 0, 2, 1, 1],
  8: [1, 1, 0, 2, 1, 1],
  9: [1, 1, 0, 2, 1, 2],
  10: [1, 1, 0, 2, 1, 2],
  11: [1, 1, 0, 2, 2, 2],
  12: [1, 1, 0, 2, 2, 2],
  13: [1, 1, 0, 2, 2, 2],
  14: [1, 1, 0, 2, 2, 2],
  15: [1, 1, 0, 2, 2, 2],
  16: [2, 1, 0, 2, 2, 2],
  17: [2, 1, 0, 2, 2, 2],
  18: [2, 1, 0, 2, 3, 2],
  19: [2, 1, 0, 2, 3, 2],
  20: [2, 1, 0, 3, 3, 2],
  21: [2, 1, 0, 3, 3, 2],
  22: [2, 2, 0, 3, 3, 2],
  23: [2, 2, 0, 3, 3, 2],
  24: [2, 2, 0, 4, 3, 2],
  25: [2, 2, 0, 4, 3, 3],
  26: [3, 2, 0, 4, 3, 3],
  27: [3, 2, 0, 4, 3, 3],
  28: [3, 2, 0, 4, 3, 3],
  29: [4, 2, 0, 4, 4, 3],
  30: [4, 2, 0, 4, 4, 3],
  31: [4, 2, 0, 4, 4, 3],
  32: [4, 2, 1, 4, 4, 3],
  33: [4, 2, 1, 4, 4, 3],
  34: [4, 2, 1, 4, 4, 4],
  35: [4, 2, 1, 4, 5, 4],
  36: [5, 2, 1, 4, 5, 4],
  37: [5, 3, 1, 4, 5, 4],
  38: [5, 3, 1, 4, 5, 4],
  39: [5, 3, 1, 5, 5, 4],
  40: [5, 4, 1, 5, 5, 4],
  41: [5, 4, 1, 5, 5, 4],
  42: [5, 4, 1, 5, 5, 5],
  43: [6, 4, 1, 5, 5, 5],
  44: [6, 4, 2, 5, 5, 5],
  45: [6, 5, 2, 5, 5, 5],
  46: [7, 5, 2, 5, 6, 5],
  47: [7, 5, 3, 5, 6, 5],
  48: [7, 5, 3, 5, 6, 5],
  49: [7, 5, 3, 5, 6, 6],
  50: [8, 5, 3, 5, 6, 6],
  51: [8, 5, 3, 5, 6, 7],
  52: [9, 5, 3, 5, 6, 7],
  53: [9, 5, 3, 5, 6, 7],
  54: [10, 5, 3, 5, 6, 8],
  55: [10, 6, 3, 5, 6, 8],
  56: [10, 7, 3, 5, 6, 8],
  57: [10, 7, 3, 5, 6, 8],
  58: [10, 7, 3, 5, 7, 8],
  59: [10, 7, 3, 5, 7, 8],
  60: [10, 7, 3, 5, 7, 8],
  61: [10, 7, 3, 5, 7, 8],
  62: [10, 7, 3, 5, 7, 8],
  63: [10, 7, 3, 5, 7, 8],
  64: [10, 7, 3, 5, 7, 8],
  65: [10, 7, 3, 5, 7, 8],
  66: [10, 7, 3, 5, 7, 8],
  67: [10, 7, 3, 5, 7, 8],
  68: [10, 7, 3, 5, 7, 8],
  69: [10, 7, 3, 5, 7, 8],
  70: [10, 7, 3, 5, 7, 8],
};

export class DragonKnight extends RuneKnight {
  protected override CLASS_NAME = ClassName.DragonKnight;
  protected override JobBonusTable = jobBonusTable;
  protected override TraitBonusTable = TraitBonusTable;

  protected override minMaxLevel = JOB_4_MIN_MAX_LEVEL;
  protected override maxJob = JOB_4_MAX_JOB_LEVEL;

  private readonly classNames4th = [ClassName.Only_4th, ClassName.DragonKnight];

  private readonly atkSkillList4th: AtkSkillModel[] = [
    {
      name: 'Servant Weapon',
      label: '[V3] Servant Weapon Lv5',
      value: 'Servant Weapon==5',
      acd: 0,
      fct: 0,
      vct: 0,
      cd: 0,
      canCri: true,
      criDmgPercentage: 0.5,
      baseCriPercentage: 1,
      isMelee: true,
      totalHit: 2,
      formula: (input: AtkSkillFormulaInput): number => {
        const { model, skillLevel, status } = input;
        const { totalPow } = status;
        const baseLevel = model.level;

        return (500 + skillLevel * 400 + totalPow * 5) * (baseLevel / 100);
      },
    },
    {
      name: 'Hack and Slasher',
      label: '[V3] Hack and Slasher Lv10',
      value: 'Hack and Slasher==10',
      acd: 0.25,
      fct: 0,
      vct: 0,
      cd: 0.7,
      totalHit: 2,
      verifyItemFn: ({ weapon }) => {
        const requires: WeaponTypeName[] = ['twohandSword', 'twohandSpear'];
        if (requires.some(wType => weapon.isType(wType))) return '';

        return requires.join(', ');
      },
      isMelee: (weaponType) => {
        return weaponType === 'twohandSword';
      },
      formula: (input: AtkSkillFormulaInput): number => {
        const { model, skillLevel, status } = input;
        const { totalPow } = status;
        const baseLevel = model.level;

        return (300 + skillLevel * 700 + totalPow * 7) * (baseLevel / 100);
      },
    },
    {
      name: 'Storm Slash',
      label: '[V3] Storm Slash Lv5',
      value: 'Storm Slash==5',
      acd: 0.5,
      fct: 0,
      vct: 0,
      cd: 0.3,
      canCri: true,
      baseCriPercentage: 1,
      criDmgPercentage: 0.5,
      isMelee: true,
      verifyItemFn: ({ weapon }) => {
        const requires: WeaponTypeName[] = ['twohandSword', 'twohandAxe'];
        if (requires.some(wType => weapon.isType(wType))) return '';

        return requires.join(', ');
      },
      totalHit: ({ skillLevel }) => skillLevel,
      formula: (input: AtkSkillFormulaInput): number => {
        const { model, skillLevel, status } = input;
        const { totalPow } = status;
        const baseLevel = model.level;

        return (100 + skillLevel * 170 + totalPow * 5) * (baseLevel / 100);
      },
    },
    {
      name: 'Madness Crusher',
      label: '[V3] Madness Crusher Lv5',
      value: 'Madness Crusher==5',
      acd: 0.5,
      fct: 0.5,
      vct: 0,
      cd: 0.35,
      verifyItemFn: ({ weapon }) => {
        const requires: WeaponTypeName[] = ['twohandSword', 'twohandSpear'];
        if (requires.some(wType => weapon.isType(wType))) return '';

        return requires.join(', ');
      },
      formula: (input: AtkSkillFormulaInput): number => {
        const { model, skillLevel, status, weapon } = input;
        const { totalPow } = status;
        const baseLevel = model.level;
        const { weight, baseWeaponLevel } = weapon.data;

        return (400 + skillLevel * 600 + totalPow * 5 + weight * baseWeaponLevel) * (baseLevel / 100);
      },
    },
    {
      name: 'Dragonic Breath',
      label: '[V3] Dragonic Breath Lv10',
      value: 'Dragonic Breath==10',
      acd: 0.15,
      fct: 0.5,
      vct: 2,
      cd: 0.5,
      hit: 2,
      isIgnoreDef: true,
      isIgnoreSDef: true,
      formula: (input: AtkSkillFormulaInput): number => {
        const { model, skillLevel, status, maxHp, maxSp } = input;
        const { totalPow } = status;
        const baseLevel = model.level;
        if (this.activeSkillLv('Dragonic Aura')) {
          return (50 + skillLevel * (350 + 0.07 * (maxHp / 8 + maxSp / 4)) + totalPow * 10) * (baseLevel / 100);
        }

        return (50 + skillLevel * (350 + 0.05 * (maxHp / 8 + maxSp / 4)) + totalPow * 7) * (baseLevel / 100);
      },
    },
  ];
  private readonly activeSkillList4th: ActiveSkillModel[] = [
    {
      label: 'Dragonic Aura 10',
      name: 'Dragonic Aura',
      inputType: 'selectButton',
      dropdown: [
        { label: 'Yes', value: 10, isUse: true, bonus: { 'Dragon Breath': 100, 'Dragon Breath - WATER': 100 } },
        { label: 'No', value: 0, isUse: false },
      ],
    },
  ];
  private readonly passiveSkillList4th: PassiveSkillModel[] = [
    {
      label: 'Dragonic Aura',
      name: 'Dragonic Aura',
      inputType: 'dropdown',
      dropdown: [
        { label: '-', value: 0, isUse: false },
        { label: 'Lv 10', value: 10, isUse: true },
      ],
    },
  ];

  constructor() {
    super();

    this.inheritSkills({
      activeSkillList: this.activeSkillList4th,
      atkSkillList: this.atkSkillList4th,
      passiveSkillList: this.passiveSkillList4th,
      classNames: this.classNames4th,
    });
  }
}
