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
    // {
    //   name: 'Soul Drain',
    //   label: 'Soul Drain Lv10',
    //   value: 'Soul Drain==10',
    //   acd: 0,
    //   fct: 0,
    //   vct: 0,
    //   cd: 0,
    //   isMatk: true,
    //   formula: (input: AtkSkillFormulaInput): number => {
    //     const { model, skillLevel } = input;
    //     const baseLevel = model.level;

    //     return (95 + skillLevel * 15) * (baseLevel / 100);
    //   },
    // },
    {
      name: 'Napalm Vulcan',
      label: 'Napalm Vulcan Lv5',
      value: 'Napalm Vulcan==5',
      fct: 0.3,
      vct: 0.5,
      acd: 0.5,
      cd: 1,
      isMatk: true,
      element: ElementType.Ghost,
      totalHit: 5,
      formula: (input: AtkSkillFormulaInput): number => {
        const { model, skillLevel } = input;
        const baseLevel = model.level;

        return skillLevel * 70 * (baseLevel / 100);
      },
    },
    {
      name: 'Lord of Vermilion',
      label: 'Lord of Vermilion Lv10',
      value: 'Lord of Vermilion==10',
      acd: 5,
      fct: 1.68,
      vct: 6.72,
      cd: 5,
      isMatk: true,
      isDevMode: true,
      hit: 20,
      element: ElementType.Wind,
      formula: (input: AtkSkillFormulaInput): number => {
        const { skillLevel } = input;

        return 400 + skillLevel * 100;
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
      totalHit: 5,
      formula: (): number => {
        return 125;
      },
    },
    {
      name: 'Meteor Storm',
      label: 'Meteor Storm Lv10',
      value: 'Meteor Storm==10',
      acd: 5,
      fct: 1.5,
      vct: 6.72,
      cd: 7,
      isMatk: true,
      isDevMode: true,
      element: ElementType.Fire,
      totalHit: 2,
      hit: 2,
      formula: (): number => {
        return 125;
      },
    },
    {
      name: 'Gravitational Field',
      label: 'Gravitational Field Lv5',
      value: 'Gravitational Field==5',
      acd: 1,
      fct: 1,
      vct: 5,
      cd: 5,
      isMatk: true,
      element: ElementType.Neutral,
      totalHit: 18,
      formula: (input: AtkSkillFormulaInput): number => {
        const { model, skillLevel } = input;
        const baseLevel = model.level;

        return skillLevel * 50 * (baseLevel / 100);
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
        { label: 'Lv 1', isUse: true, value: 1, bonus: { spPercent: 1 * 2 } },
        { label: 'Lv 2', isUse: true, value: 2, bonus: { spPercent: 2 * 2 } },
        { label: 'Lv 3', isUse: true, value: 3, bonus: { spPercent: 3 * 2 } },
        { label: 'Lv 4', isUse: true, value: 4, bonus: { spPercent: 4 * 2 } },
        { label: 'Lv 5', isUse: true, value: 5, bonus: { spPercent: 5 * 2 } },
        { label: 'Lv 6', isUse: true, value: 6, bonus: { spPercent: 6 * 2 } },
        { label: 'Lv 7', isUse: true, value: 7, bonus: { spPercent: 7 * 2 } },
        { label: 'Lv 8', isUse: true, value: 8, bonus: { spPercent: 8 * 2 } },
        { label: 'Lv 9', isUse: true, value: 9, bonus: { spPercent: 9 * 2 } },
        { label: 'Lv 10', isUse: true, value: 10, bonus: { spPercent: 10 * 2 } },
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
