import { ElementType } from '../constants/element-type.const';
import { ClassName } from './_class-name';
import {
  ActiveSkillModel,
  AtkSkillFormulaInput,
  AtkSkillModel,
  CharacterBase,
  PassiveSkillModel,
} from './_character-base.abstract';
import { Mage } from './mage';

const jobBonusTable: Record<number, [number, number, number, number, number, number]> = {};

export class Wizard extends CharacterBase {
  protected readonly CLASS_NAME = ClassName.Wizard;
  protected readonly JobBonusTable = jobBonusTable;

  protected initialStatusPoint = 100;
  protected classNames = ['Hi-Class', 'Wizard', 'Wizard Class', 'Wizard Cls'];
  protected _atkSkillList: AtkSkillModel[] = [
    {
      label: 'Soul Drain Lv10',
      name: 'Soul Drain',
      value: 'Soul Drain==10',
      acd: 0,
      fct: 0,
      vct: 0,
      cd: 0,
      isMatk: true,
      formula: (input: AtkSkillFormulaInput): number => {
        const { model, skillLevel } = input;
        const baseLevel = model.level;

        return (95 + skillLevel * 15) * (baseLevel / 100);
      },
    },
    {
      label: 'Napalm Vulcan Lv5',
      name: 'Napalm Vulcan',
      value: 'Napalm Vulcan==5',
      fct: 0.3,
      vct: 0.5,
      acd: 0.5,
      cd: 1,
      isMatk: true,
      element: ElementType.Ghost,
      formula: (input: AtkSkillFormulaInput): number => {
        const { model, skillLevel } = input;
        const baseLevel = model.level;

        return skillLevel * 70 * (baseLevel / 100);
      },
    },
    {
      label: "Heaven's Drive Lv5",
      name: "Heaven's Drive",
      value: "Heaven's Drive==5",
      fct: 0.8,
      vct: 1.9,
      acd: 0.5,
      cd: 0,
      isMatk: true,
      element: ElementType.Earth,
      formula: (input: AtkSkillFormulaInput): number => {
        const { model } = input;
        const baseLevel = model.level;

        return 125 * (baseLevel / 100);
      },
    },
  ];
  protected _activeSkillList: ActiveSkillModel[] = [
    {
      inputType: 'dropdown',
      label: 'Mystical Amp',
      name: 'Mystical Amplification',
      isEquipAtk: true,
      dropdown: [
        { label: '-', isUse: false, value: 0 },
        { label: 'Lv 1', isUse: true, value: 1, bonus: { mysticAmp: 5 } },
        { label: 'Lv 2', isUse: true, value: 2, bonus: { mysticAmp: 10 } },
        { label: 'Lv 3', isUse: true, value: 3, bonus: { mysticAmp: 15 } },
        { label: 'Lv 4', isUse: true, value: 4, bonus: { mysticAmp: 20 } },
        { label: 'Lv 5', isUse: true, value: 5, bonus: { mysticAmp: 25 } },
        { label: 'Lv 6', isUse: true, value: 6, bonus: { mysticAmp: 30 } },
        { label: 'Lv 7', isUse: true, value: 7, bonus: { mysticAmp: 35 } },
        { label: 'Lv 8', isUse: true, value: 8, bonus: { mysticAmp: 40 } },
        { label: 'Lv 9', isUse: true, value: 9, bonus: { mysticAmp: 45 } },
        { label: 'Lv 10', isUse: true, value: 10, bonus: { mysticAmp: 50 } },
      ],
    },
  ];
  protected _passiveSkillList: PassiveSkillModel[] = [
    {
      label: 'Soul Drain',
      name: 'Soul Drain',
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
      label: 'Gravitational',
      name: 'Gravitational Field',
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
    {
      label: 'Mystical Amp 10',
      name: 'Mystical Amplification',
      inputType: 'selectButton',
      dropdown: [
        { label: 'Yes', value: 10, isUse: true },
        { label: 'No', value: 0, isUse: false },
      ],
    },
  ];

  constructor() {
    super();

    this.inheritBaseClass(new Mage());
  }
}
