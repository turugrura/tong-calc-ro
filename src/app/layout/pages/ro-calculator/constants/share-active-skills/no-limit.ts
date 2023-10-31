import { ActiveSkillModel } from '../../jobs/_character-base.abstract';

export const NoLimit: ActiveSkillModel = {
  isEquipAtk: true,
  inputType: 'dropdown',
  label: 'No Limits',
  name: 'No Limits',
  dropdown: [
    { label: '0', value: 0, isUse: false },
    { label: 'Lv 1', value: 'No Limits==1', skillLv: 1, isUse: true, bonus: { range: 150 } },
    { label: 'Lv 2', value: 'No Limits==2', skillLv: 2, isUse: true, bonus: { range: 200 } },
    { label: 'Lv 3', value: 'No Limits==3', skillLv: 3, isUse: true, bonus: { range: 250 } },
    { label: 'Lv 4', value: 'No Limits==4', skillLv: 4, isUse: true, bonus: { range: 300 } },
    { label: 'Lv 5', value: 'No Limits==5', skillLv: 5, isUse: true, bonus: { range: 350 } },
  ],
};
