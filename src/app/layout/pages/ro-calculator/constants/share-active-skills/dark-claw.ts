import { ActiveSkillModel } from '../../jobs/_character-base.abstract';

export const DarkClaw: ActiveSkillModel = {
  inputType: 'dropdown',
  label: 'Dark Claw',
  name: 'Dark Claw',
  isEquipAtk: true,
  dropdown: [
    { label: '-', isUse: false, value: 0 },
    { label: 'Lv 1', isUse: true, value: 1, bonus: { darkClaw: 30 } },
    { label: 'Lv 2', isUse: true, value: 2, bonus: { darkClaw: 60 } },
    { label: 'Lv 3', isUse: true, value: 3, bonus: { darkClaw: 90 } },
    { label: 'Lv 4', isUse: true, value: 4, bonus: { darkClaw: 120 } },
    { label: 'Lv 5', isUse: true, value: 5, bonus: { darkClaw: 150 } },
  ],
};
