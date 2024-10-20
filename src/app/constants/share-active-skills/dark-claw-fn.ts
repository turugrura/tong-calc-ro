import { ActiveSkillModel } from '../../jobs/_character-base.abstract';

export const DarkClawFn = (): ActiveSkillModel => ({
  name: 'Dark Claw',
  label: 'Dark Claw 5',
  isDebuff: true,
  inputType: 'selectButton',
  dropdown: [
    { label: 'Yes', isUse: true, value: 5, bonus: { darkClaw: 150 } },
    { label: 'No', isUse: false, value: 0 },
    // { label: 'Lv 4', isUse: true, value: 4, bonus: { darkClaw: 120 } },
    // { label: 'Lv 3', isUse: true, value: 3, bonus: { darkClaw: 90 } },
    // { label: 'Lv 2', isUse: true, value: 2, bonus: { darkClaw: 60 } },
    // { label: 'Lv 1', isUse: true, value: 1, bonus: { darkClaw: 30 } },
  ],
});
