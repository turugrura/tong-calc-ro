import { ClassName } from './_class-name';
import { ActiveSkillModel, AtkSkillModel, CharacterBase, PassiveSkillModel } from './_character-base.abstract';

const jobBonusTable: Record<number, [number, number, number, number, number, number]> = {};

export class Swordman extends CharacterBase {
  protected readonly CLASS_NAME = ClassName.Swordman;
  protected readonly JobBonusTable = jobBonusTable;

  protected readonly initialStatusPoint = 40;
  protected readonly classNames = [ClassName.Swordman];
  protected readonly _atkSkillList: AtkSkillModel[] = [];
  protected readonly _activeSkillList: ActiveSkillModel[] = [
    {
      label: 'Magnum Break 10',
      name: 'Magnum Break',
      inputType: 'selectButton',
      dropdown: [
        { label: 'Yes', value: 10, isUse: true, bonus: { magnumBreakPsedoBonus: 1 } },
        { label: 'No', value: 0, isUse: false },
      ],
    },
  ];
  protected readonly _passiveSkillList: PassiveSkillModel[] = [
    {
      label: 'Sword Mastery',
      name: 'Sword Mastery',
      inputType: 'dropdown',
      isMasteryAtk: true,
      dropdown: [
        { label: '-', value: 0, isUse: false },
        { label: 'Lv 1', value: 1, skillLv: 1, isUse: true, bonus: { x_dagger_atk: 1 * 4, x_sword_atk: 1 * 4 } },
        { label: 'Lv 2', value: 2, skillLv: 2, isUse: true, bonus: { x_dagger_atk: 2 * 4, x_sword_atk: 2 * 4 } },
        { label: 'Lv 3', value: 3, skillLv: 3, isUse: true, bonus: { x_dagger_atk: 3 * 4, x_sword_atk: 3 * 4 } },
        { label: 'Lv 4', value: 4, skillLv: 4, isUse: true, bonus: { x_dagger_atk: 4 * 4, x_sword_atk: 4 * 4 } },
        { label: 'Lv 5', value: 5, skillLv: 5, isUse: true, bonus: { x_dagger_atk: 5 * 4, x_sword_atk: 5 * 4 } },
        { label: 'Lv 6', value: 6, skillLv: 6, isUse: true, bonus: { x_dagger_atk: 6 * 4, x_sword_atk: 6 * 4 } },
        { label: 'Lv 7', value: 7, skillLv: 7, isUse: true, bonus: { x_dagger_atk: 7 * 4, x_sword_atk: 7 * 4 } },
        { label: 'Lv 8', value: 8, skillLv: 8, isUse: true, bonus: { x_dagger_atk: 8 * 4, x_sword_atk: 8 * 4 } },
        { label: 'Lv 9', value: 9, skillLv: 9, isUse: true, bonus: { x_dagger_atk: 9 * 4, x_sword_atk: 9 * 4 } },
        { label: 'Lv 10', value: 10, skillLv: 10, isUse: true, bonus: { x_dagger_atk: 10 * 4, x_sword_atk: 10 * 4 } },
      ],
    },
    {
      label: 'Two-Hand Mastery',
      name: 'Two-Handed Sword Mastery',
      inputType: 'dropdown',
      isMasteryAtk: true,
      dropdown: [
        { label: '-', value: 0, isUse: false },
        { label: 'Lv 1', value: 1, skillLv: 1, isUse: true, bonus: { x_twohandSword_atk: 1 * 4 } },
        { label: 'Lv 2', value: 2, skillLv: 2, isUse: true, bonus: { x_twohandSword_atk: 2 * 4 } },
        { label: 'Lv 3', value: 3, skillLv: 3, isUse: true, bonus: { x_twohandSword_atk: 3 * 4 } },
        { label: 'Lv 4', value: 4, skillLv: 4, isUse: true, bonus: { x_twohandSword_atk: 4 * 4 } },
        { label: 'Lv 5', value: 5, skillLv: 5, isUse: true, bonus: { x_twohandSword_atk: 5 * 4 } },
        { label: 'Lv 6', value: 6, skillLv: 6, isUse: true, bonus: { x_twohandSword_atk: 6 * 4 } },
        { label: 'Lv 7', value: 7, skillLv: 7, isUse: true, bonus: { x_twohandSword_atk: 7 * 4 } },
        { label: 'Lv 8', value: 8, skillLv: 8, isUse: true, bonus: { x_twohandSword_atk: 8 * 4 } },
        { label: 'Lv 9', value: 9, skillLv: 9, isUse: true, bonus: { x_twohandSword_atk: 9 * 4 } },
        { label: 'Lv 10', value: 10, skillLv: 10, isUse: true, bonus: { x_twohandSword_atk: 10 * 4 } },
      ],
    },
    {
      label: 'Bash',
      name: 'Bash',
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
      label: 'Increase HP Recovery',
      name: 'Increase HP Recovery',
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
}
