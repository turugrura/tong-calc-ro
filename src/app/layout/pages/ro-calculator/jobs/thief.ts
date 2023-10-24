import { ClassName } from './_class-name';
import { ActiveSkillModel, AtkSkillModel, CharacterBase, PassiveSkillModel } from './_character-base.abstract';

const jobBonusTable: Record<number, [number, number, number, number, number, number]> = {};

export class Thief extends CharacterBase {
  protected readonly CLASS_NAME = ClassName.Thief;
  protected readonly JobBonusTable = jobBonusTable;

  protected readonly initialStatusPoint = 40;
  protected readonly classNames = ['Thief', 'Thief Cls', 'Thief Class'];
  protected readonly _atkSkillList: AtkSkillModel[] = [];
  protected readonly _activeSkillList: ActiveSkillModel[] = [];
  protected readonly _passiveSkillList: PassiveSkillModel[] = [
    {
      inputType: 'dropdown',
      label: 'Improve Dodge',
      name: 'Improve Dodge',
      isEquipAtk: true,
      dropdown: [
        { label: '-', value: 0, isUse: false },
        { label: 'Lv 1', value: 1, skillLv: 1, isUse: true, bonus: { flee: 4 } },
        { label: 'Lv 2', value: 2, skillLv: 2, isUse: true, bonus: { flee: 8 } },
        { label: 'Lv 3', value: 3, skillLv: 3, isUse: true, bonus: { flee: 12 } },
        { label: 'Lv 4', value: 4, skillLv: 4, isUse: true, bonus: { flee: 16 } },
        { label: 'Lv 5', value: 5, skillLv: 5, isUse: true, bonus: { flee: 20 } },
        { label: 'Lv 6', value: 6, skillLv: 6, isUse: true, bonus: { flee: 24 } },
        { label: 'Lv 7', value: 7, skillLv: 7, isUse: true, bonus: { flee: 28 } },
        { label: 'Lv 8', value: 8, skillLv: 8, isUse: true, bonus: { flee: 32 } },
        { label: 'Lv 9', value: 9, skillLv: 9, isUse: true, bonus: { flee: 36 } },
        { label: 'Lv 10', value: 10, skillLv: 10, isUse: true, bonus: { flee: 40 } },
      ],
    },
  ];
}
