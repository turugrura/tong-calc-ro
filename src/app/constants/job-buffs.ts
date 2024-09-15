import { ActiveSkillModel } from '../jobs/_character-base.abstract';
import { BragisPoemFn, DarkClawFn, ShieldSpellFn } from './share-active-skills';

export const JobBuffs: ActiveSkillModel[] = [
  {
    name: 'Cantocandidus',
    label: 'Agi Up',
    inputType: 'dropdown',
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
    name: 'Clementia',
    label: 'Blessing',
    inputType: 'dropdown',
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
    name: 'Impositio Manus',
    label: 'Impositio 5',
    inputType: 'selectButton',
    dropdown: [
      { label: 'Yes', isUse: true, value: 5, bonus: { atk: 25, matk: 25 } },
      { label: 'No', isUse: false, value: 0 },
    ],
  },
  {
    name: 'Expiatio',
    label: 'Expiatio 5',
    inputType: 'selectButton',
    dropdown: [
      { label: 'Yes', isUse: true, value: 5, bonus: { p_pene_race_all: 25, m_pene_race_all: 25 } },
      { label: 'No', isUse: false, value: 0 },
    ],
  },
  {
    name: '_Religio_Benedictum',
    label: 'All Trait 10',
    inputType: 'selectButton',
    dropdown: [
      { label: 'Yes', isUse: true, value: 5, bonus: { spl: 10, wis: 10, sta: 10, pow: 10, crt: 10, con: 10 } },
      { label: 'No', isUse: false, value: 0 },
    ],
  },
  {
    name: '_Argutus Vita_Telum',
    label: 'เจาะ M/Res 25',
    inputType: 'selectButton',
    dropdown: [
      { label: 'Yes', isUse: true, value: 5, bonus: { pene_res: 25, pene_mres: 25 } },
      { label: 'No', isUse: false, value: 0 },
    ],
  },
  // {
  //   name: 'Religio',
  //   label: 'Religio 5',
  //   inputType: 'selectButton',
  //   dropdown: [
  //     { label: 'Yes', isUse: true, value: 5, bonus: { spl: 10, wis: 10, sta: 10 } },
  //     { label: 'No', isUse: false, value: 0 },
  //   ],
  // },
  // {
  //   name: 'Benedictum',
  //   label: 'Benedictum 5',
  //   inputType: 'selectButton',
  //   dropdown: [
  //     { label: 'Yes', isUse: true, value: 5, bonus: { pow: 10, crt: 10, con: 10 } },
  //     { label: 'No', isUse: false, value: 0 },
  //   ],
  // },
  // {
  //   name: 'Argutus Vita',
  //   label: 'Argutus Vita 5',
  //   inputType: 'selectButton',
  //   dropdown: [
  //     { label: 'Yes', isUse: true, value: 5, bonus: { pene_mres: 25 } },
  //     { label: 'No', isUse: false, value: 0 },
  //   ],
  // },
  // {
  //   name: 'Argutus Telum',
  //   label: 'Argutus Telum 5',
  //   inputType: 'selectButton',
  //   dropdown: [
  //     { label: 'Yes', isUse: true, value: 5, bonus: { pene_res: 25 } },
  //     { label: 'No', isUse: false, value: 0 },
  //   ],
  // },
  {
    name: 'Presens Acies',
    label: 'Presens Acies 5',
    inputType: 'selectButton',
    dropdown: [
      { label: 'Yes', isUse: true, value: 5, bonus: { cRate: 10 } },
      { label: 'No', isUse: false, value: 0 },
    ],
  },
  {
    name: 'Crazy Uproar',
    label: 'Crazy Uproar',
    inputType: 'selectButton',
    isMasteryAtk: true,
    dropdown: [
      { label: 'Yes', value: 1, skillLv: 1, isUse: true, bonus: { str: 4, atk: 30 } },
      { label: 'No', value: 0, isUse: false },
    ],
  },
  {
    name: 'Adrenaline Rush',
    label: 'Adrenaline 5',
    inputType: 'selectButton',
    dropdown: [
      { label: 'Yes', value: 5, skillLv: 5, isUse: true, bonus: { hit: 20, skillAspd: 5 } },
      { label: 'No', value: 0, isUse: false },
    ],
  },
  {
    name: 'Power Thrust',
    label: 'Power Thrust 5',
    inputType: 'selectButton',
    dropdown: [
      { label: 'Yes', value: 5, skillLv: 5, isUse: true, bonus: { flatDmg: 15 } },
      { label: 'No', value: 0, isUse: false },
    ],
  },
  {
    label: 'Weapon Perfect 5',
    inputType: 'selectButton',
    name: 'Weapon Perfection',
    dropdown: [
      { label: 'Yes', value: 5, skillLv: 5, isUse: true, bonus: { ignore_size_penalty: 1 } },
      { label: 'No', value: 0, isUse: false },
    ],
  },
  {
    name: 'Soul',
    label: 'Soul 5',
    inputType: 'dropdown',
    dropdown: [
      { label: '-', isUse: false, value: 0 },
      { label: 'Shadow Soul', isUse: true, value: 1, bonus: { cri: 20, aspd: 3 } },
      { label: 'Fairy Soul', isUse: true, value: 2, bonus: { matk: 50, vct: 10 } },
      { label: 'Falcon Soul', isUse: true, value: 3, bonus: { atk: 50, hit: 15 } },
    ],
  },
  {
    name: "Odin's Power",
    label: "Odin's Power",
    inputType: 'dropdown',
    dropdown: [
      { label: '-', isUse: false, value: 0 },
      { label: 'Lv 1', isUse: true, value: 1, bonus: { atk: 70, matk: 70, def: -20, mdef: -20 } },
      { label: 'Lv 2', isUse: true, value: 2, bonus: { atk: 100, matk: 100, def: -40, mdef: -40 } },
    ],
  },
  {
    name: 'Comet Amp',
    label: 'Comet Amp',
    inputType: 'selectButton',
    isDebuff: true,
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
    name: 'Moonlight Serenade',
    label: 'Moonlight Ser 5',
    inputType: 'dropdown',
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
    name: 'Striking',
    label: 'Striking 5',
    inputType: 'selectButton',
    isEquipAtk: true,
    dropdown: [
      { label: 'Yes', isUse: true, value: 20, bonus: { atk: 100, perfectHit: 70 } },
      { label: 'No', isUse: false, value: 0 },
    ],
  },
  {
    name: 'Raid',
    label: 'Raid',
    inputType: 'selectButton',
    isDebuff: true,
    dropdown: [
      { label: 'Yes', isUse: true, value: 1, bonus: { raid: 1 } },
      { label: 'No', isUse: false, value: 0 },
    ],
  },
  DarkClawFn(),
  ShieldSpellFn(),
  BragisPoemFn(),
  // SwingDanceFn(),
  {
    name: 'Mystical Amplification',
    label: 'Mystical Amp 10',
    inputType: 'selectButton',
    dropdown: [
      { label: 'Yes', isUse: true, value: 1, bonus: { mysticAmp: 50 } },
      { label: 'No', isUse: false, value: 0 },
    ],
  },
  {
    name: 'Spell Enchanting',
    label: 'Spell Enchanting 5',
    inputType: 'selectButton',
    dropdown: [
      { label: 'Yes', isUse: true, value: 5, bonus: { sMatk: 5 * 4 } },
      { label: 'No', isUse: false, value: 0 },
    ],
  },
  // {
  //   name: 'Geffenia Nocturne',
  //   label: 'Geffenia Nocturne 10',
  //   inputType: 'selectButton',
  //   isDebuff: true,
  //   dropdown: [
  //     { label: 'Yes', isUse: true, value: 10, bonus: { monster_mres: -10*10 } },
  //     { label: 'No', isUse: false, value: 0 },
  //   ],
  // },
  // {
  //   name: 'Rhapsody of Mineworker',
  //   label: 'Rhapsody of Mineworker 10',
  //   inputType: 'selectButton',
  //   isDebuff: true,
  //   dropdown: [
  //     { label: 'Yes', isUse: true, value: 10, bonus: { monster_res: -10*10 } },
  //     { label: 'No', isUse: false, value: 0 },
  //   ],
  // },
  {
    name: '_Trouvere_Troubadour_ignore_res_mres',
    label: 'M/Res -100',
    inputType: 'selectButton',
    isDebuff: true,
    dropdown: [
      { label: 'Yes', isUse: true, value: 10, bonus: { monster_res: -10 * 10, monster_mres: -10 * 10 } },
      { label: 'No', isUse: false, value: 0 },
    ],
  },
  // {
  //   name: 'Serenade of Jawaii',
  //   label: 'Serenade of Jawaii 5',
  //   inputType: 'selectButton',
  //   isDebuff: true,
  //   dropdown: [
  //     { label: 'Yes', isUse: true, value: 5, bonus: { sMatk: 5*3 } },
  //     { label: 'No', isUse: false, value: 0 },
  //   ],
  // },
  // {
  //   name: 'March of Prontera',
  //   label: 'Serenade of Jawaii 5',
  //   inputType: 'selectButton',
  //   isDebuff: true,
  //   dropdown: [
  //     { label: 'Yes', isUse: true, value: 5, bonus: { pAtk: 5*3 } },
  //     { label: 'No', isUse: false, value: 0 },
  //   ],
  // },
  {
    name: '_Trouvere_Troubadour_pAtk_sMatk',
    label: '+ P.ATK S.Matk',
    inputType: 'dropdown',
    dropdown: [
      { label: '-', isUse: false, value: 0 },
      { label: '+ 15', isUse: true, value: 5, bonus: { sMatk: 15, pAtk: 15 } },
      { label: '+ 22', isUse: true, value: 6, bonus: { sMatk: 22, pAtk: 22 } },
    ],
  },
  // {
  //   name: 'Climax',
  //   label: 'Climax',
  //   inputType: 'dropdown',
  //   dropdown: [
  //     { label: '-', value: 0, isUse: false },
  //     { label: 'Lv 1', value: 1, isUse: true, bonus:{def: 300, mdef: 100, m_my_element_water: 30} },
  //     { label: 'Lv 2', value: 2, isUse: true },
  //     { label: 'Lv 3', value: 3, isUse: true },
  //     { label: 'Lv 4', value: 4, isUse: true },
  //     { label: 'Lv 5', value: 5, isUse: true },
  //   ],
  // },
];
