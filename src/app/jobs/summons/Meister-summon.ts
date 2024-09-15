import { SkillModel } from '../_character-base.abstract';

export const MeisterMonster = {
  1: 'Battle Warrior',
  2: 'Dual Cannon',
  // 3: 'Mother Net',
} as const;

type MonsterID = keyof typeof MeisterMonster;

export const isBattleWarrior = (id: number) => MeisterMonster[id as MonsterID] === 'Battle Warrior';
export const isDualCannon = (id: number) => MeisterMonster[id as MonsterID] === 'Dual Cannon';

export const genMeisterMonsterSkillList = (): SkillModel[] => {
  return [
    { label: '-', value: 0, isUse: false },
    ...Object.entries(MeisterMonster).map(([value, label]) => {
      return { label, value: Number(value), isUse: true };
    }),
  ];
};
