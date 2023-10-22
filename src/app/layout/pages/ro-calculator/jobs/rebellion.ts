import { ClassName } from './_class-name';
import {
  ActiveSkillModel,
  AtkSkillFormulaInput,
  AtkSkillModel,
  CharacterBase,
  PassiveSkillModel,
} from './_character-base.abstract';

const jobBonusTable: [number, number, number, number, number, number][] = [
  [0, 0, 0, 0, 0, 0], // job 0
  [0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 1, 0],
  [0, 0, 0, 0, 1, 0],
  [0, 0, 0, 1, 1, 0],
  [0, 0, 0, 1, 1, 0],
  [0, 0, 1, 1, 1, 0],
  [0, 0, 1, 1, 2, 0],
  [0, 0, 1, 2, 2, 0],
  [0, 1, 1, 2, 2, 0],
  [0, 1, 1, 2, 2, 1],
  [0, 1, 1, 2, 2, 1],
  [0, 1, 1, 2, 2, 1],
  [0, 1, 2, 2, 2, 1],
  [0, 1, 2, 3, 2, 1],
  [0, 1, 2, 3, 2, 1],
  [0, 2, 2, 3, 2, 1],
  [0, 2, 2, 3, 3, 1],
  [0, 2, 2, 4, 3, 1],
  [0, 2, 3, 4, 3, 1],
  [0, 2, 3, 4, 3, 2],
  [0, 2, 3, 4, 3, 2],
  [0, 2, 3, 4, 3, 2],
  [0, 2, 4, 4, 3, 2],
  [0, 2, 4, 4, 4, 2],
  [1, 2, 4, 4, 4, 2],
  [1, 2, 4, 5, 4, 2],
  [1, 3, 4, 5, 4, 2],
  [1, 3, 4, 5, 4, 2],
  [1, 3, 4, 5, 4, 2],
  [1, 3, 4, 5, 4, 3],
  [1, 3, 5, 5, 4, 3],
  [1, 3, 5, 5, 4, 3],
  [1, 3, 5, 5, 5, 3],
  [1, 3, 5, 6, 5, 3],
  [2, 3, 5, 6, 5, 3],
  [2, 3, 5, 6, 5, 3],
  [2, 3, 5, 6, 5, 3],
  [2, 3, 5, 6, 6, 3],
  [2, 3, 5, 6, 6, 3],
  [2, 4, 5, 6, 6, 3],
  [2, 4, 5, 6, 6, 4],
  [2, 4, 5, 6, 6, 4],
  [2, 4, 5, 6, 7, 4],
  [2, 4, 6, 6, 7, 4],
  [2, 4, 6, 7, 7, 4],
  [2, 4, 6, 7, 7, 4],
  [2, 4, 6, 7, 7, 4],
  [2, 4, 6, 7, 7, 4],
  [2, 4, 6, 7, 7, 4],
  [3, 4, 6, 7, 7, 4],
  [3, 5, 6, 7, 7, 4],
  [3, 5, 6, 7, 7, 5],
  [3, 5, 6, 7, 7, 5],
  [3, 5, 6, 8, 7, 5],
  [3, 5, 6, 8, 8, 5],
  [3, 5, 6, 8, 8, 5],
  [3, 6, 6, 8, 8, 5],
  [3, 6, 6, 8, 8, 5],
  [3, 6, 6, 8, 8, 5],
  [3, 6, 6, 8, 8, 5],
  [3, 6, 6, 8, 8, 5],
  [3, 6, 6, 8, 8, 5],
  [3, 6, 10, 8, 10, 5],
  [3, 6, 10, 8, 10, 5],
  [3, 6, 10, 8, 10, 5],
];

export class Rebelion extends CharacterBase {
  protected readonly CLASS_NAME = ClassName.Rebellion;
  protected readonly JobBonusTable = jobBonusTable;

  protected initialStatusPoint = 100;
  protected classNames = ['Gunslinger', 'Gunslinger Cls', 'Rebellion'];
  protected _atkSkillList: AtkSkillModel[] = [
    {
      label: 'Round Trip',
      name: 'Round Trip',
      value: 'Round Trip==10',
      acd: 1,
      fct: 0,
      vct: 0,
      cd: 1,
      levelList: [{ label: 'Lv 10', value: 'Round Trip==10' }],
      formular: (input: AtkSkillFormulaInput): number => {
        const { model, skillLevel } = input;
        const baseLevel = model.level;

        return (skillLevel * 200 + 500) * (baseLevel / 100);
      },
    },
    {
      label: 'Fire Dance',
      name: 'Fire Dance',
      value: 'Fire Dance==10',
      acd: 0.5,
      fct: 0,
      vct: 0,
      cd: 0,
      levelList: [{ label: 'Lv 10', value: 'Fire Dance==10' }],
      formular: (input: AtkSkillFormulaInput): number => {
        const { model, skillLevel } = input;
        const baseLevel = model.level;

        return (skillLevel * 100 + 200 + 200) * (baseLevel / 100);
      },
    },
    {
      label: 'Vanishing Buster',
      name: 'Vanishing Buster',
      value: 'Vanishing Buster==10',
      acd: 0.4,
      fct: 0.7,
      vct: 1,
      cd: 1.6,
      levelList: [{ label: 'Lv 10', value: 'Vanishing Buster==10' }],
      formular: (input: AtkSkillFormulaInput): number => {
        const { model, skillLevel } = input;
        const baseLevel = model.level;

        return (skillLevel * 100 + 1500) * (baseLevel / 100);
      },
    },
  ];
  protected _activeSkillList: ActiveSkillModel[] = [
    {
      isEquipAtk: true,
      inputType: 'selectButton',
      label: 'Platinum Altar',
      name: 'Platinum Altar',
      dropdown: [
        {
          label: 'Yes',
          value: 1,
          skillLv: 1,
          isUse: true,
          bonus: { atk: 150 },
        },
        { label: 'No', value: 2, isUse: false },
      ],
    },
    {
      isMasteryAtk: true,
      inputType: 'selectButton',
      label: "Rich's Coin",
      name: "Rich's Coin",
      dropdown: [
        { label: 'Yes', value: 1, skillLv: 5, isUse: true, bonus: { atk: 30 } },
        { label: 'No', value: 2, isUse: false },
      ],
    },
  ];
  protected _passiveSkillList: PassiveSkillModel[] = [
    {
      isEquipAtk: true,
      inputType: 'dropdown',
      label: 'Snake Eyes',
      name: 'Snake Eyes',
      dropdown: [
        { label: '0', value: 0, isUse: false },
        { label: '1', value: 1, skillLv: 1, isUse: true, bonus: { hit: 1 } },
        { label: '2', value: 2, skillLv: 2, isUse: true, bonus: { hit: 2 } },
        { label: '3', value: 3, skillLv: 3, isUse: true, bonus: { hit: 3 } },
        { label: '4', value: 4, skillLv: 4, isUse: true, bonus: { hit: 4 } },
        { label: '5', value: 5, skillLv: 5, isUse: true, bonus: { hit: 5 } },
        { label: '6', value: 6, skillLv: 6, isUse: true, bonus: { hit: 6 } },
        { label: '7', value: 7, skillLv: 7, isUse: true, bonus: { hit: 7 } },
        { label: '8', value: 8, skillLv: 8, isUse: true, bonus: { hit: 8 } },
        { label: '9', value: 9, skillLv: 9, isUse: true, bonus: { hit: 9 } },
        {
          label: '10',
          value: 10,
          skillLv: 10,
          isUse: true,
          bonus: { hit: 10 },
        },
      ],
    },
    {
      label: 'Chain Action Lv10',
      name: 'Chain Action',
      inputType: 'selectButton',
      dropdown: [
        { label: 'Yes', value: 10, skillLv: 10, isUse: true },
        { label: 'No', value: 0, isUse: false },
      ],
    },
  ];
}
