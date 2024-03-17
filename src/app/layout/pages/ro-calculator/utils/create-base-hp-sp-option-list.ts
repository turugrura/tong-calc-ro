import { DropdownModel } from '../models/dropdown.model';

export const createBaseHPSPOptionList = (type: 'BaseHP' | 'BaseSP') => {
  const items: (DropdownModel & { children: any[] })[] = [];

  const options: [string, string, number, number, number][] = [
    ['BaseHP', 'baseHp', 1, 100, 100],
    ['BaseSP', 'baseSp', 1, 100, 5],
  ].filter((a) => a[0] === type) as any;

  const VAL_CAP = 10;
  for (const [label, prop, rawMin, rawMax, scale] of options) {
    const labelNoPercent = label;
    const values = [] as { label: string; min: number; max: number }[];
    for (let i = rawMin; i < rawMax; i += VAL_CAP) {
      const max = Math.min(i + VAL_CAP - 1, rawMax);
      values.push({ label: `${i * scale} - ${max * scale}`, min: i, max: max });
    }

    const children = values.map((value) => {
      const { label: label2, min, max } = value;

      return {
        label: `${labelNoPercent} ${label2}`,
        value: label2,
        children: Array.from({ length: max - min + 1 }, (_, k) => {
          const num = k + min;
          return {
            label: `+ ${num * scale}`,
            value: `${prop}:${num * scale}`,
          };
        }),
      };
    });

    return children;
  }

  return items;
};
