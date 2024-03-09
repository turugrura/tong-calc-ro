import { PassiveSkillModel } from '../../jobs/_character-base.abstract';

export const SevereRainstormFn = (): PassiveSkillModel => ({
  label: 'Severe Rains',
  name: 'Severe Rainstorm',
  inputType: 'dropdown',
  dropdown: [
    { label: '-', value: 0, isUse: false },
    { label: 'Lv 5', value: 5, skillLv: 5, isUse: true },
  ],
});
