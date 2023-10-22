import { ActiveSkillModel } from '../jobs/_character-base.abstract';

export const JobBuffs: ActiveSkillModel[] = [
  {
    inputType: 'dropdown',
    label: 'Agi Up',
    name: 'Cantocandidus',
    dropdown: [
      { label: '-', value: 0, isUse: false },
      { label: 'Lv 10', value: 10, isUse: true, bonus: { agi: 12, aspdPercent: 10 } },
      { label: 'Job 20', value: 12, isUse: true, bonus: { agi: 14, aspdPercent: 12 } },
      { label: 'Job 30', value: 13, isUse: true, bonus: { agi: 15, aspdPercent: 13 } },
      { label: 'Job 40', value: 14, isUse: true, bonus: { agi: 16, aspdPercent: 14 } },
      { label: 'Job 50', value: 15, isUse: true, bonus: { agi: 17, aspdPercent: 15 } },
      { label: 'Job 60', value: 16, isUse: true, bonus: { agi: 18, aspdPercent: 16 } },
    ],
  },
  {
    inputType: 'dropdown',
    label: 'Blessing',
    name: 'Clementia',
    dropdown: [
      { label: '-', value: 0, isUse: false },
      { label: 'Lv 10', value: 10, isUse: true, bonus: { str: 10, int: 10, dex: 10, hit: 20 } },
      { label: 'Job 20', value: 12, isUse: true, bonus: { str: 12, int: 12, dex: 12, hit: 22 } },
      { label: 'Job 30', value: 13, isUse: true, bonus: { str: 13, int: 13, dex: 13, hit: 23 } },
      { label: 'Job 40', value: 14, isUse: true, bonus: { str: 14, int: 14, dex: 14, hit: 24 } },
      { label: 'Job 50', value: 15, isUse: true, bonus: { str: 15, int: 15, dex: 15, hit: 25 } },
      { label: 'Job 60', value: 16, isUse: true, bonus: { str: 16, int: 16, dex: 16, hit: 26 } },
    ],
  },
  {
    inputType: 'selectButton',
    label: 'Impositio Lv5',
    name: 'Impositio Manus',
    dropdown: [
      { label: 'Yes', isUse: true, value: 5, bonus: { atk: 25, matk: 25 } },
      { label: 'No', isUse: false, value: 0 },
    ],
  },
  {
    inputType: 'selectButton',
    label: 'Expiatio Lv5',
    name: 'Expiatio',
    dropdown: [
      { label: 'Yes', isUse: true, value: 5, bonus: { p_pene_race_all: 25, m_pene_race_all: 25 } },
      { label: 'No', isUse: false, value: 0 },
    ],
  },
  {
    label: 'Crazy Uproar',
    name: 'Crazy Uproar',
    inputType: 'selectButton',
    isMasteryAtk: true,
    dropdown: [
      { label: 'Yes', value: 1, skillLv: 1, isUse: true, bonus: { str: 4, atk: 30 } },
      { label: 'No', value: 0, isUse: false },
    ],
  },
  {
    label: 'Adrenaline Lv5',
    name: 'Adrenaline Rush',
    inputType: 'selectButton',
    dropdown: [
      { label: 'Yes', value: 5, skillLv: 5, isUse: true, bonus: { hit: 20, skillAspd: 5 } },
      { label: 'No', value: 0, isUse: false },
    ],
  },
  {
    label: 'Power Thrust Lv5',
    name: 'Power Thrust',
    inputType: 'selectButton',
    dropdown: [
      { label: 'Yes', value: 5, skillLv: 5, isUse: true, bonus: { flatDmg: 15 } },
      { label: 'No', value: 0, isUse: false },
    ],
  },
  {
    inputType: 'selectButton',
    label: 'Weapon Perfect Lv5',
    name: 'Weapon Perfection',
    dropdown: [
      { label: 'Yes', value: 5, skillLv: 5, isUse: true, bonus: { ignore_size_penalty: 1 } },
      { label: 'No', value: 0, isUse: false },
    ],
  },
  {
    inputType: 'dropdown',
    label: 'Soul Lv5',
    name: 'Soul',
    dropdown: [
      { label: '-', isUse: false, value: 0 },
      { label: 'Shadow Soul', isUse: true, value: 1, bonus: { cri: 20, aspd: 3 } },
      { label: 'Fairy Soul', isUse: true, value: 2, bonus: { matk: 50, vct: 10 } },
      { label: 'Falcon Soul', isUse: true, value: 3, bonus: { atk: 50, hit: 15 } },
    ],
  },
];
