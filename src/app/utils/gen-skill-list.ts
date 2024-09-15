import { SkillModel } from '../jobs';

export const genSkillList = (maxLevel: number, bonusFn?: (skillLevel: number) => any): SkillModel[] => {
  return Array.from({ length: maxLevel + 1 }).map((_, index) => {
    if (index === 0) return { label: '-', value: 0, isUse: false };

    if (!!bonusFn && typeof bonusFn === 'function') {
      return { label: `Lv ${index}`, value: index, isUse: true, bonus: bonusFn(index) };
    }

    return { label: `Lv ${index}`, value: index, isUse: true };
  });
};
