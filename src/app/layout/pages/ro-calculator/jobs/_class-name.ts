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

  Acolyte = 'Acolyte',
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
  SuperNovice = 'SuperNovice',
  Doram = 'Doram',

  Taekwondo = 'Taekwondo',
  SoulLinker = 'SoulLinker',
  SoulReaper = 'SoulReaper',

  StarGladiator = 'StarGladiator',
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
  13: ClassName.Sura,
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
  33: 'Star Emperor',
  1: ClassName.Rebellion,
  31: ClassName.Doram,
  30: 'Super Novice',
  17: ClassName.Oboro,
  18: ClassName.Kagerou,
} as const;

/**
  4060 Rune Knight    4061 Warlock                 4062 Ranger             4063 Arch Bishop
  4064 Mechanic         4065 Guillotine Cross  4073 Royal Guard    4074 Sorcerer
  4075 Minstrel            4076 Wanderer              4077 Sura                  4078 Genetic
  4079 Shadow Chaser

  ----- 4th Class -----
  4252 Dragon Knight    4253 Meister                    4254 Shadow Cross     4255 Arch Mage
  4256 Cardinal               4257 Windhawk              4258 Imperial Guard     4259 Biolo
  4260 Abyss Chaser     4261 Elemental Master 4262 Inquisitor               4263 Troubadour
  4264 Trouvere

  ----- Expanded Class -----
        23 Super Novice      24 Gunslinger              25 Ninja                 4045 Super Baby
  4046 Taekwon           4047 Star Gladiator     4049 Soul Linker
  4190 Ex. Super Novice  4191 Ex. Super Baby
  4211 Kagerou            4212 Oboro             4215 Rebellion        4218 Summoner
  4239 Star Emperor   4240 Soul Reaper
  4302 Sky Emperor    4303 Soul Ascetic         4304 Shinkiro                 4305 Shiranui
  4306 Night Watch     4307 Hyper Novice        4308 Spirit Handler
 */
export const ClassIcon = {
  11: 4073,
  12: 4060,
  7: 4063,
  13: 4077,
  2: 4062,
  21: 4075,
  22: 4076,
  5: 4065,
  4: 4079,
  6: 4061,
  8: 4074,
  10: 4064,
  9: 4078,
  3: 4240,
  33: 4239,
  1: 4215,
  31: 4218,
  30: 4190,
  17: 4212,
  18: 4211,
} as const;
