export enum ClassName {
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
  AssasinCross = 'AssasinCross',
  GuillotineCross = 'GuillotineCross',
  Rogue = 'Rogue',
  ShadowChaser = 'ShadowChaser',

  Sage = 'Sage',
  Sorcerer = 'Sorcerer',
  Mage = 'Mage',
  Wizard = 'Wizard',
  Warlock = 'Warlock',

  // extended
  Taekwondo = 'Taekwondo',
  SoulLinker = 'SoulLinker',
  SoulReaper = 'SoulReaper',
  Rebellion = 'Rebellion',
}

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
} as const;
