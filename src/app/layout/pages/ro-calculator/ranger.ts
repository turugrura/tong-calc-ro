import {
  ActiveSkillModel,
  AtkSkillFormulaInput,
  AtkSkillModel,
  CharacterBase,
  PassiveSkillModel,
} from './char-class.abstract';

const jobBonusTable: Record<number, [number, number, number, number, number, number]> = {
  1: [0, 0, 0, 0, 1, 0],
  2: [0, 0, 0, 1, 1, 0],
  3: [0, 0, 0, 2, 1, 0],
  4: [0, 1, 0, 2, 1, 0],
  5: [0, 1, 0, 2, 1, 0],
  6: [0, 1, 0, 2, 1, 0],
  7: [0, 2, 0, 2, 1, 0],
  8: [0, 2, 0, 2, 2, 0],
  9: [0, 2, 0, 3, 2, 0],
  10: [0, 2, 0, 3, 2, 0],
  11: [0, 2, 0, 3, 2, 0],
  12: [0, 2, 1, 3, 2, 0],
  13: [0, 2, 2, 3, 2, 0],
  14: [0, 2, 3, 3, 2, 0],
  15: [0, 2, 3, 3, 2, 0],
  16: [0, 2, 3, 3, 2, 0],
  17: [0, 2, 3, 3, 3, 0],
  18: [0, 3, 3, 3, 3, 0],
  19: [0, 3, 3, 3, 3, 0],
  20: [0, 3, 3, 3, 3, 0],
  21: [0, 3, 3, 4, 3, 0],
  22: [0, 3, 4, 4, 3, 0],
  23: [0, 3, 4, 4, 4, 0],
  24: [0, 3, 4, 4, 4, 0],
  25: [0, 3, 4, 4, 4, 0],
  26: [1, 3, 4, 4, 4, 0],
  27: [2, 3, 4, 4, 4, 0],
  28: [2, 3, 4, 4, 4, 0],
  29: [2, 3, 4, 4, 4, 0],
  30: [2, 3, 4, 4, 5, 0],
  31: [2, 4, 4, 4, 5, 0],
  32: [2, 4, 5, 4, 5, 0],
  33: [2, 4, 5, 4, 5, 0],
  34: [2, 4, 5, 4, 5, 0],
  35: [2, 4, 5, 4, 5, 0],
  36: [2, 4, 5, 5, 5, 0],
  37: [2, 4, 5, 6, 5, 0],
  38: [2, 4, 5, 7, 5, 0],
  39: [2, 5, 5, 7, 5, 0],
  40: [2, 5, 5, 7, 5, 0],
  41: [2, 5, 5, 7, 5, 0],
  42: [2, 5, 5, 7, 5, 0],
  43: [2, 6, 5, 7, 5, 0],
  44: [2, 6, 5, 7, 6, 0],
  45: [2, 7, 5, 7, 6, 0],
  46: [2, 7, 5, 7, 6, 0],
  47: [2, 7, 5, 7, 6, 0],
  48: [2, 7, 5, 7, 6, 0],
  49: [2, 7, 5, 8, 6, 0],
  50: [2, 8, 5, 8, 6, 0],
  51: [2, 8, 5, 8, 6, 1],
  52: [2, 8, 5, 8, 7, 1],
  53: [2, 8, 5, 8, 7, 1],
  54: [2, 8, 5, 9, 7, 1],
  55: [2, 9, 5, 9, 7, 1],
  56: [2, 9, 5, 9, 7, 1],
  57: [2, 9, 6, 9, 7, 1],
  58: [2, 9, 6, 9, 7, 2],
  59: [2, 9, 6, 9, 8, 2],
  60: [2, 10, 6, 9, 8, 2],
  61: [2, 10, 6, 9, 8, 2],
  62: [2, 10, 6, 9, 8, 2],
  63: [2, 10, 6, 9, 8, 2],
  64: [2, 11, 7, 9, 8, 2],
  65: [2, 11, 7, 9, 8, 3],
};

const ASPDTable = {
  bow: 9,
  Bow: 9,
  dagger: 10,
} as const;

export class Ranger extends CharacterBase {
  protected readonly BASE_ASPD = 156;
  protected readonly ASPDTable = ASPDTable;

  protected initialStatusPoint = 100;
  protected classNames = ['Ranger', 'Ranger Cls', 'Sniper', 'Hunter', 'Archer Cls', 'Only 3rd Cls'];
  protected _atkSkillList: AtkSkillModel[] = [
    {
      label: 'Arrow Storm Lv10',
      name: 'Arrow Storm',
      value: 'Arrow Storm==10',
      acd: 0,
      fct: 0, // 0.3 future
      vct: 2,
      cd: 3.2,
      hit: 3,
      levelList: [{ label: 'Arrow Storm Lv 10', value: 'Arrow Storm==10' }],
      formular: (input: AtkSkillFormulaInput): number => {
        const { baseLevel, skillLevel, usedSkillSet } = input;
        const baseAtk = usedSkillSet?.has('Fear Breeze') ? 250 : 200;
        const bonus = usedSkillSet?.has('Falcon Eyes') ? 20 : 0;

        // return (baseAtk + 180 * skillLevel) * (baseLevel / 100);
        return bonus + (1000 + 80 * skillLevel) * (baseLevel / 100);
      },
    },
    {
      label: 'Focused Arrow Lv5',
      name: 'Focused Arrow Strike',
      value: 'Focused Arrow Strike==5',
      acd: 0.5,
      fct: 0.5,
      vct: 0.5,
      cd: 0.15,
      levelList: [],
      canCri: true,
      cri: 50,
      formular: (input: AtkSkillFormulaInput): number => {
        const { baseLevel, skillLevel, usedSkillSet } = input;
        const bonus = usedSkillSet?.has('Falcon Eyes') ? 20 : 0;

        return bonus + (150 + skillLevel * 200) * (baseLevel / 100);
      },
    },
    {
      label: 'Aimed Bolt Lv 10',
      name: 'Aimed Bolt',
      value: 'Aimed Bolt==10',
      acd: 1,
      fct: 1,
      vct: 0,
      cd: 1,
      levelList: [],
      formular: (input: AtkSkillFormulaInput): number => {
        const { baseLevel, skillLevel, usedSkillSet } = input;
        const bonus = usedSkillSet?.has('Falcon Eyes') ? 20 : 0;

        return (bonus + 500 + skillLevel * 20) * (baseLevel / 100);
      },
    },
  ];
  protected _activeSkillList: ActiveSkillModel[] = [
    {
      isEquipAtk: true,
      inputType: 'selectButton',
      label: 'Improve 10',
      name: 'Improve Concentration',
      dropdown: [
        {
          label: 'Yes',
          value: 'Improve Concentration==10',
          skillLv: 10,
          isUse: true,
          bonus: { agiBoost: 12, dexBoost: 12 },
        },
        { label: 'No', value: 0, isUse: false },
      ],
    },
    {
      isEquipAtk: true,
      inputType: 'selectButton',
      label: 'Wind Walk 5',
      name: 'Wind Walk',
      dropdown: [
        { label: 'Yes', value: 'Wind Walk==5', skillLv: 5, isUse: true, bonus: { flee: 5 } },
        { label: 'No', value: 0, isUse: false },
      ],
    },
    {
      isEquipAtk: true,
      inputType: 'selectButton',
      label: 'Falcon Eyes 10',
      name: 'Falcon Eyes',
      dropdown: [
        {
          label: 'Yes',
          value: 'Falcon Eyes==10',
          skillLv: 10,
          isUse: true,
          bonus: { dmg: 20, hit: 30, cri: 10, allStatus: 5 },
        },
        { label: 'No', value: 0, isUse: false },
      ],
    },
    {
      isEquipAtk: true,
      inputType: 'dropdown',
      label: 'No Limits',
      name: 'No Limits',
      dropdown: [
        { label: '0', value: 0, isUse: false },
        { label: 'Lv 1', value: 'No Limits==1', skillLv: 1, isUse: true, bonus: { range: 150 } },
        { label: 'Lv 2', value: 'No Limits==2', skillLv: 2, isUse: true, bonus: { range: 200 } },
        { label: 'Lv 3', value: 'No Limits==3', skillLv: 3, isUse: true, bonus: { range: 250 } },
        { label: 'Lv 4', value: 'No Limits==4', skillLv: 4, isUse: true, bonus: { range: 300 } },
        { label: 'Lv 5', value: 'No Limits==5', skillLv: 5, isUse: true, bonus: { range: 350 } },
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
      label: 'Beast Bane',
      name: 'Beast Bane',
      inputType: 'dropdown',
      isMasteryAtk: true,
      dropdown: [
        { label: '0', value: 0, isUse: false },
        { label: '1', value: 1, skillLv: 1, isUse: true, bonus: { atk_race_brute: 4, atk_race_insect: 4 } },
        { label: '2', value: 2, skillLv: 2, isUse: true, bonus: { atk_race_brute: 8, atk_race_insect: 8 } },
        { label: '3', value: 3, skillLv: 3, isUse: true, bonus: { atk_race_brute: 12, atk_race_insect: 12 } },
        { label: '4', value: 4, skillLv: 4, isUse: true, bonus: { atk_race_brute: 16, atk_race_insect: 16 } },
        { label: '5', value: 5, skillLv: 5, isUse: true, bonus: { atk_race_brute: 20, atk_race_insect: 20 } },
        { label: '6', value: 6, skillLv: 6, isUse: true, bonus: { atk_race_brute: 24, atk_race_insect: 24 } },
        { label: '7', value: 7, skillLv: 7, isUse: true, bonus: { atk_race_brute: 28, atk_race_insect: 28 } },
        { label: '8', value: 8, skillLv: 8, isUse: true, bonus: { atk_race_brute: 32, atk_race_insect: 32 } },
        { label: '9', value: 9, skillLv: 9, isUse: true, bonus: { atk_race_brute: 36, atk_race_insect: 36 } },
        { label: '10', value: 10, skillLv: 10, isUse: true, bonus: { atk_race_brute: 40, atk_race_insect: 40 } },
      ],
    },
    {
      label: 'Steel Crow',
      name: 'Steel Crow',
      inputType: 'dropdown',
      isMasteryAtk: true,
      dropdown: [
        { label: '0', value: 0, isUse: false },
        { label: '1', value: 1, skillLv: 1, isUse: true, bonus: { falconDmg: 6 } },
        { label: '2', value: 2, skillLv: 2, isUse: true, bonus: { falconDmg: 12 } },
        { label: '3', value: 3, skillLv: 3, isUse: true, bonus: { falconDmg: 18 } },
        { label: '4', value: 4, skillLv: 4, isUse: true, bonus: { falconDmg: 24 } },
        { label: '5', value: 5, skillLv: 5, isUse: true, bonus: { falconDmg: 30 } },
        { label: '6', value: 6, skillLv: 6, isUse: true, bonus: { falconDmg: 36 } },
        { label: '7', value: 7, skillLv: 7, isUse: true, bonus: { falconDmg: 42 } },
        { label: '8', value: 8, skillLv: 8, isUse: true, bonus: { falconDmg: 48 } },
        { label: '9', value: 9, skillLv: 9, isUse: true, bonus: { falconDmg: 54 } },
        { label: '10', value: 10, skillLv: 10, isUse: true, bonus: { falconDmg: 60 } },
      ],
    },
    {
      isMasteryAtk: true,
      inputType: 'dropdown',
      label: 'Main Ranger',
      name: 'Main Ranger',
      dropdown: [
        { label: '0', value: 0, isUse: false },
        {
          label: '1',
          value: 1,
          skillLv: 1,
          isUse: true,
          bonus: { atk_race_brute: 5, atk_race_plant: 5, atk_race_fish: 5 },
        },
        {
          label: '2',
          value: 2,
          skillLv: 2,
          isUse: true,
          bonus: { atk_race_brute: 10, atk_race_plant: 10, atk_race_fish: 10 },
        },
        {
          label: '3',
          value: 3,
          skillLv: 3,
          isUse: true,
          bonus: { atk_race_brute: 15, atk_race_plant: 15, atk_race_fish: 15 },
        },
        {
          label: '4',
          value: 4,
          skillLv: 4,
          isUse: true,
          bonus: { atk_race_brute: 20, atk_race_plant: 20, atk_race_fish: 20 },
        },
        {
          label: '5',
          value: 5,
          skillLv: 5,
          isUse: true,
          bonus: { atk_race_brute: 25, atk_race_plant: 25, atk_race_fish: 25 },
        },
        {
          label: '6',
          value: 6,
          skillLv: 6,
          isUse: true,
          bonus: { atk_race_brute: 30, atk_race_plant: 30, atk_race_fish: 30 },
        },
        {
          label: '7',
          value: 7,
          skillLv: 7,
          isUse: true,
          bonus: { atk_race_brute: 35, atk_race_plant: 35, atk_race_fish: 35 },
        },
        {
          label: '8',
          value: 8,
          skillLv: 8,
          isUse: true,
          bonus: { atk_race_brute: 40, atk_race_plant: 40, atk_race_fish: 40 },
        },
        {
          label: '9',
          value: 9,
          skillLv: 9,
          isUse: true,
          bonus: { atk_race_brute: 45, atk_race_plant: 45, atk_race_fish: 45 },
        },
        {
          label: '10',
          value: 10,
          skillLv: 10,
          isUse: true,
          bonus: { atk_race_brute: 50, atk_race_plant: 50, atk_race_fish: 50 },
        },
      ],
    },
    {
      label: 'Trap Research',
      name: 'Trap Research',
      inputType: 'dropdown',
      isEquipAtk: true,
      dropdown: [
        { label: '0', value: 0, isUse: false },
        { label: '1', value: 'Trap Research==1', skillLv: 1, isUse: true, bonus: { int: 1, sp: 220 } },
        { label: '2', value: 'Trap Research==2', skillLv: 2, isUse: true, bonus: { int: 2, sp: 240 } },
        { label: '3', value: 'Trap Research==3', skillLv: 3, isUse: true, bonus: { int: 3, sp: 260 } },
        { label: '4', value: 'Trap Research==4', skillLv: 4, isUse: true, bonus: { int: 4, sp: 280 } },
        { label: '5', value: 'Trap Research==5', skillLv: 5, isUse: true, bonus: { int: 5, sp: 300 } },
        { label: '6', value: 'Trap Research==6', skillLv: 6, isUse: true, bonus: { int: 6, sp: 320 } },
        { label: '7', value: 'Trap Research==7', skillLv: 7, isUse: true, bonus: { int: 7, sp: 340 } },
        { label: '8', value: 'Trap Research==8', skillLv: 8, isUse: true, bonus: { int: 8, sp: 360 } },
        { label: '9', value: 'Trap Research==9', skillLv: 9, isUse: true, bonus: { int: 9, sp: 380 } },
        { label: '10', value: 'Trap Research==10', skillLv: 10, isUse: true, bonus: { int: 10, sp: 400 } },
      ],
    },
  ];

  getJobBonusStatus(jobLevel: number) {
    const [str, agi, vit, int, dex, luk] = jobBonusTable[jobLevel];

    return {
      str,
      agi,
      vit,
      int,
      dex,
      luk,
    };
  }
}
