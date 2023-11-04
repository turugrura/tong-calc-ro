export enum ClassName {
  Swordman = 'Swordman',
  Paladin = 'Paladin',
  RoyalGuard = 'RoyalGuard',

  LordKnight = 'LordKnight',
  RuneKnight = 'RuneKnight',

  Archer = 'Archer',
  Bard = 'Bard',
  Wanderer = 'Wanderer',

  Dance = 'Dance',
  Minstrel = 'Minstrel',

  Sniper = 'Sniper',
  Ranger = 'Ranger',

  Merchant = 'Merchant',
  Whitesmith = 'Whitesmith',
  Mechanic = 'Mechanic',
  Creator = 'Creator',
  Genetic = 'Genetic',

  ArchBishop = 'ArchBishop',
  Sura = 'Sura',

  Thief = 'Thief',
  AssassinCross = 'AssassinCross',
  GuillotineCross = 'GuillotineCross',
  Rogue = 'Rogue',
  ShadowChaser = 'ShadowChaser',

  Sage = 'Sage',
  Sorcerer = 'Sorcerer',
  Mage = 'Mage',
  Wizard = 'Wizard',
  Warlock = 'Warlock',

  // extended
  Doram = 'Doram',
  Taekwondo = 'Taekwondo',
  SoulLinker = 'SoulLinker',
  SoulReaper = 'SoulReaper',
  StarEmperor = 'StarEmperor',

  Rebellion = 'Rebellion',

  Ninja = 'Ninja',
  Oboro = 'Oboro',
  Kagerou = 'Kagerou',
}

/**
 * Display only
 */
export const ClassID = {
  11: 'Royal Guard',
  12: 'Rune Knight',
  7: 'Arch Bishop',
  2: ClassName.Ranger,
  21: ClassName.Minstrel,
  22: ClassName.Wanderer,
  5: 'Guillotine Cross',
  4: 'Shadow Chaser',
  6: ClassName.Warlock,
  8: ClassName.Sorcerer,
  10: ClassName.Mechanic,
  9: ClassName.Genetic,
  3: 'Soul Reaper',
  1: ClassName.Rebellion,
  31: ClassName.Doram,
  17: ClassName.Oboro,
  18: ClassName.Kagerou,
} as const;
