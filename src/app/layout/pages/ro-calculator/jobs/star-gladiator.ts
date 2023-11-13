import { ClassName } from './_class-name';
import { ActiveSkillModel, AtkSkillModel, CharacterBase, PassiveSkillModel } from './_character-base.abstract';
import { Taekwondo } from './taekwondo';

const jobBonusTable: Record<number, [number, number, number, number, number, number]> = {};

export class StarGladiator extends CharacterBase {
  protected readonly CLASS_NAME = ClassName.StarGladiator;
  protected readonly JobBonusTable = jobBonusTable;

  protected readonly initialStatusPoint = 40;
  protected readonly classNames = [
    'StarGladiator',
    'StarGladiator Cls',
    'StarGladiator Class',
    'Star Gladiator',
    'Star Gladiator Cls',
    'Star Gladiator Class',
  ];

  protected readonly _atkSkillList: AtkSkillModel[] = [];

  protected readonly _activeSkillList: ActiveSkillModel[] = [
    {
      label: 'Power 5',
      name: 'Power',
      inputType: 'dropdown',
      dropdown: [
        { label: '-', value: 0, isUse: false },
        { label: '2 Players', value: 2, isUse: true },
        { label: '3 Players', value: 3, isUse: true },
        { label: '4 Players', value: 4, isUse: true },
        { label: '5 Players', value: 5, isUse: true },
        { label: '6 Players', value: 6, isUse: true },
        { label: '7 Players', value: 7, isUse: true },
        { label: '8 Players', value: 8, isUse: true },
        { label: '9 Players', value: 9, isUse: true },
        { label: '10 Players', value: 10, isUse: true },
        { label: '11 Players', value: 11, isUse: true },
        { label: '12 Players', value: 12, isUse: true },
      ],
    },
    {
      label: 'Wrath of',
      name: 'Wrath of',
      inputType: 'selectButton',
      dropdown: [
        { label: 'Yes', value: 3, skillLv: 3, isUse: true },
        { label: 'No', value: 0, isUse: false },
      ],
    },
  ];
  protected readonly _passiveSkillList: PassiveSkillModel[] = [
    {
      label: 'Knowledge of Sun',
      name: 'Knowledge of Sun, Moon and Star',
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
  ];

  constructor() {
    super();

    this.inheritBaseClass(new Taekwondo());
  }
}
