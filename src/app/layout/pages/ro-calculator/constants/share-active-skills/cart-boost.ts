import { ActiveSkillModel } from '../../jobs/_character-base.abstract';

export const CartBoost: ActiveSkillModel = {
  label: 'Cart Boost Lv5',
  name: 'Cart Boost',
  inputType: 'selectButton',
  isMasteryAtk: true,
  dropdown: [
    { label: 'Yes', value: 5, skillLv: 5, isUse: true },
    { label: 'No', value: 0, isUse: false },
  ],
};
