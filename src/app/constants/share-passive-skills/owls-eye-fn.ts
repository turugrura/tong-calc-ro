import { PassiveSkillModel } from '../../jobs/_character-base.abstract';

export const OwlsEyeFn = (): PassiveSkillModel => ({
  label: "Owl's Eye",
  name: "Owl's Eye",
  inputType: 'dropdown',
  isEquipAtk: true,
  dropdown: [
    { label: '-', value: 0, isUse: false },
    { label: 'Lv 10', value: 10, skillLv: 10, isUse: true, bonus: { dex: 10 } },
  ],
});
