import { ClassName } from './_class-name';
import { ActiveSkillModel, AtkSkillModel, CharacterBase, PassiveSkillModel } from './char-class.abstract';
import { Mage } from './mage';

const jobBonusTable: Record<number, [number, number, number, number, number, number]> = {};

export class Sage extends CharacterBase {
  protected readonly CLASS_NAME = ClassName.Sage;
  protected readonly JobBonusTable = jobBonusTable;

  protected readonly initialStatusPoint = 48;
  protected readonly classNames = ['Hi-Class', 'Sage', 'Sage Cls', 'Sage Class'];
  protected readonly _atkSkillList: AtkSkillModel[] = [];
  protected readonly _activeSkillList: ActiveSkillModel[] = [
    {
      inputType: 'selectButton',
      label: 'Foresight',
      name: 'Foresight',
      dropdown: [
        { label: 'Yes', isUse: true, value: 1 },
        { label: 'No', isUse: false, value: 0 },
      ],
    },
  ];
  protected readonly _passiveSkillList: PassiveSkillModel[] = [
    {
      inputType: 'dropdown',
      label: 'Adv Book',
      name: 'Advanced Book',
      isMasteryAtk: true,
      dropdown: [
        { label: '-', isUse: false, value: 0 },
        { label: 'Lv 1', isUse: true, value: 1, bonus: { book_atk: 3, book_skillAspd: 0.5 } },
        { label: 'Lv 2', isUse: true, value: 2, bonus: { book_atk: 6, book_skillAspd: 1 } },
        { label: 'Lv 3', isUse: true, value: 3, bonus: { book_atk: 9, book_skillAspd: 1.5 } },
        { label: 'Lv 4', isUse: true, value: 4, bonus: { book_atk: 12, book_skillAspd: 2 } },
        { label: 'Lv 5', isUse: true, value: 5, bonus: { book_atk: 15, book_skillAspd: 2.5 } },
        { label: 'Lv 6', isUse: true, value: 6, bonus: { book_atk: 18, book_skillAspd: 3 } },
        { label: 'Lv 7', isUse: true, value: 7, bonus: { book_atk: 21, book_skillAspd: 3.5 } },
        { label: 'Lv 8', isUse: true, value: 8, bonus: { book_atk: 24, book_skillAspd: 4 } },
        { label: 'Lv 9', isUse: true, value: 9, bonus: { book_atk: 27, book_skillAspd: 4.5 } },
        { label: 'Lv 10', isUse: true, value: 10, bonus: { book_atk: 30, book_skillAspd: 5 } },
      ],
    },
    {
      inputType: 'dropdown',
      label: 'Dragonology',
      name: 'Dragonology',
      isMasteryAtk: true,
      dropdown: [
        { label: '-', isUse: false, value: 0 },
        {
          label: 'Lv 1',
          isUse: true,
          value: 1,
          bonus: { atkPercent_race_dragon: 4, matkPercent_race_dragon: 2, int: 1 },
        },
        {
          label: 'Lv 2',
          isUse: true,
          value: 2,
          bonus: { atkPercent_race_dragon: 8, matkPercent_race_dragon: 4, int: 1 },
        },
        {
          label: 'Lv 3',
          isUse: true,
          value: 3,
          bonus: { atkPercent_race_dragon: 12, matkPercent_race_dragon: 6, int: 2 },
        },
        {
          label: 'Lv 4',
          isUse: true,
          value: 4,
          bonus: { atkPercent_race_dragon: 16, matkPercent_race_dragon: 8, int: 2 },
        },
        {
          label: 'Lv 5',
          isUse: true,
          value: 5,
          bonus: { atkPercent_race_dragon: 20, matkPercent_race_dragon: 10, int: 3 },
        },
      ],
    },
    {
      inputType: 'dropdown',
      label: 'Indulge',
      name: 'Indulge',
      dropdown: [
        { label: '-', isUse: false, value: 0 },
        { label: 'Lv 1', isUse: true, value: 1 },
        { label: 'Lv 2', isUse: true, value: 2 },
        { label: 'Lv 3', isUse: true, value: 3 },
        { label: 'Lv 4', isUse: true, value: 4 },
        { label: 'Lv 5', isUse: true, value: 5 },
      ],
    },
    {
      inputType: 'dropdown',
      label: 'Auto Spell',
      name: 'Auto Spell',
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
      inputType: 'dropdown',
      label: 'Lightning Loader',
      name: 'Lightning Loader',
      dropdown: [
        { label: '-', isUse: false, value: 0 },
        { label: 'Lv 1', isUse: true, value: 1 },
        { label: 'Lv 2', isUse: true, value: 2 },
        { label: 'Lv 3', isUse: true, value: 3 },
        { label: 'Lv 4', isUse: true, value: 4 },
        { label: 'Lv 5', isUse: true, value: 5 },
      ],
    },
    {
      inputType: 'dropdown',
      label: 'Frost Weapon',
      name: 'Frost Weapon',
      dropdown: [
        { label: '-', isUse: false, value: 0 },
        { label: 'Lv 1', isUse: true, value: 1 },
        { label: 'Lv 2', isUse: true, value: 2 },
        { label: 'Lv 3', isUse: true, value: 3 },
        { label: 'Lv 4', isUse: true, value: 4 },
        { label: 'Lv 5', isUse: true, value: 5 },
      ],
    },

    {
      inputType: 'dropdown',
      label: 'Seismic Weapon',
      name: 'Seismic Weapon',
      dropdown: [
        { label: '-', isUse: false, value: 0 },
        { label: 'Lv 1', isUse: true, value: 1 },
        { label: 'Lv 2', isUse: true, value: 2 },
        { label: 'Lv 3', isUse: true, value: 3 },
        { label: 'Lv 4', isUse: true, value: 4 },
        { label: 'Lv 5', isUse: true, value: 5 },
      ],
    },
  ];

  constructor() {
    super();

    this.inheritBaseClass(new Mage());
  }
}
