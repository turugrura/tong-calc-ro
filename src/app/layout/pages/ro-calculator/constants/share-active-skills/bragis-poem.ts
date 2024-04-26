import { ActiveSkillModel } from '../../jobs/_character-base.abstract';

export const BragisPoem: ActiveSkillModel = {
  label: "Bragi's Poem 10",
  name: "Bragi's Poem",
  inputType: 'selectButton',
  dropdown: [
    { label: 'Yes', value: 10, isUse: true, bonus: { vctBySkill: 20, acd: 30 } },
    { label: 'No', value: 0, isUse: false },
  ],
};
