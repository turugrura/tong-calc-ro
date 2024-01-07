import { PassiveSkillModel } from '../../jobs/_character-base.abstract';

export const BeastBaneFn = (): PassiveSkillModel => ({
  label: 'Beast Bane',
  name: 'Beast Bane',
  inputType: 'dropdown',
  isMasteryAtk: true,
  dropdown: [
    { label: '-', value: 0, isUse: false },
    { label: 'Lv 1', value: 1, skillLv: 1, isUse: true, bonus: { x_race_brute_atk: 4, x_race_insect_atk: 4 } },
    { label: 'Lv 2', value: 2, skillLv: 2, isUse: true, bonus: { x_race_brute_atk: 8, x_race_insect_atk: 8 } },
    { label: 'Lv 3', value: 3, skillLv: 3, isUse: true, bonus: { x_race_brute_atk: 12, x_race_insect_atk: 12 } },
    { label: 'Lv 4', value: 4, skillLv: 4, isUse: true, bonus: { x_race_brute_atk: 16, x_race_insect_atk: 16 } },
    { label: 'Lv 5', value: 5, skillLv: 5, isUse: true, bonus: { x_race_brute_atk: 20, x_race_insect_atk: 20 } },
    { label: 'Lv 6', value: 6, skillLv: 6, isUse: true, bonus: { x_race_brute_atk: 24, x_race_insect_atk: 24 } },
    { label: 'Lv 7', value: 7, skillLv: 7, isUse: true, bonus: { x_race_brute_atk: 28, x_race_insect_atk: 28 } },
    { label: 'Lv 8', value: 8, skillLv: 8, isUse: true, bonus: { x_race_brute_atk: 32, x_race_insect_atk: 32 } },
    { label: 'Lv 9', value: 9, skillLv: 9, isUse: true, bonus: { x_race_brute_atk: 36, x_race_insect_atk: 36 } },
    { label: 'Lv 10', value: 10, skillLv: 10, isUse: true, bonus: { x_race_brute_atk: 40, x_race_insect_atk: 40 } },
  ],
});
