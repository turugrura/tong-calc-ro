import { ClassName } from './_class-name';
import { ActiveSkillModel, AtkSkillModel, CharacterBase, PassiveSkillModel } from './_character-base.abstract';

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
      inputType: 'selectButton',
      label: 'Improve 10',
      name: 'Improve Concentration',
      dropdown: [
        { label: 'Yes', value: 10, skillLv: 10, isUse: true, bonus: { agiBoost: 12, dexBoost: 12 } },
        { label: 'No', value: 0, isUse: false },
      ],
    },
  ];
  protected _passiveSkillList: PassiveSkillModel[] = [
    {
      label: "Owl's Eye 10",
      name: "Owl's Eye",
      inputType: 'selectButton',
      isEquipAtk: true,
      dropdown: [
        { label: 'Yes', value: 10, skillLv: 10, isUse: true, bonus: { dex: 10 } },
        { label: 'No', value: 0, isUse: false },
      ],
    },
    {
      label: "Vulture's Eye 10",
      name: "Vulture's Eye",
      inputType: 'selectButton',
      isEquipAtk: true,
      dropdown: [
        { label: 'Yes', value: 10, skillLv: 10, isUse: true, bonus: { hit: 10 } },
        { label: 'No', value: 0, isUse: false },
      ],
    },
    {
      label: 'Double Strafe',
      name: 'Double Strafe',
      inputType: 'dropdown',
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
