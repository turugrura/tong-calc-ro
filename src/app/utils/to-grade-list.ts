import { sortObj } from './sort-obj';

export const toGradeList = (arr: string[]) => {
  return arr.map((val) => ({ label: `Grade ${val}`, value: `${val}`.toLowerCase() })).sort(sortObj('value', -1));
};

export const getGradeList = () => {
  return [
    { label: 'ungrade', value: '' },
    { label: 'Grade D', value: 'D' },
    { label: 'Grade C', value: 'C' },
    { label: 'Grade B', value: 'B' },
    { label: 'Grade A', value: 'A' },
  ];
};
