import { InfoForClass } from '../models/info-for-class.model';
import { ClassName } from './_class-name';
import {
  ActiveSkillModel,
  AtkSkillFormulaInput,
  AtkSkillModel,
  CharacterBase,
  PassiveSkillModel,
} from './_character-base.abstract';
import { Whitesmith } from './white-smith';

const jobBonusTable: Record<number, [number, number, number, number, number, number]> = {
  '1': [0, 0, 0, 0, 0, 1],
  '2': [1, 0, 0, 0, 0, 1],
  '3': [1, 0, 0, 0, 0, 1],
  '4': [1, 0, 0, 0, 0, 1],
  '5': [2, 0, 0, 0, 0, 1],
  '6': [2, 0, 0, 0, 0, 1],
  '7': [2, 0, 0, 0, 0, 2],
  '8': [2, 1, 0, 0, 0, 2],
  '9': [2, 1, 0, 0, 1, 2],
  '10': [2, 1, 0, 1, 1, 2],
  '11': [2, 1, 0, 1, 1, 2],
  '12': [2, 1, 0, 1, 1, 2],
  '13': [2, 1, 0, 2, 1, 2],
  '14': [2, 1, 0, 2, 1, 3],
  '15': [2, 1, 0, 2, 1, 3],
  '16': [2, 1, 0, 2, 1, 3],
  '17': [2, 2, 0, 2, 1, 3],
  '18': [2, 2, 0, 2, 1, 3],
  '19': [2, 2, 1, 2, 1, 3],
  '20': [2, 2, 2, 2, 1, 3],
  '21': [2, 2, 2, 3, 1, 3],
  '22': [2, 2, 2, 3, 2, 3],
  '23': [2, 2, 2, 3, 2, 3],
  '24': [2, 2, 2, 3, 2, 3],
  '25': [2, 2, 3, 3, 2, 3],
  '26': [2, 2, 3, 3, 2, 4],
  '27': [2, 2, 3, 3, 2, 4],
  '28': [2, 2, 3, 3, 2, 4],
  '29': [2, 2, 4, 3, 2, 4],
  '30': [2, 2, 4, 3, 2, 4],
  '31': [3, 2, 4, 3, 2, 4],
  '32': [4, 2, 4, 3, 2, 4],
  '33': [4, 2, 5, 3, 2, 4],
  '34': [4, 2, 5, 3, 2, 5],
  '35': [4, 2, 5, 3, 2, 5],
  '36': [4, 2, 5, 3, 2, 5],
  '37': [4, 2, 5, 4, 2, 5],
  '38': [4, 2, 5, 5, 2, 5],
  '39': [4, 2, 5, 5, 2, 5],
  '40': [4, 2, 5, 5, 2, 5],
  '41': [4, 2, 5, 5, 2, 5],
  '42': [4, 2, 6, 5, 2, 5],
  '43': [4, 2, 7, 5, 2, 5],
  '44': [5, 2, 7, 5, 2, 5],
  '45': [6, 2, 7, 5, 2, 5],
  '46': [6, 2, 7, 5, 2, 5],
  '47': [6, 2, 7, 5, 2, 5],
  '48': [6, 2, 7, 5, 3, 5],
  '49': [6, 3, 7, 5, 3, 5],
  '50': [6, 3, 7, 5, 3, 5],
  '51': [6, 3, 7, 5, 3, 6],
  '52': [7, 3, 7, 5, 3, 6],
  '53': [7, 3, 7, 5, 4, 6],
  '54': [7, 3, 7, 5, 4, 6],
  '55': [7, 3, 7, 6, 4, 6],
  '56': [7, 3, 8, 6, 4, 6],
  '57': [7, 4, 8, 6, 4, 6],
  '58': [7, 4, 8, 6, 4, 6],
  '59': [7, 4, 8, 6, 5, 6],
  '60': [8, 4, 8, 6, 5, 6],
  '61': [8, 4, 8, 6, 5, 6],
  '62': [8, 4, 8, 6, 5, 6],
  '63': [8, 4, 8, 6, 5, 6],
  '64': [8, 4, 8, 6, 5, 6],
  '65': [9, 5, 9, 6, 5, 6],
};

export class Mechanic extends CharacterBase {
  protected readonly CLASS_NAME = ClassName.Mechanic;
  protected readonly JobBonusTable = jobBonusTable;

  protected readonly initialStatusPoint = 100;
  protected readonly classNames = ['Hi-Class', 'Only 3rd Cls', 'Mechanic', 'Mechanic Cls', 'Mechanic Class'];
  protected readonly _atkSkillList: AtkSkillModel[] = [
    {
      label: 'Axe Tornado Lv5',
      name: 'Axe Tornado',
      value: 'Axe Tornado==5',
      acd: 0.5,
      fct: 0,
      vct: 0,
      cd: 2,
      hit: 6,
      isMelee: true,
      levelList: [{ label: 'Lv 5', value: 'Axe Tornado==5' }],
      formula: (input: AtkSkillFormulaInput): number => {
        const { status, skillLevel, model } = input;
        const baseLevel = model.level;
        const vit = status.totalVit;

        return (vit + 200 + skillLevel * 100) * (baseLevel / 100);
      },
    },
    {
      label: 'Axe Boomerang Lv5',
      name: 'Axe Boomerang',
      value: 'Axe Boomerang==5',
      acd: 0,
      fct: 0,
      vct: 0,
      cd: 3,
      levelList: [{ label: 'Lv 5', value: 'Axe Boomerang==5' }],
      formula: (input: AtkSkillFormulaInput): number => {
        const { model, skillLevel, weapon } = input;
        const baseLevel = model.level;
        const weaponWeight = weapon?.data?.weight || 0;

        return (weaponWeight + 250 + skillLevel * 50) * (baseLevel / 100);
      },
    },
    {
      label: 'Arm Cannon Lv4',
      name: 'Arm Cannon',
      value: 'Arm Cannon==4',
      acd: 1,
      fct: 0.2,
      vct: 2,
      cd: 0.45,
      isIgnoreDef: true,
      isHit100: true,
      formula: (input: AtkSkillFormulaInput): number => {
        const { skillLevel, model, monster } = input;
        const baseLevel = model.level;
        const monsterSize = monster.size;
        const size = { s: 2, m: 1, l: 0 };
        const additional = 50 * skillLevel * size[monsterSize];

        return (additional + 300 + skillLevel * 300) * (baseLevel / 100);
      },
    },
    {
      label: 'Arm Cannon Lv5',
      name: 'Arm Cannon',
      value: 'Arm Cannon==5',
      acd: 1,
      fct: 0.2,
      vct: 2.2,
      cd: 0.65,
      isIgnoreDef: true,
      isHit100: true,
      formula: (input: AtkSkillFormulaInput): number => {
        const { skillLevel, model, monster } = input;
        const baseLevel = model.level;
        const monsterSize = monster.size;
        const size = { s: 2, m: 1, l: 0 };
        const additional = 50 * skillLevel * size[monsterSize];

        return (additional + 300 + skillLevel * 300) * (baseLevel / 100);
      },
    },
  ];
  protected readonly _activeSkillList: ActiveSkillModel[] = [];
  protected readonly _passiveSkillList: PassiveSkillModel[] = [
    {
      label: 'Axe Mastery',
      name: 'Axe Mastery',
      inputType: 'dropdown',
      isMasteryAtk: true,
      dropdown: [
        { label: '-', value: 0, isUse: false },
        { label: 'Lv 1', value: 1, isUse: true, bonus: { x_axe_atk: 5, axe_hit: 3, x_mace_atk: 4, mace_hit: 2 } },
        { label: 'Lv 2', value: 2, isUse: true, bonus: { x_axe_atk: 10, axe_hit: 6, x_mace_atk: 8, mace_hit: 4 } },
        { label: 'Lv 3', value: 3, isUse: true, bonus: { x_axe_atk: 15, axe_hit: 9, x_mace_atk: 12, mace_hit: 6 } },
        { label: 'Lv 4', value: 4, isUse: true, bonus: { x_axe_atk: 20, axe_hit: 12, x_mace_atk: 16, mace_hit: 8 } },
        { label: 'Lv 5', value: 5, isUse: true, bonus: { x_axe_atk: 25, axe_hit: 15, x_mace_atk: 20, mace_hit: 10 } },
        { label: 'Lv 6', value: 6, isUse: true, bonus: { x_axe_atk: 30, axe_hit: 18, x_mace_atk: 24, mace_hit: 12 } },
        { label: 'Lv 7', value: 7, isUse: true, bonus: { x_axe_atk: 35, axe_hit: 21, x_mace_atk: 28, mace_hit: 14 } },
        { label: 'Lv 8', value: 8, isUse: true, bonus: { x_axe_atk: 40, axe_hit: 24, x_mace_atk: 32, mace_hit: 16 } },
        { label: 'Lv 9', value: 9, isUse: true, bonus: { x_axe_atk: 45, axe_hit: 27, x_mace_atk: 36, mace_hit: 18 } },
        { label: 'Lv 10', value: 10, isUse: true, bonus: { x_axe_atk: 50, axe_hit: 30, x_mace_atk: 40, mace_hit: 20 } },
      ],
    },
    {
      label: 'Fire Earth Research',
      name: 'Fire Earth Research',
      inputType: 'dropdown',
      isMasteryAtk: true,
      dropdown: [
        { label: '-', value: 0, isUse: false },
        { label: 'Lv 1', value: 1, isUse: true, bonus: { x_atk_element_fire: 10, x_sofDef: 10 } },
        { label: 'Lv 2', value: 2, isUse: true, bonus: { x_atk_element_fire: 20, x_sofDef: 20 } },
        { label: 'Lv 3', value: 3, isUse: true, bonus: { x_atk_element_fire: 30, x_sofDef: 30 } },
        { label: 'Lv 4', value: 4, isUse: true, bonus: { x_atk_element_fire: 40, x_sofDef: 40 } },
        { label: 'Lv 5', value: 5, isUse: true, bonus: { x_atk_element_fire: 50, x_sofDef: 50 } },
      ],
    },
    {
      label: 'Axe Boomerang',
      name: 'Axe Boomerang',
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
      label: 'Lava Flow',
      name: 'Lava Flow',
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
      label: 'Power Swing',
      name: 'Power Swing',
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

    this.inheritBaseClass(new Whitesmith());
  }

  override getMasteryAtk(info: InfoForClass): number {
    const { weapon, monster } = info;
    const weaponType = weapon?.data?.typeName;
    const { element } = monster;
    const bonuses = this.bonuses?.masteryAtks || {};

    const { totalAtk } = this.calcHiddenMasteryAtk(info);

    let sum = totalAtk;
    for (const [, bonus] of Object.entries(bonuses)) {
      sum += bonus[`x_${weaponType}_atk`] || 0;
      sum += bonus[`x_atk_element_${element}`] || 0;
    }

    return sum;
  }

  override setAdditionalBonus(params: InfoForClass) {
    const { totalBonus, weapon } = params;
    const { typeName } = weapon.data;

    const { masteryAtks, equipAtks } = this.bonuses;

    const prefixCondition = `${typeName}_`;
    for (const [_skillName, bonus] of Object.entries({ ...(masteryAtks || {}), ...(equipAtks || {}) })) {
      for (const [attr, value] of Object.entries(bonus)) {
        if (attr.startsWith(prefixCondition)) {
          const actualAttr = attr.replace(prefixCondition, '');
          totalBonus[actualAttr] += value;
        }
      }
    }

    return totalBonus;
  }
}
