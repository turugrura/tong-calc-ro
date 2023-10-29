import { DropdownModel } from '../models/dropdown.model';

export const createNumberDropdownList = (from: number, to: number, prefixLabel?: string): DropdownModel[] => {
  return Array.from({ length: to - from + 1 }, (_, k) => {
    const num = k + from;
    return {
      label: `${prefixLabel || ''}${num}`,
      value: num,
    };
  });
};
