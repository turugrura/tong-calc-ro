import { SkillModel } from '../_character-base.abstract';

export const BioloMonster = {
  1: 'Fairy',
  2: 'Warrior',
  // 3: 'Mother Net',
} as const;

type MonsterID = keyof typeof BioloMonster;

export const isBioloWoodenFairy = (id: number) => BioloMonster[id as MonsterID] === 'Fairy';
export const isBioloWoodenWarrior = (id: number) => BioloMonster[id as MonsterID] === 'Warrior';

export const genBioloMonsterSkillList = (): SkillModel[] => {
  return [
    { label: '-', value: 0, isUse: false },
    ...Object.entries(BioloMonster).map(([value, label]) => {
      return { label, value: Number(value), isUse: true };
    }),
  ];
};
