import { SkillModel } from '../jobs/_character-base.abstract';

export const sortSkill = <T extends SkillModel>(x1: T, x2: T) => {
  if (typeof x1.value !== 'number' || typeof x2.value !== 'number') return 1;
  if (x1.value === 0) return 1;
  if (x2.value === 0) return 1;

  return x1.value >= x2.value ? -1 : 1;
};
