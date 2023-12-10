import { DropdownModel } from '../models/dropdown.model';

export const createNumberDropdownList = (params: {
  from: number;
  to: number;
  excludingNumbers?: number[];
  prefixLabel?: string;
}): DropdownModel[] => {
  const { from, to, excludingNumbers, prefixLabel } = params;

  let list = Array.from({ length: to - from + 1 }, (_, k) => {
    const num = k + from;
    return {
      label: `${prefixLabel || ''}${num}`,
      value: num,
    };
  });

  if (Array.isArray(excludingNumbers) && excludingNumbers.length > 0) {
    list = list.filter((a) => !excludingNumbers.includes(a.value));
  }

  return list;
};
