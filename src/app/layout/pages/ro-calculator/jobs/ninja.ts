import { ClassName } from './_class-name';
import { ActiveSkillModel, AtkSkillModel, CharacterBase, PassiveSkillModel } from './_character-base.abstract';
import { ElementCharm } from '../constants/share-active-skills/element-charm';

const jobBonusTable: Record<number, [number, number, number, number, number, number]> = {};

export class Ninja extends CharacterBase {
  protected readonly CLASS_NAME = ClassName.Ninja;
  protected readonly JobBonusTable = jobBonusTable;

  protected readonly initialStatusPoint = 40;
  protected readonly classNames = ['Ninja', 'Ninja Cls', 'Ninja Class'];
  protected readonly _atkSkillList: AtkSkillModel[] = [];
  protected readonly _activeSkillList: ActiveSkillModel[] = [
    {
      label: 'Ninja Aura 5',
      name: 'Ninja Aura',
      inputType: 'selectButton',
      dropdown: [
        { label: 'Yes', value: 5, skillLv: 5, isUse: true, bonus: { str: 5, int: 5 } },
        { label: 'No', value: 0, isUse: false },
      ],
    },
    ElementCharm,
  ];
  protected readonly _passiveSkillList: PassiveSkillModel[] = [
    {
      label: 'Ninja Mastery 10',
      name: 'Ninja Mastery',
      inputType: 'selectButton',
      dropdown: [
        { label: 'Yes', value: 10, isUse: true },
        { label: 'No', value: 0, isUse: false },
        // { label: 'Lv 1', value: 1, isUse: true } },
        // { label: 'Lv 2', value: 2, isUse: true } },
        // { label: 'Lv 3', value: 3, isUse: true } },
        // { label: 'Lv 4', value: 4, isUse: true } },
        // { label: 'Lv 5', value: 5, isUse: true } },
        // { label: 'Lv 6', value: 6, isUse: true } },
        // { label: 'Lv 7', value: 7, isUse: true } },
        // { label: 'Lv 8', value: 8, isUse: true } },
        // { label: 'Lv 9', value: 9, isUse: true } },
      ],
    },
    {
      label: 'Dagger Practice 10',
      name: 'Dagger Throwing Practice',
      inputType: 'selectButton',
      dropdown: [
        { label: 'Yes', value: 10, isUse: true, bonus: { x_atk: 10 * 3 } },
        { label: 'No', value: 0, isUse: false },
        // { label: 'Lv 1', value: 1, isUse: true, bonus: { x_atk: 1 * 3 } },
        // { label: 'Lv 2', value: 2, isUse: true, bonus: { x_atk: 2 * 3 } },
        // { label: 'Lv 3', value: 3, isUse: true, bonus: { x_atk: 3 * 3 } },
        // { label: 'Lv 4', value: 4, isUse: true, bonus: { x_atk: 4 * 3 } },
        // { label: 'Lv 5', value: 5, isUse: true, bonus: { x_atk: 5 * 3 } },
        // { label: 'Lv 6', value: 6, isUse: true, bonus: { x_atk: 6 * 3 } },
        // { label: 'Lv 7', value: 7, isUse: true, bonus: { x_atk: 7 * 3 } },
        // { label: 'Lv 8', value: 8, isUse: true, bonus: { x_atk: 8 * 3 } },
        // { label: 'Lv 9', value: 9, isUse: true, bonus: { x_atk: 9 * 3 } },
      ],
    },
    {
      label: 'Throw Huuma 5',
      name: 'Throw Huuma Shuriken',
      inputType: 'selectButton',
      dropdown: [
        { label: 'Yes', value: 5, isUse: true },
        { label: 'No', value: 0, isUse: false },
        // { label: 'Lv 1', value: 1, isUse: true },
        // { label: 'Lv 2', value: 2, isUse: true },
        // { label: 'Lv 3', value: 3, isUse: true },
        // { label: 'Lv 4', value: 4, isUse: true },
        // { label: 'Lv 5', value: 5, isUse: true },
      ],
    },
  ];
}
