import { ActiveSkillModel } from '../../jobs/_character-base.abstract';

export const ShieldSpellFn = (): ActiveSkillModel => {
  return {
    label: 'Shield Spell',
    name: 'Shield Spell',
    inputType: 'dropdown',
    isEquipAtk: true,
    dropdown: [
      { label: '-', value: 0, isUse: false },
      { label: 'Atk +200', value: 200, skillLv: 200, isUse: true, bonus: { atk: 200 } },
      { label: 'Atk +190', value: 190, skillLv: 190, isUse: true, bonus: { atk: 190 } },
      { label: 'Atk +180', value: 180, skillLv: 180, isUse: true, bonus: { atk: 180 } },
      { label: 'Atk +170', value: 170, skillLv: 170, isUse: true, bonus: { atk: 170 } },
      { label: 'Atk +160', value: 160, skillLv: 160, isUse: true, bonus: { atk: 160 } },
      { label: 'Atk +150', value: 150, skillLv: 150, isUse: true, bonus: { atk: 150 } },
      { label: 'Atk +140', value: 140, skillLv: 140, isUse: true, bonus: { atk: 140 } },
      { label: 'Atk +130', value: 130, skillLv: 130, isUse: true, bonus: { atk: 130 } },
      { label: 'Atk +120', value: 120, skillLv: 120, isUse: true, bonus: { atk: 120 } },
      { label: 'Atk +110', value: 110, skillLv: 110, isUse: true, bonus: { atk: 110 } },
      { label: 'Atk +100', value: 100, skillLv: 100, isUse: true, bonus: { atk: 100 } },
    ],
  };
};
