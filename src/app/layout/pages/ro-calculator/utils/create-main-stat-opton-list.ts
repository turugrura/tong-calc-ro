import { createBaseStatOptionList } from './create-base-stat-option-list';

export const createMainStatOptionList = () => {
  const items = [];

  const options: [string, string, number, number, string?][] = [
    ['Atk', 'atk', 1, 15],
    ['Atk percent', 'atkPercent', 1, 15, ' %'],
    ['Matk', 'matk', 1, 15],
    ['Matk percent', 'matkPercent', 1, 15, ' %'],
    ['Long Range', 'range', 1, 10, ' %'],
    ['VCT', 'vct', 1, 10],
    ['Hit', 'hit', 1, 15],
    ['CriDmg', 'criDmg', 1, 15, ' %'],
    ['ASPD', 'aspd', 1, 1],
    ['ASPD percent', 'aspdPercent', 1, 10, ' %'],
  ];
  for (const [label, prop, min, max, suffix = ''] of options) {
    const labelNoPercent = label.replace(' percent', '');
    const sign = label === 'VCT' ? '-' : '+';
    const item = {
      value: label,
      label,
      children: Array.from({ length: max - min + 1 }, (_, k) => {
        const num = k + min;
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
