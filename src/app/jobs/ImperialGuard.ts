import { JOB_4_MAX_JOB_LEVEL, JOB_4_MIN_MAX_LEVEL } from '../app-config';
import { ElementType } from '../constants';
import { EquipmentSummaryModel } from '../models/equipment-summary.model';
import { AdditionalBonusInput } from '../models/info-for-class.model';
import { addBonus } from '../utils';
import { RoyalGuard } from './RoyalGuard';
import { ActiveSkillModel, AtkSkillFormulaInput, AtkSkillModel, PassiveSkillModel } from './_character-base.abstract';
import { ClassName } from './_class-name';

const jobBonusTable: Record<number, [number, number, number, number, number, number]> = {
  1: [0, 0, 0, 0, 0, 0],
  2: [1, 0, 0, 1, 0, 0],
  3: [1, 0, 1, 1, 1, 0],
  4: [1, 0, 1, 1, 2, 0],
  5: [2, 0, 2, 1, 2, 0],
  6: [2, 0, 3, 1, 3, 0],
  7: [3, 0, 3, 1, 3, 0],
  8: [3, 0, 3, 1, 4, 0],
  9: [4, 0, 3, 1, 4, 0],
  10: [4, 0, 3, 2, 4, 0],
  11: [4, 0, 3, 2, 4, 1],
  12: [4, 1, 3, 2, 4, 1],
  13: [4, 1, 3, 2, 4, 2],
  14: [4, 2, 3, 3, 4, 2],
  15: [4, 2, 3, 4, 4, 2],
  16: [4, 2, 4, 4, 4, 2],
  17: [5, 2, 4, 5, 4, 2],
  18: [5, 2, 5, 5, 4, 2],
  19: [6, 2, 5, 6, 4, 2],
  20: [6, 2, 5, 7, 5, 2],
  21: [6, 2, 5, 8, 5, 2],
  22: [7, 2, 6, 8, 5, 2],
  23: [7, 2, 6, 8, 5, 2],
  24: [7, 2, 7, 8, 5, 2],
  25: [7, 2, 7, 9, 5, 2],
  26: [8, 2, 7, 10, 5, 2],
  27: [8, 2, 7, 10, 5, 2],
  28: [8, 2, 7, 10, 6, 2],
  29: [8, 2, 8, 10, 6, 2],
  30: [8, 2, 8, 10, 6, 2],
  31: [9, 2, 8, 10, 6, 3],
  32: [9, 2, 8, 10, 7, 3],
  33: [9, 2, 8, 10, 8, 3],
  34: [9, 2, 8, 10, 8, 3],
  35: [9, 2, 9, 10, 8, 3],
  36: [9, 2, 9, 10, 8, 3],
  37: [9, 2, 9, 10, 9, 3],
  38: [9, 3, 9, 10, 9, 3],
  39: [9, 3, 9, 10, 9, 3],
  40: [9, 3, 9, 10, 9, 3],
  41: [9, 3, 9, 10, 9, 3],
  42: [9, 3, 9, 10, 9, 3],
  43: [9, 3, 9, 10, 9, 3],
  44: [9, 3, 9, 10, 9, 3],
  45: [9, 3, 9, 10, 9, 3],
  46: [9, 3, 9, 10, 9, 3],
  47: [9, 3, 9, 10, 9, 3],
  48: [9, 3, 9, 10, 9, 3],
  49: [9, 3, 9, 10, 9, 3],
  50: [9, 3, 9, 10, 9, 3],
  51: [9, 3, 9, 10, 9, 3],
  52: [9, 3, 9, 10, 9, 3],
  53: [9, 3, 9, 10, 9, 3],
  54: [9, 3, 9, 10, 9, 3],
  55: [9, 3, 9, 10, 9, 3],
  56: [9, 3, 9, 10, 9, 3],
  57: [9, 3, 9, 10, 9, 3],
  58: [9, 3, 9, 10, 9, 3],
  59: [9, 3, 9, 10, 9, 3],
  60: [9, 3, 9, 10, 9, 3],
  61: [9, 3, 9, 10, 9, 3],
  62: [9, 3, 9, 10, 9, 3],
  63: [9, 3, 9, 10, 9, 3],
  64: [9, 3, 9, 10, 9, 3],
  65: [9, 3, 9, 10, 9, 3],
  66: [9, 3, 9, 10, 9, 3],
  67: [9, 3, 9, 10, 9, 3],
  68: [9, 3, 9, 10, 9, 3],
  69: [9, 3, 9, 10, 9, 3],
  70: [9, 3, 9, 10, 9, 3],
};

const traitBonusTable: Record<number, [number, number, number, number, number, number]> = {
  1: [1, 0, 0, 0, 0, 0],
  2: [1, 0, 0, 0, 0, 0],
  3: [1, 0, 0, 0, 0, 0],
  4: [1, 0, 0, 1, 0, 0],
  5: [1, 0, 0, 1, 0, 0],
  6: [1, 0, 0, 1, 0, 0],
  7: [1, 0, 0, 2, 0, 0],
  8: [1, 0, 0, 2, 0, 0],
  9: [1, 0, 0, 3, 0, 0],
  10: [1, 0, 0, 3, 1, 0],
  11: [1, 0, 0, 3, 1, 0],
  12: [1, 0, 0, 3, 1, 0],
  13: [2, 0, 0, 3, 1, 0],
  14: [2, 0, 0, 3, 1, 0],
  15: [2, 0, 0, 3, 1, 0],
  16: [3, 0, 0, 3, 1, 0],
  17: [3, 0, 0, 3, 1, 0],
  18: [3, 0, 0, 3, 1, 0],
  19: [3, 0, 0, 3, 1, 0],
  20: [3, 0, 0, 3, 1, 0],
  21: [3, 0, 0, 3, 1, 0],
  22: [3, 0, 0, 3, 1, 0],
  23: [3, 1, 0, 3, 1, 0],
  24: [3, 1, 0, 3, 1, 0],
  25: [3, 1, 0, 3, 1, 0],
  26: [3, 1, 0, 3, 1, 0],
  27: [4, 1, 0, 3, 1, 0],
  28: [4, 1, 0, 3, 1, 0],
  29: [4, 1, 0, 3, 1, 0],
  30: [5, 1, 0, 3, 1, 0],
  31: [5, 1, 0, 3, 1, 0],
  32: [5, 1, 0, 4, 1, 0],
  33: [5, 1, 0, 5, 1, 0],
  34: [5, 2, 0, 5, 1, 0],
  35: [5, 3, 0, 5, 1, 0],
  36: [5, 3, 0, 6, 1, 0],
  37: [5, 3, 1, 6, 1, 0],
  38: [5, 3, 2, 6, 1, 0],
  39: [5, 4, 2, 6, 1, 0],
  40: [5, 4, 3, 6, 1, 0],
  41: [5, 5, 3, 6, 1, 1],
  42: [5, 5, 4, 6, 2, 1],
  43: [5, 5, 4, 6, 2, 2],
  44: [5, 6, 4, 6, 2, 2],
  45: [5, 6, 4, 7, 2, 2],
  46: [5, 6, 5, 7, 2, 2],
  47: [5, 6, 5, 7, 2, 3],
  48: [5, 7, 5, 7, 3, 3],
  49: [5, 8, 5, 7, 3, 3],
  50: [6, 9, 5, 7, 3, 3],
  51: [7, 9, 5, 7, 3, 3],
  52: [7, 10, 5, 7, 3, 3],
  53: [7, 11, 5, 7, 3, 3],
  54: [7, 11, 5, 7, 3, 3],
  55: [7, 11, 6, 7, 4, 3],
  56: [7, 11, 6, 7, 4, 3],
  57: [8, 11, 6, 7, 4, 3],
  58: [8, 11, 6, 7, 4, 3],
  59: [8, 11, 6, 8, 4, 3],
  60: [8, 11, 6, 8, 4, 3],
  61: [8, 11, 6, 8, 4, 3],
  62: [8, 11, 6, 8, 4, 3],
  63: [8, 11, 6, 8, 4, 3],
  64: [8, 11, 6, 8, 4, 3],
  65: [8, 11, 6, 8, 4, 3],
  66: [8, 11, 6, 8, 4, 3],
  67: [8, 11, 6, 8, 4, 3],
  68: [8, 11, 6, 8, 4, 3],
  69: [8, 11, 6, 8, 4, 3],
  70: [8, 11, 6, 8, 4, 3],
};

export class ImperialGuard extends RoyalGuard {
  protected override CLASS_NAME = ClassName.ImperialGuard;
  protected override JobBonusTable = jobBonusTable;
  protected override TraitBonusTable = traitBonusTable;

  protected override minMaxLevel = JOB_4_MIN_MAX_LEVEL;
  protected override maxJob = JOB_4_MAX_JOB_LEVEL;

  private readonly classNames4th = [ClassName.Only_4th, ClassName.ImperialGuard];
  private readonly atkSkillList4th: AtkSkillModel[] = [
    {
      name: 'Overslash',
      label: '[V3] Overslash Lv10 (1 hit)',
      value: 'Overslash==10',
      acd: 0.5,
      fct: 0.5,
      vct: 0,
      cd: 0.7,
      isMelee: true,
      formula: (input: AtkSkillFormulaInput): number => {
        const { model, skillLevel, status } = input;
        const { totalPow } = status;
        const baseLevel = model.level;
        const ssMastLv = this.learnLv('Spear & Sword Mastery');

        return (skillLevel * (120 + ssMastLv * 10) + totalPow * 5) * (baseLevel / 100);
      },
    },
    {
      name: 'Shield Shooting',
      label: '[V3] Shield Shooting Lv5',
      value: 'Shield Shooting==5',
      acd: 0.5,
      fct: 0.5,
      vct: 0.5,
      cd: 0.7,
      hit: 7,
      verifyItemFn: ({ model }) => !model.shield ? 'Shield' : '',
      formula: (input: AtkSkillFormulaInput): number => {
        const { model, skillLevel, status, equipmentBonus } = input;
        const { weight, refine } = equipmentBonus.shield;
        const { totalPow } = status;
        const { level: baseLevel } = model;
        const shieldMastLv = this.learnLv('Shield Mastery');

        return (200 + skillLevel * (1300 + shieldMastLv * 15) + totalPow * 5 + weight + refine * 4) * (baseLevel / 100);
      },
    },
    {
      name: 'Cross Rain',
      label: '[V3] Cross Rain Lv10',
      value: 'Cross Rain==10',
      acd: 0.15,
      fct: 1.5,
      vct: 4,
      cd: 4.5,
      isMatk: true,
      element: ElementType.Holy,
      totalHit: 15,
      formula: (input: AtkSkillFormulaInput): number => {
        const { model, skillLevel, status } = input;
        const { totalSpl } = status;
        const baseLevel = model.level;
        const ssMastLv = this.learnLv('Spear & Sword Mastery');

        if (this.isSkillActive('Holy Shield')) {
          return (skillLevel * (450 + ssMastLv * 10) + totalSpl * 5) * (baseLevel / 100);
        }

        return (skillLevel * (320 + ssMastLv * 5) + totalSpl * 2) * (baseLevel / 100);
      },
    },
  ];
  private readonly activeSkillList4th: ActiveSkillModel[] = [
    {
      name: 'Attack Stance',
      label: 'Attack Stance',
      inputType: 'dropdown',
      dropdown: [
        { label: '-', value: 0, isUse: false },
        { label: 'Lv 1', value: 1, isUse: true, bonus: { pAtk: 1 * 3, sMatk: 1 * 3, def: -1 * 40 } },
        { label: 'Lv 2', value: 2, isUse: true, bonus: { pAtk: 2 * 3, sMatk: 2 * 3, def: -2 * 40 } },
        { label: 'Lv 3', value: 3, isUse: true, bonus: { pAtk: 3 * 3, sMatk: 3 * 3, def: -3 * 40 } },
        { label: 'Lv 4', value: 4, isUse: true, bonus: { pAtk: 4 * 3, sMatk: 4 * 3, def: -4 * 40 } },
        { label: 'Lv 5', value: 5, isUse: true, bonus: { pAtk: 5 * 3, sMatk: 5 * 3, def: -5 * 40 } },
      ],
    },
    {
      name: 'Holy Shield',
      label: 'Holy Shield',
      inputType: 'dropdown',
      dropdown: [
        { label: '-', value: 0, isUse: false },
        { label: 'Lv 1', value: 1, isUse: true, bonus: { m_my_element_holy: 5 + 2 * 1 } },
        { label: 'Lv 2', value: 2, isUse: true, bonus: { m_my_element_holy: 5 + 2 * 2 } },
        { label: 'Lv 3', value: 3, isUse: true, bonus: { m_my_element_holy: 5 + 2 * 3 } },
        { label: 'Lv 4', value: 4, isUse: true, bonus: { m_my_element_holy: 5 + 2 * 4 } },
        { label: 'Lv 5', value: 5, isUse: true, bonus: { m_my_element_holy: 5 + 2 * 5 } },
      ],
    },
    {
      name: 'Grand Judgement',
      label: 'Grand Judgement',
      inputType: 'selectButton',
      dropdown: [
        { label: 'Yes', value: 10, isUse: true },
        { label: 'No', value: 0, isUse: false },
      ],
    },
    {
      name: 'Shield Shooting',
      label: 'Shield Shooting',
      inputType: 'selectButton',
      dropdown: [
        { label: 'Yes', value: 5, isUse: true },
        { label: 'No', value: 0, isUse: false },
      ],
    },
  ];
  private readonly passiveSkillList4th: PassiveSkillModel[] = [
    {
      name: 'Spear & Sword Mastery',
      label: 'Spear & Sword Mastery',
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
      name: 'Shield Mastery',
      label: 'Shield Mastery',
      inputType: 'dropdown',
      dropdown: [
        { label: '-', value: 0, isUse: false },
        { label: 'Lv 1', value: 1, isUse: true, bonus: { res: 1 * 3 } },
        { label: 'Lv 2', value: 2, isUse: true, bonus: { res: 2 * 3 } },
        { label: 'Lv 3', value: 3, isUse: true, bonus: { res: 3 * 3 } },
        { label: 'Lv 4', value: 4, isUse: true, bonus: { res: 4 * 3 } },
        { label: 'Lv 5', value: 5, isUse: true, bonus: { res: 5 * 3 } },
        { label: 'Lv 6', value: 6, isUse: true, bonus: { res: 6 * 3 } },
        { label: 'Lv 7', value: 7, isUse: true, bonus: { res: 7 * 3 } },
        { label: 'Lv 8', value: 8, isUse: true, bonus: { res: 8 * 3 } },
        { label: 'Lv 9', value: 9, isUse: true, bonus: { res: 9 * 3 } },
        { label: 'Lv 10', value: 10, isUse: true, bonus: { res: 10 * 3 } },
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

    const { totalBonus, weapon } = params;

    const ssMastLv = this.learnLv('Spear & Sword Mastery');
    if (ssMastLv > 0 && weapon.isType('sword', 'twohandSword', 'spear', 'twohandSpear')) {
      addBonus(totalBonus, 'hit', ssMastLv * 3);
    }

    return totalBonus;
  }
}
