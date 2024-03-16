import { ActiveSkillModel } from '../jobs/_character-base.abstract';
import { DarkClawFn, ShieldSpellFn } from './share-active-skills';

export const JobBuffs: ActiveSkillModel[] = [
  {
    inputType: 'dropdown',
    label: 'Agi Up',
    name: 'Cantocandidus',
    dropdown: [
      { label: '-', value: 0, isUse: false },
      { label: 'Lv 3', value: 3, isUse: true, bonus: { agi: 5, aspdPercent: 3 } },
      { label: 'Lv 10', value: 10, isUse: true, bonus: { agi: 12, aspdPercent: 10 } },
      { label: 'Job 20', value: 12, isUse: true, bonus: { agi: 14, aspdPercent: 12 } },
      { label: 'Job 30', value: 13, isUse: true, bonus: { agi: 15, aspdPercent: 13 } },
      { label: 'Job 40', value: 14, isUse: true, bonus: { agi: 16, aspdPercent: 14 } },
      { label: 'Job 50', value: 15, isUse: true, bonus: { agi: 17, aspdPercent: 15 } },
      { label: 'Job 60', value: 16, isUse: true, bonus: { agi: 18, aspdPercent: 16 } },
      { label: 'Job 70', value: 17, isUse: true, bonus: { agi: 19, aspdPercent: 17 } },
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
      { label: 'Job 70', value: 17, isUse: true, bonus: { str: 17, int: 17, dex: 17, hit: 27 } },
    ],
  },
  {
    inputType: 'selectButton',
    label: 'Impositio 5',
    name: 'Impositio Manus',
    dropdown: [
      { label: 'Yes', isUse: true, value: 5, bonus: { atk: 25, matk: 25 } },
      { label: 'No', isUse: false, value: 0 },
    ],
  },
  {
    inputType: 'selectButton',
    label: 'Expiatio 5',
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
    label: 'Adrenaline 5',
    name: 'Adrenaline Rush',
    inputType: 'selectButton',
    dropdown: [
      { label: 'Yes', value: 5, skillLv: 5, isUse: true, bonus: { hit: 20, skillAspd: 5 } },
      { label: 'No', value: 0, isUse: false },
    ],
  },
  {
    label: 'Power Thrust 5',
    name: 'Power Thrust',
    inputType: 'selectButton',
    dropdown: [
      { label: 'Yes', value: 5, skillLv: 5, isUse: true, bonus: { flatDmg: 15 } },
      { label: 'No', value: 0, isUse: false },
    ],
  },
  {
    inputType: 'selectButton',
    label: 'Weapon Perfect 5',
    name: 'Weapon Perfection',
    dropdown: [
      { label: 'Yes', value: 5, skillLv: 5, isUse: true, bonus: { ignore_size_penalty: 1 } },
      { label: 'No', value: 0, isUse: false },
    ],
  },
  {
    inputType: 'dropdown',
    label: 'Soul 5',
    name: 'Soul',
    dropdown: [
      { label: '-', isUse: false, value: 0 },
      { label: 'Shadow Soul', isUse: true, value: 1, bonus: { cri: 20, aspd: 3 } },
      { label: 'Fairy Soul', isUse: true, value: 2, bonus: { matk: 50, vct: 10 } },
      { label: 'Falcon Soul', isUse: true, value: 3, bonus: { atk: 50, hit: 15 } },
    ],
  },
  {
    inputType: 'dropdown',
    label: "Odin's Power",
    name: "Odin's Power",
    dropdown: [
      { label: '-', isUse: false, value: 0 },
      { label: 'Lv 1', isUse: true, value: 1, bonus: { atk: 70, matk: 70, def: -20, mdef: -20 } },
      { label: 'Lv 2', isUse: true, value: 2, bonus: { atk: 100, matk: 100, def: -40, mdef: -40 } },
    ],
  },
  {
    inputType: 'selectButton',
    label: '[Debuff] Comet Amp',
    name: 'Comet Amp',
    dropdown: [
      { label: 'Yes', isUse: true, value: 1, bonus: { comet: 50 } },
      { label: 'No', isUse: false, value: 0 },
    ],
  },
  {
    label: 'Magnum Break',
    name: 'Magnum Break',
    inputType: 'dropdown',
    dropdown: [
      { label: '-', value: 0, isUse: false },
      { label: 'Active', value: 1, isUse: true, bonus: { magnumBreakPsedoBonus: 1 } },
      { label: 'Clear EDP', value: 2, isUse: true, bonus: { magnumBreakClearEDP: 1 } },
    ],
  },
  {
    label: 'Bunch of Shrimp',
    name: 'Bunch of Shrimp',
    inputType: 'selectButton',
    dropdown: [
      { label: 'Yes', isUse: true, value: 1, bonus: { atkPercent: 10, matkPercent: 10 } },
      { label: 'No', isUse: false, value: 0 },
    ],
  },
  {
    inputType: 'dropdown',
    label: 'Moonlight Ser 5',
    name: 'Moonlight Serenade',
    dropdown: [
      { label: '-', isUse: false, value: 0 },
      { label: 'Job 30', value: 13, isUse: true, bonus: { matk: 46 } },
      { label: 'Job 40', value: 14, isUse: true, bonus: { matk: 48 } },
      { label: 'Job 50', value: 15, isUse: true, bonus: { matk: 50 } },
      { label: 'Job 60', value: 16, isUse: true, bonus: { matk: 52 } },
      { label: 'Job 70', value: 17, isUse: true, bonus: { matk: 54 } },
    ],
  },
  {
    inputType: 'dropdown',
    label: 'Striking 5',
    name: 'Striking',
    dropdown: [
      { label: '-', isUse: false, value: 0 },
      { label: '20 EndowLv', isUse: true, value: 20, bonus: { strikingEndowSkillLv: 20, cri: 5 } },
      { label: '10 EndowLv', isUse: true, value: 10, bonus: { strikingEndowSkillLv: 10, cri: 5 } },
    ],
  },
  {
    inputType: 'selectButton',
    label: '[Debuff] Raid',
    name: 'Raid',
    dropdown: [
      { label: 'Yes', isUse: true, value: 1, bonus: { raid: 1 } },
      { label: 'No', isUse: false, value: 0 },
    ],
  },
  DarkClawFn(),
  ShieldSpellFn(),
];
