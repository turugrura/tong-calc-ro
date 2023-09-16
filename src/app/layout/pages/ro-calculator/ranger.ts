import {
  ActiveSkillModel,
  AtkSkillFormulaInput,
  AtkSkillModel,
  CharacterBase,
  PassiveSkillModel,
} from './char-class.abstract';

const jobBonusTable: [number, number, number, number, number, number][] = [
  [0, 0, 0, 0, 0, 0], // job 0
  [0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 1, 0],
  [0, 0, 0, 0, 1, 0],
  [0, 0, 0, 1, 1, 0],
  [0, 0, 0, 1, 1, 0],
  [0, 0, 1, 1, 1, 0],
  [0, 0, 1, 1, 2, 0],
  [0, 0, 1, 2, 2, 0],
  [0, 1, 1, 2, 2, 0],
  [0, 1, 1, 2, 2, 0],
  [0, 1, 1, 2, 2, 0],
  [0, 1, 1, 2, 2, 0],
  [0, 1, 2, 2, 2, 0],
  [0, 1, 2, 3, 2, 0],
  [0, 1, 2, 3, 2, 0],
  [0, 2, 2, 3, 2, 0],
  [0, 2, 2, 3, 3, 0],
  [0, 2, 2, 4, 3, 0],
  [0, 2, 3, 4, 3, 0],
  [0, 2, 3, 4, 3, 0],
  [0, 2, 3, 4, 3, 0],
  [0, 2, 3, 4, 3, 0],
  [0, 2, 4, 4, 3, 0],
  [0, 2, 4, 4, 4, 0],
  [1, 2, 4, 4, 4, 0],
  [1, 2, 4, 5, 4, 0],
  [1, 3, 4, 5, 4, 0],
  [1, 3, 4, 5, 4, 0],
  [1, 3, 4, 5, 4, 0],
  [1, 3, 4, 5, 4, 0],
  [1, 3, 5, 5, 4, 0],
  [1, 3, 5, 5, 4, 0],
  [1, 3, 5, 5, 5, 0],
  [1, 3, 5, 6, 5, 0],
  [2, 3, 5, 6, 5, 0],
  [2, 3, 5, 6, 5, 0],
  [2, 3, 5, 6, 5, 0],
  [2, 3, 5, 6, 6, 0],
  [2, 3, 5, 6, 6, 0],
  [2, 4, 5, 6, 6, 0],
  [2, 4, 5, 6, 6, 0],
  [2, 4, 5, 6, 6, 0],
  [2, 4, 5, 6, 6, 0],
  [2, 4, 6, 6, 6, 0],
  [2, 4, 6, 7, 6, 0],
  [2, 7, 5, 8, 6, 0], //
  [2, 7, 5, 8, 6, 1],
  [2, 7, 5, 8, 6, 1],
  [2, 7, 5, 8, 6, 1],
  [2, 7, 5, 8, 6, 1],
  [2, 8, 5, 8, 6, 1],
  [2, 7, 5, 8, 6, 1],
  [2, 7, 5, 8, 6, 1],
  [2, 7, 5, 9, 7, 1],
  [2, 9, 5, 9, 7, 1], //
  [2, 9, 5, 9, 7, 3],
  [2, 9, 5, 9, 7, 3],
  [2, 9, 5, 9, 7, 3],
  [2, 9, 5, 9, 7, 3],
  [2, 9, 5, 9, 7, 3],
  [2, 9, 5, 9, 7, 3],
  [2, 9, 5, 9, 7, 3],
  [3, 7, 10, 8, 10, 3],
  [3, 7, 10, 8, 10, 3],
  [3, 7, 10, 8, 10, 3],
];

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
      levelList: [{ label: 'Arrow Storm Lv 10', value: 'Arrow Storm==10' }],
      formular: (input: AtkSkillFormulaInput<{}>): number => {
        const { baseLevel, skillLevel, usedSkillSet } = input;
        const baseAtk = usedSkillSet?.has('Fear Breeze') ? 250 : 200;
        const bonus = usedSkillSet?.has('Falcon Eyes') ? 20 : 0;

        // return (baseAtk + 180 * skillLevel) * (baseLevel / 100);
        return (1000 + bonus + 80 * skillLevel) * (baseLevel / 100);
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
      formular: (input: AtkSkillFormulaInput<{}>): number => {
        const { baseLevel, skillLevel, usedSkillSet } = input;

        return (150 + skillLevel * 200) * (baseLevel / 100);
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

      skillNames.push(skill.label);

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

      skillNames.push(skill.label);

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

  override calcSkillDmgByTotalHit(finalDamage: number, skillName: string): number {
    if (skillName === 'Arrow Storm') {
      return Math.floor(finalDamage / 3) * 3;
    }

    return finalDamage;
  }
}
