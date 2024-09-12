import { PassiveSkillModel } from '../../jobs/_character-base.abstract';

export const DemonBane: PassiveSkillModel = {
  inputType: 'dropdown',
  label: 'Demon Bane',
  name: 'Demon Bane',
  isMasteryAtk: true,
  dropdown: [
    { label: '-', value: 0, isUse: false },
    { label: 'Lv 1', value: 1, isUse: true, bonus: { x_race_demon_atk: 3, x_element_undead_atk: 3 } },
    { label: 'Lv 2', value: 2, isUse: true, bonus: { x_race_demon_atk: 6, x_element_undead_atk: 6 } },
    { label: 'Lv 3', value: 3, isUse: true, bonus: { x_race_demon_atk: 9, x_element_undead_atk: 9 } },
    { label: 'Lv 4', value: 4, isUse: true, bonus: { x_race_demon_atk: 12, x_element_undead_atk: 12 } },
    { label: 'Lv 5', value: 5, isUse: true, bonus: { x_race_demon_atk: 15, x_element_undead_atk: 15 } },
    { label: 'Lv 6', value: 6, isUse: true, bonus: { x_race_demon_atk: 18, x_element_undead_atk: 18 } },
    { label: 'Lv 7', value: 7, isUse: true, bonus: { x_race_demon_atk: 21, x_element_undead_atk: 21 } },
    { label: 'Lv 8', value: 8, isUse: true, bonus: { x_race_demon_atk: 24, x_element_undead_atk: 24 } },
    { label: 'Lv 9', value: 9, isUse: true, bonus: { x_race_demon_atk: 27, x_element_undead_atk: 27 } },
    { label: 'Lv 10', value: 10, isUse: true, bonus: { x_race_demon_atk: 30, x_element_undead_atk: 30 } },
  ],
};
