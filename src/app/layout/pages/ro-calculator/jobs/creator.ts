import { ClassName } from './_class-name';
import { ActiveSkillModel, AtkSkillModel, CharacterBase, PassiveSkillModel } from './_character-base.abstract';
import { Merchant } from './merchant';

const jobBonusTable: Record<number, [number, number, number, number, number, number]> = {};

export class Creator extends CharacterBase {
  protected readonly CLASS_NAME = ClassName.Creator;
  protected readonly JobBonusTable = jobBonusTable;

  protected readonly initialStatusPoint = 40;
  protected readonly classNames = [
    'Hi-Class',
    'Alchemist',
    'Alchemist Cls',
    'Alchemist Class',
    'Biochemist',
    'Biochemist Cls',
    'Biochemist Class',
    'Creator',
    'Creator Cls',
    'Creator Class',
  ];
  protected readonly _atkSkillList: AtkSkillModel[] = [];
  protected readonly _activeSkillList: ActiveSkillModel[] = [];
  protected readonly _passiveSkillList: PassiveSkillModel[] = [
    {
      label: 'Learn Potion',
      name: 'Learning Potion',
      inputType: 'dropdown',
      dropdown: [
        { label: '-', isUse: false, value: 0 },
        { label: 'Lv 1', isUse: true, value: 1 },
        { label: 'Lv 2', isUse: true, value: 2 },
        { label: 'Lv 3', isUse: true, value: 3 },
        { label: 'Lv 4', isUse: true, value: 4 },
        { label: 'Lv 5', isUse: true, value: 5 },
        { label: 'Lv 6', isUse: true, value: 6 },
        { label: 'Lv 7', isUse: true, value: 7 },
        { label: 'Lv 8', isUse: true, value: 8 },
        { label: 'Lv 9', isUse: true, value: 9 },
        { label: 'Lv 10', isUse: true, value: 10 },
      ],
    },
    {
      label: 'Axe Mastery',
      name: 'Axe Mastery',
      inputType: 'dropdown',
      isMasteryAtk: true,
      dropdown: [
        { label: '-', isUse: false, value: 0 },
        { label: 'Lv 10', isUse: true, value: 10, bonus: { x_axe_atk: 30, x_sword_atk: 30 } },
      ],
    },
    {
      label: 'Acid Demonstration',
      name: 'Acid Demonstration',
      inputType: 'dropdown',
      dropdown: [
        { label: '-', isUse: false, value: 0 },
        { label: 'Lv 1', isUse: true, value: 1 },
        { label: 'Lv 2', isUse: true, value: 2 },
        { label: 'Lv 3', isUse: true, value: 3 },
        { label: 'Lv 4', isUse: true, value: 4 },
        { label: 'Lv 5', isUse: true, value: 5 },
        { label: 'Lv 6', isUse: true, value: 6 },
        { label: 'Lv 7', isUse: true, value: 7 },
        { label: 'Lv 8', isUse: true, value: 8 },
        { label: 'Lv 9', isUse: true, value: 9 },
        { label: 'Lv 10', isUse: true, value: 10 },
      ],
    },
    {
      label: 'Bio Cannibalize',
      name: 'Bio Cannibalize',
      inputType: 'dropdown',
      dropdown: [
        { label: '-', value: 0, isUse: false },
        { label: 'Lv 1', value: 1, skillLv: 1, isUse: true },
        { label: 'Lv 2', value: 2, skillLv: 2, isUse: true },
        { label: 'Lv 3', value: 3, skillLv: 3, isUse: true },
        { label: 'Lv 4', value: 4, skillLv: 4, isUse: true },
        { label: 'Lv 5', value: 5, skillLv: 5, isUse: true },
      ],
    },
  ];

  constructor() {
    super();

    this.inheritBaseClass(new Merchant());
  }
}
