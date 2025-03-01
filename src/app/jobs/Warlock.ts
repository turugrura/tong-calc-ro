import { ElementType } from '../constants/element-type.const';
import { ClassName } from './_class-name';
import { ActiveSkillModel, AtkSkillFormulaInput, AtkSkillModel, PassiveSkillModel } from './_character-base.abstract';
import { HighWizard } from './HighWizard';

const jobBonusTable: Record<number, [number, number, number, number, number, number]> = {
  1: [0, 0, 0, 1, 0, 0],
  2: [0, 0, 0, 2, 0, 0],
  3: [0, 0, 0, 2, 1, 0],
  4: [0, 0, 0, 2, 1, 0],
  5: [0, 0, 0, 2, 1, 0],
  6: [0, 0, 0, 2, 2, 0],
  7: [0, 0, 0, 3, 2, 0],
  8: [0, 1, 0, 3, 2, 0],
  9: [0, 1, 0, 3, 2, 0],
  10: [0, 1, 0, 3, 2, 0],
  11: [0, 1, 0, 3, 2, 0],
  12: [0, 1, 0, 4, 2, 0],
  13: [0, 1, 0, 4, 3, 0],
  14: [0, 1, 0, 4, 3, 0],
  15: [0, 1, 1, 4, 3, 0],
  16: [0, 1, 1, 4, 3, 0],
  17: [0, 1, 1, 4, 3, 0],
  18: [0, 1, 2, 4, 3, 0],
  19: [0, 1, 2, 4, 4, 0],
  20: [0, 2, 2, 4, 4, 0],
  21: [0, 2, 2, 4, 4, 0],
  22: [0, 2, 2, 4, 4, 0],
  23: [0, 2, 2, 5, 4, 0],
  24: [0, 2, 3, 5, 4, 0],
  25: [0, 2, 4, 5, 4, 0],
  26: [0, 2, 4, 5, 4, 0],
  27: [0, 2, 4, 5, 4, 0],
  28: [0, 2, 4, 5, 5, 0],
  29: [0, 3, 4, 5, 5, 0],
  30: [0, 3, 4, 5, 5, 0],
  31: [0, 3, 4, 5, 5, 1],
  32: [0, 3, 4, 5, 5, 1],
  33: [0, 3, 4, 5, 5, 1],
  34: [1, 3, 4, 5, 5, 1],
  35: [1, 3, 4, 6, 5, 1],
  36: [1, 3, 4, 7, 5, 1],
  37: [1, 3, 4, 7, 5, 1],
  38: [1, 3, 4, 7, 5, 1],
  39: [1, 3, 4, 7, 6, 1],
  40: [1, 4, 4, 7, 6, 1],
  41: [1, 4, 4, 8, 6, 1],
  42: [1, 4, 4, 8, 6, 1],
  43: [1, 4, 4, 8, 6, 1],
  44: [1, 4, 4, 9, 6, 1],
  45: [1, 4, 4, 10, 6, 1],
  46: [1, 4, 4, 10, 6, 1],
  47: [1, 5, 4, 10, 6, 1],
  48: [1, 5, 4, 10, 6, 1],
  49: [1, 5, 4, 10, 6, 1],
  50: [1, 5, 4, 11, 6, 1],
  51: [1, 5, 4, 11, 7, 1],
  52: [1, 5, 5, 11, 7, 1],
  53: [1, 5, 5, 11, 7, 2],
  54: [1, 6, 5, 11, 7, 2],
  55: [1, 6, 5, 12, 7, 2],
  56: [1, 6, 5, 12, 7, 2],
  57: [1, 6, 6, 12, 7, 2],
  58: [1, 7, 6, 12, 7, 2],
  59: [1, 7, 6, 12, 8, 2],
  60: [1, 7, 6, 13, 8, 2],
  61: [1, 7, 6, 13, 8, 2],
  62: [1, 7, 6, 13, 8, 2],
  63: [1, 7, 6, 13, 8, 2],
  64: [1, 7, 6, 13, 8, 2],
  65: [1, 7, 7, 14, 8, 3],
  66: [1, 7, 7, 14, 8, 3],
  67: [1, 7, 7, 14, 8, 3],
  68: [1, 7, 7, 14, 8, 3],
  69: [1, 7, 7, 14, 8, 3],
  70: [1, 7, 8, 15, 8, 4],
};

export class Warlock extends HighWizard {
  protected override CLASS_NAME = ClassName.Warlock;
  protected override JobBonusTable = jobBonusTable;

  private readonly classNames3rd = [ClassName.Only_3rd, ClassName.Warlock];
  private readonly atkSkillList3rd: AtkSkillModel[] = [
    {
      name: 'Comet',
      label: 'Comet Lv5',
      value: 'Comet==5',
      acd: 1.5,
      fct: 2,
      vct: 10,
      cd: 20,
      isMatk: true,
      hit: 10,
      element: ElementType.Neutral,
      formula: (input: AtkSkillFormulaInput): number => {
        const { model, skillLevel } = input;
        const baseLevel = model.level;

        return (2500 + skillLevel * 700) * (baseLevel / 100);
      },
    },
    {
      name: 'Crimson Rock',
      label: 'Crimson Rock Lv5',
      value: 'Crimson Rock==5',
      fct: 1,
      vct: 5,
      acd: 0.5,
      cd: 5,
      isMatk: true,
      hit: 7,
      element: ElementType.Fire,
      formula: (input: AtkSkillFormulaInput): number => {
        const { model, skillLevel } = input;
        const baseLevel = model.level;

        return (700 + skillLevel * 600) * (baseLevel / 100);
      },
    },
    {
      name: 'Jack Frost',
      label: 'Jack Frost Lv5',
      value: 'Jack Frost==5',
      acd: 1,
      fct: 1,
      vct: 4,
      cd: 4,
      totalHit: 4,
      isMatk: true,
      element: ElementType.Water,
      formula: (input: AtkSkillFormulaInput): number => {
        const { model, skillLevel } = input;
        const baseLevel = model.level;

        return (1000 + skillLevel * 300) * (baseLevel / 100);
      },
    },
    {
      name: 'Jack Frost',
      label: 'Jack Frost Lv5 (in Frost)',
      value: 'Jack Frost Frost==5',
      acd: 1,
      fct: 1,
      vct: 4,
      cd: 4,
      hit: 4,
      isMatk: true,
      element: ElementType.Water,
      formula: (input: AtkSkillFormulaInput): number => {
        const { model, skillLevel } = input;
        const baseLevel = model.level;

        return (1200 + skillLevel * 600) * (baseLevel / 100);
      },
    },
    {
      name: 'Soul Expansion',
      label: 'Soul Expansion Lv5',
      value: 'Soul Expansion==5',
      acd: 0.5,
      fct: 0,
      vct: 2,
      cd: 0,
      isMatk: true,
      element: ElementType.Ghost,
      hit: 2,
      formula: (input: AtkSkillFormulaInput): number => {
        const { model, skillLevel, status } = input;
        const baseLevel = model.level;

        return (1000 + skillLevel * 200 + status.totalInt) * (baseLevel / 100);
      },
    },
    {
      name: 'Chain Lightning',
      label: 'Chain Lightning Lv5',
      value: 'Chain Lightning==5',
      acd: 3,
      fct: 1,
      vct: 5.5,
      cd: 0,
      isMatk: true,
      element: ElementType.Wind,
      formula: (input: AtkSkillFormulaInput): number => {
        const { model, skillLevel } = input;
        const baseLevel = model.level;
        const chainBonus = 900;

        return (500 + skillLevel * 100) * (baseLevel / 100) + chainBonus;
      },
    },
    {
      name: 'Earth Strain',
      label: 'Earth Strain Lv5',
      value: 'Earth Strain==5',
      acd: 1,
      fct: 1,
      vct: 6,
      cd: 10,
      isMatk: true,
      hit: 10,
      element: ElementType.Earth,
      formula: (input: AtkSkillFormulaInput): number => {
        const { model, skillLevel } = input;
        const baseLevel = model.level;

        return (1000 + skillLevel * 600) * (baseLevel / 100);
      },
    },
    {
      name: 'Frost Misty',
      label: 'Frost Misty Lv5',
      value: 'Frost Misty==5',
      acd: 1,
      fct: 0.5,
      vct: 4,
      cd: 10,
      isMatk: true,
      hit: 5,
      element: ElementType.Water,
      formula: (input: AtkSkillFormulaInput): number => {
        const { model, skillLevel } = input;
        const baseLevel = model.level;

        return (200 + skillLevel * 100) * (baseLevel / 100);
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
    {
      name: 'Drain Life',
      label: 'Drain Life Lv5',
      value: 'Drain Life==5',
      acd: 0,
      fct: 1,
      vct: 4,
      cd: 2,
      isMatk: true,
      element: ElementType.Neutral,
      formula: (input: AtkSkillFormulaInput): number => {
        const { model, skillLevel, status } = input;
        const baseLevel = model.level;

        return (skillLevel * 200 + status.totalInt) * (baseLevel / 100);
      },
    },
    // {
    //   name: 'Tetra Vortex',
    //   label: 'Tetra Vortex Lv10',
    //   value: 'Tetra Vortex==10',
    //   acd: 0,
    //   fct: 1,
    //   vct: 14,
    //   cd: 15,
    //   isMatk: true,
    //   // getElement(skillValue) {

    //   // },
    //   totalHit: 4,
    //   formula: (input: AtkSkillFormulaInput): number => {
    //     const { model, skillLevel } = input;
    //     const baseLevel = model.level;

    //     return 800 + skillLevel * 400;
    //   },
    // },
  ];
  private readonly activeSkillList3rd: ActiveSkillModel[] = [
    {
      inputType: 'selectButton',
      label: 'Recogn Spell',
      name: 'Recognized Spell',
      dropdown: [
        { label: 'Yes', isUse: true, value: 1, bonus: { spell_maximize: 1 } },
        { label: 'No', isUse: false, value: 0 },
      ],
    },
    {
      inputType: 'selectButton',
      label: 'Comet Amp',
      name: 'Comet Amp',
      isDebuff: true,
      dropdown: [
        { label: 'Yes', isUse: true, value: 1, bonus: { comet: 50 } },
        { label: 'No', isUse: false, value: 0 },
      ],
    },
    {
      inputType: 'dropdown',
      label: 'Intensification',
      name: 'Intensification',
      dropdown: [
        { label: '-', isUse: false, value: 0 },
        { label: 'Lv 1', isUse: true, value: 1, bonus: { final_ghost: 40, vct: 10 } },
        { label: 'Lv 2', isUse: true, value: 2, bonus: { final_ghost: 80, vct: 20 } },
        { label: 'Lv 3', isUse: true, value: 3, bonus: { final_ghost: 120, vct: 30 } },
        { label: 'Lv 4', isUse: true, value: 4, bonus: { final_ghost: 160, vct: 40 } },
        { label: 'Lv 5', isUse: true, value: 5, bonus: { final_ghost: 200, vct: 50 } },
      ],
    },
    {
      label: 'Released',
      name: 'Released',
      inputType: 'selectButton',
      dropdown: [
        { label: 'Yes', isUse: true, value: 1, bonus: { releasedSkill: 1 } },
        { label: 'No', isUse: false, value: 0 },
      ],
    },
  ];
  protected readonly passiveSkillList3rd: PassiveSkillModel[] = [
    {
      inputType: 'dropdown',
      label: 'Freezing Spell',
      name: 'Freezing Spell',
      isEquipAtk: true,
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
    {
      inputType: 'dropdown',
      label: 'Radius',
      name: 'Radius',
      dropdown: [
        { label: '-', isUse: false, value: 0 },
        { label: 'Lv 1', isUse: true, value: 1, bonus: { fctPercent: 10 * 1 } },
        { label: 'Lv 2', isUse: true, value: 2, bonus: { fctPercent: 10 * 2 } },
        { label: 'Lv 3', isUse: true, value: 3, bonus: { fctPercent: 10 * 3 } },
      ],
    },
    {
      inputType: 'dropdown',
      label: 'Recognized Spell',
      name: 'Recognized Spell',
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
      label: 'Soul Expansion',
      name: 'Soul Expansion',
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
      label: 'Comet',
      name: 'Comet',
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
      label: 'Chain Lightning',
      name: 'Chain Lightning',
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
}
