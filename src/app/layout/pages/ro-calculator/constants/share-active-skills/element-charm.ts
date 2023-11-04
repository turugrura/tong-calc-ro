import { ActiveSkillModel } from '../../jobs/_character-base.abstract';

export const ElementCharm: ActiveSkillModel = {
  inputType: 'dropdown',
  label: 'Charm Lv10',
  name: 'Charm',
  dropdown: [
    { label: '-', isUse: false, value: 0 },
    {
      label: 'Fire',
      isUse: true,
      value: 'Fire-Charm',
      bonus: { 'Flaming Petals': 200, 'Blaze Shield': 200, 'Exploding Dragon': 1000, p_element_earth: 30 },
    },
    { label: 'Earth', isUse: true, value: 'Earth-Charm', bonus: { weaponAtkPercent: 150, p_element_wind: 30 } },
    {
      label: 'Ice',
      isUse: true,
      value: 'Ice-Charm',
      bonus: {
        'Freezing Spear': 200,
        'Snow Flake Draft': 1000,
        p_element_fire: 30,
      },
    },
    {
      label: 'Wind',
      isUse: true,
      value: 'Wind-Charm',
      bonus: {
        'Wind Blade': 200,
        'Lightning Jolt': 200,
        'First Wind': 1000,
        p_element_water: 30,
      },
    },
  ],
};
