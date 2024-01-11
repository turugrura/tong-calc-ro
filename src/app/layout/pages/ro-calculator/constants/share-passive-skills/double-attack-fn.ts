import { PassiveSkillModel } from '../../jobs/_character-base.abstract';

export const DoubleAttackFn = (): PassiveSkillModel => ({
  label: 'Double Attack',
  name: 'Double Attack',
  inputType: 'dropdown',
  dropdown: [
    { label: '-', value: 0, isUse: false },
    { label: 'Lv 1', value: 1, skillLv: 1, isUse: true, bonus: { hitPercent: 1 * 5 } },
    { label: 'Lv 2', value: 2, skillLv: 2, isUse: true, bonus: { hitPercent: 2 * 5 } },
    { label: 'Lv 3', value: 3, skillLv: 3, isUse: true, bonus: { hitPercent: 3 * 5 } },
    { label: 'Lv 4', value: 4, skillLv: 4, isUse: true, bonus: { hitPercent: 4 * 5 } },
    { label: 'Lv 5', value: 5, skillLv: 5, isUse: true, bonus: { hitPercent: 5 * 5 } },
    { label: 'Lv 6', value: 6, skillLv: 6, isUse: true, bonus: { hitPercent: 6 * 5 } },
    { label: 'Lv 7', value: 7, skillLv: 7, isUse: true, bonus: { hitPercent: 7 * 5 } },
    { label: 'Lv 8', value: 8, skillLv: 8, isUse: true, bonus: { hitPercent: 8 * 5 } },
    { label: 'Lv 9', value: 9, skillLv: 9, isUse: true, bonus: { hitPercent: 9 * 5 } },
    { label: 'Lv 10', value: 10, skillLv: 10, isUse: true, bonus: { hitPercent: 10 * 5 } },
  ],
});
