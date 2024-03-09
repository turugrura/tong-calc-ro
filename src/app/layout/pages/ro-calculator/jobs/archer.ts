import { ClassName } from './_class-name';
import { ActiveSkillModel, AtkSkillModel, CharacterBase, PassiveSkillModel } from './_character-base.abstract';
import { DoubleStrafeFn, OwlsEyeFn, VulturesEyeFn } from '../constants/share-passive-skills';

const jobBonusTable: Record<number, [number, number, number, number, number, number]> = {};

export class Archer extends CharacterBase {
  protected readonly CLASS_NAME = ClassName.Archer;
  protected readonly JobBonusTable = jobBonusTable;

  protected initialStatusPoint = 100;
  protected classNames = ['Archer', 'Archer Cls', 'Archer Class'];
  protected _atkSkillList: AtkSkillModel[] = [];
  protected _activeSkillList: ActiveSkillModel[] = [
    {
      isEquipAtk: true,
      inputType: 'dropdown',
      label: 'Improve Concen',
      name: 'Improve Concentration',
      dropdown: [
        { label: '-', value: 0, isUse: false },
        { label: 'Lv 10', value: 10, skillLv: 10, isUse: true, bonus: { agiBoost: 12, dexBoost: 12 } },
      ],
    },
  ];
  protected _passiveSkillList: PassiveSkillModel[] = [OwlsEyeFn(), VulturesEyeFn(), DoubleStrafeFn()];
}
