import { JOB_4_MAX_JOB_LEVEL, JOB_4_MIN_MAX_LEVEL } from '../app-config';
import { WeaponTypeName } from '../constants';
import { EquipmentSummaryModel } from '../models/equipment-summary.model';
import { AdditionalBonusInput } from '../models/info-for-class.model';
import { Ranger } from './Ranger';
import { ActiveSkillModel, AtkSkillFormulaInput, AtkSkillModel, PassiveSkillModel } from './_character-base.abstract';
import { ClassName } from './_class-name';

const jobBonusTable: Record<number, [number, number, number, number, number, number]> = {
  1: [0, 0, 0, 0, 1, 0],
  2: [0, 0, 1, 0, 1, 0],
  3: [0, 1, 1, 0, 1, 0],
  4: [0, 1, 1, 1, 1, 0],
  5: [0, 2, 1, 1, 1, 0],
  6: [0, 2, 2, 1, 1, 0],
  7: [0, 2, 2, 1, 1, 0],
  8: [0, 2, 2, 1, 2, 0],
  9: [0, 2, 3, 1, 2, 0],
  10: [0, 3, 3, 1, 2, 0],
  11: [0, 3, 4, 1, 2, 0],
  12: [0, 4, 4, 1, 2, 0],
  13: [0, 5, 4, 1, 2, 0],
  14: [0, 5, 4, 1, 2, 1],
  15: [0, 5, 4, 1, 3, 1],
  16: [0, 5, 4, 2, 3, 1],
  17: [0, 5, 4, 2, 3, 1],
  18: [0, 5, 4, 2, 3, 2],
  19: [0, 6, 4, 2, 3, 2],
  20: [0, 6, 5, 2, 3, 2],
  21: [0, 6, 5, 3, 3, 2],
  22: [0, 6, 5, 3, 4, 2],
  23: [1, 6, 5, 3, 4, 2],
  24: [1, 6, 5, 3, 4, 2],
  25: [1, 6, 6, 3, 4, 2],
  26: [1, 7, 6, 4, 4, 2],
  27: [1, 7, 6, 4, 4, 3],
  28: [1, 7, 6, 4, 4, 3],
  29: [1, 7, 6, 4, 5, 3],
  30: [1, 7, 6, 4, 5, 3],
  31: [1, 7, 6, 4, 5, 4],
  32: [1, 7, 6, 4, 5, 4],
  33: [1, 8, 6, 4, 5, 4],
  34: [1, 8, 6, 5, 5, 4],
  35: [1, 8, 7, 5, 5, 4],
  36: [1, 8, 7, 5, 6, 4],
  37: [1, 8, 7, 6, 6, 4],
  38: [1, 9, 7, 7, 6, 4],
  39: [1, 10, 7, 7, 6, 4],
  40: [1, 10, 7, 7, 6, 4],
  41: [1, 11, 7, 7, 6, 4],
  42: [1, 11, 7, 7, 6, 4],
  43: [1, 11, 7, 7, 7, 4],
  44: [1, 11, 7, 7, 7, 4],
  45: [2, 11, 7, 8, 7, 4],
  46: [2, 11, 7, 8, 7, 4],
  47: [2, 12, 7, 8, 7, 4],
  48: [2, 12, 7, 9, 7, 4],
  49: [2, 12, 8, 9, 7, 4],
  50: [2, 12, 8, 9, 8, 4],
  51: [2, 12, 8, 9, 8, 4],
  52: [2, 12, 8, 9, 8, 4],
  53: [2, 12, 8, 9, 8, 4],
  54: [2, 12, 8, 9, 8, 4],
  55: [2, 12, 8, 9, 8, 4],
  56: [2, 12, 8, 9, 8, 4],
  57: [2, 12, 8, 9, 8, 4],
  58: [2, 12, 8, 9, 8, 4],
  59: [2, 12, 8, 9, 8, 4],
  60: [2, 12, 8, 9, 8, 4],
  61: [2, 12, 8, 9, 8, 4],
  62: [2, 12, 8, 9, 8, 4],
  63: [2, 12, 8, 9, 8, 4],
  64: [2, 12, 8, 9, 8, 4],
  65: [2, 12, 8, 9, 8, 4],
  66: [2, 12, 8, 9, 8, 4],
  67: [2, 12, 8, 9, 8, 4],
  68: [2, 12, 8, 9, 8, 4],
  69: [2, 12, 8, 9, 8, 4],
  70: [2, 12, 8, 9, 8, 4],
};

const traitBonusTable: Record<number, [number, number, number, number, number, number]> = {
  1: [0, 0, 0, 0, 0, 0],
  2: [0, 0, 0, 0, 0, 0],
  3: [0, 0, 0, 0, 1, 0],
  4: [0, 0, 0, 0, 1, 0],
  5: [1, 0, 0, 0, 1, 0],
  6: [1, 0, 0, 0, 1, 0],
  7: [1, 0, 0, 0, 2, 0],
  8: [1, 0, 0, 1, 2, 0],
  9: [1, 0, 1, 1, 2, 0],
  10: [1, 0, 1, 1, 2, 0],
  11: [1, 0, 1, 1, 3, 0],
  12: [1, 0, 1, 1, 3, 0],
  13: [2, 0, 1, 1, 3, 0],
  14: [2, 0, 1, 1, 4, 0],
  15: [2, 0, 1, 2, 4, 0],
  16: [2, 1, 1, 2, 4, 0],
  17: [2, 1, 1, 2, 4, 1],
  18: [2, 1, 1, 2, 5, 1],
  19: [2, 1, 1, 2, 5, 1],
  20: [2, 1, 1, 2, 5, 1],
  21: [2, 1, 2, 2, 5, 1],
  22: [2, 1, 2, 2, 5, 1],
  23: [2, 2, 2, 2, 5, 1],
  24: [3, 2, 2, 2, 5, 1],
  25: [3, 2, 2, 2, 5, 1],
  26: [3, 2, 2, 2, 5, 1],
  27: [3, 2, 2, 2, 5, 1],
  28: [3, 2, 2, 2, 6, 1],
  29: [3, 2, 2, 2, 7, 1],
  30: [3, 3, 2, 2, 7, 1],
  31: [3, 3, 2, 2, 7, 2],
  32: [3, 3, 2, 3, 7, 2],
  33: [3, 3, 3, 3, 7, 2],
  34: [4, 3, 3, 3, 7, 2],
  35: [4, 3, 3, 3, 7, 2],
  36: [4, 3, 4, 3, 7, 2],
  37: [4, 3, 4, 3, 7, 2],
  38: [4, 3, 4, 3, 7, 2],
  39: [4, 3, 4, 3, 7, 2],
  40: [5, 3, 4, 3, 7, 3],
  41: [5, 3, 4, 4, 7, 3],
  42: [6, 4, 4, 4, 7, 3],
  43: [6, 4, 4, 4, 7, 3],
  44: [6, 4, 5, 4, 8, 3],
  45: [6, 4, 5, 4, 8, 3],
  46: [6, 4, 5, 4, 8, 4],
  47: [7, 4, 5, 4, 8, 4],
  48: [7, 4, 5, 4, 8, 4],
  49: [7, 4, 5, 4, 8, 4],
  50: [7, 4, 5, 4, 9, 4],
  51: [7, 4, 5, 4, 10, 4],
  52: [8, 4, 5, 4, 11, 4],
  53: [8, 5, 5, 4, 11, 4],
  54: [8, 5, 5, 4, 11, 4],
  55: [9, 5, 5, 4, 11, 4],
  56: [9, 5, 5, 4, 11, 4],
  57: [9, 5, 5, 4, 11, 5],
  58: [9, 5, 5, 4, 11, 5],
  59: [10, 5, 5, 4, 11, 5],
  60: [10, 5, 5, 4, 11, 5],
  61: [10, 5, 5, 4, 11, 5],
  62: [10, 5, 5, 4, 11, 5],
  63: [10, 5, 5, 4, 11, 5],
  64: [10, 5, 5, 4, 11, 5],
  65: [10, 5, 5, 4, 11, 5],
  66: [10, 5, 5, 4, 11, 5],
  67: [10, 5, 5, 4, 11, 5],
  68: [10, 5, 5, 4, 11, 5],
  69: [10, 5, 5, 4, 11, 5],
  70: [10, 5, 5, 4, 11, 5],
};

export class Windhawk extends Ranger {
  protected override CLASS_NAME = ClassName.Windhawk;
  protected override JobBonusTable = jobBonusTable;
  protected override TraitBonusTable = traitBonusTable;

  protected override minMaxLevel = JOB_4_MIN_MAX_LEVEL;
  protected override maxJob = JOB_4_MAX_JOB_LEVEL;

  private readonly classNames4th = [ClassName.Only_4th, ClassName.Windhawk];
  private readonly atkSkillList4th: AtkSkillModel[] = [
    {
      name: 'Crescive Bolt',
      label: '[V3] Crescive Bolt Lv10',
      value: 'Crescive Bolt==10',
      acd: 0.3,
      fct: 1,
      vct: 1,
      cd: 0.15,
      maxStack: 3,
      canCri: true,
      criDmgPercentage: 0.5,
      baseCriPercentage: 1,
      formula: (input: AtkSkillFormulaInput): number => {
        const { model, skillLevel, status, stack } = input;
        const baseLevel = model.level;
        const totalStack = stack;
        const calaBonus = this.isSkillActive('Calamity Gale') ? 1.2 : 1;

        return (skillLevel * 340 + status.totalCon * 10) * (baseLevel / 100) * (1 + 0.1 * totalStack) * calaBonus;
      },
    },
    {
      name: 'Gale Storm',
      label: '[V3] Gale Storm Lv10',
      value: 'Gale Storm==10',
      acd: 0.15,
      fct: 0.5,
      vct: 1,
      cd: 1.5,
      hit: 5,
      canCri: () => this.isSkillActive('Calamity Gale'),
      formula: (input: AtkSkillFormulaInput): number => {
        const { model, skillLevel, status } = input;
        const baseLevel = model.level;

        return (skillLevel * 950 + status.totalCon * 5) * (baseLevel / 100);
      },
    },
    {
      name: 'Hawk Rush',
      label: '[V3] Hawk Rush Lv5',
      value: 'Hawk Rush==5',
      acd: 0,
      fct: 0,
      vct: 0,
      cd: 0.15,
      canCri: true,
      criDmgPercentage: 0.5,
      baseCriPercentage: 1,
      verifyItemFn: ({ weapon }) => {
        const requires: WeaponTypeName[] = ['bow'];
        if (requires.some(wType => weapon.isType(wType))) return '';

        return requires.join(', ');
      },
      formula: (input: AtkSkillFormulaInput): number => {
        const { model, skillLevel, status } = input;
        const baseLevel = model.level;
        const natureFrieldlyLv = this.learnLv('Nature Friendly');

        return (skillLevel * 500 + status.totalCon * 5) * (1 + 0.1 * natureFrieldlyLv) * (baseLevel / 100);
      },
    },
  ];
  private readonly activeSkillList4th: ActiveSkillModel[] = [
    {
      name: 'Calamity Gale',
      label: 'Calamity Gale',
      inputType: 'selectButton',
      dropdown: [
        { label: 'Yes', value: 1, isUse: true, bonus: { range: 350 } },
        { label: 'No', value: 0, isUse: false },
      ],
    },
  ];
  private readonly passiveSkillList4th: PassiveSkillModel[] = [
    {
      name: 'Nature Friendly',
      label: 'Nature Friendly',
      inputType: 'dropdown',
      dropdown: [
        { label: 'Lv 1', value: 1, isUse: true },
        { label: 'Lv 2', value: 2, isUse: true },
        { label: 'Lv 3', value: 3, isUse: true },
        { label: 'Lv 4', value: 4, isUse: true },
        { label: 'Lv 5', value: 5, isUse: true },
        { label: '-', value: 0, isUse: false },
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
    const { totalBonus, skillName } = params;
    // const {race, elementUpper} = monster;

    if (this.isSkillActive('Calamity Gale')) {
      // if (race === '' || elementUpper === ElementType.Water) {
      // }
      const noLimitLv = this.activeSkillLv('No Limits');
      if (noLimitLv > 0) {
        totalBonus.range -= 100 + noLimitLv * 50;
      }

      if (skillName === 'Crescive Bolt' || skillName === 'Gale Storm') {
        totalBonus.p_race_fish = (totalBonus.p_race_fish || 0) + 50;
        totalBonus.p_element_water = (totalBonus.p_element_water || 0) + 50;
      }
    }

    return totalBonus;
  }

  // override modifyFinalAtk(currentAtk: number, params: InfoForClass): number {
  //   const {totalBonus, skillName, monster} = params;
  //   const {race, elementUpper} = monster;

  //   if (this.isSkillActive('Calamity Gale') && (skillName === 'Crescive Bolt' || skillName === 'Gale Storm')) {
  //     if (race === '' || elementUpper === ElementType.Water) {

  //     }
  //   }
  // }
}
