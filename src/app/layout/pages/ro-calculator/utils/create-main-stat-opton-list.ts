export const createMainStatOptionList = () => {
  const items = [];

  const options: [string, string, number, number, string?][] = [
    ['Atk', 'atk', 1, 15],
    ['Atk percent', 'atkPercent', 1, 15, ' %'],
    ['Matk', 'matk', 1, 15],
    ['Matk percent', 'matkPercent', 1, 15, ' %'],
    ['Long Range', 'range', 1, 10, ' %'],
    ['Vct', 'vct', 1, 10],
    ['Hit', 'hit', 1, 15],
    ['CriDmg', 'criDmg', 1, 15, ' %'],
    ['ASPD', 'aspd', 1, 1],
    ['ASPD percent', 'aspdPercent', 1, 10, ' %'],
    ['All Stat', 'allStatus', 1, 10],
    ['Str', 'str', 1, 10],
    ['Agi', 'agi', 1, 10],
    ['Vit', 'vit', 1, 10],
    ['Int', 'int', 1, 10],
    ['Dex', 'dex', 1, 10],
    ['Luk', 'luk', 1, 10],
  ];
  for (const [label, prop, min, max, suffix = ''] of options) {
    const labelNoPercent = label.replace(' percent', '');
    const item = {
      value: label,
      label,
      children: Array.from({ length: max - min + 1 }, (_, k) => {
        const num = k + min;
        return {
          label: `${labelNoPercent} +${num}${suffix}`,
          value: `${prop}:${num}`,
        };
      }),
    };
    items.push(item);
  }

  return items;
};
