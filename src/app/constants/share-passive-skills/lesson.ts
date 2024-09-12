import { PassiveSkillModel } from '../../jobs/_character-base.abstract';

export const Lesson: PassiveSkillModel = {
  label: 'Lesson',
  name: 'Lesson',
  inputType: 'dropdown',
  isMasteryAtk: true,
  dropdown: [
    { label: '-', value: 0, isUse: false },
    { label: 'Lv 1', value: 1, isUse: true, bonus: { sp: 1 * 30 } },
    { label: 'Lv 2', value: 2, isUse: true, bonus: { sp: 2 * 30 } },
    { label: 'Lv 3', value: 3, isUse: true, bonus: { sp: 3 * 30 } },
    { label: 'Lv 4', value: 4, isUse: true, bonus: { sp: 4 * 30 } },
    { label: 'Lv 5', value: 5, isUse: true, bonus: { sp: 5 * 30 } },
    { label: 'Lv 6', value: 6, isUse: true, bonus: { sp: 6 * 30 } },
    { label: 'Lv 7', value: 7, isUse: true, bonus: { sp: 7 * 30 } },
    { label: 'Lv 8', value: 8, isUse: true, bonus: { sp: 8 * 30 } },
    { label: 'Lv 9', value: 9, isUse: true, bonus: { sp: 9 * 30 } },
    { label: 'Lv 10', value: 10, isUse: true, bonus: { sp: 10 * 30 } },
  ],
};
