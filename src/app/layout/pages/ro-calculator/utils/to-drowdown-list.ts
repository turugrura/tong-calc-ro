import { DropdownModel } from '../models/dropdown.model';

export const toDropdownList = <T extends Record<string, any>>(
  list: T[],
  labelKey: keyof T,
  valueKey: keyof T,
  elementKey?: keyof T,
  extraKeys?: (keyof T)[],
): DropdownModel[] => {
  return list.map((a) => {
    const ex = (extraKeys || []).reduce<T>((extraAttr, key) => {
      extraAttr[key] = a[key];

      return extraAttr;
    }, {} as T);

    return {
      label: a[labelKey],
      value: a[valueKey],
      usableClass: a['usableClass'] || undefined,
      element: elementKey ? a[elementKey] || '' : undefined,
      ...ex,
    };
  });
};
