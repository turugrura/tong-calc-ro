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
  protected readonly _passiveSkillList: PassiveSkillModel[] = [];
}
