import { ElementType } from '../constants/element-type.const';
import { ClassName } from './_class-name';
import { ActiveSkillModel, AtkSkillModel, CharacterBase, PassiveSkillModel } from './_character-base.abstract';

const jobBonusTable: Record<number, [number, number, number, number, number, number]> = {};

export class Mage extends CharacterBase {
  protected readonly CLASS_NAME = ClassName.Mage;
  protected readonly JobBonusTable = jobBonusTable;

  protected readonly initialStatusPoint = 40;
  protected readonly classNames = ['Mage', 'Mage Class', 'Mage Cls'];
  protected readonly _atkSkillList: AtkSkillModel[] = [
    {
      label: 'Cold Bolt Lv1',
      name: 'Cold Bolt',
      acd: 0,
      cd: 0,
      fct: 0,
      vct: 0,
      isMatk: true,
      isDevMode: true,
      element: ElementType.Water,
      value: 'Cold Bolt==1',
      formula: (): number => {
        return 100;
      },
    },
  ];
  protected readonly _activeSkillList: ActiveSkillModel[] = [];
  protected readonly _passiveSkillList: PassiveSkillModel[] = [
    {
      inputType: 'dropdown',
      label: 'Safety Wall',
      name: 'Safety Wall',
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
}
