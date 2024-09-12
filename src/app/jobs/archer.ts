import { ClassName } from './_class-name';
import { ActiveSkillModel, AtkSkillModel, CharacterBase, PassiveSkillModel } from './_character-base.abstract';
import { DoubleStrafeFn, OwlsEyeFn, VulturesEyeFn } from '../constants/share-passive-skills';

const jobBonusTable: Record<number, [number, number, number, number, number, number]> = {};

export class Archer extends CharacterBase {
  protected CLASS_NAME = ClassName.Archer;
  protected readonly JobBonusTable = jobBonusTable;

  protected initialStatusPoint = 100;
  protected classNames = [ClassName.Archer];
  protected _atkSkillList: AtkSkillModel[] = [];
  protected _activeSkillList: ActiveSkillModel[] = [
    {
      isEquipAtk: true,
      inputType: 'selectButton',
      label: 'Improve Concen 10',
      name: 'Improve Concentration',
      dropdown: [
        { label: 'Yes', value: 10, skillLv: 10, isUse: true, bonus: { agiBoost: 12, dexBoost: 12 } },
        { label: 'No', value: 0, isUse: false },
      ],
    },
  ];
  protected _passiveSkillList: PassiveSkillModel[] = [OwlsEyeFn(), VulturesEyeFn(), DoubleStrafeFn()];
}
