import { DropdownModel } from '../models/dropdown.model';

export const createTraitStatOptionList = (starVal: number, endVal: number) => {
  const item: DropdownModel & { children: any[] } = {
    label: 'Trait Stat',
    value: 'Trait Stat',
    children: [],
  };

  const VAL_CAP = 20;
  const options: [string, string][] = [
    ['POW', 'pow'],
    ['SPL', 'spl'],
    ['STA', 'sta'],
    ['WIS', 'wis'],
    ['CON', 'con'],
    ['CRT', 'crt'],
    ['C.RATE', 'cRate'],
    ['P.ATK', 'pAtk'],
    ['S.MATK', 'sMatk'],
  ];

  for (const [label, prop] of options) {
    const values = [] as { label: string; min: number; max: number }[];
    for (let i = starVal; i < endVal; i += VAL_CAP) {
      const max = Math.min(i + VAL_CAP - 1, endVal);
      values.push({ label: `${i} - ${max}`, min: i, max: max });
    }

    let children = [];
    if (values.length === 1) {
      const { min, max } = values[0];
      children = Array.from({ length: max - min + 1 }, (_, k) => {
        const num = k + min;
        return {
          label: `${label} +${num}`,
          value: `${prop}:${num}`,
        };
      });
    } else if (values.length > 1) {
      children = values.map((value) => {
        const { label: label2, min, max } = value;

        return {
          label: `${label} ${label2}`,
          value: label2,
          children: Array.from({ length: max - min + 1 }, (_, k) => {
            const num = k + min;
            return {
              label: `${label} +${num}`,
              value: `${prop}:${num}`,
            };
          }),
        };
      });
    } else {
      item.children.push({
        label,
        value: prop,
      });

      continue;
    }

    item.children.push({
      value: label,
      label,
      children,
    });
  }

  return item;
};
