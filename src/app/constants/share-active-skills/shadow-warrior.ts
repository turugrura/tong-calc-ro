import { ActiveSkillModel } from '../../jobs/_character-base.abstract';

export const ShadowWarrior: ActiveSkillModel = {
  label: 'Shadow Warrior',
  name: 'Shadow Warrior',
  inputType: 'selectButton',
  dropdown: [
    {
      label: 'Yes',
      value: 1,
      isUse: true,
      bonus: {
        'Kunai Explosion': 20,
        'Kunai Splash': 20,
        'Cross Slash': 20,
        'Swirling Petal': 20,
      },
    },
    { label: 'No', value: 0, isUse: false },
  ],
};
