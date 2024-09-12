import { PassiveSkillModel } from '../../jobs/_character-base.abstract';

export const HiltBindingFn = (): PassiveSkillModel => ({
  label: 'Hilt Binding',
  name: 'Hilt Binding',
  inputType: 'dropdown',
  isMasteryAtk: true,
  dropdown: [
    { label: '-', value: 0, isUse: false },
    { label: 'Lv 1', value: 1, isUse: true, bonus: { str: 1, x_atk: 4 } },
  ],
});
