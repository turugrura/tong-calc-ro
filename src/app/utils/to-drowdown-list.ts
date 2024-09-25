import { ItemDropdownModel } from '../models/dropdown.model';

export const toDropdownList = <T extends Record<string, any>>(
  list: T[],
  labelKey: keyof T,
  valueKey: keyof T,
  elementKey?: keyof T,
  extraKeys?: (keyof T)[],
): ItemDropdownModel[] => {
  return list.map<ItemDropdownModel>((a) => {
    const ex = (extraKeys || []).reduce<T>((extraAttr, key) => {
      extraAttr[key] = a[key];

      return extraAttr;
    }, {} as T);

    return {
      label: a[labelKey],
      value: a[valueKey],
      usableClass: a['usableClass'] || undefined,
      unusableClass: a['unusableClass'] || undefined,
      element: elementKey ? a[elementKey] || '' : undefined,
      lv200ClassName: a['requiredLevel'] >= 200 ? 'lv200' : '',
      ...ex,
    };
  });
};
