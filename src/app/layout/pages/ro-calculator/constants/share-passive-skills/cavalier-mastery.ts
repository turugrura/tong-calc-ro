import { PassiveSkillModel } from '../../jobs/_character-base.abstract';

export const CavalierMastery: PassiveSkillModel = {
  label: 'Cavalier M. 5',
  name: 'Cavalier Mastery',
  inputType: 'selectButton',
  dropdown: [
    { label: 'Yes', value: 5, skillLv: 5, isUse: true },
    { label: 'No', value: 0, isUse: false },
  ],
};
