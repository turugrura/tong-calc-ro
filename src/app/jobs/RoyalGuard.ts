import { ClassName } from './_class-name';
import { ActiveSkillModel, AtkSkillFormulaInput, AtkSkillModel, PassiveSkillModel } from './_character-base.abstract';
import { Paladin } from './Paladin';
import { ElementType } from '../constants/element-type.const';
import { AdditionalBonusInput, InfoForClass } from '../models/info-for-class.model';
import { ShieldSpellFn } from '../constants/share-active-skills';

const jobBonusTable: Record<number, [number, number, number, number, number, number]> = {
  1: [0, 0, 0, 0, 0, 0],
  2: [0, 0, 1, 0, 0, 0],
  3: [0, 0, 1, 1, 0, 0],
  4: [1, 0, 1, 1, 0, 0],
  5: [1, 0, 1, 2, 0, 0],
  6: [1, 0, 1, 2, 1, 0],
  7: [1, 0, 1, 2, 1, 0],
  8: [1, 0, 1, 2, 1, 0],
  9: [1, 0, 2, 2, 1, 0],
  10: [1, 0, 2, 2, 1, 0],
  11: [1, 0, 2, 3, 1, 0],
  12: [1, 0, 2, 3, 1, 0],
  13: [2, 0, 2, 3, 1, 0],
  14: [2, 0, 2, 3, 2, 0],
  15: [2, 0, 2, 3, 2, 0],
  16: [2, 0, 2, 3, 2, 1],
  17: [2, 0, 2, 3, 2, 1],
  18: [2, 0, 2, 3, 2, 1],
  19: [2, 0, 2, 4, 2, 1],
  20: [2, 0, 2, 4, 3, 1],
  21: [2, 0, 2, 4, 3, 1],
  22: [2, 0, 2, 4, 3, 1],
  23: [2, 1, 2, 4, 3, 1],
  24: [2, 1, 2, 5, 3, 1],
  25: [2, 1, 2, 5, 3, 1],
  26: [2, 1, 2, 6, 3, 1],
  27: [2, 1, 3, 6, 3, 1],
  28: [2, 1, 3, 6, 3, 1],
  29: [2, 1, 3, 6, 3, 1],
  30: [3, 1, 3, 6, 3, 1],
  31: [3, 1, 3, 6, 4, 1],
  32: [3, 1, 3, 6, 4, 1],
  33: [3, 1, 3, 6, 4, 2],
  34: [3, 2, 3, 6, 4, 2],
  35: [3, 2, 3, 6, 4, 2],
  36: [3, 2, 3, 6, 4, 2],
  37: [3, 2, 3, 7, 4, 2],
  38: [3, 2, 3, 8, 4, 2],
  39: [3, 2, 3, 8, 4, 2],
  40: [4, 2, 3, 8, 4, 2],
  41: [4, 2, 4, 8, 4, 2],
  42: [4, 2, 5, 8, 4, 2],
  43: [4, 2, 5, 8, 4, 2],
  44: [4, 2, 5, 8, 5, 2],
  45: [5, 2, 5, 8, 5, 2],
  46: [5, 2, 5, 9, 5, 2],
  47: [5, 2, 5, 9, 5, 2],
  48: [6, 2, 5, 9, 5, 2],
  49: [6, 2, 5, 9, 6, 2],
  50: [6, 2, 5, 9, 6, 2],
  51: [6, 3, 5, 9, 6, 2],
  52: [6, 3, 5, 9, 6, 2],
  53: [6, 3, 6, 9, 6, 2],
  54: [6, 3, 6, 9, 6, 3],
  55: [6, 3, 6, 9, 6, 3],
  56: [6, 3, 6, 9, 7, 3],
  57: [6, 3, 6, 9, 7, 3],
  58: [7, 3, 6, 9, 7, 3],
  59: [7, 3, 7, 9, 7, 3],
  60: [7, 3, 7, 10, 7, 3],
  61: [7, 3, 7, 10, 7, 3],
  62: [7, 3, 7, 10, 7, 3],
  63: [7, 3, 7, 10, 7, 3],
  64: [7, 3, 7, 10, 7, 3],
  65: [8, 3, 8, 10, 8, 3],
  66: [8, 3, 8, 10, 8, 3],
  67: [8, 3, 8, 10, 8, 3],
  68: [8, 3, 8, 10, 8, 3],
  69: [8, 3, 8, 10, 8, 3],
  70: [9, 3, 9, 10, 9, 3],
};

export class RoyalGuard extends Paladin {
  protected override CLASS_NAME = ClassName.RoyalGuard;
  protected override JobBonusTable = jobBonusTable;

  protected readonly classNames3rd = [ClassName.Only_3rd, ClassName.RoyalGuard];
  protected readonly atkSkillList3rd: AtkSkillModel[] = [
    {
      name: 'Banishing Point',
      label: 'Banishing Point Lv10',
      value: 'Banishing Point==10',
      values: ['[Improved] Banishing Point==10'],
      acd: 0,
      fct: 0,
      vct: 0,
      cd: 0,
      formula: (input: AtkSkillFormulaInput): number => {
        const { model, skillLevel } = input;
        const baseLevel = model.level;
        const bashLv = this.learnLv('Bash');

        if (this.isSkillActive('Grand Judgement')) {
          return skillLevel * 180 + bashLv * 70;
        }

        return (skillLevel * 80 + bashLv * 50) * (baseLevel / 100);
      },
    },
    {
      name: 'Genesis Ray',
      label: 'Genesis Ray Lv10',
      value: 'Genesis Ray==10',
      values: ['[Improved] Genesis Ray==10'],
      acd: 1,
      fct: 0.5,
      vct: 6.5,
      cd: 2,
      hit: 7,
      isMatk: true,
      getElement: () => {
        if (this.isSkillActive('Inspiration')) return ElementType.Neutral;

        return ElementType.Holy;
      },
      formula: (input: AtkSkillFormulaInput): number => {
        const { model, skillLevel, status } = input;
        const baseLevel = model.level;
        const totalInt = status.totalInt;
        if (this.isSkillActive('Inspiration')) {
          return (skillLevel * 300 + totalInt * 3) * (baseLevel / 100);
        }

        return (skillLevel * 230 + totalInt * 2) * (baseLevel / 100);
      },
    },
    {
      name: 'Over Brand',
      label: 'Over Brand Lv5',
      value: 'Over Brand==5',
      values: ['[Improved] Over Brand==5'],
      acd: 1,
      fct: 0.5,
      vct: 0,
      cd: 0.3,
      isMelee: true,
      hit: 3,
      formula: (input: AtkSkillFormulaInput): number => {
        const { model, skillLevel, status } = input;
        const baseLevel = model.level;
        const { totalStr, totalDex } = status;
        const moonSlasherBonus = this.isSkillActive('Moon Slasher') ? 150 : 0;

        return (skillLevel * (300 + moonSlasherBonus) + totalStr + totalDex) * (baseLevel / 100);
      },
    },
    {
      name: 'Shield Press',
      label: 'Shield Press Lv10',
      value: 'Shield Press==10',
      acd: 0,
      fct: 0,
      vct: 0,
      cd: 2,
      isMelee: true,
      hit: 5,
      verifyItemFn: ({ model }) => !model.shield ? 'Shield' : '',
      formula: (input: AtkSkillFormulaInput): number => {
        const { model, skillLevel, status, equipmentBonus } = input;
        const baseLevel = model.level;
        const { totalStr, totalVit } = status;
        const { weight = 0, refine = 0 } = equipmentBonus.shield || {};

        if (this.isSkillActive('Shield Shooting')) {
          const shieldMastLv = this.learnLv('Shield Mastery');
          return (totalStr + weight + skillLevel * (260 + shieldMastLv * 15)) * (baseLevel / 100) + totalVit * refine;
        }

        return (totalStr + weight + skillLevel * 200) * (baseLevel / 100) + totalVit * refine;
      },
    },
    {
      name: 'Cannon Spear',
      label: 'Cannon Spear Lv5',
      value: 'Cannon Spear==5',
      acd: 0,
      fct: 0,
      vct: 0,
      cd: 2,
      canCri: true,
      criDmgPercentage: 0.5,
      formula: (input: AtkSkillFormulaInput): number => {
        const { model, skillLevel, status } = input;
        const baseLevel = model.level;
        const { totalStr } = status;

        if (this.isSkillActive('Grand Judgement')) {
          return skillLevel * (200 + totalStr) * (baseLevel / 100);
        }

        return skillLevel * (50 + totalStr) * (baseLevel / 100);
      },
    },
    {
      name: 'Cannon Spear',
      label: '[Improved] Cannon Spear Lv5',
      value: '[Improved] Cannon Spear==5',
      acd: 0,
      fct: 0,
      vct: 0,
      cd: 1.7,
      canCri: true,
      criDmgPercentage: 0.5,
      formula: (input: AtkSkillFormulaInput): number => {
        const { model, skillLevel, status } = input;
        const baseLevel = model.level;
        const { totalStr } = status;
        if (this.isSkillActive('Grand Judgement')) {
          return skillLevel * (200 + totalStr) * (baseLevel / 100);
        }

        return skillLevel * (120 + totalStr) * (baseLevel / 100);
      },
    },
    {
      name: 'Earth Drive',
      label: 'Earth Drive Lv5',
      value: 'Earth Drive==5',
      values: ['[Improved] Earth Drive==5'],
      acd: 1,
      fct: 0,
      vct: 1,
      cd: 2.5,
      isMelee: true,
      hit: 5,
      formula: (input: AtkSkillFormulaInput): number => {
        const { model, status, skillLevel } = input;
        const baseLevel = model.level;
        const { totalVit, totalStr } = status;

        if (this.isSkillActive('Shield Shooting')) {
          const shieldMastLv = this.learnLv('Shield Mastery');
          return (totalVit + totalStr + skillLevel * (600 + shieldMastLv * 15)) * (baseLevel / 100);
        }

        return (totalVit + totalStr + skillLevel * 380) * (baseLevel / 100);
      },
    },
    {
      name: 'Moon Slasher',
      label: 'Moon Slasher Lv5',
      value: 'Moon Slasher==5',
      acd: 1,
      fct: 0,
      vct: 1,
      cd: 2,
      isMelee: true,
      hit: 5,
      formula: (input: AtkSkillFormulaInput): number => {
        const { model, skillLevel } = input;
        const baseLevel = model.level;
        const overbrandLv = this.learnLv('Over Brand');

        return (120 * skillLevel + overbrandLv * 80) * (baseLevel / 100);
      },
    },
  ];

  protected readonly activeSkillList3rd: ActiveSkillModel[] = [
    ShieldSpellFn(),
    {
      label: 'Earth Drive',
      name: 'Earth Drive',
      inputType: 'selectButton',
      isMasteryAtk: true,
      dropdown: [
        { label: 'Yes', value: 5, skillLv: 5, isUse: true, bonus: { p_pene_class_all: 25 } },
        { label: 'No', value: 0, isUse: false },
      ],
    },
    {
      label: 'Ride Peco',
      name: 'Ride Peco',
      inputType: 'selectButton',
      dropdown: [
        { label: 'Yes', value: 1, skillLv: 1, isUse: true, bonus: { ridePeco: 1 } },
        { label: 'No', value: 0, isUse: false },
      ],
    },
    {
      label: 'Inspiration 5',
      name: 'Inspiration',
      inputType: 'selectButton',
      isEquipAtk: true,
      dropdown: [
        {
          label: 'Yes',
          value: 1,
          skillLv: 1,
          isUse: true,
          bonus: { atk: 200, matk: 200, allStatus: 30, hit: 60, hpPercent: 20 },
        },
        { label: 'No', value: 0, isUse: false },
      ],
    },
    {
      label: 'Moon Slasher',
      name: 'Moon Slasher',
      inputType: 'selectButton',
      isMasteryAtk: true,
      dropdown: [
        { label: 'Yes', value: 5, isUse: true },
        { label: 'No', value: 0, isUse: false },
      ],
    },
  ];

  protected readonly passiveSkillList3rd: PassiveSkillModel[] = [
    {
      label: 'Shield Press',
      name: 'Shield Press',
      inputType: 'dropdown',
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
      label: 'Over Brand',
      name: 'Over Brand',
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
    {
      label: 'Inspiration',
      name: 'Inspiration',
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
    {
      label: 'Piety',
      name: 'Piety',
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
    {
      label: 'Moon Slasher',
      name: 'Moon Slasher',
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

    this.inheritSkills({
      activeSkillList: this.activeSkillList3rd,
      atkSkillList: this.atkSkillList3rd,
      passiveSkillList: this.passiveSkillList3rd,
      classNames: this.classNames3rd,
    });
  }

  override getMasteryAtk(info: InfoForClass): number {
    const { weapon } = info;
    const weaponType = weapon?.data?.typeName;
    const bonuses = this.bonuses?.masteryAtks || {};

    const b = this.getMasteryAtkByMonsterRace(info.monster.race);
    const c = this.getMasteryAtkByMonsterElement(info.monster.element);

    let sum = b.totalAtk + c.totalAtk;
    const spearMasteryLv = this.learnLv('Spear Mastery');
    if ((weaponType === 'spear' || weaponType === 'twohandSpear') && spearMasteryLv > 0) {
      sum += spearMasteryLv * 4;
      if (this.isSkillActive('Ride Peco')) sum += spearMasteryLv;
    }

    for (const [, bonus] of Object.entries(bonuses)) {
      sum += bonus[`x_${weaponType}_atk`] || 0;
    }

    return sum;
  }

  override setAdditionalBonus(params: AdditionalBonusInput) {
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

    if (this.isSkillActive('Ride Peco')) {
      totalBonus.decreaseSkillAspdPercent = (totalBonus.decreaseSkillAspdPercent || 0) + (50 - this.learnLv('Cavalier Mastery') * 10);

      if (typeName === 'spear' || typeName === 'twohandSpear') {
        totalBonus['sizePenalty_m'] = 100;
      }
    }

    if (this.isSkillActive('Spear Quicken')) {
      totalBonus.cri = (totalBonus.cri || 0) + 30;
      totalBonus.flee = (totalBonus.flee || 0) + 20;
      totalBonus.skillAspd = (totalBonus.skillAspd || 0) + 7;
      totalBonus.aspdPercent = (totalBonus.aspdPercent || 0) + 10;
    }

    return totalBonus;
  }
}
