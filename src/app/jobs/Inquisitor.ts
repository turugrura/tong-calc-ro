import { JOB_4_MAX_JOB_LEVEL, JOB_4_MIN_MAX_LEVEL } from '../app-config';
import { EquipmentSummaryModel } from '../models/equipment-summary.model';
import { AdditionalBonusInput } from '../models/info-for-class.model';
import { addBonus, floor, genSkillList } from '../utils';
import { Sura } from './Sura';
import { ActiveSkillModel, AtkSkillFormulaInput, AtkSkillModel, PassiveSkillModel } from './_character-base.abstract';
import { ClassName } from './_class-name';

const jobBonusTable: Record<number, [number, number, number, number, number, number]> = {
  1: [0, 1, 0, 0, 1, 0],
  2: [1, 1, 0, 0, 2, 0],
  3: [1, 1, 0, 1, 2, 0],
  4: [2, 1, 0, 1, 2, 0],
  5: [3, 1, 0, 1, 2, 0],
  6: [4, 1, 0, 1, 2, 0],
  7: [4, 1, 0, 1, 3, 0],
  8: [4, 2, 0, 2, 3, 0],
  9: [5, 2, 0, 2, 4, 0],
  10: [5, 3, 0, 2, 4, 0],
  11: [5, 3, 0, 2, 5, 0],
  12: [5, 4, 1, 2, 5, 0],
  13: [5, 4, 1, 2, 5, 0],
  14: [5, 5, 2, 2, 5, 0],
  15: [5, 5, 2, 3, 5, 1],
  16: [6, 5, 2, 3, 5, 1],
  17: [6, 5, 3, 4, 5, 1],
  18: [7, 5, 3, 5, 5, 1],
  19: [7, 5, 4, 5, 6, 1],
  20: [7, 5, 5, 5, 7, 1],
  21: [7, 6, 5, 5, 7, 1],
  22: [8, 7, 5, 5, 7, 1],
  23: [8, 8, 5, 5, 7, 1],
  24: [8, 8, 5, 5, 8, 1],
  25: [8, 9, 5, 5, 8, 1],
  26: [9, 9, 5, 5, 8, 1],
  27: [9, 9, 5, 5, 8, 1],
  28: [9, 9, 5, 5, 8, 1],
  29: [9, 9, 5, 5, 8, 1],
  30: [9, 9, 5, 6, 8, 1],
  31: [9, 9, 5, 6, 8, 1],
  32: [9, 9, 5, 6, 8, 1],
  33: [9, 9, 5, 6, 8, 1],
  34: [9, 9, 5, 6, 8, 1],
  35: [9, 9, 5, 6, 8, 1],
  36: [9, 9, 5, 6, 8, 1],
  37: [9, 9, 5, 6, 8, 1],
  38: [9, 9, 5, 6, 8, 1],
  39: [9, 9, 5, 6, 8, 1],
  40: [9, 9, 5, 6, 8, 1],
  41: [9, 9, 5, 6, 8, 1],
  42: [9, 9, 5, 7, 8, 1],
  43: [9, 10, 5, 7, 8, 1],
  44: [9, 10, 5, 7, 8, 1],
  45: [9, 10, 5, 8, 8, 1],
  46: [9, 10, 5, 8, 8, 1],
  47: [9, 10, 6, 8, 8, 1],
  48: [9, 10, 6, 8, 8, 1],
  49: [9, 10, 6, 8, 8, 1],
  50: [9, 10, 6, 8, 8, 1],
  51: [9, 10, 6, 8, 8, 1],
  52: [9, 10, 6, 8, 8, 1],
  53: [9, 10, 6, 8, 8, 1],
  54: [9, 10, 6, 8, 8, 1],
  55: [9, 10, 6, 8, 8, 1],
  56: [9, 10, 6, 8, 8, 1],
  57: [9, 10, 6, 8, 8, 1],
  58: [9, 10, 6, 8, 8, 1],
  59: [9, 10, 6, 8, 8, 1],
  60: [9, 10, 6, 8, 8, 1],
  61: [9, 10, 6, 8, 8, 1],
  62: [9, 10, 6, 8, 8, 1],
  63: [9, 10, 6, 8, 8, 1],
  64: [9, 10, 6, 8, 8, 1],
  65: [9, 10, 6, 8, 8, 1],
  66: [9, 10, 6, 8, 8, 1],
  67: [9, 10, 6, 8, 8, 1],
  68: [9, 10, 6, 8, 8, 1],
  69: [9, 10, 6, 8, 8, 1],
  70: [9, 10, 6, 8, 8, 1],
};

const traitBonusTable: Record<number, [number, number, number, number, number, number]> = {
  1: [0, 0, 0, 0, 0, 0],
  2: [0, 0, 0, 0, 0, 0],
  3: [1, 0, 0, 0, 0, 0],
  4: [1, 0, 0, 0, 0, 0],
  5: [2, 0, 0, 0, 0, 0],
  6: [2, 0, 0, 0, 0, 0],
  7: [3, 0, 0, 0, 0, 0],
  8: [3, 0, 0, 0, 0, 0],
  9: [3, 0, 0, 0, 0, 0],
  10: [3, 0, 0, 0, 0, 0],
  11: [3, 1, 0, 0, 0, 0],
  12: [3, 1, 0, 0, 0, 0],
  13: [3, 1, 1, 0, 0, 0],
  14: [3, 1, 1, 0, 0, 0],
  15: [3, 1, 1, 0, 0, 0],
  16: [3, 2, 1, 0, 0, 0],
  17: [3, 2, 1, 0, 0, 0],
  18: [3, 2, 1, 0, 0, 0],
  19: [3, 2, 1, 0, 0, 0],
  20: [3, 2, 1, 0, 0, 0],
  21: [3, 2, 1, 0, 0, 0],
  22: [3, 2, 1, 0, 0, 0],
  23: [3, 2, 1, 0, 0, 0],
  24: [3, 2, 1, 0, 0, 0],
  25: [3, 2, 1, 0, 0, 0],
  26: [3, 2, 1, 0, 0, 0],
  27: [3, 2, 1, 0, 0, 1],
  28: [3, 2, 1, 0, 1, 1],
  29: [3, 2, 1, 0, 1, 2],
  30: [4, 2, 1, 0, 1, 2],
  31: [5, 2, 1, 0, 1, 2],
  32: [5, 2, 2, 0, 1, 3],
  33: [5, 2, 2, 1, 1, 3],
  34: [5, 2, 2, 2, 1, 3],
  35: [6, 2, 2, 2, 1, 3],
  36: [6, 3, 2, 2, 1, 3],
  37: [6, 3, 2, 2, 2, 3],
  38: [6, 3, 2, 2, 3, 3],
  39: [6, 3, 2, 2, 3, 4],
  40: [6, 3, 2, 2, 4, 4],
  41: [6, 3, 2, 3, 4, 4],
  42: [6, 3, 2, 3, 4, 5],
  43: [7, 3, 2, 3, 4, 5],
  44: [7, 3, 2, 3, 5, 5],
  45: [7, 4, 2, 3, 5, 5],
  46: [7, 5, 2, 3, 5, 5],
  47: [7, 5, 3, 3, 5, 5],
  48: [7, 5, 3, 3, 5, 6],
  49: [8, 6, 3, 3, 5, 6],
  50: [9, 6, 4, 3, 5, 6],
  51: [10, 6, 4, 3, 5, 6],
  52: [10, 7, 4, 3, 5, 6],
  53: [10, 8, 4, 3, 5, 6],
  54: [10, 8, 4, 3, 5, 6],
  55: [11, 8, 5, 3, 5, 6],
  56: [11, 8, 5, 3, 5, 6],
  57: [11, 8, 6, 3, 5, 6],
  58: [11, 8, 6, 3, 5, 6],
  59: [11, 8, 6, 3, 6, 6],
  60: [11, 8, 6, 3, 6, 6],
  61: [11, 8, 6, 3, 6, 6],
  62: [11, 8, 6, 3, 6, 6],
  63: [11, 8, 6, 3, 6, 6],
  64: [11, 8, 6, 3, 6, 6],
  65: [11, 8, 6, 3, 6, 6],
  66: [11, 8, 6, 3, 6, 6],
  67: [11, 8, 6, 3, 6, 6],
  68: [11, 8, 6, 3, 6, 6],
  69: [11, 8, 6, 3, 6, 6],
  70: [11, 8, 6, 3, 6, 6],
};

const _3Faith = {
  1: 'Sincere',
  2: 'Firm',
  3: 'Powerful',
} as const;

export class Inquisitor extends Sura {
  protected override CLASS_NAME = ClassName.Inquisitor;
  protected override JobBonusTable = jobBonusTable;
  protected override TraitBonusTable = traitBonusTable;

  protected override minMaxLevel = JOB_4_MIN_MAX_LEVEL;
  protected override maxJob = JOB_4_MAX_JOB_LEVEL;

  private readonly classNames4th = [ClassName.Only_4th, ClassName.Inquisitor];
  private readonly atkSkillList4th: AtkSkillModel[] = [
    {
      name: 'First Brand',
      label: '[V3] First Brand Lv5',
      value: 'First Brand==5',
      acd: 0,
      fct: 0,
      vct: 0,
      cd: 0.3,
      isMelee: true,
      formula: (input: AtkSkillFormulaInput): number => {
        const { model, skillLevel, status } = input;
        const { totalPow } = status;
        const baseLevel = model.level;

        return (skillLevel * 1200 + totalPow * 5) * (baseLevel / 100);
      },
    },
    {
      name: 'Second Faith',
      label: '[V3] Second Faith Lv5',
      value: 'Second Faith==5',
      acd: 0,
      fct: 0,
      vct: 0,
      cd: 0.7,
      isMelee: true,
      hit: 2,
      formula: (input: AtkSkillFormulaInput): number => {
        const { model, skillLevel, status } = input;
        const { totalPow } = status;
        const baseLevel = model.level;

        return (100 + skillLevel * 2300 + totalPow * 5) * (baseLevel / 100);
      },
    },
    {
      name: 'Third Punish',
      label: '[V3] Third Punish Lv5',
      value: 'Third Punish==5',
      acd: 0,
      fct: 0,
      vct: 0,
      cd: 1,
      isMelee: true,
      canCri: true,
      baseCriPercentage: 1,
      criDmgPercentage: 0.5,
      totalHit: 3,
      formula: (input: AtkSkillFormulaInput): number => {
        const { model, skillLevel, status } = input;
        const { totalPow } = status;
        const baseLevel = model.level;

        return (350 + skillLevel * 1500 + totalPow * 10) * (baseLevel / 100);
      },
    },
    {
      name: 'Second Judgement',
      label: '[V3] Second Judgement Lv5',
      value: 'Second Judgement==5',
      acd: 0,
      fct: 0,
      vct: 0,
      cd: 0.7,
      isMelee: true,
      hit: 3,
      formula: (input: AtkSkillFormulaInput): number => {
        const { model, skillLevel, status } = input;
        const { totalPow } = status;
        const baseLevel = model.level;

        return (150 + skillLevel * 2600 + totalPow * 7) * (baseLevel / 100);
      },
    },
    {
      name: 'Third Consecration',
      label: '[V3] Third Consecration Lv5',
      value: 'Third Consecration==5',
      acd: 0,
      fct: 0,
      vct: 0,
      cd: 1,
      isMelee: true,
      totalHit: 5,
      formula: (input: AtkSkillFormulaInput): number => {
        const { model, skillLevel, status } = input;
        const { totalPow } = status;
        const baseLevel = model.level;

        return (skillLevel * 700 + totalPow * 10) * (baseLevel / 100);
      },
    },
    {
      name: 'Second Flame',
      label: '[V3] Second Flame Lv5',
      value: 'Second Flame==5',
      acd: 0,
      fct: 0,
      vct: 0,
      cd: 0.7,
      isMelee: true,
      formula: (input: AtkSkillFormulaInput): number => {
        const { model, skillLevel, status } = input;
        const { totalPow } = status;
        const baseLevel = model.level;

        return (100 + skillLevel * 2900 + totalPow * 9) * (baseLevel / 100);
      },
    },
    {
      name: 'Third Flame Bomb',
      label: '[V3] Third Flame Bomb Lv5',
      value: 'Third Flame Bomb==5',
      acd: 0,
      fct: 0,
      vct: 0,
      cd: 1,
      totalHit: 3,
      isMelee: true,
      formula: (input: AtkSkillFormulaInput): number => {
        const { model, skillLevel, status, maxHp } = input;
        const { totalPow } = status;
        const baseLevel = model.level;

        return (skillLevel * 650 + totalPow * 10 + floor(maxHp / 5)) * (baseLevel / 100);
      },
    },
    {
      name: 'Explosion Blaster',
      label: '[V3] Explosion Blaster Lv5',
      value: 'Explosion Blaster==5',
      acd: 0,
      fct: 0,
      vct: 0,
      cd: 0.7,
      canCri: true,
      baseCriPercentage: 1,
      criDmgPercentage: 0.5,
      formula: (input: AtkSkillFormulaInput): number => {
        const { model, skillLevel, status } = input;
        const { totalPow } = status;
        const baseLevel = model.level;

        if (this.isSkillActive('Oleum Sanctum')) {
          return (skillLevel * 3200 + totalPow * 15) * (baseLevel / 100);
        }

        return (skillLevel * 2800 + totalPow * 15) * (baseLevel / 100);
      },
    },
    {
      name: 'Massive Flame Blaster',
      label: '[V3] Massive Flame Blaster Lv10',
      value: 'Massive Flame Blaster==10',
      acd: 1,
      fct: 0,
      vct: 0,
      cd: 5,
      canCri: true,
      baseCriPercentage: 1,
      criDmgPercentage: 0.5,
      formula: (input: AtkSkillFormulaInput): number => {
        const { model, skillLevel, status, monster } = input;
        const { totalPow } = status;
        const baseLevel = model.level;
        const raceBonus = monster.isRace('demihuman', 'brute') ? 150 : 0;

        return (skillLevel * (2150 + raceBonus) + totalPow * 15) * (baseLevel / 100);
      },
    },
  ];
  private readonly activeSkillList4th: ActiveSkillModel[] = [
    {
      name: '_3Faith',
      label: 'Faith 5',
      inputType: 'dropdown',
      dropdown: [
        { label: '-', value: 0, isUse: false },
        { label: _3Faith[1], value: 1, isUse: true },
        { label: _3Faith[2], value: 2, isUse: true },
        { label: _3Faith[3], value: 3, isUse: true },
      ],
    },
    {
      name: 'Oleum Sanctum',
      label: 'Oleum Sanctum 5',
      isDebuff: true,
      inputType: 'selectButton',
      dropdown: [
        { label: 'Yes', value: 5, isUse: true, bonus: { oleumSanctum: 5 * 3 } },
        { label: 'No', value: 0, isUse: false },
        // { label: 'Lv 1', value: 1, isUse: true, bonus: { oleumSanctum: 1 * 3 } },
        // { label: 'Lv 2', value: 2, isUse: true, bonus: { oleumSanctum: 2 * 3 } },
        // { label: 'Lv 3', value: 3, isUse: true, bonus: { oleumSanctum: 3 * 3 } },
        // { label: 'Lv 4', value: 4, isUse: true, bonus: { oleumSanctum: 4 * 3 } },
      ],
    },
  ];
  private readonly passiveSkillList4th: PassiveSkillModel[] = [
    {
      name: 'Will of Faith',
      label: 'Will of Faith',
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

    const willOfFaithLv = this.learnLv('Will of Faith');
    if (willOfFaithLv > 0 && weapon.isType('fist')) {
      addBonus(totalBonus, 'p_race_demon', willOfFaithLv + 2);
      addBonus(totalBonus, 'p_race_undead', willOfFaithLv + 2);
    }

    const faithChoice = _3Faith[this.activeSkillLv('_3Faith') as keyof typeof _3Faith];
    if (faithChoice === 'Sincere') {
      addBonus(totalBonus, 'aspd', 3);
      addBonus(totalBonus, 'perfectHit', 5 * 4);
    } else if (faithChoice === 'Firm') {
      addBonus(totalBonus, 'hpPercent', 5 * 2);
      addBonus(totalBonus, 'res', 5 * 8);
    } else if (faithChoice === 'Powerful') {
      addBonus(totalBonus, 'atk', 10 + 5 * 5);
      addBonus(totalBonus, 'pAtk', 5 + 5 * 2);
    }

    return totalBonus;
  }
}
