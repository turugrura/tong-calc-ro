import { ClassName } from './_class-name';
import { ActiveSkillModel, AtkSkillModel, CharacterBase, PassiveSkillModel } from './_character-base.abstract';
import { Merchant } from './merchant';
import { HiltBindingFn } from '../constants/share-passive-skills';

const jobBonusTable: Record<number, [number, number, number, number, number, number]> = {};

export class Whitesmith extends CharacterBase {
  protected readonly CLASS_NAME = ClassName.Whitesmith;
  protected readonly JobBonusTable = jobBonusTable;

  protected readonly initialStatusPoint = 40;
  protected readonly classNames = ['Blacksmith', 'Blacksmith Cls', 'Blacksmith Class', 'Whitesmith', 'Whitesmith Cls', 'Whitesmith Class'];
  protected readonly _atkSkillList: AtkSkillModel[] = [];
  protected readonly _activeSkillList: ActiveSkillModel[] = [
    {
      label: 'Adrenaline Lv5',
      name: 'Adrenaline Rush',
      inputType: 'selectButton',
      dropdown: [
        {
          label: 'Yes',
          value: 5,
          isUse: true,
          bonus: {
            axe_hit: 20,
            axe_aspdPercent: 10,
            axe_skillAspd: 7,
            twohandAxe_hit: 20,
            twohandAxe_aspdPercent: 10,
            twohandAxe_skillAspd: 7,
            mace_hit: 20,
            mace_aspdPercent: 10,
            mace_skillAspd: 7,
            twohandMace_hit: 20,
            twohandMace_aspdPercent: 10,
            twohandMace_skillAspd: 7,
          },
        },
        { label: 'No', value: 0, isUse: false },
      ],
    },
    {
      label: 'Power Thrust Lv5',
      name: 'Power Thrust',
      inputType: 'selectButton',
      dropdown: [
        { label: 'Yes', value: 5, isUse: true, bonus: { flatDmg: 25 } },
        { label: 'No', value: 0, isUse: false },
      ],
    },
    {
      label: 'Weapon Perfect Lv5',
      name: 'Weapon Perfection',
      inputType: 'selectButton',
      dropdown: [
        { label: 'Yes', value: 5, isUse: true, bonus: { ignore_size_penalty: 1 } },
        { label: 'No', value: 0, isUse: false },
      ],
    },
    {
      label: 'P.Maximize Lv5',
      name: 'Power Maximize',
      inputType: 'selectButton',
      dropdown: [
        { label: 'Yes', value: 5, isUse: true, bonus: { weapon_maximize: 1 } },
        { label: 'No', value: 0, isUse: false },
      ],
    },
  ];
  protected readonly _passiveSkillList: PassiveSkillModel[] = [
    HiltBindingFn(),
    {
      label: 'Skin Tempering',
      name: 'Skin Tempering',
      inputType: 'dropdown',
      isMasteryAtk: true,
      dropdown: [
        { label: '-', value: 0, isUse: false },
        { label: 'Lv 1', value: 1, isUse: true, bonus: { x_resist_fire: 4, x_resist_neutral: 1 } },
        { label: 'Lv 2', value: 2, isUse: true, bonus: { x_resist_fire: 8, x_resist_neutral: 2 } },
        { label: 'Lv 3', value: 3, isUse: true, bonus: { x_resist_fire: 12, x_resist_neutral: 3 } },
        { label: 'Lv 4', value: 4, isUse: true, bonus: { x_resist_fire: 16, x_resist_neutral: 4 } },
        { label: 'Lv 5', value: 5, isUse: true, bonus: { x_resist_fire: 20, x_resist_neutral: 5 } },
      ],
    },
    {
      label: 'Weaponry Research',
      name: 'Weaponry Research',
      inputType: 'dropdown',
      isMasteryAtk: true,
      dropdown: [
        { label: '-', value: 0, isUse: false },
        { label: 'Lv 1', value: 1, isUse: true, bonus: { x_atk: 2 } },
        { label: 'Lv 2', value: 2, isUse: true, bonus: { x_atk: 4 } },
        { label: 'Lv 3', value: 3, isUse: true, bonus: { x_atk: 6 } },
        { label: 'Lv 4', value: 4, isUse: true, bonus: { x_atk: 8 } },
        { label: 'Lv 5', value: 5, isUse: true, bonus: { x_atk: 10 } },
        { label: 'Lv 6', value: 6, isUse: true, bonus: { x_atk: 12 } },
        { label: 'Lv 7', value: 7, isUse: true, bonus: { x_atk: 14 } },
        { label: 'Lv 8', value: 8, isUse: true, bonus: { x_atk: 16 } },
        { label: 'Lv 9', value: 9, isUse: true, bonus: { x_atk: 18 } },
        { label: 'Lv 10', value: 10, isUse: true, bonus: { x_atk: 20 } },
      ],
    },
  ];

  constructor() {
    super();

    this.inheritBaseClass(new Merchant());
  }
}
