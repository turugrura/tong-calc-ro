import { createBaseStatOptionList } from './create-base-stat-option-list';

export const createMainStatOptionList = () => {
  const items = [];

  const options: [string, string, number, number, string, number?][] = [
    ['Atk', 'atk', 1, 15, ''],
    ['Atk %', 'atkPercent', 1, 3, ' %'],
    ['Matk', 'matk', 1, 15, ''],
    ['Matk %', 'matkPercent', 1, 3, ' %'],
    ['All Magic Elemental', 'm_my_element_all', 1, 5, ' %'],
    ['Melee', 'melee', 1, 5, ' %'],
    ['Long Range', 'range', 1, 5, ' %'],
    ['VCT', 'vct', 1, 3, ' %'],
    ['Hit', 'hit', 5, 15, ''],
    ['CRI Rate', 'cri', 1, 5, ' %'],
    ['CRI Dmg', 'criDmg', 1, 5, ' %'],
    ['ASPD', 'aspd', 1, 1, ''],
    ['ASPD %', 'aspdPercent', 1, 5, ' %'],
    ['MaxHP', 'hp', 100, 500, '', 50],
    ['MaxHP %', 'hpPercent', 1, 2, ' %'],
  ];
  for (const [label, prop, min, max, suffix = '', stepRate = 1] of options) {
    const labelNoPercent = label.replace(' %', '');
    const sign = label === 'VCT' ? '-' : '+';
    const item = {
      value: label,
      label,
      children: Array.from({ length: (max - min) / stepRate + 1 }, (_, k) => {
        const num = (k * stepRate + min);
        return {
          label: `${labelNoPercent} ${sign}${num}${suffix}`,
          value: `${prop}:${num}`,
        };
      }),
    };
    items.push(item);
  }

  items.push(createBaseStatOptionList(1, 10));

  return items;
};
