import { ClassName } from './_class-name';
import {
  ActiveSkillModel,
  AtkSkillFormulaInput,
  AtkSkillModel,
  CharacterBase,
  PassiveSkillModel,
} from './_character-base.abstract';
import { Swordman } from './swordman';
import { DemonBane, Heal, SpearMastery } from '../constants/share-passive-skills';
import { CavalierMastery } from '../constants/share-passive-skills/cavalier-mastery';
import { ElementType } from '../constants/element-type.const';

const jobBonusTable: Record<number, [number, number, number, number, number, number]> = {};

export class Paladin extends CharacterBase {
  protected readonly CLASS_NAME = ClassName.Paladin;
  protected readonly JobBonusTable = jobBonusTable;

  protected readonly initialStatusPoint = 40;
  protected readonly classNames = ['Hi-Class', 'Paladin', 'Paladin Cls', 'Paladin Class'];
  protected readonly _atkSkillList: AtkSkillModel[] = [
    {
      label: 'Gloria Domini Lv5',
      name: 'Gloria Domini',
      value: 'Gloria Domini==5',
      acd: 1,
      fct: 1,
      vct: 1,
      cd: 0,
      isMatk: true,
      element: ElementType.Holy,
      formula: (input: AtkSkillFormulaInput): number => {
        const { model, skillLevel } = input;
        const baseLevel = model.level;

        return (500 + skillLevel * 150) * (baseLevel / 100);
      },
    },
  ];
  protected readonly _activeSkillList: ActiveSkillModel[] = [
    {
      label: 'Spear Quick 10',
      name: 'Spear Quicken',
      inputType: 'selectButton',
      isMasteryAtk: true,
      dropdown: [
        { label: 'Yes', value: 10, skillLv: 10, isUse: true, bonus: { spear_skillAspd: 7 } },
        { label: 'No', value: 0, isUse: false },
      ],
    },
  ];
  protected readonly _passiveSkillList: PassiveSkillModel[] = [
    DemonBane,
    {
      label: 'Faith',
      name: 'Faith',
      inputType: 'dropdown',
      dropdown: [
        { label: '-', value: 0, isUse: false },
        { label: 'Lv 1', value: 1, skillLv: 1, isUse: true, bonus: { hp: 200 } },
        { label: 'Lv 2', value: 2, skillLv: 2, isUse: true, bonus: { hp: 400 } },
        { label: 'Lv 3', value: 3, skillLv: 3, isUse: true, bonus: { hp: 600 } },
        { label: 'Lv 4', value: 4, skillLv: 4, isUse: true, bonus: { hp: 800 } },
        { label: 'Lv 5', value: 5, skillLv: 5, isUse: true, bonus: { hp: 1000 } },
        { label: 'Lv 6', value: 6, skillLv: 6, isUse: true, bonus: { hp: 1200 } },
        { label: 'Lv 7', value: 7, skillLv: 7, isUse: true, bonus: { hp: 1400 } },
        { label: 'Lv 8', value: 8, skillLv: 8, isUse: true, bonus: { hp: 1600 } },
        { label: 'Lv 9', value: 9, skillLv: 9, isUse: true, bonus: { hp: 1800 } },
        { label: 'Lv 10', value: 10, skillLv: 10, isUse: true, bonus: { hp: 2000 } },
      ],
    },
    Heal,
    SpearMastery,
    CavalierMastery,
    {
      label: 'Auto Guard',
      name: 'Auto Guard',
      inputType: 'dropdown',
      dropdown: [
        { label: '-', value: 0, isUse: false },
        { label: 'Lv 1', value: 1, skillLv: 1, isUse: true },
        { label: 'Lv 2', value: 2, skillLv: 2, isUse: true },
        { label: 'Lv 3', value: 3, skillLv: 3, isUse: true },
        { label: 'Lv 4', value: 4, skillLv: 4, isUse: true },
        { label: 'Lv 5', value: 5, skillLv: 5, isUse: true },
        { label: 'Lv 6', value: 6, skillLv: 6, isUse: true },
        { label: 'Lv 7', value: 7, skillLv: 7, isUse: true },
        { label: 'Lv 8', value: 8, skillLv: 8, isUse: true },
        { label: 'Lv 9', value: 9, skillLv: 9, isUse: true },
        { label: 'Lv 10', value: 10, skillLv: 10, isUse: true },
      ],
    },
    {
      label: 'Grand Cross',
      name: 'Grand Cross',
      inputType: 'dropdown',
      dropdown: [
        { label: '-', value: 0, isUse: false },
        { label: 'Lv 1', value: 1, skillLv: 1, isUse: true },
        { label: 'Lv 2', value: 2, skillLv: 2, isUse: true },
        { label: 'Lv 3', value: 3, skillLv: 3, isUse: true },
        { label: 'Lv 4', value: 4, skillLv: 4, isUse: true },
        { label: 'Lv 5', value: 5, skillLv: 5, isUse: true },
        { label: 'Lv 6', value: 6, skillLv: 6, isUse: true },
        { label: 'Lv 7', value: 7, skillLv: 7, isUse: true },
        { label: 'Lv 8', value: 8, skillLv: 8, isUse: true },
        { label: 'Lv 9', value: 9, skillLv: 9, isUse: true },
        { label: 'Lv 10', value: 10, skillLv: 10, isUse: true },
      ],
    },
  ];

  constructor() {
    super();

    this.inheritBaseClass(new Swordman());
  }
}
