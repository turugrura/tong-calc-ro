import { ClassName } from './_class-name';
import { ActiveSkillModel, AtkSkillModel, CharacterBase, PassiveSkillModel } from './_character-base.abstract';
import { Swordman } from './swordman';
import { SpearMastery } from '../constants/share-passive-skills';
import { CavalierMastery } from '../constants/share-passive-skills/cavalier-mastery';

const jobBonusTable: Record<number, [number, number, number, number, number, number]> = {};

export class LordKnight extends CharacterBase {
  protected readonly CLASS_NAME = ClassName.LordKnight;
  protected readonly JobBonusTable = jobBonusTable;

  protected readonly initialStatusPoint = 40;
  protected readonly classNames = ['Hi-Class', 'Lord Knight', 'Lord Knight Cls', 'Lord Knight Class'];
  protected readonly _atkSkillList: AtkSkillModel[] = [];
  protected readonly _activeSkillList: ActiveSkillModel[] = [
    {
      label: 'Two hand Quick 10',
      name: 'Two hand Quicken',
      inputType: 'selectButton',
      dropdown: [
        {
          label: 'Yes',
          value: 10,
          skillLv: 10,
          isUse: true,
          bonus: { twohandSword_skillAspd: 7, twohandSword_cri: 12, twohandSword_hit: 20 },
        },
        { label: 'No', value: 0, isUse: false },
      ],
    },
  ];
  protected readonly _passiveSkillList: PassiveSkillModel[] = [
    SpearMastery,
    CavalierMastery,
    {
      label: 'Two hand Quick 10',
      name: 'Two hand Quicken',
      inputType: 'selectButton',
      dropdown: [
        { label: 'Yes', value: 10, skillLv: 10, isUse: true },
        { label: 'No', value: 0, isUse: false },
      ],
    },
    {
      label: 'Clashing Spiral',
      name: 'Clashing Spiral',
      inputType: 'dropdown',
      dropdown: [
        { label: '-', value: 0, isUse: false },
        { label: 'Lv 1', value: 1, isUse: true },
        { label: 'Lv 2', value: 2, isUse: true },
        { label: 'Lv 3', value: 3, isUse: true },
        { label: 'Lv 4', value: 4, isUse: true },
        { label: 'Lv 5', value: 5, isUse: true },
      ],
    },
    {
      label: 'Clashing Spiral',
      name: 'Clashing Spiral',
      inputType: 'dropdown',
      dropdown: [
        { label: '-', value: 0, isUse: false },
        { label: 'Lv 1', value: 1, skillLv: 1, isUse: true },
        { label: 'Lv 2', value: 2, skillLv: 2, isUse: true },
        { label: 'Lv 3', value: 3, skillLv: 3, isUse: true },
        { label: 'Lv 4', value: 4, skillLv: 4, isUse: true },
        { label: 'Lv 5', value: 5, skillLv: 5, isUse: true },
      ],
    },
  ];

  constructor() {
    super();

    this.inheritBaseClass(new Swordman());
  }
}
