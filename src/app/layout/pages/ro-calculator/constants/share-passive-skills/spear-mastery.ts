import { PassiveSkillModel } from '../../jobs/_character-base.abstract';

export const SpearMastery: PassiveSkillModel = {
  label: 'Spear Mastery',
  name: 'Spear Mastery',
  inputType: 'dropdown',
  isMasteryAtk: true,
  dropdown: [
    { label: '-', value: 0, isUse: false },
    { label: 'Lv 1', value: 1, isUse: true, bonus: { x_spear_atk: 1 * 4 } },
    { label: 'Lv 2', value: 2, isUse: true, bonus: { x_spear_atk: 2 * 4 } },
    { label: 'Lv 3', value: 3, isUse: true, bonus: { x_spear_atk: 3 * 4 } },
    { label: 'Lv 4', value: 4, isUse: true, bonus: { x_spear_atk: 4 * 4 } },
    { label: 'Lv 5', value: 5, isUse: true, bonus: { x_spear_atk: 5 * 4 } },
    { label: 'Lv 6', value: 6, isUse: true, bonus: { x_spear_atk: 6 * 4 } },
    { label: 'Lv 7', value: 7, isUse: true, bonus: { x_spear_atk: 7 * 4 } },
    { label: 'Lv 8', value: 8, isUse: true, bonus: { x_spear_atk: 8 * 4 } },
    { label: 'Lv 9', value: 9, isUse: true, bonus: { x_spear_atk: 9 * 4 } },
    { label: 'Lv 10', value: 10, isUse: true, bonus: { x_spear_atk: 10 * 4 } },
  ],
};
