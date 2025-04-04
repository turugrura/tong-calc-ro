import { JOB_4_MAX_JOB_LEVEL, JOB_4_MIN_MAX_LEVEL } from '../app-config';
import { ElementType, WeaponTypeName } from '../constants';
import { EquipmentSummaryModel } from '../models/equipment-summary.model';
import { AdditionalBonusInput } from '../models/info-for-class.model';
import { addBonus, floor } from '../utils';
import { ArchBishop } from './ArchBishop';
import { ActiveSkillModel, AtkSkillFormulaInput, AtkSkillModel, PassiveSkillModel } from './_character-base.abstract';
import { ClassName } from './_class-name';

const jobBonusTable: Record<number, [number, number, number, number, number, number]> = {
  1: [1, 0, 0, 1, 0, 0],
  2: [1, 0, 0, 1, 0, 0],
  3: [1, 0, 0, 2, 0, 0],
  4: [1, 0, 0, 2, 1, 0],
  5: [1, 1, 0, 2, 1, 0],
  6: [1, 2, 0, 2, 1, 0],
  7: [1, 2, 0, 2, 1, 1],
  8: [1, 2, 0, 3, 1, 1],
  9: [1, 2, 1, 3, 1, 1],
  10: [1, 2, 2, 3, 1, 1],
  11: [1, 2, 2, 4, 1, 1],
  12: [1, 2, 2, 5, 1, 1],
  13: [1, 2, 2, 5, 2, 1],
  14: [1, 2, 2, 5, 3, 1],
  15: [2, 2, 2, 5, 3, 1],
  16: [2, 3, 2, 5, 4, 1],
  17: [2, 3, 3, 5, 4, 2],
  18: [3, 3, 3, 6, 4, 2],
  19: [3, 4, 3, 6, 5, 2],
  20: [3, 4, 4, 7, 5, 2],
  21: [4, 4, 4, 7, 5, 2],
  22: [4, 4, 4, 8, 5, 2],
  23: [4, 4, 4, 8, 6, 2],
  24: [5, 4, 4, 8, 6, 2],
  25: [5, 4, 4, 8, 6, 2],
  26: [5, 5, 4, 8, 6, 2],
  27: [5, 5, 4, 8, 7, 2],
  28: [5, 5, 4, 9, 7, 2],
  29: [5, 5, 5, 9, 7, 2],
  30: [5, 5, 5, 10, 7, 2],
  31: [5, 6, 5, 10, 7, 2],
  32: [5, 7, 5, 10, 7, 2],
  33: [5, 7, 5, 11, 7, 2],
  34: [5, 7, 6, 11, 7, 3],
  35: [5, 7, 6, 11, 7, 3],
  36: [5, 7, 6, 12, 7, 3],
  37: [5, 7, 7, 12, 7, 3],
  38: [5, 7, 7, 12, 7, 3],
  39: [6, 7, 7, 12, 7, 3],
  40: [6, 7, 7, 12, 7, 3],
  41: [6, 7, 7, 12, 7, 4],
  42: [6, 7, 7, 12, 7, 4],
  43: [6, 7, 7, 12, 7, 4],
  44: [6, 7, 7, 12, 7, 4],
  45: [6, 7, 7, 12, 7, 4],
  46: [6, 7, 7, 12, 7, 4],
  47: [6, 7, 7, 12, 7, 4],
  48: [6, 7, 7, 12, 7, 4],
  49: [6, 7, 7, 12, 7, 4],
  50: [6, 7, 7, 12, 7, 4],
  51: [6, 7, 7, 12, 7, 4],
  52: [6, 7, 7, 12, 7, 4],
  53: [6, 7, 7, 12, 7, 4],
  54: [6, 7, 7, 12, 7, 4],
  55: [6, 7, 7, 12, 7, 4],
  56: [6, 7, 7, 12, 7, 4],
  57: [6, 7, 7, 12, 7, 4],
  58: [6, 7, 7, 12, 7, 4],
  59: [6, 7, 7, 12, 7, 4],
  60: [6, 7, 7, 12, 7, 4],
  61: [6, 7, 7, 12, 7, 4],
  62: [6, 7, 7, 12, 7, 4],
  63: [6, 7, 7, 12, 7, 4],
  64: [6, 7, 7, 12, 7, 4],
  65: [6, 7, 7, 12, 7, 4],
  66: [6, 7, 7, 12, 7, 4],
  67: [6, 7, 7, 12, 7, 4],
  68: [6, 7, 7, 12, 7, 4],
  69: [6, 7, 7, 12, 7, 4],
  70: [6, 7, 7, 12, 7, 4],
};

const traitBonusTable: Record<number, [number, number, number, number, number, number]> = {
  1: [0, 0, 0, 0, 0, 0],
  2: [0, 0, 0, 1, 0, 0],
  3: [0, 1, 0, 1, 0, 0],
  4: [0, 1, 0, 2, 0, 0],
  5: [0, 1, 0, 2, 0, 0],
  6: [0, 2, 0, 2, 0, 0],
  7: [0, 2, 0, 2, 0, 0],
  8: [0, 2, 0, 3, 0, 0],
  9: [0, 2, 0, 3, 0, 0],
  10: [0, 2, 0, 3, 0, 0],
  11: [1, 2, 0, 3, 0, 0],
  12: [1, 2, 0, 3, 0, 0],
  13: [1, 2, 0, 3, 0, 0],
  14: [2, 2, 0, 3, 0, 0],
  15: [2, 2, 0, 3, 0, 0],
  16: [2, 2, 0, 3, 0, 0],
  17: [2, 2, 0, 3, 0, 0],
  18: [2, 2, 0, 3, 0, 0],
  19: [2, 2, 0, 3, 0, 0],
  20: [2, 2, 0, 3, 0, 0],
  21: [2, 2, 0, 3, 0, 0],
  22: [2, 2, 0, 3, 0, 0],
  23: [2, 2, 0, 3, 0, 0],
  24: [3, 2, 0, 3, 0, 0],
  25: [3, 3, 0, 3, 0, 0],
  26: [3, 3, 1, 3, 0, 0],
  27: [3, 3, 2, 3, 0, 0],
  28: [3, 3, 2, 3, 0, 0],
  29: [3, 3, 2, 3, 0, 0],
  30: [3, 3, 2, 3, 0, 1],
  31: [3, 3, 2, 3, 0, 1],
  32: [3, 3, 2, 3, 0, 2],
  33: [3, 3, 2, 3, 0, 2],
  34: [3, 3, 2, 3, 0, 2],
  35: [3, 3, 2, 4, 0, 2],
  36: [3, 3, 2, 4, 1, 2],
  37: [3, 3, 2, 4, 1, 2],
  38: [3, 3, 2, 4, 2, 2],
  39: [3, 3, 2, 5, 2, 2],
  40: [3, 3, 2, 5, 3, 2],
  41: [3, 3, 2, 5, 3, 2],
  42: [4, 3, 2, 5, 3, 2],
  43: [5, 3, 2, 6, 3, 2],
  44: [5, 3, 3, 6, 3, 2],
  45: [5, 3, 3, 6, 4, 3],
  46: [6, 3, 3, 6, 4, 4],
  47: [6, 3, 4, 7, 4, 4],
  48: [6, 4, 4, 7, 4, 4],
  49: [7, 4, 4, 7, 4, 5],
  50: [7, 4, 4, 8, 4, 6],
  51: [7, 4, 4, 9, 4, 6],
  52: [8, 4, 4, 9, 4, 6],
  53: [8, 5, 4, 9, 4, 6],
  54: [8, 5, 5, 9, 4, 6],
  55: [8, 5, 5, 9, 4, 7],
  56: [8, 5, 5, 9, 5, 7],
  57: [8, 5, 5, 9, 5, 7],
  58: [8, 5, 5, 9, 5, 7],
  59: [8, 5, 5, 10, 5, 7],
  60: [8, 5, 5, 10, 5, 7],
  61: [8, 5, 5, 10, 5, 7],
  62: [8, 5, 5, 10, 5, 7],
  63: [8, 5, 5, 10, 5, 7],
  64: [8, 5, 5, 10, 5, 7],
  65: [8, 5, 5, 10, 5, 7],
  66: [8, 5, 5, 10, 5, 7],
  67: [8, 5, 5, 10, 5, 7],
  68: [8, 5, 5, 10, 5, 7],
  69: [8, 5, 5, 10, 5, 7],
  70: [8, 5, 5, 10, 5, 7],
};

export class Cardinal extends ArchBishop {
  protected override CLASS_NAME = ClassName.Cardinal;
  protected override JobBonusTable = jobBonusTable;
  protected override TraitBonusTable = traitBonusTable;

  protected override minMaxLevel = JOB_4_MIN_MAX_LEVEL;
  protected override maxJob = JOB_4_MAX_JOB_LEVEL;

  private readonly classNames4th = [ClassName.Only_4th, ClassName.Cardinal];
  private readonly atkSkillList4th: AtkSkillModel[] = [
    {
      name: 'Framen',
      label: '[V3] Framen Lv5',
      value: 'Framen==5',
      acd: 0.5,
      fct: 1.5,
      vct: 5,
      cd: 0.3,
      isMatk: true,
      element: ElementType.Holy,
      formula: (input: AtkSkillFormulaInput): number => {
        const { model, skillLevel, status, monster } = input;
        const { totalSpl } = status;
        const baseLevel = model.level;
        const fidusLv = this.learnLv('Fidus Animus');

        if (monster.isRace('demon', 'undead')) {
          return (skillLevel * (900 + fidusLv * 5) + totalSpl * 5) * (baseLevel / 100);
        }

        return (skillLevel * (800 + fidusLv * 5) + totalSpl * 3) * (baseLevel / 100);
      },
    },
    {
      name: 'Arbitrium',
      label: '[V3] Arbitrium Lv10',
      value: 'Arbitrium==10',
      acd: 0.5,
      fct: 1.5,
      vct: 4,
      cd: 1.5,
      isMatk: true,
      element: ElementType.Holy,
      formula: (input: AtkSkillFormulaInput): number => {
        const { model, skillLevel, status } = input;
        const { totalSpl } = status;
        const baseLevel = model.level;
        const fidusLv = this.learnLv('Fidus Animus');

        const primaryDmg = (skillLevel * (1250 + fidusLv * 10) + totalSpl * 7) * (baseLevel / 100);
        const secondaryDmg = (skillLevel * (1000 + fidusLv * 10) + totalSpl * 7) * (baseLevel / 100);

        return primaryDmg + secondaryDmg;
      },
    },
    {
      name: 'Petitio',
      label: '[V3] Petitio Lv10',
      value: 'Petitio==10',
      acd: 0.5,
      fct: 0,
      vct: 0,
      cd: 0.5,
      canCri: true,
      criDmgPercentage: 0.5,
      isMelee: (weaponType) => {
        return weaponType === 'book';
      },
      verifyItemFn: ({ weapon }) => {
        const requires: WeaponTypeName[] = ['mace', 'twohandMace', 'book'];
        if (requires.some(wType => weapon.isType(wType))) return '';

        return requires.join(', ');
      },
      formula: (input: AtkSkillFormulaInput): number => {
        const { model, skillLevel, status } = input;
        const { totalPow } = status;
        const baseLevel = model.level;
        const mAndBookLv = this.learnLv('Mace & Book Mastery');

        return (skillLevel * (1050 + mAndBookLv * 10) + totalPow * 5) * (baseLevel / 100);
      },
    },
  ];
  private readonly activeSkillList4th: ActiveSkillModel[] = [];
  private readonly passiveSkillList4th: PassiveSkillModel[] = [
    {
      name: 'Mace & Book Mastery',
      label: 'Mace & Book Mastery',
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
      name: 'Fidus Animus',
      label: 'Fidus Animus',
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

    this.inheritSkills({
      activeSkillList: this.activeSkillList4th,
      atkSkillList: this.atkSkillList4th,
      passiveSkillList: this.passiveSkillList4th,
      classNames: this.classNames4th,
    });
  }

  override setAdditionalBonus(params: AdditionalBonusInput): EquipmentSummaryModel {
    super.setAdditionalBonus(params);

    const { totalBonus, weapon, skillName } = params;

    const mAndBookLv = this.learnLv('Mace & Book Mastery');
    if (mAndBookLv > 0 && weapon.isType('mace', 'book', 'twohandMace')) {
      const mapM = [0, 2, 3, 5, 6, 8, 9, 11, 12, 14, 15];
      const mapL = [0, 3, 5, 7, 9, 10, 12, 13, 15, 16, 18];
      addBonus(totalBonus, 'p_size_s', mAndBookLv);
      addBonus(totalBonus, 'p_size_m', mapM[mAndBookLv]);
      addBonus(totalBonus, 'p_size_l', mapL[mAndBookLv]);
    }

    const fidusLv = this.learnLv('Fidus Animus');
    if (fidusLv > 0) {
      if (skillName === 'Framen' || skillName === 'Arbitrium' || skillName === 'Pneumaticus Procella') {
        addBonus(totalBonus, 'm_my_element_holy', floor(fidusLv * 1.5));
      }
    }

    return totalBonus;
  }
}
