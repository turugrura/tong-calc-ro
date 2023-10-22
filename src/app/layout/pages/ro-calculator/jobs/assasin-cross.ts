import { ClassName } from './_class-name';
import {
  ActiveSkillModel,
  AtkSkillFormulaInput,
  AtkSkillModel,
  CharacterBase,
  PassiveSkillModel,
} from './_character-base.abstract';
import { Thief } from './thief';

const jobBonusTable: Record<number, [number, number, number, number, number, number]> = {};

export class AssasinCross extends CharacterBase {
  protected readonly CLASS_NAME = ClassName.AssasinCross;
  protected readonly JobBonusTable = jobBonusTable;

  protected initialStatusPoint = 100;
  protected classNames = ['Hi-Class', 'Assassin', 'Assassin Cross', 'Assassin Cross Cls', 'Assassin Cross Class'];
  protected _atkSkillList: AtkSkillModel[] = [
    {
      name: 'Meteor Assault',
      label: 'Meteor Assault Lv 10',
      value: 'Meteor Assault==10',
      fct: 0.25,
      vct: 0.25,
      cd: 0.5,
      acd: 0,
      levelList: [],
      formular: (input: AtkSkillFormulaInput): number => {
        const { model, skillLevel, status } = input;
        const baseLevel = model.level;
        const bonusStr = status.totalStr * 5;

        return (bonusStr + skillLevel * 120 + 200) * (baseLevel / 100);
      },
    },
  ];
  protected _activeSkillList: ActiveSkillModel[] = [
    {
      inputType: 'dropdown',
      label: 'Venom Imp',
      name: 'Venom Impression',
      isEquipAtk: true,
      dropdown: [
        { label: '-', value: 0, isUse: false },
        { label: 'Lv 1', value: 1, isUse: true, bonus: { vi: 10 } },
        { label: 'Lv 2', value: 2, isUse: true, bonus: { vi: 20 } },
        { label: 'Lv 3', value: 3, isUse: true, bonus: { vi: 30 } },
        { label: 'Lv 4', value: 4, isUse: true, bonus: { vi: 40 } },
        { label: 'Lv 5', value: 5, isUse: true, bonus: { vi: 50 } },
      ],
    },
    {
      inputType: 'selectButton',
      label: 'EDP',
      name: 'Enchant Deadly Poison',
      dropdown: [
        { label: 'Yes', value: 1, isUse: true },
        { label: 'No', value: 0, isUse: false },
      ],
    },
  ];
  protected _passiveSkillList: PassiveSkillModel[] = [
    {
      inputType: 'dropdown',
      label: 'Katar Mastery',
      name: 'Katar Mastery',
      isMasteryAtk: true,
      dropdown: [
        { label: '-', isUse: false, value: 0 },
        { label: 'Lv 1', isUse: true, value: 1, bonus: { atk: 3 } },
        { label: 'Lv 2', isUse: true, value: 2, bonus: { atk: 6 } },
        { label: 'Lv 3', isUse: true, value: 3, bonus: { atk: 9 } },
        { label: 'Lv 4', isUse: true, value: 4, bonus: { atk: 12 } },
        { label: 'Lv 5', isUse: true, value: 5, bonus: { atk: 15 } },
        { label: 'Lv 6', isUse: true, value: 6, bonus: { atk: 18 } },
        { label: 'Lv 7', isUse: true, value: 7, bonus: { atk: 21 } },
        { label: 'Lv 8', isUse: true, value: 8, bonus: { atk: 24 } },
        { label: 'Lv 9', isUse: true, value: 9, bonus: { atk: 27 } },
        { label: 'Lv 10', isUse: true, value: 10, bonus: { atk: 30 } },
      ],
    },
    {
      inputType: 'dropdown',
      label: 'Adv Katar',
      name: 'Advanced Katar Mastery',
      dropdown: [
        { label: '-', isUse: false, value: 0 },
        { label: 'Lv 1', isUse: true, value: 1, bonus: { final: 12 } },
        { label: 'Lv 2', isUse: true, value: 2, bonus: { final: 14 } },
        { label: 'Lv 3', isUse: true, value: 3, bonus: { final: 16 } },
        { label: 'Lv 4', isUse: true, value: 4, bonus: { final: 18 } },
        { label: 'Lv 5', isUse: true, value: 5, bonus: { final: 20 } },
      ],
    },
    {
      inputType: 'dropdown',
      label: 'Soul Destroyer',
      name: 'Soul Destroyer',
      isMasteryAtk: true,
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
  ];

  constructor() {
    super();

    this.inheritBaseClass(new Thief());
  }
}
