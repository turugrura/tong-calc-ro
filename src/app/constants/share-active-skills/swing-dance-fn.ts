import { PassiveSkillModel } from '../../jobs/_character-base.abstract';

export const SwingDanceFn = (): PassiveSkillModel => ({
  label: 'Swing Dance 5',
  name: 'Swing Dance',
  inputType: 'selectButton',
  dropdown: [
    { label: 'Yes', value: 5, isUse: true, bonus: { skillAspd: 5 * 4, fctPercent: 5 * 6 } },
    { label: 'No', value: 0, isUse: false },
    // { label: 'Lv 1', value: 1, isUse: true, bonus: { skillAspd: 1 * 4, fctPercent: 1 * 6 } },
    // { label: 'Lv 2', value: 2, isUse: true, bonus: { skillAspd: 2 * 4, fctPercent: 2 * 6 } },
    // { label: 'Lv 3', value: 3, isUse: true, bonus: { skillAspd: 3 * 4, fctPercent: 3 * 6 } },
    // { label: 'Lv 4', value: 4, isUse: true, bonus: { skillAspd: 4 * 4, fctPercent: 4 * 6 } },
    // { label: 'Lv 5', value: 5, isUse: true, bonus: { skillAspd: 5 * 4, fctPercent: 5 * 6 } },
  ],
});
