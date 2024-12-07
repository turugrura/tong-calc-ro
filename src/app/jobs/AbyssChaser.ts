import { ClassName } from './_class-name';
import { ActiveSkillModel, AtkSkillFormulaInput, AtkSkillModel, PassiveSkillModel } from './_character-base.abstract';
import { JOB_4_MAX_JOB_LEVEL, JOB_4_MIN_MAX_LEVEL } from '../app-config';
import { ShadowChaser } from './ShadowChaser';
import { addBonus, floor, genSkillList } from '../utils';
import { EquipmentSummaryModel } from '../models/equipment-summary.model';
import { AdditionalBonusInput } from '../models/info-for-class.model';
import { ElementType, WeaponTypeName } from '../constants';

const jobBonusTable: Record<number, [number, number, number, number, number, number]> = {
  1: [0, 0, 0, 0, 0, 1],
  2: [1, 0, 0, 0, 0, 1],
  3: [1, 0, 0, 0, 1, 1],
  4: [1, 0, 0, 0, 1, 2],
  5: [2, 0, 0, 1, 1, 2],
  6: [2, 0, 0, 2, 1, 2],
  7: [2, 0, 0, 2, 1, 3],
  8: [2, 1, 0, 2, 1, 3],
  9: [2, 1, 0, 2, 2, 3],
  10: [2, 1, 1, 3, 2, 3],
  11: [2, 1, 2, 3, 2, 3],
  12: [3, 1, 2, 3, 2, 3],
  13: [4, 1, 2, 4, 2, 3],
  14: [4, 1, 2, 4, 2, 4],
  15: [4, 1, 2, 4, 2, 4],
  16: [4, 1, 2, 4, 3, 4],
  17: [4, 2, 2, 4, 3, 4],
  18: [4, 2, 3, 4, 3, 4],
  19: [4, 2, 3, 5, 3, 4],
  20: [4, 2, 4, 5, 3, 4],
  21: [5, 2, 4, 6, 3, 4],
  22: [5, 2, 5, 6, 4, 4],
  23: [5, 3, 5, 6, 4, 4],
  24: [5, 3, 5, 6, 4, 5],
  25: [5, 4, 6, 6, 4, 5],
  26: [5, 4, 6, 6, 4, 6],
  27: [6, 5, 6, 6, 4, 6],
  28: [6, 6, 6, 6, 4, 6],
  29: [6, 7, 7, 6, 4, 6],
  30: [6, 7, 7, 6, 5, 6],
  31: [7, 8, 7, 6, 5, 6],
  32: [8, 8, 7, 6, 5, 6],
  33: [8, 8, 8, 6, 5, 6],
  34: [8, 8, 8, 6, 5, 6],
  35: [8, 8, 8, 6, 5, 6],
  36: [8, 8, 8, 6, 5, 6],
  37: [8, 8, 8, 6, 5, 6],
  38: [8, 8, 8, 6, 6, 6],
  39: [8, 8, 8, 6, 6, 6],
  40: [8, 8, 8, 6, 6, 6],
  41: [8, 9, 8, 6, 6, 6],
  42: [8, 9, 8, 6, 6, 6],
  43: [8, 9, 8, 6, 6, 6],
  44: [8, 9, 8, 6, 6, 6],
  45: [8, 9, 8, 6, 6, 6],
  46: [8, 9, 8, 6, 6, 6],
  47: [8, 9, 8, 6, 6, 6],
  48: [8, 9, 8, 6, 6, 6],
  49: [8, 9, 8, 6, 6, 6],
  50: [8, 9, 8, 6, 6, 6],
  51: [8, 9, 8, 6, 6, 6],
  52: [8, 9, 8, 6, 6, 6],
  53: [8, 9, 8, 6, 6, 6],
  54: [8, 9, 8, 6, 6, 6],
  55: [8, 9, 8, 6, 6, 6],
  56: [8, 9, 8, 6, 6, 6],
  57: [8, 9, 8, 6, 6, 6],
  58: [8, 9, 8, 6, 6, 6],
  59: [8, 9, 8, 6, 6, 6],
  60: [8, 9, 8, 6, 6, 6],
  61: [8, 9, 8, 6, 6, 6],
  62: [8, 9, 8, 6, 6, 6],
  63: [8, 9, 8, 6, 6, 6],
  64: [8, 9, 8, 6, 6, 6],
  65: [8, 9, 8, 6, 6, 6],
  66: [8, 9, 8, 6, 6, 6],
  67: [8, 9, 8, 6, 6, 6],
  68: [8, 9, 8, 6, 6, 6],
  69: [8, 9, 8, 6, 6, 6],
  70: [8, 9, 8, 6, 6, 6],
};

const traitBonusTable: Record<number, [number, number, number, number, number, number]> = {
  1: [1, 0, 0, 0, 0, 0],
  2: [1, 0, 0, 1, 0, 0],
  3: [1, 0, 0, 1, 0, 0],
  4: [1, 0, 0, 1, 0, 0],
  5: [1, 0, 0, 1, 0, 0],
  6: [1, 0, 0, 1, 0, 0],
  7: [2, 0, 0, 1, 0, 0],
  8: [2, 1, 0, 1, 0, 0],
  9: [2, 1, 0, 1, 1, 0],
  10: [2, 1, 0, 1, 1, 0],
  11: [2, 1, 0, 1, 2, 0],
  12: [2, 1, 0, 1, 2, 0],
  13: [2, 1, 0, 1, 2, 0],
  14: [2, 1, 0, 1, 2, 0],
  15: [2, 1, 0, 2, 2, 0],
  16: [2, 1, 0, 2, 2, 1],
  17: [2, 1, 1, 2, 2, 1],
  18: [2, 1, 1, 2, 2, 1],
  19: [2, 1, 2, 2, 2, 1],
  20: [2, 2, 2, 2, 2, 1],
  21: [2, 2, 2, 2, 2, 1],
  22: [2, 2, 2, 2, 2, 1],
  23: [2, 3, 2, 2, 2, 1],
  24: [2, 3, 2, 2, 2, 1],
  25: [2, 3, 2, 2, 2, 1],
  26: [2, 3, 2, 2, 2, 1],
  27: [2, 3, 2, 2, 2, 1],
  28: [2, 3, 2, 2, 2, 1],
  29: [2, 3, 2, 2, 2, 1],
  30: [2, 3, 2, 2, 2, 1],
  31: [2, 3, 2, 2, 2, 1],
  32: [2, 3, 2, 2, 2, 1],
  33: [2, 3, 2, 2, 2, 1],
  34: [3, 3, 3, 2, 2, 1],
  35: [3, 3, 3, 3, 2, 1],
  36: [4, 3, 3, 3, 2, 1],
  37: [4, 4, 3, 3, 3, 1],
  38: [4, 4, 3, 3, 3, 1],
  39: [4, 4, 3, 3, 3, 2],
  40: [4, 4, 3, 3, 3, 3],
  41: [4, 5, 3, 3, 3, 3],
  42: [5, 5, 3, 3, 3, 3],
  43: [5, 5, 3, 3, 3, 4],
  44: [6, 5, 3, 3, 3, 4],
  45: [6, 5, 3, 4, 3, 5],
  46: [6, 5, 3, 5, 3, 5],
  47: [6, 5, 4, 5, 3, 5],
  48: [6, 5, 4, 6, 4, 5],
  49: [6, 6, 4, 6, 4, 5],
  50: [7, 6, 4, 7, 4, 5],
  51: [8, 6, 4, 7, 4, 5],
  52: [8, 6, 4, 7, 4, 6],
  53: [8, 6, 4, 7, 4, 6],
  54: [8, 7, 4, 7, 4, 6],
  55: [8, 8, 4, 7, 5, 6],
  56: [8, 8, 4, 8, 5, 6],
  57: [8, 8, 4, 8, 5, 6],
  58: [8, 8, 4, 8, 5, 6],
  59: [9, 8, 4, 8, 5, 6],
  60: [9, 8, 4, 8, 5, 6],
  61: [9, 8, 4, 8, 5, 6],
  62: [9, 8, 4, 8, 5, 6],
  63: [9, 8, 4, 8, 5, 6],
  64: [9, 8, 4, 8, 5, 6],
  65: [9, 8, 4, 8, 5, 6],
  66: [9, 8, 4, 8, 5, 6],
  67: [9, 8, 4, 8, 5, 6],
  68: [9, 8, 4, 8, 5, 6],
  69: [9, 8, 4, 8, 5, 6],
  70: [9, 8, 4, 8, 5, 6],
};

export class AbyssChaser extends ShadowChaser {
  protected override CLASS_NAME = ClassName.AbyssChaser;
  protected override JobBonusTable = jobBonusTable;
  protected override TraitBonusTable = traitBonusTable;

  protected override minMaxLevel = JOB_4_MIN_MAX_LEVEL;
  protected override maxJob = JOB_4_MAX_JOB_LEVEL;

  private readonly classNames4th = [ClassName.Only_4th, ClassName.AbyssChaser];
  private readonly atkSkillList4th: AtkSkillModel[] = [
    {
      name: 'Abyss Dagger',
      label: '[V2] Abyss Dagger Lv5',
      value: 'Abyss Dagger==5',
      acd: 0.5,
      fct: 0,
      vct: 0,
      cd: 0.3,
      isMelee: true,
      totalHit: 2,
      verifyItemFn: ({ weapon }) => {
        const requires: WeaponTypeName[] = ['dagger', 'sword']
        if (requires.some(wType => weapon.isType(wType))) return ''

        return requires.join(', ')
      },
      formula: (input: AtkSkillFormulaInput): number => {
        const { model, skillLevel, status } = input;
        const { totalPow } = status;
        const { level: baseLevel } = model;

        return (skillLevel * 350 + totalPow * 5) * (baseLevel / 100);
      },
    },
    {
      name: 'Unlucky Rush',
      label: '[V2] Unlucky Rush Lv5',
      value: 'Unlucky Rush==5',
      acd: 0.5,
      fct: 0,
      vct: 0,
      cd: 0.25,
      isMelee: true,
      formula: (input: AtkSkillFormulaInput): number => {
        const { model, skillLevel, status } = input;
        const { totalPow } = status;
        const { level: baseLevel } = model;

        return (100 + skillLevel * 300 + totalPow * 5) * (baseLevel / 100);
      },
    },
    {
      name: 'Deft Stab',
      label: '[V2] Deft Stab Lv5',
      value: 'Deft Stab==5',
      acd: 0.5,
      fct: 0,
      vct: 0,
      cd: 0.3,
      isMelee: true,
      hit: 5,
      formula: (input: AtkSkillFormulaInput): number => {
        const { model, skillLevel, status } = input;
        const { totalPow } = status;
        const { level: baseLevel } = model;

        return (skillLevel * 360 + totalPow * 5) * (baseLevel / 100);
      },
    },
    {
      name: 'Chain Reaction Shot',
      label: '[V2] Chain Reaction Shot Lv5',
      value: 'Chain Reaction Shot==5',
      acd: 0.5,
      fct: 1,
      vct: 1,
      cd: 1.5,
      verifyItemFn: ({ weapon }) => {
        const requires: WeaponTypeName[] = ['bow']
        if (requires.some(wType => weapon.isType(wType))) return ''

        return requires.join(', ')
      },
      formula: (input: AtkSkillFormulaInput): number => {
        const { model, skillLevel, status } = input;
        const { totalCon } = status;
        const { level: baseLevel } = model;

        const primary = (skillLevel * 600 + totalCon * 5) * (baseLevel / 100);
        const second = (skillLevel * 950 + totalCon * 5) * (baseLevel / 100);

        return floor(primary) + floor(second);
      },
    },
    {
      name: 'Frenzy Shot',
      label: '[V2] Frenzy Shot Lv10 (1 hit)',
      value: 'Frenzy Shot==10',
      acd: 0.5,
      fct: 0,
      vct: 0,
      cd: 0.2,
      canCri: true,
      baseCriPercentage: 1,
      criDmgPercentage: 0.5,
      verifyItemFn: ({ weapon }) => {
        const requires: WeaponTypeName[] = ['bow']
        if (requires.some(wType => weapon.isType(wType))) return ''

        return requires.join(', ')
      },
      formula: (input: AtkSkillFormulaInput): number => {
        const { model, skillLevel, status } = input;
        const { totalCon } = status;
        const { level: baseLevel } = model;

        return (skillLevel * 350 + totalCon * 5) * (baseLevel / 100);
      },
    },
    {
      name: 'From the Abyss',
      label: '[V2] From the Abyss Lv5',
      value: 'From the Abyss==5',
      acd: 0,
      fct: 0,
      vct: 0,
      cd: 60,
      isMatk: true,
      element: ElementType.Neutral,
      formula: (input: AtkSkillFormulaInput): number => {
        const { model, skillLevel, status } = input;
        const { totalSpl } = status;
        const { level: baseLevel } = model;

        return (150 + skillLevel * 70 + totalSpl * 5) * (baseLevel / 100);
      },
    },
    {
      name: 'Abyss Square',
      label: '[V2] Abyss Square Lv5 (อยู่นอกพื้นที่สกิล)',
      value: 'Abyss Square==5',
      acd: 0.5,
      fct: 1.5,
      vct: 5,
      cd: 3,
      totalHit: 10,
      isMatk: true,
      element: ElementType.Neutral,
      formula: (input: AtkSkillFormulaInput): number => {
        const { model, skillLevel, status } = input;
        const { totalSpl } = status;
        const { level: baseLevel } = model;
        const magicSwordMasLv = this.learnLv('Magic Sword Mastery')

        return (skillLevel * (250 + magicSwordMasLv * 15) + totalSpl * 5) * (baseLevel / 100);
      },
    },
    {
      name: 'Omega Abyss Strike',
      label: '[V2] Omega Abyss Strike Lv10',
      value: 'Omega Abyss Strike==10',
      acd: 0.5,
      fct: 1.5,
      vct: 4,
      cd: 60,
      isMatk: true,
      element: ElementType.Neutral,
      formula: (input: AtkSkillFormulaInput): number => {
        const { model, skillLevel, status, monster } = input;
        const { totalSpl } = status;
        const { level: baseLevel } = model;
        const raceBonus = monster.isRace('angel', 'demon') ? 550 : 0;

        return (skillLevel * (600 + raceBonus) + totalSpl * 10) * (baseLevel / 100);
      },
    },
  ];
  private readonly activeSkillList4th: ActiveSkillModel[] = [
    {
      name: 'Strip Shadow',
      label: 'Strip Shadow',
      isDebuff: true,
      inputType: 'selectButton',
      dropdown: [
        { label: 'Yes', value: 5, isUse: true, bonus: { monster_res: -50, monster_mres: -50 } },
        { label: 'No', value: 0, isUse: false },
      ],
    },
    {
      name: 'Abyss Slayer',
      label: 'Abyss Slayer',
      inputType: 'dropdown',
      dropdown: genSkillList(10, (lv) => ({ pAtk: 10 + lv * 2, sMatk: 10 + lv * 2, hit: 100 + lv * 20 })),
    },
    {
      name: 'Abyss Dagger',
      label: 'Abyss Dagger',
      inputType: 'selectButton',
      dropdown: [
        { label: 'Yes', value: 5, isUse: true },
        { label: 'No', value: 0, isUse: false },
      ],
    },
  ];
  private readonly passiveSkillList4th: PassiveSkillModel[] = [
    {
      name: 'Dagger & Bow Mastery',
      label: 'Dagger & Bow Mastery',
      inputType: 'dropdown',
      dropdown: genSkillList(10),
    },
    {
      name: 'Magic Sword Mastery',
      label: 'Magic Sword Mastery',
      inputType: 'dropdown',
      dropdown: genSkillList(10),
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

    const dAndBowLv = this.learnLv('Dagger & Bow Mastery');
    if (dAndBowLv > 0 && weapon.isType('dagger', 'bow')) {
      const mapM = [0, 2, 3, 5, 6, 8, 9, 11, 12, 14, 15];
      addBonus(totalBonus, 'p_size_s', dAndBowLv);
      addBonus(totalBonus, 'p_size_m', mapM[dAndBowLv]);
      addBonus(totalBonus, 'p_size_l', dAndBowLv * 2);
    }

    const magicLv = this.learnLv('Magic Sword Mastery');
    if (magicLv > 0 && weapon.isType('dagger', 'sword')) {
      addBonus(totalBonus, 'm_size_all', Math.ceil(magicLv * 1.5));
    }

    return totalBonus;
  }
}
