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
import { floor } from '../utils';
import { ElementType } from '../constants/element-type.const';

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
      name: 'Rampage Blast',
      label: 'Rampage Blast Lv5',
      value: 'Rampage Blast==5',
      fct: 0,
      vct: 0,
      acd: 1,
      cd: 10,
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

        return floor(totalDmg);
      },
    },
    {
      name: 'Tiger Cannon',
      label: 'Tiger Cannon Lv10',
      value: 'Tiger Cannon==10',
      fct: 0,
      vct: 2,
      acd: 1,
      cd: 3,
      isMelee: true,
      isSudoElement: true,
      levelList: [],
      formula: (input: AtkSkillFormulaInput): number => {
        const { model, skillLevel, maxHp, maxSp, monster } = input;
        if (monster.elementUpper === ElementType.Ghost) return 0;

        const baseLevel = model.level;
        const baseDamage = (maxHp * (10 + skillLevel * 2) * 0.01 + maxSp * (5 + skillLevel) * 0.01) / 4;

        return floor(baseDamage * (baseLevel / 100));
      },
      finalDmgFormula: ({ damage, skillLevel, monster }): number => {
        if (monster.elementUpper === ElementType.Ghost) return 0;
        const bonusDamge = skillLevel * 240 + monster.level * 40;

        return damage + bonusDamge;
      },
    },
    {
      name: 'Tiger Cannon',
      label: 'Tiger Cannon Lv10 (Combo)',
      value: 'Tiger Cannon Combo==10',
      fct: 0,
      vct: 2,
      acd: 1,
      cd: 3,
      isMelee: true,
      levelList: [],
      formula: (input: AtkSkillFormulaInput): number => {
        const { model, skillLevel, monster, maxHp, maxSp } = input;
        if (monster.elementUpper === ElementType.Ghost) return 0;

        const baseLevel = model.level;
        const baseDamage = (maxHp * (10 + skillLevel * 2) * 0.01 + maxSp * (5 + skillLevel) * 0.01) / 2;

        return floor((baseDamage * (baseLevel / 100) * 4) / 3);
      },
      finalDmgFormula: ({ damage, skillLevel, monster }): number => {
        if (monster.elementUpper === ElementType.Ghost) return 0;
        const bonusDamge = skillLevel * 500 + monster.level * 40;

        return damage + bonusDamge;
      },
    },
    {
      name: 'Knuckle Arrow',
      label: 'Knuckle Arrow Lv10',
      value: 'Knuckle Arrow==10',
      fct: 0,
      vct: 0,
      acd: 1,
      cd: 0,
      formula: (input: AtkSkillFormulaInput): number => {
        const { model, skillLevel, monster } = input;
        const baseLevel = model.level;

        let baseDamage = 500 + skillLevel * 100;

        if (monster.isMvp) {
          baseDamage = 500 + skillLevel * 200;
        }

        return baseDamage * (baseLevel / 100);
      },
    },
  ];

  protected readonly _activeSkillList: ActiveSkillModel[] = [
    {
      label: 'Rising Dragon',
      name: 'Rising Dragon',
      inputType: 'dropdown',
      dropdown: [
        { label: '-', value: 0, isUse: false },
        { label: 'Lv 1', value: 1, isUse: true, bonus: { hpPercent: 1 + 2, spPercent: 1 + 2 } },
        { label: 'Lv 2', value: 2, isUse: true, bonus: { hpPercent: 2 + 2, spPercent: 2 + 2 } },
        { label: 'Lv 3', value: 3, isUse: true, bonus: { hpPercent: 3 + 2, spPercent: 3 + 2 } },
        { label: 'Lv 4', value: 4, isUse: true, bonus: { hpPercent: 4 + 2, spPercent: 4 + 2 } },
        { label: 'Lv 5', value: 5, isUse: true, bonus: { hpPercent: 5 + 2, spPercent: 5 + 2 } },
        { label: 'Lv 6', value: 6, isUse: true, bonus: { hpPercent: 6 + 2, spPercent: 6 + 2 } },
        { label: 'Lv 7', value: 7, isUse: true, bonus: { hpPercent: 7 + 2, spPercent: 7 + 2 } },
        { label: 'Lv 8', value: 8, isUse: true, bonus: { hpPercent: 8 + 2, spPercent: 8 + 2 } },
        { label: 'Lv 9', value: 9, isUse: true, bonus: { hpPercent: 9 + 2, spPercent: 9 + 2 } },
        { label: 'Lv 10', value: 10, isUse: true, bonus: { hpPercent: 10 + 2, spPercent: 10 + 2 } },
      ],
    },
    {
      label: 'GT - Opposite',
      name: 'Gentle Touch - Opposite',
      inputType: 'dropdown',
      dropdown: [
        { label: '-', value: 0, isUse: false },
        {
          label: 'Lv 1',
          value: 1,
          isUse: true,
          bonus: { atk: 8 * 1, atkPercent: 1, 'Rampage Blast': 30, 'Knuckle Arrow': 30 },
        },
        {
          label: 'Lv 2',
          value: 2,
          isUse: true,
          bonus: { atk: 8 * 2, atkPercent: 2, 'Rampage Blast': 30, 'Knuckle Arrow': 30 },
        },
        {
          label: 'Lv 3',
          value: 3,
          isUse: true,
          bonus: { atk: 8 * 3, atkPercent: 3, 'Rampage Blast': 30, 'Knuckle Arrow': 30 },
        },
        {
          label: 'Lv 4',
          value: 4,
          isUse: true,
          bonus: { atk: 8 * 4, atkPercent: 4, 'Rampage Blast': 30, 'Knuckle Arrow': 30 },
        },
        {
          label: 'Lv 5',
          value: 5,
          isUse: true,
          bonus: { atk: 8 * 5, atkPercent: 5, 'Rampage Blast': 30, 'Knuckle Arrow': 30 },
        },
      ],
    },
    {
      label: 'GT - Alive',
      name: 'Gentle Touch - Alive',
      inputType: 'dropdown',
      dropdown: [
        { label: '-', value: 0, isUse: false },
        { label: 'Lv 1', value: 1, isUse: true, bonus: { hpPercent: 1 * 2, def: 1 * 20, 'Tiger Cannon': 30 } },
        { label: 'Lv 2', value: 2, isUse: true, bonus: { hpPercent: 2 * 2, def: 2 * 20, 'Tiger Cannon': 30 } },
        { label: 'Lv 3', value: 3, isUse: true, bonus: { hpPercent: 3 * 2, def: 3 * 20, 'Tiger Cannon': 30 } },
        { label: 'Lv 4', value: 4, isUse: true, bonus: { hpPercent: 4 * 2, def: 4 * 20, 'Tiger Cannon': 30 } },
        { label: 'Lv 5', value: 5, isUse: true, bonus: { hpPercent: 5 * 2, def: 5 * 20, 'Tiger Cannon': 30 } },
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
    {
      label: 'Total Spirit',
      name: 'Total Spirit',
      inputType: 'dropdown',
      isMasteryAtk: true,
      dropdown: [
        { label: '-', value: 0, isUse: false },
        { label: 'Lv 1', value: 1, isUse: true, bonus: { atk: 1 * 3 } },
        { label: 'Lv 2', value: 2, isUse: true, bonus: { atk: 2 * 3 } },
        { label: 'Lv 3', value: 3, isUse: true, bonus: { atk: 3 * 3 } },
        { label: 'Lv 4', value: 4, isUse: true, bonus: { atk: 4 * 3 } },
        { label: 'Lv 5', value: 5, isUse: true, bonus: { atk: 5 * 3 } },
      ],
    },
    {
      label: 'Flash Combo',
      name: 'Flash Combo',
      inputType: 'dropdown',
      isMasteryAtk: true,
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

  protected readonly _passiveSkillList: PassiveSkillModel[] = [
    {
      label: 'Divine Protection',
      name: 'Divine Protection',
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
      label: 'Iron Hand',
      name: 'Iron Hand',
      inputType: 'dropdown',
      isMasteryAtk: true,
      dropdown: [
        { label: '-', value: 0, isUse: false },
        { label: 'Lv 1', value: 1, isUse: true, bonus: { x_fist_atk: 1 * 3, x_none_atk: 1 * 3 } },
        { label: 'Lv 2', value: 2, isUse: true, bonus: { x_fist_atk: 2 * 3, x_none_atk: 2 * 3 } },
        { label: 'Lv 3', value: 3, isUse: true, bonus: { x_fist_atk: 3 * 3, x_none_atk: 3 * 3 } },
        { label: 'Lv 4', value: 4, isUse: true, bonus: { x_fist_atk: 4 * 3, x_none_atk: 4 * 3 } },
        { label: 'Lv 5', value: 5, isUse: true, bonus: { x_fist_atk: 5 * 3, x_none_atk: 5 * 3 } },
        { label: 'Lv 6', value: 6, isUse: true, bonus: { x_fist_atk: 6 * 3, x_none_atk: 6 * 3 } },
        { label: 'Lv 7', value: 7, isUse: true, bonus: { x_fist_atk: 7 * 3, x_none_atk: 7 * 3 } },
        { label: 'Lv 8', value: 8, isUse: true, bonus: { x_fist_atk: 8 * 3, x_none_atk: 8 * 3 } },
        { label: 'Lv 9', value: 9, isUse: true, bonus: { x_fist_atk: 9 * 3, x_none_atk: 9 * 3 } },
        { label: 'Lv 10', value: 10, isUse: true, bonus: { x_fist_atk: 10 * 3, x_none_atk: 10 * 3 } },
      ],
    },
    {
      label: 'Dodge',
      name: 'Dodge',
      inputType: 'dropdown',
      dropdown: [
        { label: '-', value: 0, isUse: false },
        { label: 'Lv 1', value: 1, isUse: true, bonus: { flee: 1 } },
        { label: 'Lv 2', value: 2, isUse: true, bonus: { flee: 3 } },
        { label: 'Lv 3', value: 3, isUse: true, bonus: { flee: 4 } },
        { label: 'Lv 4', value: 4, isUse: true, bonus: { flee: 6 } },
        { label: 'Lv 5', value: 5, isUse: true, bonus: { flee: 7 } },
        { label: 'Lv 6', value: 6, isUse: true, bonus: { flee: 9 } },
        { label: 'Lv 7', value: 7, isUse: true, bonus: { flee: 10 } },
        { label: 'Lv 8', value: 8, isUse: true, bonus: { flee: 12 } },
        { label: 'Lv 9', value: 9, isUse: true, bonus: { flee: 13 } },
        { label: 'Lv 10', value: 10, isUse: true, bonus: { flee: 15 } },
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
    {
      label: 'Rising Dragon',
      name: 'Rising Dragon',
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
      label: 'GT - Alive',
      name: 'Gentle Touch - Alive',
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
      label: 'GT - Opposite',
      name: 'Gentle Touch - Opposite',
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

    this.inheritBaseClass(new Acolyte());
  }

  override getMasteryAtk(info: InfoForClass): number {
    const { weapon } = info;
    const wTypeName = weapon.data?.typeName || 'none';

    return this.calcHiddenMasteryAtk(info, { prefix: `x_${wTypeName}` }).totalAtk;
  }

  override setAdditionalBonus(params: InfoForClass) {
    const { totalBonus, skillName } = params;
    const flashComboLv = this.activeSkillLv('Flash Combo');
    if (skillName === 'Tiger Cannon' && flashComboLv > 0) {
      totalBonus['weaponAtk'] = (flashComboLv + 1) * 20;
    }

    return totalBonus;
  }
}
