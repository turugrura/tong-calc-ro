import { ClassName } from './_class-name';
import { ActiveSkillModel, AtkSkillModel, PassiveSkillModel } from './_character-base.abstract';
import { Swordman } from './swordman';
import { SpearMastery } from '../constants/share-passive-skills';
import { CavalierMastery } from '../constants/share-passive-skills/cavalier-mastery';

const jobBonusTable: Record<number, [number, number, number, number, number, number]> = {};

export class LordKnight extends Swordman {
  protected override CLASS_NAME = ClassName.LordKnight;
  protected override JobBonusTable = jobBonusTable;

  protected override initialStatusPoint = 100;
  protected readonly classNamesHi = [ClassName.HiClass, ClassName.LordKnight];
  protected readonly atkSkillListHi: AtkSkillModel[] = [];
  protected readonly activeSkillListHi: ActiveSkillModel[] = [
    {
      label: 'Two hand Quick 10',
      name: 'Two hand Quicken',
      inputType: 'selectButton',
      dropdown: [
        { label: 'Yes', value: 10, skillLv: 10, isUse: true },
        { label: 'No', value: 0, isUse: false },
      ],
    },
    {
      name: 'Aura Blade',
      label: 'Aura Blade 5',
      inputType: 'selectButton',
      dropdown: [
        { label: 'Yes', value: 5, isUse: true },
        { label: 'No', value: 0, isUse: false },
      ],
    },
    {
      name: 'Spear Dynamo',
      label: 'Spear Dynamo 5',
      inputType: 'selectButton',
      dropdown: [
        { label: 'Yes', value: 5, isUse: true, bonus: { atkPercent: 15, hit: 50, defPercent: -15 } },
        { label: 'No', value: 0, isUse: false },
      ],
    },
  ];
  protected readonly passiveSkillListHi: PassiveSkillModel[] = [
    SpearMastery,
    CavalierMastery,
    {
      label: 'Two hand Quick',
      name: 'Two hand Quicken',
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
      label: 'Clashing Spiral',
      name: 'Clashing Spiral',
      inputType: 'dropdown',
      dropdown: [
        { label: '-', value: 0, isUse: false },
        { label: 'Lv 1', value: 1, isUse: true },
        { label: 'Lv 2', value: 2, isUse: true },
        { label: 'Lv 3', value: 3, isUse: true },
        { label: 'Lv 4', value: 4, isUse: true },
        { label: 'Lv 5', value: 5, isUse: true },
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
