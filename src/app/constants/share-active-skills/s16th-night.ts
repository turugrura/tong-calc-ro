import { ActiveSkillModel } from '../../jobs/_character-base.abstract';

export const S16thNight: ActiveSkillModel = {
  inputType: 'selectButton',
  label: '16th Night 5',
  name: '16th Night',
  isEquipAtk: true,
  dropdown: [
    { label: 'Yes', isUse: true, value: 5, bonus: { vctBySkill: 50, fctPercent: 100 } },
    { label: 'No', isUse: false, value: 0 },
  ],
};
