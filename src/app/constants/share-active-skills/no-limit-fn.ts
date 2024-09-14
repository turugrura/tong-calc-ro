import { ActiveSkillModel } from '../../jobs/_character-base.abstract';

export const NoLimitFn = (): ActiveSkillModel => ({
  isEquipAtk: true,
  inputType: 'dropdown',
  label: 'No Limits',
  name: 'No Limits',
  dropdown: [
    { label: '-', value: 0, isUse: false },
    { label: 'Lv 1', value: 1, skillLv: 1, isUse: true, bonus: { range: 150 } },
    { label: 'Lv 2', value: 2, skillLv: 2, isUse: true, bonus: { range: 200 } },
    { label: 'Lv 3', value: 3, skillLv: 3, isUse: true, bonus: { range: 250 } },
    { label: 'Lv 4', value: 4, skillLv: 4, isUse: true, bonus: { range: 300 } },
    { label: 'Lv 5', value: 5, skillLv: 5, isUse: true, bonus: { range: 350 } },
  ],
});
