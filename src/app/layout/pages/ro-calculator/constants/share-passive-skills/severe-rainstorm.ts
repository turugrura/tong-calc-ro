import { PassiveSkillModel } from '../../jobs/_character-base.abstract';

export const SevereRainstorm: PassiveSkillModel = {
  label: 'Severe Rains 5',
  name: 'Severe Rainstorm',
  inputType: 'selectButton',
  dropdown: [
    { label: 'Yes', value: 5, skillLv: 5, isUse: true },
    { label: 'No', value: 0, isUse: false },
  ],
};
