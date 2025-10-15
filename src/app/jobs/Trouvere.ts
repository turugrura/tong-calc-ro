import { JOB_4_MAX_JOB_LEVEL, JOB_4_MIN_MAX_LEVEL } from '../app-config';
import { WeaponTypeName } from '../constants';
import { DebufSonicBrandFn, MysticSymphonyFn, StageMannerFn } from '../constants/share-passive-skills';
import { EquipmentSummaryModel } from '../models/equipment-summary.model';
import { AdditionalBonusInput } from '../models/info-for-class.model';
import { addBonus } from '../utils';
import { Wanderer } from './Wanderer';
import { ActiveSkillModel, AtkSkillFormulaInput, AtkSkillModel, PassiveSkillModel } from './_character-base.abstract';
import { ClassName } from './_class-name';

const jobBonusTable: Record<number, [number, number, number, number, number, number]> = {
  1: [0, 0, 0, 0, 1, 0],
  2: [0, 0, 0, 1, 1, 0],
  3: [0, 0, 0, 2, 1, 0],
  4: [0, 1, 0, 2, 1, 0],
  5: [1, 1, 1, 2, 1, 0],
  6: [1, 1, 1, 2, 1, 0],
  7: [1, 2, 1, 2, 1, 0],
  8: [1, 2, 1, 2, 2, 0],
  9: [1, 2, 1, 3, 2, 0],
  10: [2, 3, 1, 3, 2, 0],
  11: [2, 3, 2, 3, 3, 0],
  12: [2, 3, 2, 3, 3, 0],
  13: [2, 3, 3, 3, 3, 0],
  14: [2, 3, 4, 3, 3, 0],
  15: [3, 3, 4, 3, 3, 0],
  16: [3, 3, 4, 3, 3, 0],
  17: [3, 3, 4, 3, 4, 0],
  18: [3, 4, 5, 3, 4, 0],
  19: [3, 4, 5, 3, 4, 0],
  20: [3, 4, 5, 3, 4, 0],
  21: [3, 4, 5, 4, 4, 0],
  22: [3, 4, 6, 4, 4, 0],
  23: [3, 4, 6, 4, 5, 0],
  24: [3, 4, 6, 4, 5, 0],
  25: [4, 4, 6, 4, 5, 0],
  26: [5, 4, 6, 4, 5, 1],
  27: [6, 4, 6, 4, 5, 1],
  28: [6, 4, 6, 4, 5, 1],
  29: [6, 4, 6, 4, 5, 1],
  30: [6, 4, 6, 4, 6, 1],
  31: [6, 5, 6, 4, 6, 1],
  32: [6, 5, 6, 5, 6, 1],
  33: [6, 5, 6, 5, 6, 2],
  34: [6, 5, 6, 6, 6, 2],
  35: [6, 5, 6, 6, 6, 2],
  36: [6, 5, 6, 7, 6, 2],
  37: [6, 5, 6, 7, 6, 2],
  38: [6, 5, 6, 8, 6, 2],
  39: [6, 5, 6, 9, 6, 3],
  40: [7, 6, 6, 9, 6, 3],
  41: [7, 6, 6, 9, 7, 3],
  42: [7, 6, 6, 9, 7, 3],
  43: [7, 6, 6, 9, 7, 3],
  44: [7, 6, 6, 9, 8, 3],
  45: [7, 7, 6, 9, 8, 3],
  46: [7, 8, 6, 9, 8, 3],
  47: [7, 8, 6, 9, 8, 3],
  48: [7, 8, 6, 9, 8, 3],
  49: [7, 8, 6, 10, 8, 3],
  50: [7, 9, 6, 10, 8, 3],
  51: [7, 9, 6, 10, 8, 3],
  52: [7, 9, 6, 10, 8, 3],
  53: [7, 9, 6, 10, 8, 3],
  54: [7, 9, 6, 10, 8, 3],
  55: [7, 9, 6, 10, 8, 3],
  56: [7, 9, 6, 10, 8, 3],
  57: [7, 9, 6, 10, 8, 3],
  58: [7, 9, 6, 10, 8, 3],
  59: [7, 9, 6, 10, 8, 3],
  60: [7, 9, 6, 10, 8, 3],
  61: [7, 9, 6, 10, 8, 3],
  62: [7, 9, 6, 10, 8, 3],
  63: [7, 9, 6, 10, 8, 3],
  64: [7, 9, 6, 10, 8, 3],
  65: [7, 9, 6, 10, 8, 3],
  66: [7, 9, 6, 10, 8, 3],
  67: [7, 9, 6, 10, 8, 3],
  68: [7, 9, 6, 10, 8, 3],
  69: [7, 9, 6, 10, 8, 3],
  70: [7, 9, 6, 10, 8, 3],
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
  52: [5, 7, 4, 5, 10, 4],
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

export class Trouvere extends Wanderer {
  protected override CLASS_NAME = ClassName.Trouvere;
  protected override JobBonusTable = jobBonusTable;
  protected override TraitBonusTable = traitBonusTable;

  protected override minMaxLevel = JOB_4_MIN_MAX_LEVEL;
  protected override maxJob = JOB_4_MAX_JOB_LEVEL;

  private readonly classNames4th = [ClassName.Only_4th, ClassName.Trouvere];
  private readonly atkSkillList4th: AtkSkillModel[] = [
    {
      name: 'Rhythm Shooting',
      label: '[V3] Rhythm Shooting Lv5',
      value: 'Rhythm Shooting==5',
      acd: 0,
      fct: 0,
      vct: 2,
      cd: 0.15,
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
    {
      name: 'Rose Blossom',
      label: '[V3] Rose Blossom Lv5',
      value: 'Rose Blossom==5',
      acd: 0.15,
      fct: 0.5,
      vct: 1,
      cd: 0.7,
      totalHit: 1,
      verifyItemFn: ({ weapon }) => {
        const requires: WeaponTypeName[] = ['bow', 'instrument', 'whip'];
        if (requires.some(wType => weapon.isType(wType))) return '';

        return requires.join(', ');
      },
      formula: (input: AtkSkillFormulaInput): number => {
        const { model, skillLevel, status } = input;
        const baseLevel = model.level;
        const stageMannerLv = this.learnLv('Stage Manner');

        if (this.isSkillActive('_Debuf_Sonic_Brand')) {
          const main = ((200 + skillLevel * 2200) + (status.totalCon * 3 * stageMannerLv)) * (baseLevel / 100);
          const second = ((250 + skillLevel * 3000) + (status.totalCon * 3 * stageMannerLv)) * (baseLevel / 100);

          return main + second;
        }

        const main = ((200 + skillLevel * 2000) + (status.totalCon * 3 * stageMannerLv)) * (baseLevel / 100);
        const second = ((250 + skillLevel * 2800) + (status.totalCon * 3 * stageMannerLv)) * (baseLevel / 100);

        return main + second;
      },
    },
  ];
  private readonly activeSkillList4th: ActiveSkillModel[] = [MysticSymphonyFn(), DebufSonicBrandFn()];
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
