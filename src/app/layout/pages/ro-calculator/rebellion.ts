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
  private _atkSkillList = [];
  private _buffSkillList = [
    {
      isEquip: true,
      inputType: 'selectButton',
      label: 'Platinum Altar',
      dropdown: [
        { label: 'Yes', value: 1, bonus: { atk: 150 } },
        { label: 'No', value: 2 },
      ],
    },
    {
      isMastery: true,
      inputType: 'selectButton',
      label: "Rich's Coin",
      dropdown: [
        { label: 'Yes', value: 1, bonus: { atk: 30 } },
        { label: 'No', value: 2 },
      ],
    },
  ];
  private _passiveSkillList = [];

  get activeSkills() {
    return this._buffSkillList;
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
