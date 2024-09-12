import { ElementType } from '../constants/element-type.const';
import { ClassName } from './_class-name';
import { ActiveSkillModel, AtkSkillModel, CharacterBase, PassiveSkillModel } from './_character-base.abstract';

const jobBonusTable: Record<number, [number, number, number, number, number, number]> = {};

export class Mage extends CharacterBase {
  protected readonly CLASS_NAME = ClassName.Mage;
  protected readonly JobBonusTable = jobBonusTable;

  protected readonly initialStatusPoint = 40;
  protected readonly classNames = [ClassName.Mage];
  protected readonly _atkSkillList: AtkSkillModel[] = [
    {
      label: 'Fire Bolt Lv10',
      name: 'Fire Bolt',
      value: 'Fire Bolt==10',
      acd: 2.8,
      fct: 1.2,
      vct: 3.2,
      cd: 0,
      totalHit: 10,
      isMatk: true,
      element: ElementType.Fire,
      formula: (): number => {
        return 100;
      },
    },
    {
      label: 'Cold Bolt Lv10',
      name: 'Cold Bolt',
      value: 'Cold Bolt==10',
      acd: 2.8,
      fct: 1.2,
      vct: 3.2,
      cd: 0,
      totalHit: 10,
      isMatk: true,
      element: ElementType.Water,
      formula: (): number => {
        return 100;
      },
    },
    {
      label: 'Lightening Bolt Lv10',
      name: 'Lightening Bolt',
      value: 'Lightening Bolt==10',
      acd: 2.8,
      fct: 1.2,
      vct: 3.2,
      cd: 0,
      totalHit: 10,
      isMatk: true,
      element: ElementType.Wind,
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
