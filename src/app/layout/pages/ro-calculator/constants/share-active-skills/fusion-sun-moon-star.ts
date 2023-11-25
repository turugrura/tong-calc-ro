import { ActiveSkillModel } from '../../jobs/_character-base.abstract';

export const FusionSunMoonStar: ActiveSkillModel = {
  label: 'ตัวลอย',
  name: 'Fusion of Sun, Moon and Star',
  inputType: 'selectButton',
  dropdown: [
    { label: 'Yes', value: 1, skillLv: 1, isUse: true, bonus: { forceCri: 1 } },
    { label: 'No', value: 0, isUse: false },
  ],
};
