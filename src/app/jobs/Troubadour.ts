import { JOB_4_MAX_JOB_LEVEL, JOB_4_MIN_MAX_LEVEL } from '../app-config';
import { WeaponTypeName } from '../constants';
import { MysticSymphonyFn, StageMannerFn } from '../constants/share-passive-skills';
import { EquipmentSummaryModel } from '../models/equipment-summary.model';
import { AdditionalBonusInput } from '../models/info-for-class.model';
import { addBonus } from '../utils';
import { Minstrel } from './Minstrel';
import { ActiveSkillModel, AtkSkillFormulaInput, AtkSkillModel, PassiveSkillModel } from './_character-base.abstract';
import { ClassName } from './_class-name';

const jobBonusTable: Record<number, [number, number, number, number, number, number]> = {
  1: [0, 0, 0, 1, 0, 0],
  2: [1, 0, 0, 1, 0, 0],
  3: [1, 0, 1, 2, 0, 0],
  4: [1, 0, 1, 2, 1, 0],
  5: [1, 1, 1, 2, 2, 0],
  6: [1, 1, 1, 2, 2, 0],
  7: [1, 1, 1, 3, 2, 0],
  8: [1, 1, 1, 4, 2, 0],
  9: [1, 1, 1, 4, 2, 0],
  10: [1, 2, 2, 4, 2, 0],
  11: [1, 2, 3, 4, 2, 0],
  12: [1, 2, 3, 4, 2, 1],
  13: [1, 2, 3, 4, 2, 1],
  14: [1, 2, 3, 4, 3, 1],
  15: [1, 2, 3, 4, 4, 1],
  16: [1, 2, 3, 4, 4, 1],
  17: [1, 2, 3, 4, 4, 1],
  18: [2, 2, 3, 4, 4, 1],
  19: [3, 2, 3, 4, 4, 1],
  20: [3, 2, 3, 4, 4, 1],
  21: [3, 2, 3, 4, 4, 1],
  22: [3, 2, 3, 5, 4, 1],
  23: [3, 2, 3, 5, 4, 1],
  24: [4, 2, 3, 5, 4, 1],
  25: [4, 2, 3, 5, 4, 1],
  26: [4, 3, 3, 5, 4, 1],
  27: [4, 4, 3, 5, 4, 1],
  28: [5, 4, 3, 5, 4, 1],
  29: [5, 4, 3, 5, 4, 1],
  30: [5, 4, 3, 5, 4, 2],
  31: [5, 5, 3, 5, 4, 2],
  32: [5, 5, 3, 6, 4, 2],
  33: [5, 5, 3, 6, 5, 2],
  34: [5, 5, 4, 6, 5, 2],
  35: [5, 5, 4, 6, 5, 2],
  36: [5, 5, 4, 6, 6, 2],
  37: [5, 5, 4, 6, 6, 2],
  38: [5, 6, 4, 6, 6, 2],
  39: [5, 7, 4, 6, 6, 2],
  40: [5, 7, 4, 7, 7, 2],
  41: [5, 7, 5, 8, 7, 2],
  42: [5, 7, 5, 8, 7, 2],
  43: [5, 7, 5, 8, 7, 2],
  44: [6, 7, 5, 8, 8, 2],
  45: [6, 7, 6, 8, 8, 3],
  46: [7, 7, 6, 8, 8, 3],
  47: [7, 7, 6, 8, 9, 3],
  48: [7, 7, 6, 8, 9, 3],
  49: [7, 7, 6, 9, 9, 3],
  50: [7, 7, 6, 9, 10, 3],
  51: [7, 7, 6, 9, 10, 3],
  52: [7, 7, 6, 9, 10, 3],
  53: [7, 7, 6, 9, 10, 3],
  54: [7, 7, 6, 9, 10, 3],
  55: [7, 7, 6, 9, 10, 3],
  56: [7, 7, 6, 9, 10, 3],
  57: [7, 7, 6, 9, 10, 3],
  58: [7, 7, 6, 9, 10, 3],
  59: [7, 7, 6, 9, 10, 3],
  60: [7, 7, 6, 9, 10, 3],
  61: [7, 7, 6, 9, 10, 3],
  62: [7, 7, 6, 9, 10, 3],
  63: [7, 7, 6, 9, 10, 3],
  64: [7, 7, 6, 9, 10, 3],
  65: [7, 7, 6, 9, 10, 3],
  66: [7, 7, 6, 9, 10, 3],
  67: [7, 7, 6, 9, 10, 3],
  68: [7, 7, 6, 9, 10, 3],
  69: [7, 7, 6, 9, 10, 3],
  70: [7, 7, 6, 9, 10, 3],
};

const traitBonusTable: Record<number, [number, number, number, number, number, number]> = {
  1: [0, 0, 0, 0, 0, 0],
  2: [0, 1, 0, 0, 0, 0],
  3: [0, 1, 0, 0, 0, 0],
  4: [0, 1, 0, 0, 1, 0],
  5: [0, 1, 0, 0, 1, 0],
  6: [0, 1, 0, 1, 1, 0],
  7: [1, 1, 0, 1, 1, 0],
  8: [1, 1, 0, 1, 2, 0],
  9: [1, 1, 1, 1, 2, 0],
  10: [1, 1, 1, 1, 2, 0],
  11: [1, 1, 1, 1, 2, 0],
  12: [1, 2, 1, 1, 2, 0],
  13: [1, 2, 1, 1, 3, 0],
  14: [1, 2, 1, 1, 3, 1],
  15: [1, 2, 1, 1, 3, 1],
  16: [1, 2, 1, 2, 3, 1],
  17: [1, 3, 1, 2, 3, 1],
  18: [1, 3, 1, 2, 3, 1],
  19: [1, 3, 1, 2, 4, 1],
  20: [1, 3, 1, 2, 5, 1],
  21: [2, 3, 1, 2, 5, 1],
  22: [2, 3, 1, 2, 5, 1],
  23: [2, 3, 2, 2, 5, 1],
  24: [3, 3, 2, 2, 5, 1],
  25: [3, 3, 2, 3, 5, 1],
  26: [3, 3, 2, 3, 5, 1],
  27: [3, 4, 2, 3, 5, 1],
  28: [3, 4, 3, 3, 5, 1],
  29: [3, 5, 3, 3, 5, 1],
  30: [3, 5, 3, 3, 5, 2],
  31: [3, 5, 3, 3, 5, 2],
  32: [3, 5, 3, 3, 5, 2],
  33: [3, 5, 3, 3, 6, 2],
  34: [3, 5, 3, 3, 6, 2],
  35: [4, 5, 3, 3, 6, 2],
  36: [4, 5, 3, 3, 6, 3],
  37: [4, 5, 4, 3, 7, 3],
  38: [4, 5, 4, 3, 7, 4],
  39: [4, 5, 4, 3, 7, 4],
  40: [4, 5, 4, 3, 7, 4],
  41: [4, 5, 4, 3, 7, 4],
  42: [4, 5, 4, 4, 7, 4],
  43: [5, 5, 4, 4, 8, 4],
  44: [5, 5, 4, 4, 8, 4],
  45: [5, 5, 4, 4, 8, 4],
  46: [5, 5, 4, 4, 8, 4],
  47: [5, 6, 4, 4, 8, 4],
  48: [5, 6, 4, 5, 8, 4],
  49: [5, 6, 4, 5, 9, 4],
  50: [5, 6, 4, 5, 9, 4],
  51: [5, 6, 4, 5, 10, 4],
  52: [5, 6, 4, 6, 10, 4],
  53: [5, 7, 4, 6, 10, 4],
  54: [5, 7, 4, 6, 10, 4],
  55: [6, 7, 4, 6, 11, 4],
  56: [6, 7, 4, 7, 11, 4],
  57: [6, 7, 4, 7, 11, 4],
  58: [6, 7, 4, 7, 11, 4],
  59: [7, 7, 4, 7, 11, 4],
  60: [7, 7, 4, 7, 11, 4],
  61: [7, 7, 4, 7, 11, 4],
  62: [7, 7, 4, 7, 11, 4],
  63: [7, 7, 4, 7, 11, 4],
  64: [7, 7, 4, 7, 11, 4],
  65: [7, 7, 4, 7, 11, 4],
  66: [7, 7, 4, 7, 11, 4],
  67: [7, 7, 4, 7, 11, 4],
  68: [7, 7, 4, 7, 11, 4],
  69: [7, 7, 4, 7, 11, 4],
  70: [7, 7, 4, 7, 11, 4],
};

export class Troubadour extends Minstrel {
  protected override CLASS_NAME = ClassName.Troubadour;
  protected override JobBonusTable = jobBonusTable;
  protected override TraitBonusTable = traitBonusTable;

  protected override minMaxLevel = JOB_4_MIN_MAX_LEVEL;
  protected override maxJob = JOB_4_MAX_JOB_LEVEL;

  private readonly classNames4th = [ClassName.Only_4th, ClassName.Troubadour];
  private readonly atkSkillList4th: AtkSkillModel[] = [
    {
      name: 'Rhythm Shooting',
      label: '[V3] Rhythm Shooting Lv5',
      value: 'Rhythm Shooting==5',
      acd: 0.15,
      fct: 0,
      vct: 2,
      cd: 0,
      totalHit: 3,
      verifyItemFn: ({ weapon }) => {
        const requires: WeaponTypeName[] = ['bow', 'instrument', 'whip'];
        if (requires.some(wType => weapon.isType(wType))) return '';

        return requires.join(', ');
      },
      formula: (input: AtkSkillFormulaInput): number => {
        const { model, skillLevel, status } = input;
        const baseLevel = model.level;
        const stageMannerLv = this.learnLv('Stage Manner');

        // if (this.isSkillActive('Sonic Brand'))

        return (200 + skillLevel * 120 + status.totalCon * 3 * stageMannerLv) * (baseLevel / 100);
      },
    },
  ];
  private readonly activeSkillList4th: ActiveSkillModel[] = [MysticSymphonyFn()];
  private readonly passiveSkillList4th: PassiveSkillModel[] = [StageMannerFn()];

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

    const stageMannerLv = this.learnLv('Stage Manner');
    if (stageMannerLv > 0 && weapon.isType('bow', 'instrument', 'whip')) {
      addBonus(totalBonus, 'pAtk', stageMannerLv * 3);
      addBonus(totalBonus, 'sMatk', stageMannerLv * 3);
    }

    return totalBonus;
  }
}
