import { ActiveSkillModel } from '../../jobs/_character-base.abstract';

export const ElementCharm: ActiveSkillModel = {
  inputType: 'dropdown',
  label: 'Charm 10',
  name: 'Charm',
  dropdown: [
    { label: '-', isUse: false, value: 0 },
    {
      label: 'Fire',
      isUse: true,
      value: 10,
      bonus: {
        'flat_Flaming Petals': 200,
        'flat_Blaze Shield': 200,
        'flat_Exploding Dragon': 1000,
        p_element_earth: 30,
      },
    },
    { label: 'Earth', isUse: true, value: 20, bonus: { weaponAtkPercent: 150, p_element_wind: 30 } },
    {
      label: 'Ice',
      isUse: true,
      value: 30,
      bonus: {
        'flat_Freezing Spear': 200,
        'flat_Snow Flake Draft': 1000,
        p_element_fire: 30,
      },
    },
    {
      label: 'Wind',
      isUse: true,
      value: 40,
      bonus: {
        'flat_Wind Blade': 200,
        'flat_Lightning Jolt': 200,
        'flat_First Wind': 1000,
        p_element_water: 30,
      },
    },
  ],
};
