import { ClassName } from './_class-name';
import { ActiveSkillModel, AtkSkillFormulaInput, AtkSkillModel, PassiveSkillModel } from './_character-base.abstract';
import { BeastBaneFn } from '../constants/share-passive-skills';
import { Archer } from './archer';

const jobBonusTable: Record<number, [number, number, number, number, number, number]> = {};

export class Sniper extends Archer {
  protected override CLASS_NAME = ClassName.Sniper;
  protected override JobBonusTable = jobBonusTable;

  protected override initialStatusPoint = 40;
  private classNamesHi = [ClassName.Hunter, ClassName.HiClass, ClassName.Sniper];
  private atkSkillListHi: AtkSkillModel[] = [
    {
      name: 'Focused Arrow Strike',
      label: 'Focused Arrow Lv5',
      value: 'Focused Arrow Strike==5',
      values: ['[Improved] Focused Arrow Strike==5'],
      acd: 0.5,
      fct: 0.5,
      vct: 0.5,
      cd: 0.15,
      canCri: true,
      baseCri: 50,
      criDmgPercentage: 0.5,
      formula: (input: AtkSkillFormulaInput): number => {
        const { model, skillLevel } = input;
        const baseLevel = model.level;

        return (300 + skillLevel * 300) * (baseLevel / 100);
      },
    },
  ];
  private activeSkillListHi: ActiveSkillModel[] = [
    {
      isEquipAtk: true,
      inputType: 'selectButton',
      label: 'Wind Walk 5',
      name: 'Wind Walk',
      dropdown: [
        { label: 'Yes', value: 5, skillLv: 5, isUse: true, bonus: { flee: 5 } },
        { label: 'No', value: 0, isUse: false },
      ],
    },
    {
      isEquipAtk: true,
      inputType: 'selectButton',
      label: 'Falcon Eyes 10',
      name: 'Falcon Eyes',
      dropdown: [
        { label: 'Yes', value: 10, skillLv: 10, isUse: true, bonus: { flatDmg: 20, hit: 30, cri: 10, allStatus: 5 } },
        { label: 'No', value: 0, isUse: false },
      ],
    },
  ];
  private passiveSkillListHi: PassiveSkillModel[] = [
    BeastBaneFn(),
    {
      label: 'Steel Crow',
      name: 'Steel Crow',
      inputType: 'dropdown',
      isMasteryAtk: true,
      dropdown: [
        { label: '-', value: 0, isUse: false },
        { label: 'Lv 1', value: 1, isUse: true, bonus: { falconDmg: 6 } },
        { label: 'Lv 2', value: 2, isUse: true, bonus: { falconDmg: 12 } },
        { label: 'Lv 3', value: 3, isUse: true, bonus: { falconDmg: 18 } },
        { label: 'Lv 4', value: 4, isUse: true, bonus: { falconDmg: 24 } },
        { label: 'Lv 5', value: 5, isUse: true, bonus: { falconDmg: 30 } },
        { label: 'Lv 6', value: 6, isUse: true, bonus: { falconDmg: 36 } },
        { label: 'Lv 7', value: 7, isUse: true, bonus: { falconDmg: 42 } },
        { label: 'Lv 8', value: 8, isUse: true, bonus: { falconDmg: 48 } },
        { label: 'Lv 9', value: 9, isUse: true, bonus: { falconDmg: 54 } },
        { label: 'Lv 10', value: 10, isUse: true, bonus: { falconDmg: 60 } },
      ],
    },
    {
      inputType: 'dropdown',
      label: 'Falcon Eyes',
      name: 'Falcon Eyes',
      dropdown: [
        { label: '-', value: 0, isUse: false },
        { label: 'Lv 10', value: 10, isUse: true },
      ],
    },
  ];

  constructor() {
    super();

    this.inheritSkills({
      activeSkillList: this.activeSkillListHi,
      atkSkillList: this.atkSkillListHi,
      passiveSkillList: this.passiveSkillListHi,
      classNames: this.classNamesHi,
    });
  }
}
