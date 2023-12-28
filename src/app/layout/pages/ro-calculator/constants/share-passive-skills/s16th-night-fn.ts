import { PassiveSkillModel } from '../../jobs/_character-base.abstract';

export const S16thNightFn = (): PassiveSkillModel => ({
  inputType: 'dropdown',
  label: '16th Night',
  name: '16th Night',
  dropdown: [
    { label: '-', value: 0, isUse: false },
    { label: 'Lv 1', value: 1, isUse: true },
    { label: 'Lv 2', value: 2, isUse: true },
    { label: 'Lv 3', value: 3, isUse: true },
    { label: 'Lv 4', value: 4, isUse: true },
    { label: 'Lv 5', value: 5, isUse: true },
  ],
});
