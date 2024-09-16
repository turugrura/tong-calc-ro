import { ClassName } from '../jobs';

const validClassName = Object.values(ClassName);

export const validClassNameSet = new Set(validClassName);

const usedConditions = [
  'Acolyte',
  'ArchBishop',
  'Archer',
  'Bard',
  'Blacksmith',
  'Dancer',
  'Genetic',
  'GuillotineCross',
  'Gunslinger',
  'Mage',
  'Mechanic',
  'Merchant',
  'Minstrel',
  'Ninja',
  'Novice',
  'Ranger',
  'Rogue',
  'RoyalGuard',
  'RuneKnight',
  'Sage',
  'ShadowChaser',
  'Sorcerer',
  'SoulLinker',
  'SuperNovice',
  'Sura',
  'Swordman',
  'Taekwondo',
  'Thief',
  'Wanderer',
  'Warlock',
  'Wizard',
];
for (const element of usedConditions) {
  if (!validClassNameSet.has(element as any)) {
    console.error(`USED[${element}] not found in 'ClassName'`);
  }
}
