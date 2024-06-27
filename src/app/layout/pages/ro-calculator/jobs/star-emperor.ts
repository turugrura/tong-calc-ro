import { ClassName } from './_class-name';
import { ActiveSkillModel, AtkSkillFormulaInput, AtkSkillModel, CharacterBase, PassiveSkillModel } from './_character-base.abstract';
import { InfoForClass } from '../models/info-for-class.model';
import { StarGladiator } from './star-gladiator';
import { FusionSunMoonStar } from '../constants/share-active-skills';

const jobBonusTable: Record<number, [number, number, number, number, number, number]> = {
  1: [1, 0, 0, 0, 0, 0],
  2: [1, 0, 0, 0, 1, 0],
  3: [1, 0, 0, 0, 1, 0],
  4: [1, 0, 0, 0, 1, 0],
  5: [1, 1, 0, 0, 1, 0],
  6: [1, 1, 0, 0, 1, 0],
  7: [1, 1, 0, 1, 1, 0],
  8: [2, 1, 0, 1, 1, 0],
  9: [2, 1, 0, 1, 1, 1],
  10: [2, 1, 0, 1, 1, 1],
  11: [2, 1, 0, 1, 2, 1],
  12: [3, 1, 0, 1, 2, 1],
  13: [3, 2, 0, 1, 2, 1],
  14: [3, 2, 0, 1, 2, 1],
  15: [3, 2, 0, 2, 2, 1],
  16: [3, 2, 0, 2, 2, 2],
  17: [3, 2, 1, 2, 2, 2],
  18: [3, 2, 1, 2, 2, 2],
  19: [4, 2, 1, 2, 2, 2],
  20: [4, 2, 1, 2, 3, 2],
  21: [4, 3, 1, 2, 3, 2],
  22: [4, 3, 1, 2, 3, 2],
  23: [5, 3, 1, 2, 3, 2],
  24: [5, 3, 2, 2, 3, 2],
  25: [5, 3, 2, 3, 3, 2],
  26: [5, 3, 2, 3, 3, 2],
  27: [5, 3, 2, 3, 4, 2],
  28: [5, 3, 2, 3, 4, 2],
  29: [5, 4, 2, 3, 4, 2],
  30: [5, 4, 2, 3, 5, 2],
  31: [6, 4, 2, 3, 5, 2],
  32: [6, 4, 2, 3, 5, 2],
  33: [6, 4, 2, 3, 5, 2],
  34: [6, 4, 2, 3, 6, 2],
  35: [6, 5, 2, 3, 6, 2],
  36: [6, 5, 2, 3, 6, 3],
  37: [6, 5, 3, 3, 6, 3],
  38: [6, 5, 3, 3, 7, 3],
  39: [7, 5, 3, 3, 7, 3],
  40: [7, 5, 3, 3, 7, 3],
  41: [7, 6, 3, 3, 7, 3],
  42: [7, 6, 4, 3, 7, 3],
  43: [8, 6, 4, 3, 7, 3],
  44: [8, 6, 4, 3, 7, 3],
  45: [8, 6, 4, 3, 8, 3],
  46: [8, 6, 4, 3, 8, 3],
  47: [8, 7, 4, 3, 8, 3],
  48: [9, 7, 4, 3, 8, 3],
  49: [9, 7, 4, 3, 8, 3],
  50: [9, 7, 4, 3, 9, 3],
  51: [9, 7, 4, 3, 9, 3],
  52: [9, 7, 4, 3, 9, 3],
  53: [9, 7, 4, 3, 9, 3],
  54: [9, 7, 4, 3, 9, 3],
  55: [9, 7, 4, 3, 9, 3],
  56: [10, 7, 4, 3, 9, 3],
  57: [10, 7, 4, 3, 9, 3],
  58: [10, 7, 4, 3, 9, 3],
  59: [10, 8, 4, 3, 9, 3],
  60: [10, 8, 4, 3, 9, 3],
  61: [10, 8, 4, 3, 9, 3],
  62: [10, 8, 4, 3, 9, 3],
  63: [10, 8, 4, 3, 9, 3],
  64: [10, 8, 4, 3, 9, 3],
  65: [11, 9, 5, 3, 9, 3],
  66: [11, 9, 5, 3, 9, 3],
  67: [11, 9, 5, 3, 9, 3],
  68: [11, 9, 5, 3, 9, 3],
  69: [11, 9, 5, 3, 9, 3],
  70: [12, 10, 6, 3, 9, 3],
};

export class StarEmperor extends CharacterBase {
  protected readonly CLASS_NAME = ClassName.StarEmperor;
  protected readonly JobBonusTable = jobBonusTable;

  protected readonly initialStatusPoint = 48;
  protected readonly classNames = ['Star Emperor', 'Star Emperor Cls', 'Star Emperor Class', 'StarEmperor', 'StarEmperor Cls', 'StarEmperor Class'];
  protected readonly _atkSkillList: AtkSkillModel[] = [
    {
      label: 'New Moon Kick Lv7',
      name: 'New Moon Kick',
      value: 'New Moon Kick==7',
      acd: 0,
      fct: 1,
      vct: 0,
      cd: 1,
      isMelee: true,
      formula: (input: AtkSkillFormulaInput): number => {
        const { skillLevel } = input;

        return 700 + skillLevel * 100;
      },
    },
    {
      label: 'Full Moon Kick Lv10',
      name: 'Full Moon Kick',
      value: 'Full Moon Kick==10',
      acd: 0,
      fct: 0,
      vct: 0,
      cd: 1,
      isMelee: true,
      formula: (input: AtkSkillFormulaInput): number => {
        const { model, skillLevel } = input;
        const baseLevel = model.level;
        const bonus = this.isSkillActive('Lunar Luminance') ? 1.25 : 1;

        return (1100 + skillLevel * 100) * (baseLevel / 100) * bonus;
      },
    },
    {
      label: 'Blaze Kick Lv7',
      name: 'Blaze Kick',
      value: 'Blaze Kick==7',
      acd: 0,
      fct: 0,
      vct: 0,
      cd: 0,
      isMelee: true,
      formula: (input: AtkSkillFormulaInput): number => {
        const { skillLevel } = input;

        return 150 + skillLevel * 50;
      },
    },
    {
      label: 'Solar Explosion Lv10',
      name: 'Solar Explosion',
      value: 'Solar Explosion==10',
      acd: 0.5,
      fct: 0,
      vct: 0,
      cd: 0,
      isMelee: true,
      formula: (input: AtkSkillFormulaInput): number => {
        const { model, skillLevel } = input;
        const baseLevel = model.level;
        const bonus = this.isSkillActive('Solar Luminance') ? 1.25 : 1;

        return (1000 + skillLevel * 220) * (baseLevel / 100) * bonus;
      },
    },
    {
      name: 'Falling Stars',
      label: 'Falling Stars Lv10',
      value: 'Falling Stars==10',
      acd: 0,
      fct: 0,
      vct: 0,
      cd: 0,
      hit: 3,
      isMelee: true,
      autoSpellChance: 0.15,
      formula: (input: AtkSkillFormulaInput): number => {
        const { model, skillLevel } = input;
        const baseLevel = model.level;
        const bonus = this.isSkillActive('Stellar Luminance') ? 1.25 : 1;

        return (100 + skillLevel * 100) * (baseLevel / 100) * bonus;
      },
      finalDmgFormula: (input): number => {
        return input.damage * 2;
      },
    },
    {
      name: 'Wind Cutter',
      label: 'Wind Cutter Lv5',
      value: 'Wind Cutter==5',
      acd: 0.5,
      fct: 0,
      vct: 0,
      cd: 0.3,
      isMelee: (weaponType) => weaponType !== 'spear' && weaponType !== 'twohandSpear',
      formula: (input: AtkSkillFormulaInput): number => {
        const { model, skillLevel, weapon } = input;
        const wTypeName = weapon.data.typeName;
        const baseLevel = model.level;

        let baseDamage = 0;
        if (wTypeName === 'twohandSword') {
          baseDamage = 250 * skillLevel * 2;
        } else if (wTypeName === 'spear' || wTypeName === 'twohandSpear') {
          baseDamage = 400 * skillLevel;
        } else {
          baseDamage = 300 * skillLevel;
        }

        return baseDamage * (baseLevel / 100);
      },
    },
  ];

  protected readonly _activeSkillList: ActiveSkillModel[] = [
    {
      label: 'Lunar Luminance 5',
      name: 'Lunar Luminance',
      inputType: 'selectButton',
      dropdown: [
        { label: 'Yes', value: 5, skillLv: 5, isUse: true },
        { label: 'No', value: 0, isUse: false },
      ],
    },
    {
      label: 'Solar Stance 3',
      name: 'Solar Stance',
      inputType: 'selectButton',
      dropdown: [
        { label: 'Yes', value: 3, skillLv: 3, isUse: true, bonus: { atkPercent: 5 } },
        { label: 'No', value: 0, isUse: false },
      ],
    },
    {
      label: 'Solar Luminance 5',
      name: 'Solar Luminance',
      inputType: 'selectButton',
      dropdown: [
        { label: 'Yes', value: 5, skillLv: 5, isUse: true },
        { label: 'No', value: 0, isUse: false },
      ],
    },
    FusionSunMoonStar(),
    {
      label: 'Stellar Stance 3',
      name: 'Stellar Stance',
      inputType: 'selectButton',
      dropdown: [
        { label: 'Yes', value: 3, skillLv: 3, isUse: true, bonus: { aspdPercent: 10 } },
        { label: 'No', value: 0, isUse: false },
      ],
    },
    {
      label: 'Stellar Luminance 5',
      name: 'Stellar Luminance',
      inputType: 'selectButton',
      dropdown: [
        { label: 'Yes', value: 5, skillLv: 5, isUse: true },
        { label: 'No', value: 0, isUse: false },
      ],
    },
  ];

  protected readonly _passiveSkillList: PassiveSkillModel[] = [
    {
      label: 'Blessing of Sun',
      name: 'Blessing of Sun',
      inputType: 'dropdown',
      dropdown: [
        { label: '-', isUse: false, value: 0 },
        { label: 'Lv 1', isUse: true, value: 1 },
        { label: 'Lv 2', isUse: true, value: 2 },
        { label: 'Lv 3', isUse: true, value: 3 },
        { label: 'Lv 4', isUse: true, value: 4 },
        { label: 'Lv 5', isUse: true, value: 5 },
      ],
    },
    {
      label: 'Blessing of Moon',
      name: 'Blessing of Moon',
      inputType: 'dropdown',
      dropdown: [
        { label: '-', isUse: false, value: 0 },
        { label: 'Lv 1', isUse: true, value: 1 },
        { label: 'Lv 2', isUse: true, value: 2 },
        { label: 'Lv 3', isUse: true, value: 3 },
        { label: 'Lv 4', isUse: true, value: 4 },
        { label: 'Lv 5', isUse: true, value: 5 },
      ],
    },
    {
      label: 'Blessing of Star',
      name: 'Blessing of Star',
      inputType: 'dropdown',
      dropdown: [
        { label: '-', isUse: false, value: 0 },
        { label: 'Lv 1', isUse: true, value: 1 },
        { label: 'Lv 2', isUse: true, value: 2 },
        { label: 'Lv 3', isUse: true, value: 3 },
        { label: 'Lv 4', isUse: true, value: 4 },
        { label: 'Lv 5', isUse: true, value: 5 },
      ],
    },
  ];

  constructor() {
    super();

    this.inheritBaseClass(new StarGladiator());
  }

  getWrathAtkBonus(info: InfoForClass): number {
    if (!this.isSkillActive('Wrath of')) return 0;

    const { model, status, monster } = info;
    const { level } = model;
    const { totalLuk, totalDex, totalStr } = status;
    const { size } = monster;
    const bonusSize = size === 'l' ? totalStr : 0;

    return Math.floor((level + totalLuk + totalDex + bonusSize) / 3);
  }

  override modifyFinalAtk(currentAtk: number, _params: InfoForClass) {
    const partyCnt = this.bonuses.usedSkillMap.get('Power') || 1;
    const wratBonus = (100 + this.getWrathAtkBonus(_params)) / 100;

    let totalAtk = Math.floor(currentAtk * ((100 + (partyCnt - 1) * 10) / 100));
    totalAtk = totalAtk * wratBonus;

    return totalAtk;
  }
}
