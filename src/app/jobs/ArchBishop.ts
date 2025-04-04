import { ElementType } from '../constants/element-type.const';
import { RaceType } from '../constants/race-type.const';
import { InfoForClass } from '../models/info-for-class.model';
import { HighPriest } from './HighPriest';
import { ActiveSkillModel, AtkSkillFormulaInput, AtkSkillModel, PassiveSkillModel } from './_character-base.abstract';
import { ClassName } from './_class-name';

const jobBonusTable: Record<number, [number, number, number, number, number, number]> = {
  1: [0, 0, 0, 1, 0, 0],
  2: [0, 0, 0, 1, 0, 0],
  3: [0, 0, 1, 1, 0, 0],
  4: [0, 0, 1, 1, 0, 0],
  5: [0, 0, 1, 1, 1, 0],
  6: [0, 0, 1, 1, 1, 0],
  7: [0, 0, 1, 2, 1, 0],
  8: [0, 0, 1, 3, 1, 0],
  9: [0, 0, 1, 3, 1, 0],
  10: [0, 0, 2, 3, 1, 0],
  11: [0, 0, 3, 3, 1, 0],
  12: [0, 0, 3, 3, 1, 0],
  13: [0, 0, 3, 3, 1, 0],
  14: [0, 0, 3, 3, 2, 0],
  15: [0, 0, 3, 3, 3, 0],
  16: [0, 0, 3, 3, 3, 0],
  17: [0, 0, 3, 3, 3, 0],
  18: [1, 0, 3, 3, 3, 0],
  19: [2, 0, 3, 3, 3, 0],
  20: [2, 0, 3, 3, 3, 0],
  21: [2, 0, 3, 3, 3, 0],
  22: [2, 0, 3, 4, 3, 0],
  23: [2, 0, 3, 4, 3, 0],
  24: [3, 0, 3, 4, 3, 0],
  25: [3, 0, 3, 4, 3, 0],
  26: [3, 1, 3, 4, 3, 0],
  27: [3, 2, 3, 4, 3, 0],
  28: [4, 2, 3, 4, 3, 0],
  29: [4, 2, 3, 4, 3, 0],
  30: [4, 2, 3, 4, 3, 0],
  31: [4, 2, 3, 4, 3, 0],
  32: [4, 2, 3, 5, 3, 0],
  33: [4, 2, 3, 5, 3, 0],
  34: [4, 2, 4, 5, 3, 0],
  35: [4, 2, 4, 5, 3, 0],
  36: [4, 2, 4, 5, 4, 0],
  37: [4, 2, 4, 5, 4, 0],
  38: [4, 3, 4, 5, 4, 0],
  39: [4, 4, 4, 5, 4, 0],
  40: [4, 4, 4, 6, 4, 0],
  41: [4, 4, 4, 7, 4, 0],
  42: [4, 4, 4, 7, 4, 0],
  43: [4, 4, 4, 7, 4, 0],
  44: [4, 4, 4, 7, 5, 0],
  45: [4, 4, 5, 7, 5, 0],
  46: [5, 4, 5, 7, 5, 0],
  47: [5, 4, 5, 7, 5, 0],
  48: [5, 4, 5, 7, 5, 0],
  49: [5, 4, 5, 8, 5, 0],
  50: [5, 4, 5, 8, 6, 0],
  51: [5, 4, 5, 8, 6, 1],
  52: [5, 5, 5, 8, 6, 1],
  53: [5, 5, 6, 8, 6, 1],
  54: [6, 5, 6, 8, 6, 1],
  55: [6, 5, 6, 9, 6, 1],
  56: [6, 5, 6, 9, 6, 1],
  57: [6, 5, 7, 9, 6, 1],
  58: [6, 5, 7, 9, 6, 2],
  59: [6, 5, 7, 9, 7, 2],
  60: [6, 5, 7, 10, 7, 2],
  61: [6, 5, 7, 10, 7, 2],
  62: [6, 5, 7, 10, 7, 2],
  63: [6, 5, 7, 10, 7, 2],
  64: [6, 5, 7, 10, 7, 2],
  65: [6, 6, 7, 11, 7, 3],
  66: [6, 6, 7, 11, 7, 3],
  67: [6, 6, 7, 11, 7, 3],
  68: [6, 6, 7, 11, 7, 3],
  69: [6, 6, 7, 11, 7, 3],
  70: [6, 7, 7, 12, 7, 4],
};

export class ArchBishop extends HighPriest {
  protected override CLASS_NAME = ClassName.ArchBishop;
  protected override JobBonusTable = jobBonusTable;

  protected readonly classNames3rd = [ClassName.Only_3rd, ClassName.ArchBishop];
  protected readonly atkSkillList3rd: AtkSkillModel[] = [
    {
      name: 'Holy Light',
      label: 'Holy Light',
      value: 'Holy Light==1',
      acd: 0,
      cd: 0,
      fct: 0,
      vct: 0,
      isMatk: true,
      element: ElementType.Holy,
      formula: (): number => {
        return 125;
      },
    },
    {
      name: 'Magnus Exorcismus',
      label: 'Magnus Exorcismus Lv10',
      value: 'Magnus Exorcismus==10',
      acd: 1,
      cd: 6,
      fct: 1,
      vct: 4,
      isMatk: true,
      element: ElementType.Holy,
      totalHit: 10,
      formula: (input: AtkSkillFormulaInput): number => {
        const { race, element } = input.monster;
        const inCludeBonus =
          [RaceType.Demon.toLowerCase(), RaceType.Undead.toLowerCase()].includes(race) ||
          [ElementType.Undead.toLowerCase(), ElementType.Dark.toLowerCase()].includes(element);

        if (inCludeBonus) return 130;

        return 100;
      },
    },
    {
      name: 'Judex',
      label: 'Judex Lv10',
      value: 'Judex==10',
      values: ['[Improved] Judex==10'],
      fct: 0.5,
      vct: 2,
      acd: 0.5,
      cd: 0,
      isMatk: true,
      element: ElementType.Holy,
      hit: 3,
      formula: (input: AtkSkillFormulaInput): number => {
        const { model, skillLevel } = input;
        const baseLevel = model.level;

        return (300 + skillLevel * 70) * (baseLevel / 100);
      },
    },
    {
      name: 'Adoramus',
      label: 'Adoramus Lv10',
      value: 'Adoramus==10',
      values: ['[Improved] Adoramus==10'],
      fct: 0.5,
      vct: 2,
      acd: 0.5,
      cd: 2.5,
      isMatk: true,
      hit: 10,
      element: ElementType.Holy,
      formula: (input: AtkSkillFormulaInput): number => {
        const { model, skillLevel } = input;
        const baseLevel = model.level;

        return (300 + skillLevel * 250) * (baseLevel / 100);
      },
    },
    {
      name: 'Adoramus',
      label: 'Adoramus Lv10 (In Ancilla)',
      value: '[Improved] Adoramus Ancilla==10',
      fct: 0.5,
      vct: 2,
      acd: 0.5,
      cd: 2.5,
      isMatk: true,
      hit: 10,
      element: ElementType.Neutral,
      formula: (input: AtkSkillFormulaInput): number => {
        const { model, skillLevel } = input;
        const baseLevel = model.level;

        return (300 + skillLevel * 250) * (baseLevel / 100);
      },
    },
    {
      name: 'Hell Inferno',
      label: 'Hell Inferno Lv5',
      value: 'Hell Inferno==5',
      fct: 1,
      vct: 3,
      acd: 0.5,
      cd: 3,
      isMatk: true,
      element: ElementType.Fire,
      formula: (input: AtkSkillFormulaInput): number => {
        const { model, skillLevel } = input;
        const baseLevel = model.level;

        return skillLevel * 400 * (baseLevel / 100);
      },
      part2: {
        label: 'Shadow Dmg',
        isIncludeMain: true,
        element: ElementType.Dark,
        isMatk: true,
        isMelee: false,
        hit: 3,
        formula: (input: AtkSkillFormulaInput): number => {
          const { model, skillLevel } = input;
          const baseLevel = model.level;

          return skillLevel * 600 * (baseLevel / 100);
        },
      },
    },
  ];
  protected readonly activeSkillList3rd: ActiveSkillModel[] = [
    {
      inputType: 'dropdown',
      label: 'Magnificat',
      name: 'Magnificat',
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
      inputType: 'dropdown',
      label: 'Offertorium',
      name: 'Offertorium',
      dropdown: [
        { label: '-', isUse: false, value: 0 },
        { label: 'Lv 5', isUse: true, value: 5 },
      ],
    },
    {
      inputType: 'dropdown',
      label: 'Basilica',
      name: 'Basilica',
      dropdown: [
        { label: '-', isUse: false, value: 0 },
        {
          label: 'Lv 5',
          isUse: true,
          value: 5,
          bonus: { m_my_element_holy: 15, p_element_dark: 25, p_element_undead: 25 },
        },
      ],
    },
  ];
  protected readonly passiveSkillList3rd: PassiveSkillModel[] = [
    {
      inputType: 'dropdown',
      label: 'Mace Mastery',
      name: 'Mace Mastery',
      isEquipAtk: true,
      dropdown: [
        { label: '-', value: 0, isUse: false },
        { label: 'Lv 1', value: 1, isUse: true, bonus: { atk_Mace: 3, cri: 1 } },
        { label: 'Lv 2', value: 2, isUse: true, bonus: { atk_Mace: 6, cri: 2 } },
        { label: 'Lv 3', value: 3, isUse: true, bonus: { atk_Mace: 9, cri: 3 } },
        { label: 'Lv 4', value: 4, isUse: true, bonus: { atk_Mace: 12, cri: 4 } },
        { label: 'Lv 5', value: 5, isUse: true, bonus: { atk_Mace: 15, cri: 5 } },
        { label: 'Lv 6', value: 6, isUse: true, bonus: { atk_Mace: 18, cri: 6 } },
        { label: 'Lv 7', value: 7, isUse: true, bonus: { atk_Mace: 21, cri: 7 } },
        { label: 'Lv 8', value: 8, isUse: true, bonus: { atk_Mace: 24, cri: 8 } },
        { label: 'Lv 9', value: 9, isUse: true, bonus: { atk_Mace: 27, cri: 9 } },
        { label: 'Lv 10', value: 10, isUse: true, bonus: { atk_Mace: 30, cri: 10 } },
      ],
    },
    {
      inputType: 'dropdown',
      label: 'Meditation',
      name: 'Meditation',
      dropdown: [
        { label: '-', value: 0, isUse: false },
        { label: 'Lv 1', value: 1, isUse: true, bonus: { spPercent: 1 } },
        { label: 'Lv 2', value: 2, isUse: true, bonus: { spPercent: 2 } },
        { label: 'Lv 3', value: 3, isUse: true, bonus: { spPercent: 3 } },
        { label: 'Lv 4', value: 4, isUse: true, bonus: { spPercent: 4 } },
        { label: 'Lv 5', value: 5, isUse: true, bonus: { spPercent: 5 } },
        { label: 'Lv 6', value: 6, isUse: true, bonus: { spPercent: 6 } },
        { label: 'Lv 7', value: 7, isUse: true, bonus: { spPercent: 7 } },
        { label: 'Lv 8', value: 8, isUse: true, bonus: { spPercent: 8 } },
        { label: 'Lv 9', value: 9, isUse: true, bonus: { spPercent: 9 } },
        { label: 'Lv 10', value: 10, isUse: true, bonus: { spPercent: 10 } },
      ],
    },
    {
      inputType: 'dropdown',
      label: 'Kyrie',
      name: 'Kyrie Eleison',
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
      inputType: 'dropdown',
      label: 'Assumptio',
      name: 'Assumptio',
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
      inputType: 'dropdown',
      label: 'Clementia',
      name: 'Clementia',
      dropdown: [
        { label: '-', value: 0, isUse: false },
        { label: 'Lv 1', value: 1, isUse: true },
        { label: 'Lv 2', value: 2, isUse: true },
        { label: 'Lv 3', value: 3, isUse: true },
      ],
    },
    {
      inputType: 'dropdown',
      label: 'Laudaagnus',
      name: 'Laudaagnus',
      dropdown: [
        { label: '-', value: 0, isUse: false },
        { label: 'Lv 1', value: 1, isUse: true },
        { label: 'Lv 2', value: 2, isUse: true },
        { label: 'Lv 3', value: 3, isUse: true },
        { label: 'Lv 4', value: 4, isUse: true },
      ],
    },
    {
      inputType: 'dropdown',
      label: 'Expiatio',
      name: 'Expiatio',
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
      inputType: 'dropdown',
      label: 'Impositio Manus',
      name: 'Impositio Manus',
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
    const { weapon, monster, model } = info;
    const weaponSubType = weapon?.data?.subTypeName;
    const bonusBaseLv = 0.05 * (model['level'] + 1);
    const bonuses = this._passiveSkillList.map((s, idx) => s.dropdown.find((d) => d.value === this.passiveSkillIds[idx])?.bonus).filter(Boolean);
    const { race, element } = monster;

    let totalAtk = 0;
    for (const bonus of bonuses) {
      const atk =
        bonus?.[`atk_${weaponSubType}`] ||
        Math.floor(bonus?.[`x_atk_race_${race}`] + bonusBaseLv || 0) ||
        Math.floor(bonus?.[`x_atk_element_${element}`] + bonusBaseLv || 0) ||
        0;
      totalAtk += atk;
    }
    // console.log({ bonuses, totalAtk, a });

    return totalAtk;
  }
}
