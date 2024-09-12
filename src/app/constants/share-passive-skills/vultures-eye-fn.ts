import { PassiveSkillModel } from '../../jobs/_character-base.abstract';

export const VulturesEyeFn = (): PassiveSkillModel => ({
  label: "Vulture's Eye",
  name: "Vulture's Eye",
  inputType: 'dropdown',
  isEquipAtk: true,
  dropdown: [
    { label: '-', value: 0, isUse: false },
    { label: 'Lv 10', value: 10, skillLv: 10, isUse: true, bonus: { hit: 10 } },
  ],
});
