import { ClassName } from './_class-name';
import { ActiveSkillModel, AtkSkillModel, CharacterBase, PassiveSkillModel } from './_character-base.abstract';

const jobBonusTable: Record<number, [number, number, number, number, number, number]> = {};

export class Swordman extends CharacterBase {
  protected readonly CLASS_NAME = ClassName.Swordman;
  protected readonly JobBonusTable = jobBonusTable;

  protected readonly initialStatusPoint = 40;
  protected readonly classNames = ['Swordman', 'Swordman Cls', 'Swordman Class'];
  protected readonly _atkSkillList: AtkSkillModel[] = [];
  protected readonly _activeSkillList: ActiveSkillModel[] = [
    {
      label: 'Magnum Break 10',
      name: 'Magnum Break',
      inputType: 'selectButton',
      dropdown: [
        { label: 'Yes', value: 10, isUse: true, bonus: { p_element_fire: 20 } },
        { label: 'No', value: 0, isUse: false },
      ],
    },
  ];
  protected readonly _passiveSkillList: PassiveSkillModel[] = [
    {
      label: 'Sword M. 10',
      name: 'Sword Mastery',
      inputType: 'selectButton',
      isMasteryAtk: true,
      dropdown: [
        { label: 'Yes', value: 10, skillLv: 10, isUse: true, bonus: { x_dagger_atk: 40, x_sword_atk: 40 } },
        { label: 'No', value: 0, isUse: false },
      ],
    },
    {
      label: 'Two-Hand M. 10',
      name: 'Two-Handed Sword Mastery',
      inputType: 'selectButton',
      isMasteryAtk: true,
      dropdown: [
        { label: 'Yes', value: 10, skillLv: 10, isUse: true, bonus: { x_2handSword_atk: 40 } },
        { label: 'No', value: 0, isUse: false },
      ],
    },
    {
      label: 'Bash',
      name: 'Bash',
      inputType: 'dropdown',
      dropdown: [
        { label: '0', value: 0, isUse: false },
        { label: '1', value: 1, skillLv: 1, isUse: true },
        { label: '2', value: 2, skillLv: 2, isUse: true },
        { label: '3', value: 3, skillLv: 3, isUse: true },
        { label: '4', value: 4, skillLv: 4, isUse: true },
        { label: '5', value: 5, skillLv: 5, isUse: true },
        { label: '6', value: 6, skillLv: 6, isUse: true },
        { label: '7', value: 7, skillLv: 7, isUse: true },
        { label: '8', value: 8, skillLv: 8, isUse: true },
        { label: '9', value: 9, skillLv: 9, isUse: true },
        { label: '10', value: 10, skillLv: 10, isUse: true },
      ],
    },
  ];
}