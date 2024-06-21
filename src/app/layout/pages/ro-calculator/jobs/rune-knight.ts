import { ClassName } from './_class-name';
import {
  ActiveSkillModel,
  AtkSkillFormulaInput,
  AtkSkillModel,
  CharacterBase,
  DefForCalcModel,
  PassiveSkillModel,
} from './_character-base.abstract';
import { LordKnight } from './lord-knight';
import { ElementType } from '../constants/element-type.const';
import { InfoForClass } from '../models/info-for-class.model';
import { floor } from '../utils';

const jobBonusTable: Record<number, [number, number, number, number, number, number]> = {
  1: [0, 0, 0, 1, 0, 0],
  2: [0, 0, 0, 2, 0, 0],
  3: [0, 0, 0, 2, 1, 0],
  4: [0, 0, 1, 2, 1, 0],
  5: [0, 0, 1, 3, 1, 0],
  6: [0, 0, 1, 3, 1, 0],
  7: [0, 0, 1, 3, 1, 0],
  8: [0, 0, 1, 3, 1, 0],
  9: [0, 0, 1, 3, 1, 0],
  10: [1, 0, 1, 3, 1, 0],
  11: [2, 0, 1, 3, 1, 0],
  12: [2, 0, 1, 4, 1, 0],
  13: [2, 0, 1, 5, 1, 0],
  14: [2, 0, 2, 5, 1, 0],
  15: [2, 0, 2, 5, 2, 0],
  16: [2, 0, 2, 5, 2, 0],
  17: [2, 0, 2, 5, 2, 0],
  18: [2, 0, 2, 5, 2, 0],
  19: [2, 0, 2, 5, 3, 0],
  20: [2, 1, 2, 5, 3, 0],
  21: [2, 2, 2, 5, 3, 0],
  22: [2, 2, 2, 6, 3, 0],
  23: [2, 2, 3, 6, 3, 0],
  24: [2, 2, 3, 6, 4, 0],
  25: [2, 2, 3, 6, 4, 0],
  26: [2, 2, 3, 6, 4, 0],
  27: [2, 2, 3, 6, 4, 0],
  28: [2, 2, 3, 6, 4, 0],
  29: [2, 2, 3, 6, 4, 0],
  30: [2, 2, 3, 7, 4, 0],
  31: [2, 2, 3, 7, 5, 0],
  32: [2, 2, 4, 7, 5, 0],
  33: [3, 2, 4, 7, 5, 0],
  34: [3, 2, 4, 7, 5, 0],
  35: [3, 2, 4, 7, 5, 0],
  36: [3, 2, 4, 7, 5, 0],
  37: [3, 2, 4, 7, 5, 0],
  38: [3, 2, 4, 7, 5, 0],
  39: [3, 2, 4, 8, 5, 0],
  40: [3, 2, 4, 8, 6, 0],
  41: [3, 3, 4, 8, 6, 0],
  42: [3, 3, 4, 8, 6, 0],
  43: [3, 3, 4, 8, 6, 0],
  44: [3, 3, 4, 8, 7, 0],
  45: [3, 3, 5, 8, 7, 0],
  46: [3, 3, 5, 9, 7, 0],
  47: [3, 3, 5, 9, 7, 1],
  48: [3, 3, 5, 9, 7, 2],
  49: [3, 3, 5, 9, 7, 3],
  50: [3, 3, 5, 10, 7, 3],
  51: [4, 3, 5, 10, 7, 3],
  52: [4, 3, 5, 10, 7, 3],
  53: [4, 4, 5, 10, 7, 3],
  54: [4, 4, 5, 10, 7, 3],
  55: [4, 4, 5, 10, 8, 3],
  56: [4, 4, 5, 10, 8, 3],
  57: [4, 4, 5, 10, 8, 4],
  58: [4, 4, 5, 10, 8, 4],
  59: [4, 4, 6, 10, 8, 4],
  60: [5, 4, 6, 10, 8, 4],
  61: [5, 4, 7, 10, 8, 4],
  62: [5, 4, 7, 10, 8, 4],
  63: [5, 5, 7, 10, 8, 4],
  64: [5, 5, 7, 10, 8, 4],
  65: [5, 5, 7, 10, 8, 5],
  66: [5, 5, 7, 10, 9, 5],
  67: [5, 5, 7, 10, 9, 5],
  68: [5, 6, 7, 10, 9, 5],
  69: [5, 6, 7, 10, 9, 5],
  70: [6, 6, 7, 10, 9, 5],
};

export class RuneKnight extends CharacterBase {
  protected readonly CLASS_NAME = ClassName.RuneKnight;
  protected readonly JobBonusTable = jobBonusTable;

  protected readonly initialStatusPoint = 100;
  protected readonly classNames = ['Only 3rd Cls', 'Rune Knight', 'Rune Knight Cls', 'Rune Knight Class'];
  protected readonly _atkSkillList: AtkSkillModel[] = [
    // {
    //   name: 'Clashing Spiral',
    //   label: 'Clashing Spiral Lv5',
    //   value: 'Clashing Spiral==1',
    //   acd: 1,
    //   fct: 0.3,
    //   vct: 0.25,
    //   cd: 0,
    //   hit: 5,
    //   formula: (input: AtkSkillFormulaInput): number => {
    //     const { model, skillLevel, monster, weapon } = input;
    //     const baseLevel = model.level;
    //     const weaponWeight = weapon.data?.weight || 1;
    //     const sizeModifier = {
    //       l: 1,
    //       m: 1.15,
    //       s: 1.3,
    //     }[monster.size];

    //     return weaponWeight * 0.7 * sizeModifier * (150 + skillLevel * 50) * (baseLevel / 100);
    //   },
    //   finalDmgFormula(input) {
    //     const { model, skillLevel, monster, weapon, statusAtk, equipmentAtk } = input;
    //     const baseLevel = model.level;
    //     const weaponWeight = weapon.data?.weight ?? 0;
    //     const sizeModifier = {
    //       l: 1,
    //       m: 1.15,
    //       s: 1.3,
    //     }[monster.size];
    //     const masterAtk = 0;

    //     return (
    //       (((floor(statusAtk * 0.9) + floor(equipmentAtk + weaponWeight) * 0.7 + masterAtk) *
    //         floor(150 + skillLevel * 50)) /
    //         100) *
    //       (baseLevel / 100) *
    //       5
    //     );
    //   },
    // },
    {
      name: 'Sonic Wave',
      label: 'Sonic Wave Lv10',
      value: 'Sonic Wave==10',
      values: ['[Improved 2nd] Sonic Wave==10'],
      acd: 0.5,
      fct: 0,
      vct: 0,
      cd: 1.75,
      canCri: true,
      criDmgPercentage: 0.5,
      hit: 3,
      formula: (input: AtkSkillFormulaInput): number => {
        const { model, skillLevel } = input;
        const baseLevel = model.level;

        return (1050 + skillLevel * 150) * (1 + (baseLevel - 100) / 100);
      },
    },
    {
      name: 'Wind Cutter',
      label: 'Wind Cutter Lv5',
      value: 'Wind Cutter==5',
      values: ['Wind Cutter==10', '[Improved 2nd] Wind Cutter==5', '[Improved 2nd] Wind Cutter==10'],
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
    {
      name: 'Ignition Break',
      label: 'Ignition Break Lv5',
      value: 'Ignition Break==5',
      values: ['[Improved 2nd] Ignition Break==5'],
      acd: 0,
      fct: 0,
      vct: 1,
      cd: 2,
      isMelee: true,
      canCri: true,
      criDmgPercentage: 0.5,
      formula: (input: AtkSkillFormulaInput): number => {
        const { model, skillLevel } = input;
        const baseLevel = model.level;

        return skillLevel * 450 * (baseLevel / 100);
      },
    },
    {
      name: 'Hundred Spears',
      label: 'Hundred Spears Lv10',
      value: 'Hundred Spears==10',
      values: ['[Improved] Hundred Spears==10'],
      acd: 0.5,
      fct: 0,
      vct: 0.1,
      cd: 3,
      hit: 5,
      formula: (input: AtkSkillFormulaInput): number => {
        const { model, skillLevel } = input;
        const baseLevel = model.level;
        const clashingSpiralBonus = this.learnLv('Clashing Spiral') * 50;

        return (600 + 200 * skillLevel) * (baseLevel / 100) + clashingSpiralBonus;
      },
    },
    {
      name: 'Dragon Breath',
      label: 'Dragon Breath Lv10',
      value: 'Dragon Breath==10',
      values: ['[Improved 2nd] Dragon Breath==10'],
      acd: 2,
      fct: 0.5,
      vct: 2,
      cd: 0,
      isHit100: true,
      currentHpFn: (maxHp) => this.getCurrentHp(maxHp),
      getElement: () => {
        if (this.isSkillActive('Lux Anima Runestone')) {
          return ElementType.Dark;
        } else if (this.isSkillActive('Turisus Runestone')) {
          return ElementType.Holy;
        }

        return ElementType.Fire;
      },
      formula: (input: AtkSkillFormulaInput): number => {
        return this.calcDragonBreathFormula(input);
      },
      customFormula: (input): number => {
        return this.calcPostSkillDamgeDragonBreath(input, 'Dragon Breath');
      },
    },
    {
      name: 'Dragon Breath - WATER',
      label: 'Dragon Breath - WATER Lv10',
      value: 'Dragon Breath - WATER==10',
      values: ['[Improved 2nd] Dragon Breath - WATER==10'],
      acd: 2,
      fct: 0.5,
      vct: 2,
      cd: 0,
      isHit100: true,
      currentHpFn: (maxHp) => this.getCurrentHp(maxHp),
      getElement: () => {
        if (this.isSkillActive('Lux Anima Runestone')) {
          return ElementType.Neutral;
        } else if (this.isSkillActive('Asir Runestone')) {
          return ElementType.Ghost;
        }

        return ElementType.Water;
      },
      formula: (input: AtkSkillFormulaInput): number => {
        return this.calcDragonBreathFormula(input);
      },
      customFormula: (input): number => {
        return this.calcPostSkillDamgeDragonBreath(input, 'Dragon Breath - WATER');
      },
    },
  ];

  protected readonly _activeSkillList: ActiveSkillModel[] = [
    {
      name: 'Aura Blade',
      label: 'Aura Blade 5',
      inputType: 'selectButton',
      dropdown: [
        { label: 'Yes', value: 5, isUse: true },
        { label: 'No', value: 0, isUse: false },
      ],
    },
    {
      name: 'Spear Dynamo',
      label: 'Spear Dynamo 5',
      inputType: 'selectButton',
      dropdown: [
        { label: 'Yes', value: 5, isUse: true, bonus: { atkPercent: 15, hit: 50, defPercent: -15 } },
        { label: 'No', value: 0, isUse: false },
      ],
    },
    {
      name: 'Enchant Blade',
      label: 'Enchant Blade 10',
      inputType: 'selectButton',
      dropdown: [
        { label: 'Yes', value: 10, isUse: true },
        { label: 'No', value: 0, isUse: false },
      ],
    },
    {
      name: 'Ride Dragon',
      label: 'Ride Dragon',
      inputType: 'selectButton',
      dropdown: [
        { label: 'Yes', value: 5, isUse: true },
        { label: 'No', value: 0, isUse: false },
      ],
    },
    {
      name: 'Current HP',
      label: 'Current HP',
      inputType: 'dropdown',
      dropdown: [
        { label: '100 %', value: 0, isUse: false },
        { label: '30 %', value: 30, isUse: true },
        { label: '40 %', value: 40, isUse: true },
        { label: '50 %', value: 50, isUse: true },
        { label: '60 %', value: 60, isUse: true },
        { label: '70 %', value: 70, isUse: true },
        { label: '80 %', value: 80, isUse: true },
        { label: '90 %', value: 90, isUse: true },
      ],
    },
    {
      name: 'Turisus Runestone',
      label: 'Rune: Turisus',
      inputType: 'selectButton',
      dropdown: [
        { label: 'Yes', value: 1, isUse: true, bonus: { flatBasicDmg: 250, str: 30, melee: 15 } },
        { label: 'No', value: 0, isUse: false },
      ],
    },
    {
      name: 'Lux Anima Runestone',
      label: 'Rune: Lux Anima',
      inputType: 'selectButton',
      dropdown: [
        {
          label: 'Yes',
          value: 2,
          isUse: true,
          bonus: { p_size_all: 30, criDmg: 30, melee: 30, range: 30, hpPercent: 30, spPercent: 30 },
        },
        { label: 'No', value: 0, isUse: false },
      ],
    },
    {
      name: 'Asir Runestone',
      label: 'Rune: Asir',
      inputType: 'selectButton',
      isMasteryAtk: true,
      dropdown: [
        { label: 'Yes', value: 1, isUse: true, bonus: { atk: 70 } },
        { label: 'No', value: 0, isUse: false },
      ],
    },
  ];

  protected readonly _passiveSkillList: PassiveSkillModel[] = [
    {
      label: 'Ignition Break',
      name: 'Ignition Break',
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
      label: 'Dragon Training',
      name: 'Dragon Training',
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
      label: 'Dragon Breath',
      name: 'Dragon Breath',
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
      label: 'Breath - WATER',
      name: 'Dragon Breath - WATER',
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
      label: 'Rune Mastery',
      name: 'Rune Mastery',
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
      label: 'Enchant Blade',
      name: 'Enchant Blade',
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
      label: 'Sonic Wave',
      name: 'Sonic Wave',
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
      label: 'Death Bound',
      name: 'Death Bound',
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

    this.inheritBaseClass(new LordKnight());
  }

  override getMasteryAtk(info: InfoForClass): number {
    const { weapon } = info;
    const weaponType = weapon?.data?.typeName;
    const bonuses = this.bonuses?.masteryAtks || {};

    let sum = 0;
    const spearMasteryLv = this.learnLv('Spear Mastery');
    if ((weaponType === 'spear' || weaponType === 'twohandSpear') && spearMasteryLv > 0) {
      sum += spearMasteryLv * 4;
      if (this.isSkillActive('Ride Dragon')) sum += spearMasteryLv;
      if (this.learnLv('Dragon Training')) sum += spearMasteryLv * 10;
    }

    for (const [, bonus] of Object.entries(bonuses)) {
      sum += bonus[`x_${weaponType}_atk`] || 0;
    }

    return sum;
  }

  override setAdditionalBonus(params: InfoForClass) {
    const { totalBonus, weapon } = params;

    if (this.isSkillActive('Asir Runestone')) {
      const asirRuneAspdBonus = 4 * this.learnLv('Rune Mastery');
      totalBonus.aspdPercent = (totalBonus.aspdPercent || 0) + asirRuneAspdBonus;
    }

    const wType = weapon.data?.typeName;
    if (this.isSkillActive('Two hand Quicken') && wType === 'twohandSword') {
      totalBonus.skillAspd = (totalBonus.skillAspd || 0) + 7;
      totalBonus.aspdPercent = (totalBonus.aspdPercent || 0) + 10;
      totalBonus.cri = (totalBonus.cri || 0) + 12;
      totalBonus.hit = (totalBonus.hit || 0) + 20;
    }

    const isRideDragon = this.isSkillActive('Ride Dragon');
    if (isRideDragon) {
      totalBonus.decreaseSkillAspdPercent =
        (totalBonus.decreaseSkillAspdPercent || 0) + (25 - this.learnLv('Dragon Training') * 5);

      if (wType === 'spear' || wType === 'twohandSpear') {
        totalBonus['ignore_size_penalty'] = 100;
      }
    }

    if (!wType) return totalBonus;

    const bonus = this.getDynimicBonusFromSkill(`${wType}_`);
    for (const [key, value] of Object.entries(bonus)) {
      if (totalBonus[key]) {
        totalBonus[key] += value;
      } else {
        totalBonus[key] = value;
      }
    }

    return totalBonus;
  }

  private getCurrentHp(maxHp: number) {
    const curHp = this.activeSkillLv('Current HP') || 100;

    return maxHp * curHp * 0.01;
  }

  private calcDragonBreathFormula(input: AtkSkillFormulaInput) {
    const { model, skillLevel, currentHp, maxSp } = input;
    const baseLevel = model.level;
    const dragonTrainingLv = this.learnLv('Dragon Training');

    return (currentHp / 50 + maxSp / 4) * ((skillLevel * baseLevel) / 100) * (90 + dragonTrainingLv * 10) * 0.01;
  }

  private calcPostSkillDamgeDragonBreath(
    input: AtkSkillFormulaInput & {
      baseSkillDamage: number;
      sizePenalty: number;
      propertyMultiplier: number;
    } & DefForCalcModel,
    skillName: string,
  ) {
    const { baseSkillDamage, propertyMultiplier, totalBonus, reducedHardDef, finalSoftDef } = input;
    let totalDamage = baseSkillDamage;
    totalDamage = totalDamage - (reducedHardDef + finalSoftDef);
    totalDamage = floor(totalDamage * (100 + totalBonus.range) * 0.01);
    totalDamage = floor(totalDamage * (100 + (totalBonus[skillName] || 0)) * 0.01);
    totalDamage = floor(totalDamage * propertyMultiplier);

    return totalDamage;
  }

  override getAdditionalDmg(info: InfoForClass): number {
    if (this.isSkillActive('Aura Blade')) {
      return info.model.level * 8;
    }

    return 0;
  }

  override getAdditionalBasicDmg(info: InfoForClass): number {
    if (this.isSkillActive('Enchant Blade')) {
      return 300 * (info.model.level / 100) + info.status.totalInt + info.totalBonus.matk;
    }

    return 0;
  }
}
