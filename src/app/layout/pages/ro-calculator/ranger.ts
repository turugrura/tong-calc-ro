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
  64: [2, 10, 6, 9, 8, 2],
  65: [2, 11, 7, 9, 8, 3],
};

export class Ranger extends CharacterBase {
  protected initialStatusPoint = 100;
  private _atkSkillList: AtkSkillModel[] = [
    {
      label: 'Arrow Storm Lv10',
      name: 'Arrow Storm',
      value: 'Arrow Storm==10',
      acd: 0,
      fct: 0,
      vct: 0,
      cd: 0,
      hit: 3,
      levelList: [{ label: 'Arrow Storm Lv 10', value: 'Arrow Storm==10' }],
      formular: (input: AtkSkillFormulaInput): number => {
        const { baseLevel, skillLevel, usedSkillSet } = input;
        const baseAtk = usedSkillSet?.has('Fear Breeze') ? 250 : 200;
        const bonus = usedSkillSet?.has('Falcon Eyes') ? 20 : 0;

        // return (baseAtk + 180 * skillLevel) * (baseLevel / 100);
        return (bonus + 1000 + 80 * skillLevel) * (baseLevel / 100);
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

        return (bonus + 150 + skillLevel * 200) * (baseLevel / 100);
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
  private _activeSkillList: ActiveSkillModel[] = [
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
  ];
  private _passiveSkillList: PassiveSkillModel[] = [
    {
      label: "Owl's Eye 10",
      name: "Owl's Eye",
      inputType: 'selectButton',
      isEquipAtk: true,
      dropdown: [
        { label: 'Yes', value: "Owl's Eye==10", skillLv: 10, isUse: true, bonus: { dex: 10 } },
        { label: 'No', value: 0, isUse: false },
      ],
    },
    {
      label: "Vulture's Eye 10",
      name: "Vulture's Eye",
      inputType: 'selectButton',
      isEquipAtk: true,
      dropdown: [
        { label: 'Yes', value: "Vulture's Eye==10", skillLv: 10, isUse: true, bonus: { hit: 10 } },
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
        { label: '1', value: 'Beast Bane==1', skillLv: 1, isUse: true, bonus: { atkRaceBrute: 4, atkRaceInsect: 4 } },
        { label: '2', value: 'Beast Bane==2', skillLv: 2, isUse: true, bonus: { atkRaceBrute: 8, atkRaceInsect: 8 } },
        { label: '3', value: 'Beast Bane==3', skillLv: 3, isUse: true, bonus: { atkRaceBrute: 12, atkRaceInsect: 12 } },
        { label: '4', value: 'Beast Bane==4', skillLv: 4, isUse: true, bonus: { atkRaceBrute: 16, atkRaceInsect: 16 } },
        { label: '5', value: 'Beast Bane==5', skillLv: 5, isUse: true, bonus: { atkRaceBrute: 20, atkRaceInsect: 20 } },
        { label: '6', value: 'Beast Bane==6', skillLv: 6, isUse: true, bonus: { atkRaceBrute: 24, atkRaceInsect: 24 } },
        { label: '7', value: 'Beast Bane==7', skillLv: 7, isUse: true, bonus: { atkRaceBrute: 28, atkRaceInsect: 28 } },
        { label: '8', value: 'Beast Bane==8', skillLv: 8, isUse: true, bonus: { atkRaceBrute: 32, atkRaceInsect: 32 } },
        { label: '9', value: 'Beast Bane==9', skillLv: 9, isUse: true, bonus: { atkRaceBrute: 36, atkRaceInsect: 36 } },
        {
          label: '10',
          value: 'Beast Bane==10',
          skillLv: 10,
          isUse: true,
          bonus: { atkRaceBrute: 40, atkRaceInsect: 40 },
        },
      ],
    },
    {
      label: 'Steel Crow',
      name: 'Steel Crow',
      inputType: 'dropdown',
      isMasteryAtk: true,
      dropdown: [
        { label: '0', value: 0, isUse: false },
        { label: '1', value: 'Steel Crow==1', skillLv: 1, isUse: true, bonus: { falconDmg: 6 } },
        { label: '2', value: 'Steel Crow==2', skillLv: 2, isUse: true, bonus: { falconDmg: 12 } },
        { label: '3', value: 'Steel Crow==3', skillLv: 3, isUse: true, bonus: { falconDmg: 18 } },
        { label: '4', value: 'Steel Crow==4', skillLv: 4, isUse: true, bonus: { falconDmg: 24 } },
        { label: '5', value: 'Steel Crow==5', skillLv: 5, isUse: true, bonus: { falconDmg: 30 } },
        { label: '6', value: 'Steel Crow==6', skillLv: 6, isUse: true, bonus: { falconDmg: 36 } },
        { label: '7', value: 'Steel Crow==7', skillLv: 7, isUse: true, bonus: { falconDmg: 42 } },
        { label: '8', value: 'Steel Crow==8', skillLv: 8, isUse: true, bonus: { falconDmg: 48 } },
        { label: '9', value: 'Steel Crow==9', skillLv: 9, isUse: true, bonus: { falconDmg: 54 } },
        { label: '10', value: 'Steel Crow==10', skillLv: 10, isUse: true, bonus: { falconDmg: 60 } },
      ],
    },
    {
      isMasteryAtk: true,
      inputType: 'dropdown',
      label: 'Main Ranger',
      name: 'Main Ranger',
      dropdown: [
        { label: '0', value: 0, isUse: false },
        { label: '1', value: 'Main Ranger==1', skillLv: 1, isUse: true, bonus: { atk: 5 } },
        { label: '2', value: 'Main Ranger==2', skillLv: 2, isUse: true, bonus: { atk: 10 } },
        { label: '3', value: 'Main Ranger==3', skillLv: 3, isUse: true, bonus: { atk: 15 } },
        { label: '4', value: 'Main Ranger==4', skillLv: 4, isUse: true, bonus: { atk: 20 } },
        { label: '5', value: 'Main Ranger==5', skillLv: 5, isUse: true, bonus: { atk: 25 } },
        { label: '6', value: 'Main Ranger==6', skillLv: 6, isUse: true, bonus: { atk: 30 } },
        { label: '7', value: 'Main Ranger==7', skillLv: 7, isUse: true, bonus: { atk: 35 } },
        { label: '8', value: 'Main Ranger==8', skillLv: 8, isUse: true, bonus: { atk: 40 } },
        { label: '9', value: 'Main Ranger==9', skillLv: 9, isUse: true, bonus: { atk: 45 } },
        { label: '10', value: 'Main Ranger==10', skillLv: 10, isUse: true, bonus: { atk: 50 } },
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

  get atkSkills() {
    return this._atkSkillList;
  }

  get passiveSkills() {
    return this._passiveSkillList;
  }

  get activeSkills() {
    return this._activeSkillList;
  }

  getSkillBonusAndName(params: { activeIds: number[]; passiveIds: number[] }) {
    const equipAtks: Record<string, any> = {};
    const masteryAtks: Record<string, any> = {};
    const skillNames = [];
    const learnedSkillMap = new Map<string, number>();

    const { activeIds, passiveIds } = params;
    this._activeSkillList.forEach((skill, index) => {
      const { bonus, isUse, skillLv } = skill.dropdown.find((x) => x.value === activeIds[index]) ?? {};
      if (isUse) learnedSkillMap.set(skill.name, skillLv);
      if (!bonus) return;

      skillNames.push(skill.name);

      const { isEquipAtk, isMasteryAtk } = skill;
      if (isEquipAtk) {
        equipAtks[skill.name] = bonus;
      } else if (isMasteryAtk) {
        masteryAtks[skill.name] = bonus;
      }
    });

    this._passiveSkillList.forEach((skill, index) => {
      const { bonus, isUse, skillLv } = (skill.dropdown as any[]).find((x) => x.value === passiveIds[index]) ?? {};
      if (isUse) learnedSkillMap.set(skill.name, skillLv);
      if (!bonus) return;

      skillNames.push(skill.name);

      const { isEquipAtk, isMasteryAtk } = skill;
      if (isEquipAtk) {
        equipAtks[skill.name] = bonus;
      } else if (isMasteryAtk) {
        masteryAtks[skill.name] = bonus;
      }
    });

    return { skillNames, equipAtks, masteryAtks, learnedSkillMap };
  }

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
