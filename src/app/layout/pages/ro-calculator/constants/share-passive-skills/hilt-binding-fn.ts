import { PassiveSkillModel } from '../../jobs/_character-base.abstract';

export const HiltBindingFn = (): PassiveSkillModel => ({
  label: 'Hilt Binding',
  name: 'Hilt Binding',
  inputType: 'selectButton',
  isMasteryAtk: true,
  dropdown: [
    { label: 'Yes', value: 1, skillLv: 1, isUse: true, bonus: { str: 1, x_atk: 4 } },
    { label: 'No', value: 0, isUse: false },
  ],
});
