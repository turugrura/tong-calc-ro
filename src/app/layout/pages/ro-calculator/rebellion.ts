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
  [0, 1, 1, 2, 2, 1],
  [0, 1, 1, 2, 2, 1],
  [0, 1, 1, 2, 2, 1],
  [0, 1, 2, 2, 2, 1],
  [0, 1, 2, 3, 2, 1],
  [0, 1, 2, 3, 2, 1],
  [0, 2, 2, 3, 2, 1],
  [0, 2, 2, 3, 3, 1],
  [0, 2, 2, 4, 3, 1],
  [0, 2, 3, 4, 3, 1],
  [0, 2, 3, 4, 3, 2],
  [0, 2, 3, 4, 3, 2],
  [0, 2, 3, 4, 3, 2],
  [0, 2, 4, 4, 3, 2],
  [0, 2, 4, 4, 4, 2],
  [1, 2, 4, 4, 4, 2],
  [1, 2, 4, 5, 4, 2],
  [1, 3, 4, 5, 4, 2],
  [1, 3, 4, 5, 4, 2],
  [1, 3, 4, 5, 4, 2],
  [1, 3, 4, 5, 4, 3],
  [1, 3, 5, 5, 4, 3],
  [1, 3, 5, 5, 4, 3],
  [1, 3, 5, 5, 5, 3],
  [1, 3, 5, 6, 5, 3],
  [2, 3, 5, 6, 5, 3],
  [2, 3, 5, 6, 5, 3],
  [2, 3, 5, 6, 5, 3],
  [2, 3, 5, 6, 6, 3],
  [2, 3, 5, 6, 6, 3],
  [2, 4, 5, 6, 6, 3],
  [2, 4, 5, 6, 6, 4],
  [2, 4, 5, 6, 6, 4],
  [2, 4, 5, 6, 7, 4],
  [2, 4, 6, 6, 7, 4],
  [2, 4, 6, 7, 7, 4],
  [2, 4, 6, 7, 7, 4],
  [2, 4, 6, 7, 7, 4],
  [2, 4, 6, 7, 7, 4],
  [2, 4, 6, 7, 7, 4],
  [3, 4, 6, 7, 7, 4],
  [3, 5, 6, 7, 7, 4],
  [3, 5, 6, 7, 7, 5],
  [3, 5, 6, 7, 7, 5],
  [3, 5, 6, 8, 7, 5],
  [3, 5, 6, 8, 8, 5],
  [3, 5, 6, 8, 8, 5],
  [3, 6, 6, 8, 8, 5],
  [3, 6, 6, 8, 8, 5],
  [3, 6, 6, 8, 8, 5],
  [3, 6, 6, 8, 8, 5],
  [3, 6, 6, 8, 8, 5],
  [3, 6, 6, 8, 8, 5],
  [3, 6, 6, 8, 8, 5],
  [3, 6, 6, 8, 8, 5],
  [3, 6, 6, 8, 8, 5],
];

export class Rebelion {
  private _level = 1;
  private _atkSkillList = [
    {
      label: 'Round Trip',
      name: 'Round Trip',
      value: 'Round Trip',
      formular: ({
        baseLevel,
        skillLevel,
      }: {
        baseLevel: number;
        skillLevel: number;
      }): number => {
        return (skillLevel * 200 + 500) * (baseLevel / 100);
      },
    },
  ];
  private _activeSkillList = [
    {
      isEquip: true,
      inputType: 'selectButton',
      label: 'Platinum Altar',
      name: 'Platinum Altar',
      dropdown: [
        {
          label: 'Yes',
          value: 1,
          skillLv: 1,
          isUse: true,
          bonus: { atk: 150 },
        },
        { label: 'No', value: 2, isUse: false },
      ],
    },
    {
      isMastery: true,
      inputType: 'selectButton',
      label: "Rich's Coin",
      name: "Rich's Coin",
      dropdown: [
        { label: 'Yes', value: 1, skillLv: 5, isUse: true, bonus: { atk: 30 } },
        { label: 'No', value: 2, isUse: false },
      ],
    },
  ];
  private _passiveSkillList = [
    {
      isEquip: true,
      isMastery: false,
      inputType: 'dropdown',
      label: 'Snake Eyes',
      name: 'Snake Eyes',
      dropdown: [
        { label: '0', value: 0, isUse: false, bonus: undefined },
        { label: '1', value: 1, skillLv: 1, isUse: true, bonus: { hit: 1 } },
        { label: '2', value: 2, skillLv: 2, isUse: true, bonus: { hit: 2 } },
        { label: '3', value: 3, skillLv: 3, isUse: true, bonus: { hit: 3 } },
        { label: '4', value: 4, skillLv: 4, isUse: true, bonus: { hit: 4 } },
        { label: '5', value: 5, skillLv: 5, isUse: true, bonus: { hit: 5 } },
        { label: '6', value: 6, skillLv: 6, isUse: true, bonus: { hit: 6 } },
        { label: '7', value: 7, skillLv: 7, isUse: true, bonus: { hit: 7 } },
        { label: '8', value: 8, skillLv: 8, isUse: true, bonus: { hit: 8 } },
        { label: '9', value: 9, skillLv: 9, isUse: true, bonus: { hit: 9 } },
        {
          label: '10',
          value: 10,
          skillLv: 10,
          isUse: true,
          bonus: { hit: 10 },
        },
      ],
    },
    {
      label: 'Chain Action Lv10',
      name: 'Chain Action',
      dropdown: [
        { label: 'Yes', value: 10, skillLv: 10, isUse: true, bonus: undefined },
        { label: 'No', value: 0, isUse: false },
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
      const { bonus, isUse, skillLv } = skill.dropdown.find(
        (x) => x.value === activeIds[index]
      );
      if (isUse) learnedSkillMap.set(skill.name, skillLv);
      if (!bonus) return;

      skillNames.push(skill.label);

      const { isEquip, isMastery } = skill;
      if (isEquip) {
        equipAtks[skill.name] = bonus;
      } else if (isMastery) {
        masteryAtks[skill.name] = bonus;
      }
    });

    this._passiveSkillList.forEach((skill, index) => {
      const { bonus, isUse, skillLv } =
        (skill.dropdown as any[]).find((x) => x.value === passiveIds[index]) ??
        {};
      if (isUse) learnedSkillMap.set(skill.name, skillLv);
      if (!bonus) return;

      skillNames.push(skill.label);

      const { isEquip, isMastery } = skill;
      if (isEquip) {
        equipAtks[skill.name] = bonus;
      } else if (isMastery) {
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
