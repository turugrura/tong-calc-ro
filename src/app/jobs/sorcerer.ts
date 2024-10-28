import { ElementType, ElementalMasterSpirit } from '../constants/element-type.const';
import { AdditionalBonusInput, InfoForClass } from '../models/info-for-class.model';
import { ClassName } from './_class-name';
import { ActiveSkillModel, AtkSkillFormulaInput, AtkSkillModel, PassiveSkillModel } from './_character-base.abstract';
import { Scholar } from './Scholar';
import { addBonus } from '../utils';

const jobBonusTable: Record<number, [number, number, number, number, number, number]> = {
  1: [0, 0, 0, 1, 0, 0],
  2: [0, 0, 0, 2, 0, 0],
  3: [0, 0, 0, 2, 1, 0],
  4: [0, 0, 1, 2, 1, 0],
  5: [0, 0, 1, 3, 1, 0],
  6: [0, 0, 1, 3, 1, 0],
  7: [0, 0, 1, 3, 1, 0],
  8: [0, 0, 1, 3, 1, 0],
  9: [0, 0, 1, 3, 1, 0],
  10: [1, 0, 1, 3, 1, 0],
  11: [2, 0, 1, 3, 1, 0],
  12: [2, 0, 1, 4, 1, 0],
  13: [2, 0, 1, 5, 1, 0],
  14: [2, 0, 2, 5, 1, 0],
  15: [2, 0, 2, 5, 2, 0],
  16: [2, 0, 2, 5, 2, 0],
  17: [2, 0, 2, 5, 2, 0],
  18: [2, 0, 2, 5, 2, 0],
  19: [2, 0, 2, 5, 3, 0],
  20: [2, 1, 2, 5, 3, 0],
  21: [2, 2, 2, 5, 3, 0],
  22: [2, 2, 2, 6, 3, 0],
  23: [2, 2, 3, 6, 3, 0],
  24: [2, 2, 3, 6, 4, 0],
  25: [2, 2, 3, 6, 4, 0],
  26: [2, 2, 3, 6, 4, 0],
  27: [2, 2, 3, 6, 4, 0],
  28: [2, 2, 3, 6, 4, 0],
  29: [2, 2, 3, 6, 4, 0],
  30: [2, 2, 3, 7, 4, 0],
  31: [2, 2, 3, 7, 5, 0],
  32: [2, 2, 4, 7, 5, 0],
  33: [3, 2, 4, 7, 5, 0],
  34: [3, 2, 4, 7, 5, 0],
  35: [3, 2, 4, 7, 5, 0],
  36: [3, 2, 4, 7, 5, 0],
  37: [3, 2, 4, 7, 5, 0],
  38: [3, 2, 4, 7, 5, 0],
  39: [3, 2, 4, 8, 5, 0],
  40: [3, 2, 4, 8, 6, 0],
  41: [3, 3, 4, 8, 6, 0],
  42: [3, 3, 4, 8, 6, 0],
  43: [3, 3, 4, 8, 6, 0],
  44: [3, 3, 4, 8, 7, 0],
  45: [3, 3, 5, 8, 7, 0],
  46: [3, 3, 5, 9, 7, 0],
  47: [3, 3, 5, 9, 7, 1],
  48: [3, 3, 5, 9, 7, 2],
  49: [3, 3, 5, 9, 7, 3],
  50: [3, 3, 5, 10, 7, 3],
  51: [3, 3, 5, 10, 8, 3],
  52: [3, 3, 5, 10, 8, 3],
  53: [4, 3, 5, 10, 8, 3],
  54: [4, 3, 5, 10, 8, 3],
  55: [4, 4, 5, 10, 8, 3],
  56: [4, 4, 5, 10, 8, 3],
  57: [4, 4, 6, 10, 8, 3],
  58: [4, 4, 6, 10, 8, 3],
  59: [4, 4, 6, 10, 9, 3],
  60: [4, 4, 6, 11, 9, 3],
  61: [4, 4, 6, 11, 9, 3],
  62: [4, 4, 6, 11, 9, 3],
  63: [4, 4, 6, 11, 9, 3],
  64: [4, 4, 6, 11, 9, 3],
  65: [4, 4, 7, 12, 9, 4],
  66: [4, 4, 7, 12, 9, 4],
  67: [4, 4, 7, 12, 9, 4],
  68: [4, 4, 7, 12, 9, 4],
  69: [4, 4, 7, 12, 9, 4],
  70: [4, 4, 8, 13, 9, 5],
};

enum ElementalSpiritValue {
  Agni_2 = 12,
  Aqua_2 = 22,
  Ventus_2 = 32,
  Tera_2 = 42,
}

export class Sorcerer extends Scholar {
  protected override CLASS_NAME = ClassName.Sorcerer;
  protected override JobBonusTable = jobBonusTable;

  private readonly classNames3rd = [ClassName.Only_3rd, ClassName.Sorcerer];
  private readonly atkSkillList3rd: AtkSkillModel[] = [
    {
      name: 'Fist Spell',
      label: 'Fist Spell Lv10',
      value: 'Fist Spell==10',
      levelList: [
        { label: 'Fist Spell Lv10 (Fire Bolt Lv10)', value: 'Fist Spell Fire Bolt==10' },
        { label: 'Fist Spell Lv10 (Cold Bolt Lv10)', value: 'Fist Spell Cold Bolt==10' },
        { label: 'Fist Spell Lv10 (Lightening Bolt Lv10)', value: 'Fist Spell Lightening Bolt==10' },
      ],
      fct: 0,
      vct: 0,
      cd: 0,
      acd: 0,
      isMatk: true,
      getElement(skillValue) {
        const map = {
          'Fist Spell Fire Bolt==10': ElementType.Fire,
          'Fist Spell Cold Bolt==10': ElementType.Water,
          'Fist Spell Lightening Bolt==10': ElementType.Wind,
        };

        return map[skillValue];
      },
      treatedAsSkillNameFn(skillValue) {
        const map = {
          'Fist Spell Fire Bolt==10': 'Fire Bolt==10',
          'Fist Spell Cold Bolt==10': 'Cold Bolt==10',
          'Fist Spell Lightening Bolt==10': 'Lightening Bolt==10',
        };

        return map[skillValue];
      },
      formula: (_input: AtkSkillFormulaInput): number => {
        return 100;
      },
      finalDmgFormula(input) {
        const boltLv = 10;

        return input.damage * (boltLv + 2);
      },
    },
    {
      name: 'Diamond Dust',
      label: 'Diamond Dust Lv 5',
      value: 'Diamond Dust==5',
      fct: 0,
      vct: 7,
      cd: 5,
      acd: 1,
      element: ElementType.Water,
      isMatk: true,
      hit: 2,
      formula: (input: AtkSkillFormulaInput): number => {
        const { model, skillLevel, status } = input;
        const baseLevel = model.level;
        const totalInt = status.totalInt;
        const bonus = this.learnLv('Frost Weapon') * 300;
        const summonerBonus = this.isSummon(ElementalSpiritValue.Aqua_2) ? model.jobLevel * 5 : 0

        return ((skillLevel + 2) * totalInt + bonus) * (baseLevel / 100) + summonerBonus;
      },
    },
    {
      name: 'Earth Grave',
      label: 'Earth Grave Lv 5',
      value: 'Earth Grave==5',
      fct: 1,
      vct: 3,
      cd: 5,
      acd: 1,
      element: ElementType.Earth,
      isMatk: true,
      formula: (input: AtkSkillFormulaInput): number => {
        const { model, skillLevel, status } = input;
        const baseLevel = model.level;
        const totalInt = status.totalInt;
        const bonus = this.learnLv('Seismic Weapon') * 300;
        const summonerBonus = this.isSummon(ElementalSpiritValue.Tera_2) ? model.jobLevel * 5 : 0

        return ((skillLevel + 2) * totalInt + bonus) * (baseLevel / 100) + summonerBonus;
      },
    },
    {
      name: 'Psychic Wave',
      label: 'Psychic Wave Lv5',
      value: 'Psychic Wave==5',
      fct: 0.6,
      vct: 12,
      cd: 5,
      acd: 1,
      getElement: () => {
        const spiritLv = this.activeSkillLv('_ElementalMaster_spirit');
        if (spiritLv) return ElementalMasterSpirit[spiritLv] || ElementType.Neutral

        const elementalMapper = {
          [ElementalSpiritValue.Agni_2]: ElementType.Fire,
          [ElementalSpiritValue.Aqua_2]: ElementType.Water,
          [ElementalSpiritValue.Ventus_2]: ElementType.Wind,
          [ElementalSpiritValue.Tera_2]: ElementType.Earth,
        }
        const eleSpiritVal = this.activeSkillLv('_Sorcerer_Elemental_Spirit')
        if (eleSpiritVal) return elementalMapper[eleSpiritVal] || ElementType.Neutral

        return ElementType.Neutral;
      },
      totalHit: 7,
      isMatk: true,
      formula: (input: AtkSkillFormulaInput): number => {
        const { model, skillLevel, status } = input;
        const baseLevel = model.level;
        const totalInt = status.totalInt;

        return (70 * skillLevel + 3 * totalInt) * (baseLevel / 100);
      },
      finalDmgFormula(input) {
        const weaponType = input.weapon.data?.typeName;
        if (weaponType === 'book' || weaponType === 'rod' || weaponType === 'twohandRod') {
          return input.damage * 2;
        }

        return input.damage;
      },
    },
    {
      name: 'Varetyr Spear',
      label: 'Varetyr Spear Lv10',
      value: 'Varetyr Spear==10',
      fct: 1,
      vct: 4,
      cd: 5,
      acd: 1,
      element: ElementType.Wind,
      isMatk: true,
      hit: 3,
      formula: (input: AtkSkillFormulaInput): number => {
        const { model, skillLevel, status } = input;
        const baseLevel = model.level;
        const totalInt = status.totalInt;
        const strikingLvl = this.learnLv('Striking');
        const endowLvl = this.learnLv('Lightning Loader');
        const summonerBonus = this.isSummon(ElementalSpiritValue.Ventus_2) ? model.jobLevel * 5 : 0

        return (((skillLevel + 4) * totalInt) / 2 + (strikingLvl + endowLvl) * 150) * (baseLevel / 100) + summonerBonus;
      },
    },
    {
      name: 'Poison Burst',
      label: 'Poison Burst Lv5',
      value: 'Poison Burst==5',
      fct: 0,
      vct: 6,
      cd: 2,
      acd: 1,
      element: ElementType.Poison,
      isMatk: true,
      formula: (input: AtkSkillFormulaInput): number => {
        const { model, skillLevel, status } = input;
        const baseLevel = model.level;
        const totalInt = status.totalInt;
        const summonerBonus = this.isSummon(ElementalSpiritValue.Tera_2) ? model.jobLevel * 5 : 0

        return (1000 + skillLevel * 300 + totalInt) * (baseLevel / 100) + summonerBonus;
      },
    },
  ];
  private readonly activeSkillList3rd: ActiveSkillModel[] = [
    {
      name: '_Sorcerer_Elemental_Spirit',
      label: 'Elemental Spirit',
      inputType: 'dropdown',
      dropdown: [
        { label: '-', isUse: false, value: 0 },
        { label: 'Agni Lv 2', isUse: true, value: ElementalSpiritValue.Agni_2, },
        { label: 'Aqua Lv 2', isUse: true, value: ElementalSpiritValue.Aqua_2 },
        { label: 'Ventus Lv 2', isUse: true, value: ElementalSpiritValue.Ventus_2 },
        { label: 'Tera Lv 2', isUse: true, value: ElementalSpiritValue.Tera_2, },
      ],
    },
  ];
  private readonly passiveSkillList3rd: PassiveSkillModel[] = [
    {
      name: 'Striking',
      label: 'Striking',
      inputType: 'dropdown',
      dropdown: [
        { label: '-', isUse: false, value: 0 },
        { label: 'Lv 1', isUse: true, value: 1 },
        { label: 'Lv 2', isUse: true, value: 2 },
        { label: 'Lv 3', isUse: true, value: 3 },
        { label: 'Lv 4', isUse: true, value: 4 },
        { label: 'Lv 5', isUse: true, value: 5 },
      ],
    },
    {
      name: 'Diamond Dust',
      label: 'Diamond Dust',
      inputType: 'dropdown',
      dropdown: [
        { label: '-', isUse: false, value: 0 },
        { label: 'Lv 1', isUse: true, value: 1 },
        { label: 'Lv 2', isUse: true, value: 2 },
        { label: 'Lv 3', isUse: true, value: 3 },
        { label: 'Lv 4', isUse: true, value: 4 },
        { label: 'Lv 5', isUse: true, value: 5 },
      ],
    },
    {
      name: 'Earth Grave',
      label: 'Earth Grave',
      inputType: 'dropdown',
      dropdown: [
        { label: '-', isUse: false, value: 0 },
        { label: 'Lv 1', isUse: true, value: 1 },
        { label: 'Lv 2', isUse: true, value: 2 },
        { label: 'Lv 3', isUse: true, value: 3 },
        { label: 'Lv 4', isUse: true, value: 4 },
        { label: 'Lv 5', isUse: true, value: 5 },
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

  override getMasteryAtk(params: InfoForClass): number {
    if (!this.bonuses?.masteryAtks) return 0;

    const { weapon } = params;
    const { typeName } = weapon.data;

    let atk = 0;
    for (const [_skillName, bonus] of Object.entries(this.bonuses.masteryAtks)) {
      atk += bonus[`${typeName}_atk`] || 0;
    }

    return atk;
  }

  override setAdditionalBonus(params: AdditionalBonusInput) {
    if (!this.bonuses?.masteryAtks) return params.totalBonus;

    const { totalBonus, weapon } = params;
    const { typeName } = weapon.data;

    const { masteryAtks, equipAtks } = this.bonuses;

    let aspdPercent = 0;
    for (const [_skillName, bonus] of Object.entries({ ...masteryAtks, ...equipAtks })) {
      aspdPercent += bonus[`${typeName}_aspdPercent`] || 0;
    }
    totalBonus.aspdPercent = (totalBonus.aspdPercent || 0) + aspdPercent;

    if (!this.activeSkillLv('_ElementalMaster_spirit')) {
      if (this.isSummon(ElementalSpiritValue.Agni_2)) {
        addBonus(totalBonus, 'atk', 120)
      } else if (this.isSummon(ElementalSpiritValue.Aqua_2)) {
        addBonus(totalBonus, 'matk', 80)
      } else if (this.isSummon(ElementalSpiritValue.Ventus_2)) {
        addBonus(totalBonus, 'skillAspd', 5)
        addBonus(totalBonus, 'fct', 1)
      } else if (this.isSummon(ElementalSpiritValue.Tera_2)) {
        addBonus(totalBonus, 'hpPercent', 10)
      }
    }

    return totalBonus;
  }

  private isSummon(spirit: ElementalSpiritValue) {
    if (this.activeSkillLv('_ElementalMaster_spirit')) return false;

    return this.activeSkillLv('_Sorcerer_Elemental_Spirit') === spirit
  }
}
