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
      label: 'Learn Potion 10',
      name: 'Learning Potion',
      inputType: 'selectButton',
      dropdown: [
        { label: 'Yes', value: 10, skillLv: 10, isUse: true },
        { label: 'No', value: 0, isUse: false },
      ],
    },
    {
      label: 'Axe Mastery 10',
      name: 'Axe Mastery',
      inputType: 'selectButton',
      isMasteryAtk: true,
      dropdown: [
        { label: 'Yes', value: 10, skillLv: 10, isUse: true, bonus: { x_axe_atk: 30, x_sword_atk: 30 } },
        { label: 'No', value: 0, isUse: false },
      ],
    },
    {
      label: 'Acid Demons 10',
      name: 'Acid Demonstration',
      inputType: 'selectButton',
      dropdown: [
        { label: 'Yes', value: 10, skillLv: 10, isUse: true },
        { label: 'No', value: 0, isUse: false },
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
