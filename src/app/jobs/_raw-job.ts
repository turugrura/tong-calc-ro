import { ClassName } from './_class-name';
import { ActiveSkillModel, AtkSkillModel, PassiveSkillModel } from './_character-base.abstract';
import { InfoForClass } from '../models/info-for-class.model';
import { Swordman } from './Swordman';

const jobBonusTable: Record<number, [number, number, number, number, number, number]> = {};

export class RawJob extends Swordman {
  protected override CLASS_NAME = ClassName.DragonKnight;
  protected override JobBonusTable = jobBonusTable;

  protected override initialStatusPoint = 100;
  protected readonly classNames4th = [ClassName.DragonKnight];
  protected readonly atkSkillList4th: AtkSkillModel[] = [];
  protected readonly activeSkillList4th: ActiveSkillModel[] = [
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
  ];
  protected readonly passiveSkillList4th: PassiveSkillModel[] = [
    {
      label: 'Axe Boomerang',
      name: 'Axe Boomerang',
      inputType: 'dropdown',
      dropdown: [
        { label: '-', value: 0, isUse: false },
        { label: 'Lv 1', value: 1, isUse: true },
        { label: 'Lv 2', value: 2, isUse: true },
        { label: 'Lv 3', value: 3, isUse: true },
        { label: 'Lv 4', value: 4, isUse: true },
        { label: 'Lv 5', value: 5, isUse: true },
        { label: 'Lv 6', value: 6, isUse: true },
        { label: 'Lv 7', value: 7, isUse: true },
        { label: 'Lv 8', value: 8, isUse: true },
        { label: 'Lv 9', value: 9, isUse: true },
        { label: 'Lv 10', value: 10, isUse: true },
      ],
    },
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
  ];

  override getMasteryAtk(info: InfoForClass): number {
    const { weapon } = info;
    const weaponType = weapon?.data?.typeName;
    const bonuses = this.bonuses?.masteryAtks || {};

    let sum = 0;
    for (const [, bonus] of Object.entries(bonuses)) {
      sum += bonus[`x_${weaponType}_atk`] || 0; // x_spear_atk
    }

    return sum;
  }

  override setAdditionalBonus(params: InfoForClass) {
    const { totalBonus, weapon } = params;
    const { typeName } = weapon.data;

    const { masteryAtks, equipAtks } = this.bonuses;

    const prefixCondition = `${typeName}_`;
    for (const [_skillName, bonus] of Object.entries({ ...(masteryAtks || {}), ...(equipAtks || {}) })) {
      for (const [attr, value] of Object.entries(bonus)) {
        if (attr.startsWith(prefixCondition)) {
          const actualAttr = attr.replace(prefixCondition, '');
          totalBonus[actualAttr] += value;
        }
      }
    }

    return totalBonus;
  }

  constructor() {
    super();

    this.inheritSkills({
      activeSkillList: this.activeSkillList4th,
      atkSkillList: this.atkSkillList4th,
      passiveSkillList: this.passiveSkillList4th,
      classNames: this.classNames4th,
    });
  }
}
