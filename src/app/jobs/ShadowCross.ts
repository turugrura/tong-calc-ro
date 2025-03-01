import { JOB_4_MAX_JOB_LEVEL, JOB_4_MIN_MAX_LEVEL } from '../app-config';
import { WeaponTypeName } from '../constants';
import { EquipmentSummaryModel } from '../models/equipment-summary.model';
import { AdditionalBonusInput } from '../models/info-for-class.model';
import { addBonus, genSkillList, genSkillListWithLabel } from '../utils';
import { GuillotineCross } from './GuillotineCross';
import { ActiveSkillModel, AtkSkillFormulaInput, AtkSkillModel, PassiveSkillModel } from './_character-base.abstract';
import { ClassName } from './_class-name';

const jobBonusTable: Record<number, [number, number, number, number, number, number]> = {
  1: [1, 1, 0, 0, 0, 0],
  2: [2, 2, 0, 0, 0, 0],
  3: [2, 3, 0, 0, 1, 0],
  4: [3, 3, 0, 0, 1, 1],
  5: [3, 3, 0, 0, 1, 1],
  6: [3, 4, 0, 1, 1, 1],
  7: [4, 4, 1, 1, 1, 1],
  8: [4, 4, 1, 1, 2, 1],
  9: [4, 4, 1, 2, 2, 2],
  10: [4, 4, 1, 2, 2, 2],
  11: [4, 5, 1, 2, 3, 2],
  12: [4, 5, 1, 2, 3, 2],
  13: [4, 6, 2, 2, 3, 2],
  14: [4, 6, 3, 2, 3, 2],
  15: [5, 7, 3, 2, 3, 2],
  16: [5, 7, 3, 2, 3, 2],
  17: [6, 7, 3, 3, 3, 2],
  18: [6, 7, 3, 3, 3, 2],
  19: [6, 8, 3, 3, 3, 2],
  20: [6, 8, 3, 3, 4, 2],
  21: [6, 8, 4, 3, 5, 2],
  22: [6, 8, 4, 4, 5, 2],
  23: [6, 8, 5, 4, 6, 2],
  24: [6, 8, 5, 4, 7, 2],
  25: [7, 8, 5, 4, 8, 2],
  26: [7, 8, 5, 4, 9, 2],
  27: [8, 9, 5, 4, 9, 2],
  28: [8, 9, 5, 4, 9, 3],
  29: [8, 10, 5, 4, 9, 3],
  30: [8, 10, 5, 5, 9, 4],
  31: [8, 10, 5, 5, 9, 4],
  32: [8, 10, 5, 5, 9, 4],
  33: [8, 10, 5, 5, 9, 4],
  34: [8, 10, 5, 5, 9, 4],
  35: [8, 10, 5, 5, 9, 4],
  36: [8, 11, 5, 5, 9, 4],
  37: [8, 11, 5, 5, 9, 4],
  38: [8, 11, 5, 5, 9, 4],
  39: [8, 11, 5, 5, 9, 4],
  40: [8, 11, 5, 5, 9, 4],
  41: [8, 11, 5, 5, 9, 4],
  42: [8, 11, 5, 5, 9, 4],
  43: [8, 11, 6, 5, 9, 4],
  44: [8, 11, 6, 5, 9, 4],
  45: [8, 11, 6, 5, 9, 4],
  46: [8, 11, 6, 5, 9, 4],
  47: [8, 11, 6, 5, 9, 4],
  48: [8, 11, 6, 5, 9, 4],
  49: [8, 11, 6, 5, 9, 4],
  50: [8, 11, 6, 5, 9, 4],
  51: [8, 11, 6, 5, 9, 4],
  52: [8, 11, 6, 5, 9, 4],
  53: [8, 11, 6, 5, 9, 4],
  54: [8, 11, 6, 5, 9, 4],
  55: [8, 11, 6, 5, 9, 4],
  56: [8, 11, 6, 5, 9, 4],
  57: [8, 11, 6, 5, 9, 4],
  58: [8, 11, 6, 5, 9, 4],
  59: [8, 11, 6, 5, 9, 4],
  60: [8, 11, 6, 5, 9, 4],
  61: [8, 11, 6, 5, 9, 4],
  62: [8, 11, 6, 5, 9, 4],
  63: [8, 11, 6, 5, 9, 4],
  64: [8, 11, 6, 5, 9, 4],
  65: [8, 11, 6, 5, 9, 4],
  66: [8, 11, 6, 5, 9, 4],
  67: [8, 11, 6, 5, 9, 4],
  68: [8, 11, 6, 5, 9, 4],
  69: [8, 11, 6, 5, 9, 4],
  70: [8, 11, 6, 5, 9, 4],
};

const traitBonusTable: Record<number, [number, number, number, number, number, number]> = {
  1: [0, 0, 0, 0, 0, 0],
  2: [0, 0, 0, 0, 0, 0],
  3: [0, 0, 0, 0, 0, 0],
  4: [0, 0, 0, 0, 0, 0],
  5: [1, 0, 0, 0, 0, 0],
  6: [1, 0, 0, 0, 0, 0],
  7: [1, 0, 0, 0, 0, 0],
  8: [2, 0, 0, 0, 0, 0],
  9: [2, 0, 0, 0, 0, 0],
  10: [2, 1, 0, 0, 0, 0],
  11: [2, 1, 0, 0, 0, 0],
  12: [3, 1, 0, 0, 0, 0],
  13: [3, 1, 0, 0, 0, 0],
  14: [3, 1, 0, 0, 0, 0],
  15: [3, 1, 0, 0, 0, 0],
  16: [4, 1, 0, 0, 0, 0],
  17: [4, 1, 0, 0, 0, 0],
  18: [5, 1, 0, 0, 0, 0],
  19: [5, 1, 0, 0, 0, 0],
  20: [5, 2, 0, 0, 0, 0],
  21: [5, 2, 0, 0, 0, 0],
  22: [5, 2, 0, 0, 0, 0],
  23: [5, 2, 0, 0, 0, 0],
  24: [5, 2, 0, 0, 1, 0],
  25: [5, 2, 0, 0, 1, 0],
  26: [5, 2, 0, 0, 1, 0],
  27: [5, 2, 0, 0, 1, 0],
  28: [5, 2, 0, 0, 1, 0],
  29: [5, 2, 0, 0, 1, 0],
  30: [5, 2, 0, 0, 1, 0],
  31: [6, 2, 0, 0, 1, 0],
  32: [6, 2, 0, 0, 2, 0],
  33: [7, 2, 0, 0, 2, 0],
  34: [7, 3, 0, 0, 2, 0],
  35: [7, 3, 0, 0, 3, 1],
  36: [7, 3, 0, 0, 3, 1],
  37: [8, 3, 0, 0, 4, 1],
  38: [8, 3, 0, 0, 4, 2],
  39: [8, 4, 1, 0, 4, 2],
  40: [9, 5, 1, 0, 4, 2],
  41: [9, 5, 2, 0, 4, 2],
  42: [10, 5, 2, 0, 4, 2],
  43: [10, 5, 2, 0, 4, 2],
  44: [10, 6, 2, 0, 4, 2],
  45: [10, 7, 3, 0, 4, 2],
  46: [10, 7, 3, 0, 4, 3],
  47: [10, 7, 3, 0, 5, 3],
  48: [10, 7, 3, 0, 5, 4],
  49: [10, 7, 4, 0, 6, 4],
  50: [11, 7, 4, 0, 6, 5],
  51: [12, 7, 4, 0, 6, 5],
  52: [12, 7, 4, 0, 6, 5],
  53: [12, 7, 4, 0, 7, 5],
  54: [12, 8, 4, 0, 7, 6],
  55: [12, 8, 4, 0, 7, 7],
  56: [12, 8, 4, 0, 7, 7],
  57: [12, 8, 4, 0, 8, 7],
  58: [12, 8, 4, 0, 8, 7],
  59: [12, 8, 4, 0, 8, 8],
  60: [12, 8, 4, 0, 8, 8],
  61: [12, 8, 4, 0, 8, 8],
  62: [12, 8, 4, 0, 8, 8],
  63: [12, 8, 4, 0, 8, 8],
  64: [12, 8, 4, 0, 8, 8],
  65: [12, 8, 4, 0, 8, 8],
  66: [12, 8, 4, 0, 8, 8],
  67: [12, 8, 4, 0, 8, 8],
  68: [12, 8, 4, 0, 8, 8],
  69: [12, 8, 4, 0, 8, 8],
  70: [12, 8, 4, 0, 8, 8],
};

export class ShadowCross extends GuillotineCross {
  protected override CLASS_NAME = ClassName.ShadowCross;
  protected override JobBonusTable = jobBonusTable;
  protected override TraitBonusTable = traitBonusTable;

  protected override minMaxLevel = JOB_4_MIN_MAX_LEVEL;
  protected override maxJob = JOB_4_MAX_JOB_LEVEL;

  private readonly classNames4th = [ClassName.Only_4th, ClassName.ShadowCross];
  private readonly atkSkillList4th: AtkSkillModel[] = [
    {
      name: 'Shadow Stab',
      label: '[V3] Shadow Stab Lv5',
      value: 'Shadow Stab==5',
      acd: 0,
      fct: 0,
      vct: 0,
      cd: 0.35,
      isMelee: true,
      verifyItemFn: ({ weapon }) => {
        const requires: WeaponTypeName[] = ['dagger'];
        if (requires.some(wType => weapon.isType(wType))) return '';

        return requires.join(', ');
      },
      isIgnoreDef: true,
      totalHit: () => {
        if (this.isSkillActive('Cloaking Exceed')) return 2;

        return 1;
      },
      formula: (input: AtkSkillFormulaInput): number => {
        const { model, skillLevel, status } = input;
        const { totalPow } = status;
        const baseLevel = model.level;

        return (skillLevel * 300 + totalPow * 5) * (baseLevel / 100);
      },
    },
    {
      name: 'Dancing Knife',
      label: '[V3] Dancing Knife Lv5',
      value: 'Dancing Knife==5',
      acd: 1,
      fct: 1,
      vct: 1,
      cd: 30,
      hitEveryNSec: 0.3,
      isMelee: true,
      verifyItemFn: ({ weapon }) => {
        const requires: WeaponTypeName[] = ['dagger'];
        if (requires.some(wType => weapon.isType(wType))) return '';

        return requires.join(', ');
      },
      formula: (input: AtkSkillFormulaInput): number => {
        const { model, skillLevel, status } = input;
        const { totalPow } = status;
        const baseLevel = model.level;

        return (skillLevel * 200 + totalPow * 5) * (baseLevel / 100);
      },
    },
    {
      name: 'Eternal Slash',
      label: '[V3] Eternal Slash Lv5 (1 hit)',
      value: 'Eternal Slash==5',
      acd: 0.5,
      fct: 0,
      vct: 0,
      cd: 0.5,
      isMelee: true,
      canCri: true,
      baseCriPercentage: 0.5,
      criDmgPercentage: 0.5,
      formula: (input: AtkSkillFormulaInput): number => {
        const { model, skillLevel, status } = input;
        const { totalPow } = status;
        const baseLevel = model.level;

        if (this.isSkillActive('Shadow Exceed')) {
          return (skillLevel * 365 + totalPow * 3) * (baseLevel / 100);
        }

        return (skillLevel * 265 + totalPow * 2) * (baseLevel / 100);
      },
      // finalDmgFormula(input) {
      //   const totalHit = input.stack || 1;

      //   return input.damage * totalHit;
      // },
    },
    {
      name: 'Savage Impact',
      label: '[V3] Savage Impact Lv5',
      value: 'Savage Impact==5',
      acd: 0.3,
      fct: 0,
      vct: 0,
      cd: 1,
      isMelee: true,
      canCri: true,
      baseCriPercentage: 0.5,
      criDmgPercentage: 0.5,
      verifyItemFn: ({ weapon }) => {
        const requires: WeaponTypeName[] = ['katar'];
        if (requires.some(wType => weapon.isType(wType))) return '';

        return requires.join(', ');
      },
      totalHit: () => {
        if (this.isSkillActive('Cloaking Exceed')) return 5;

        return 3;
      },
      formula: (input: AtkSkillFormulaInput): number => {
        const { model, skillLevel, status } = input;
        const { totalPow } = status;
        const baseLevel = model.level;

        if (this.isSkillActive('Shadow Exceed')) {
          return (skillLevel * 110 + totalPow * 7) * (baseLevel / 100);
        }

        return (skillLevel * 90 + totalPow * 5) * (baseLevel / 100);
      },
    },
    {
      name: 'Impact Crater',
      label: '[V3] Impact Crater Lv5',
      value: 'Impact Crater==5',
      acd: 0.5,
      fct: 0,
      vct: 0,
      cd: 1.5,
      isMelee: true,
      canCri: true,
      baseCriPercentage: 0.5,
      criDmgPercentage: 0.5,
      verifyItemFn: ({ weapon }) => {
        const requires: WeaponTypeName[] = ['katar'];
        if (requires.some(wType => weapon.isType(wType))) return '';

        return requires.join(', ');
      },
      totalHit: () => {
        return this.activeSkillLv('Spin Count') || 1;
      },
      formula: (input: AtkSkillFormulaInput): number => {
        const { model, skillLevel, status } = input;
        const { totalPow } = status;
        const baseLevel = model.level;

        return (skillLevel * 80 + totalPow * 3) * (baseLevel / 100);
      },
    },
    {
      name: 'Fatal Shadow Claw',
      label: '[V3] Fatal Shadow Claw Lv10',
      value: 'Fatal Shadow Claw==10',
      acd: 0.5,
      fct: 1.5,
      vct: 4,
      cd: 60,
      isMelee: true,
      forceCri: true,
      formula: (input: AtkSkillFormulaInput): number => {
        const { model, skillLevel, status, monster } = input;
        const { totalPow } = status;
        const baseLevel = model.level;
        const raceBonus = monster.isRace('demihuman', 'dragon') ? 150 : 0;

        return (skillLevel * (1300 + raceBonus) + totalPow * 10) * (baseLevel / 100);
      },
    },
  ];
  private readonly activeSkillList4th: ActiveSkillModel[] = [
    {
      name: 'Shadow Wound',
      label: 'Shadow Wound',
      isDebuff: true,
      inputType: 'dropdown',
      dropdown: genSkillListWithLabel(
        20,
        (lv) => `${lv} stack`,
        (lv) => ({ meleeReduction: lv * 3 }),
      ),
    },
    {
      name: 'Potent Venom',
      label: 'Potent Venom',
      inputType: 'dropdown',
      dropdown: genSkillList(10, (lv) => ({ pene_res: lv * 3 })),
    },
    {
      name: 'Shadow Exceed',
      label: 'Shadow Exceed 10',
      inputType: 'selectButton',
      dropdown: [
        { label: 'Yes', value: 10, isUse: true },
        { label: 'No', value: 0, isUse: false },
      ],
    },
  ];
  private readonly passiveSkillList4th: PassiveSkillModel[] = [
    {
      name: 'Shadow Sense',
      label: 'Shadow Sense',
      inputType: 'dropdown',
      dropdown: genSkillList(10, (lv) => ({ flee: lv * 10 })),
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

  override setAdditionalBonus(params: AdditionalBonusInput): EquipmentSummaryModel {
    super.setAdditionalBonus(params);

    const { totalBonus, weapon } = params;

    const shadowSenseLv = this.learnLv('Shadow Sense');
    if (shadowSenseLv > 0) {
      let criBonus = 0;
      if (weapon.isType('dagger')) criBonus = 10 + shadowSenseLv * 4;
      if (weapon.isType('katar')) criBonus = 5 + shadowSenseLv * 2;
      addBonus(totalBonus, 'cri', criBonus);
    }

    return totalBonus;
  }
}
