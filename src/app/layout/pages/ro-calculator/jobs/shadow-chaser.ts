import { ClassName } from './_class-name';
import { ActiveSkillModel, AtkSkillModel, CharacterBase, PassiveSkillModel } from './char-class.abstract';

const jobBonusTable: Record<number, [number, number, number, number, number, number]> = {
  1: [0, 0, 0, 0, 0, 1],
  2: [1, 0, 0, 0, 0, 1],
  3: [1, 0, 0, 0, 0, 1],
  4: [1, 0, 0, 0, 0, 1],
  5: [2, 0, 0, 0, 0, 1],
  6: [2, 0, 0, 0, 0, 1],
  7: [2, 0, 0, 0, 0, 2],
  8: [2, 1, 0, 0, 0, 2],
  9: [2, 1, 0, 0, 1, 2],
  10: [2, 1, 0, 1, 1, 2],
  11: [2, 1, 0, 1, 1, 2],
  12: [2, 1, 0, 1, 1, 2],
  13: [2, 1, 0, 2, 1, 2],
  14: [2, 1, 0, 2, 1, 3],
  15: [2, 1, 0, 2, 1, 3],
  16: [2, 1, 0, 2, 1, 3],
  17: [2, 2, 0, 2, 1, 3],
  18: [2, 2, 0, 2, 1, 3],
  19: [2, 2, 1, 2, 1, 3],
  20: [2, 2, 2, 2, 1, 3],
  21: [2, 2, 2, 3, 1, 3],
  22: [2, 2, 2, 3, 2, 3],
  23: [2, 2, 2, 3, 2, 3],
  24: [2, 2, 2, 3, 2, 3],
  25: [2, 2, 3, 3, 2, 3],
  26: [2, 2, 3, 3, 2, 4],
  27: [2, 2, 3, 3, 2, 4],
  28: [2, 2, 3, 3, 2, 4],
  29: [2, 2, 4, 3, 2, 4],
  30: [2, 2, 4, 3, 2, 4],
  31: [3, 2, 4, 3, 2, 4],
  32: [4, 2, 4, 3, 2, 4],
  33: [4, 2, 5, 3, 2, 4],
  34: [4, 2, 5, 3, 2, 5],
  35: [4, 2, 5, 3, 2, 5],
  36: [4, 2, 5, 3, 2, 5],
  37: [4, 2, 5, 4, 2, 5],
  38: [4, 2, 5, 5, 2, 5],
  39: [4, 2, 5, 5, 2, 5],
  40: [4, 2, 5, 5, 2, 5],
  41: [4, 2, 5, 5, 2, 5],
  42: [4, 2, 6, 5, 2, 5],
  43: [4, 2, 7, 5, 2, 5],
  44: [5, 2, 7, 5, 2, 5],
  45: [6, 2, 7, 5, 2, 5],
  46: [6, 2, 7, 5, 2, 5],
  47: [6, 2, 7, 5, 2, 5],
  48: [6, 2, 7, 5, 3, 5],
  49: [6, 3, 7, 5, 3, 5],
  50: [6, 3, 7, 5, 3, 5],
  51: [6, 3, 7, 6, 3, 5],
  52: [6, 3, 8, 6, 3, 5],
  53: [7, 3, 8, 6, 3, 5],
  54: [7, 4, 8, 6, 3, 5],
  55: [7, 4, 8, 6, 3, 5],
  56: [7, 4, 8, 6, 3, 6],
  57: [7, 4, 8, 6, 4, 6],
  58: [7, 4, 8, 6, 4, 6],
  59: [8, 4, 8, 6, 4, 6],
  60: [8, 5, 8, 6, 4, 6],
  61: [8, 5, 8, 6, 4, 6],
  62: [8, 5, 8, 6, 4, 6],
  63: [8, 5, 8, 6, 4, 6],
  64: [8, 5, 8, 6, 4, 6],
  65: [8, 7, 8, 6, 5, 6],
};

export class ShadowChaser extends CharacterBase {
  protected readonly CLASS_NAME = ClassName.ShadowChaser;
  protected readonly JobBonusTable = jobBonusTable;

  protected initialStatusPoint = 100;
  protected classNames = ['Shadow Chaser', 'Shadow Chaser Cls', 'Shadow Chaser Class', 'Rougue', 'Stalker'];
  protected _atkSkillList: AtkSkillModel[] = [
    {
      label: 'Fatal Manace',
      name: 'Fatal Manace',
      value: 'Fatal Manace==10',
      acd: 0.5,
      fct: 0,
      vct: 0,
      cd: 0,
      levelList: [{ label: 'Lv 10', value: 'Fatal Manace==10' }],
      formular: ({ baseLevel, skillLevel }: { baseLevel: number; skillLevel: number }): number => {
        return (100 + skillLevel * 100) * (baseLevel / 100);
      },
    },
  ];
  protected _activeSkillList: ActiveSkillModel[] = [
    {
      label: 'Preserve',
      name: 'Preserve',
      inputType: 'selectButton',
      dropdown: [
        { label: 'Yes', value: 10, skillLv: 10, isUse: true },
        { label: 'No', value: 0, isUse: false },
      ],
    },
    {
      label: 'ShieldSpell',
      name: 'ShieldSpell',
      inputType: 'dropdown',
      isMasteryAtk: true,
      dropdown: [
        { label: 'Atk +50', value: 50, skillLv: 5, isUse: true, bonus: { atk: 50 } },
        { label: 'Atk +60', value: 60, skillLv: 6, isUse: true, bonus: { atk: 60 } },
        { label: 'Atk +70', value: 70, skillLv: 7, isUse: true, bonus: { atk: 70 } },
        { label: 'Atk +80', value: 80, skillLv: 8, isUse: true, bonus: { atk: 80 } },
        { label: 'Atk +90', value: 90, skillLv: 9, isUse: true, bonus: { atk: 90 } },
        { label: 'Atk +100', value: 100, skillLv: 100, isUse: true, bonus: { atk: 100 } },
        { label: 'Atk +110', value: 110, skillLv: 110, isUse: true, bonus: { atk: 110 } },
        { label: 'Atk +120', value: 120, skillLv: 120, isUse: true, bonus: { atk: 120 } },
        { label: '-', value: 0, isUse: false },
      ],
    },
  ];
  protected _passiveSkillList: PassiveSkillModel[] = [
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
      inputType: 'dropdown',
      label: 'Sword Mastery',
      name: 'Sword Mastery',
      isMasteryAtk: true,
      dropdown: [
        { label: '-', value: 0, isUse: false },
        { label: 'Lv 1', value: 1, skillLv: 1, isUse: true, bonus: { atk: 4 } },
        { label: 'Lv 2', value: 2, skillLv: 2, isUse: true, bonus: { atk: 8 } },
        { label: 'Lv 3', value: 3, skillLv: 3, isUse: true, bonus: { atk: 12 } },
        { label: 'Lv 4', value: 4, skillLv: 4, isUse: true, bonus: { atk: 16 } },
        { label: 'Lv 5', value: 5, skillLv: 5, isUse: true, bonus: { atk: 20 } },
        { label: 'Lv 6', value: 6, skillLv: 6, isUse: true, bonus: { atk: 24 } },
        { label: 'Lv 7', value: 7, skillLv: 7, isUse: true, bonus: { atk: 28 } },
        { label: 'Lv 8', value: 8, skillLv: 8, isUse: true, bonus: { atk: 32 } },
        { label: 'Lv 9', value: 9, skillLv: 9, isUse: true, bonus: { atk: 36 } },
        { label: 'Lv 10', value: 10, skillLv: 10, isUse: true, bonus: { atk: 40 } },
      ],
    },
    {
      inputType: 'dropdown',
      label: 'Improve Dodge',
      name: 'Improve Dodge',
      isEquipAtk: true,
      dropdown: [
        { label: '-', value: 0, isUse: false },
        { label: 'Lv 1', value: 1, skillLv: 1, isUse: true, bonus: { flee: 4 } },
        { label: 'Lv 2', value: 2, skillLv: 2, isUse: true, bonus: { flee: 8 } },
        { label: 'Lv 3', value: 3, skillLv: 3, isUse: true, bonus: { flee: 12 } },
        { label: 'Lv 4', value: 4, skillLv: 4, isUse: true, bonus: { flee: 16 } },
        { label: 'Lv 5', value: 5, skillLv: 5, isUse: true, bonus: { flee: 20 } },
        { label: 'Lv 6', value: 6, skillLv: 6, isUse: true, bonus: { flee: 24 } },
        { label: 'Lv 7', value: 7, skillLv: 7, isUse: true, bonus: { flee: 28 } },
        { label: 'Lv 8', value: 8, skillLv: 8, isUse: true, bonus: { flee: 32 } },
        { label: 'Lv 9', value: 9, skillLv: 9, isUse: true, bonus: { flee: 36 } },
        { label: 'Lv 10', value: 10, skillLv: 10, isUse: true, bonus: { flee: 40 } },
      ],
    },
    {
      inputType: 'dropdown',
      label: 'Snatcher',
      name: 'Snatcher',
      isEquipAtk: true,
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
      inputType: 'dropdown',
      label: 'Plagiarism',
      name: 'Plagiarism',
      isEquipAtk: true,
      dropdown: [
        { label: '-', value: 0, isUse: false },
        { label: 'Lv 1', value: 1, skillLv: 1, isUse: true, bonus: { aspdPercent: 1 } },
        { label: 'Lv 2', value: 2, skillLv: 2, isUse: true, bonus: { aspdPercent: 2 } },
        { label: 'Lv 3', value: 3, skillLv: 3, isUse: true, bonus: { aspdPercent: 3 } },
        { label: 'Lv 4', value: 4, skillLv: 4, isUse: true, bonus: { aspdPercent: 4 } },
        { label: 'Lv 5', value: 5, skillLv: 5, isUse: true, bonus: { aspdPercent: 5 } },
        { label: 'Lv 6', value: 6, skillLv: 6, isUse: true, bonus: { aspdPercent: 6 } },
        { label: 'Lv 7', value: 7, skillLv: 7, isUse: true, bonus: { aspdPercent: 7 } },
        { label: 'Lv 8', value: 8, skillLv: 8, isUse: true, bonus: { aspdPercent: 8 } },
        { label: 'Lv 9', value: 9, skillLv: 9, isUse: true, bonus: { aspdPercent: 9 } },
        { label: 'Lv 10', value: 10, skillLv: 10, isUse: true, bonus: { aspdPercent: 10 } },
      ],
    },
  ];
}