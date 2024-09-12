import { ClassName } from './_class-name';
import { ActiveSkillModel, AtkSkillModel, CharacterBase, PassiveSkillModel } from './_character-base.abstract';
import { ElementType } from '../constants/element-type.const';

const jobBonusTable: Record<number, [number, number, number, number, number, number]> = {};

export class Taekwondo extends CharacterBase {
  protected readonly CLASS_NAME = ClassName.Taekwondo;
  protected readonly JobBonusTable = jobBonusTable;

  protected readonly initialStatusPoint = 40;
  protected readonly classNames = [ClassName.Taekwondo];
  protected readonly _atkSkillList: AtkSkillModel[] = [];
  protected readonly _activeSkillList: ActiveSkillModel[] = [
    {
      label: 'Seven Wind',
      name: 'Seven Wind',
      inputType: 'dropdown',
      dropdown: [
        { label: '-', value: 0, isUse: false },
        { label: '1 Earth', value: 1, isUse: true, bonus: { mildwind: 1, propertyAtk: ElementType.Earth } },
        { label: '2 Wind', value: 2, isUse: true, bonus: { mildwind: 1, propertyAtk: ElementType.Wind } },
        { label: '3 Water', value: 3, isUse: true, bonus: { mildwind: 1, propertyAtk: ElementType.Water } },
        { label: '4 Fire', value: 4, isUse: true, bonus: { mildwind: 1, propertyAtk: ElementType.Fire } },
        { label: '5 Ghost', value: 5, isUse: true, bonus: { mildwind: 1, propertyAtk: ElementType.Ghost } },
        { label: '6 Darkness', value: 6, isUse: true, bonus: { mildwind: 1, propertyAtk: ElementType.Dark } },
        { label: '7 Holy', value: 7, isUse: true, bonus: { mildwind: 1, propertyAtk: ElementType.Holy } },
      ],
    },
  ];
  protected readonly _passiveSkillList: PassiveSkillModel[] = [
    {
      inputType: 'dropdown',
      label: 'Run',
      name: 'Run',
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
      inputType: 'dropdown',
      label: 'Happy Break',
      name: 'Happy Break',
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
      inputType: 'dropdown',
      label: 'Peaceful Break',
      name: 'Peaceful Break',
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
