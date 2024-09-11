import { sortObj } from './sort-obj';

export const toGradeList = (arr: string[]) => {
  return arr.map((val) => ({ label: `Grade ${val}`, value: `${val}`.toLowerCase() })).sort(sortObj('value', -1));
};
