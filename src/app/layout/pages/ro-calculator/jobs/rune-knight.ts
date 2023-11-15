import { ClassName } from './_class-name';
import {
  ActiveSkillModel,
  AtkSkillFormulaInput,
  AtkSkillModel,
  CharacterBase,
  PassiveSkillModel,
} from './_character-base.abstract';
import { LordKnight } from './lord-knight';
import { ElementType } from '../constants/element-type.const';
import { InfoForClass } from '../models/info-for-class.model';
import { environment } from 'src/environments/environment';

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
    {
      label: 'Ignition Break Lv5',
      name: 'Ignition Break',
      value: 'Ignition Break==5',
      acd: 0,
      fct: 0,
      vct: 1,
      cd: 2,
      isMelee: true,
      isDevMode: environment.production === true,
      formula: (input: AtkSkillFormulaInput): number => {
        const { model, skillLevel, weapon } = input;
        const baseLevel = model.level;
        const isWeaponFire = weapon?.data?.propertyAtk === ElementType.Fire;
        const bonusFire = isWeaponFire ? 0 : skillLevel * 100;

        return (bonusFire + skillLevel * 300) * (baseLevel / 100);
      },
    },
    {
      label: 'Hundred Spears Lv10',
      name: 'Hundred Spears',
      value: 'Hundred Spears==10',
      acd: 0.5,
      fct: 0,
      vct: 0.1,
      cd: 3,
      hit: 5,
      formula: (input: AtkSkillFormulaInput): number => {
        const { model } = input;
        const baseLevel = model.level;
        const bonus = this.learnLv('Clashing Spiral') * 50;

        return (1400 + bonus) * (baseLevel / 100);
      },
    },
  ];

  protected readonly _activeSkillList: ActiveSkillModel[] = [
    {
      label: 'Aura Blade 5',
      name: 'Aura Blade',
      inputType: 'selectButton',
      dropdown: [
        { label: 'Yes', value: 5, skillLv: 5, isUse: true },
        { label: 'No', value: 0, isUse: false },
      ],
    },
    {
      label: 'Spear Dynamo 5',
      name: 'Spear Dynamo',
      inputType: 'selectButton',
      dropdown: [
        { label: 'Yes', value: 5, skillLv: 5, isUse: true, bonus: { atkPercent: 15, hit: 50, defPercent: -15 } },
        { label: 'No', value: 0, isUse: false },
      ],
    },
    {
      label: 'Rune: Turisus',
      name: 'Turisus Runestone',
      inputType: 'selectButton',
      isDevMode: environment.production === true,
      dropdown: [
        { label: 'Yes', value: 5, skillLv: 5, isUse: true, bonus: { melee: 250, str: 30 } },
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

    this.inheritBaseClass(new LordKnight());
  }

  override getMasteryAtk(info: InfoForClass): number {
    const { weapon, model } = info;
    const weaponType = weapon?.data?.typeName;
    const bonuses = this.bonuses?.masteryAtks || {};

    let sum = 0;
    for (const [, bonus] of Object.entries(bonuses)) {
      sum += bonus[`x_${weaponType}_atk`] || 0; // x_spear_atk
    }

    if (this.isSkillActive('Aura Blade')) {
      sum += model.level * 8;
    }

    return sum;
  }

  override setAdditionalBonus(params: InfoForClass) {
    const { totalBonus, weapon } = params;
    const wType = weapon.data?.typeName;
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
}
