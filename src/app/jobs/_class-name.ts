export enum ClassName {
  ALL = 'all',
  HiClass = 'Hi-Class',
  Only_3rd = 'Only 3rd Cls',
  Only_4th = '4th',

  Swordman = 'Swordman',
  Paladin = 'Paladin',
  RoyalGuard = 'RoyalGuard',
  ImperialGuard = 'ImperialGuard',

  Knight = 'Knight',
  LordKnight = 'LordKnight',
  RuneKnight = 'RuneKnight',
  DragonKnight = 'DragonKnight',

  Archer = 'Archer',
  Hunter = 'Hunter',
  Sniper = 'Sniper',
  Ranger = 'Ranger',
  Windhawk = 'Windhawk',

  Bard = 'Bard',
  Clown = 'Clown',
  Wanderer = 'Wanderer',
  Trouvere = 'Trouvere',

  Dancer = 'Dancer',
  Minstrel = 'Minstrel',
  Troubadour = 'Troubadour',

  Merchant = 'Merchant',
  Blacksmith = 'Blacksmith',
  Whitesmith = 'Whitesmith',
  Mechanic = 'Mechanic',
  Meister = 'Meister',

  Alchemist = 'Alchemist',
  Creator = 'Creator',
  Genetic = 'Genetic',
  Biolo = 'Biolo',

  Acolyte = 'Acolyte',
  Priest = 'Priest',
  ArchBishop = 'ArchBishop',
  Cardinal = 'Cardinal',

  Monk = 'Monk',
  Champion = 'Champion',
  Sura = 'Sura',
  Inquisitor = 'Inquisitor',

  Thief = 'Thief',
  Assassin = 'Assassin',
  AssassinCross = 'AssassinCross',
  GuillotineCross = 'GuillotineCross',
  ShadowCross = 'ShadowCross',

  Rogue = 'Rogue',
  Stalker = 'Stalker',
  ShadowChaser = 'ShadowChaser',
  AbyssChaser = 'AbyssChaser',

  Sage = 'Sage',
  Sorcerer = 'Sorcerer',
  ElementalMaster = 'ElementalMaster',

  Mage = 'Mage',
  Wizard = 'Wizard',
  Warlock = 'Warlock',
  ArchMage = 'ArchMage',

  // extended
  Novice = 'Novice',
  SuperNovice = 'SuperNovice',
  HyperNovice = 'HyperNovice',

  Doram = 'Doram',
  SpiritHandler = 'SpiritHandler',

  Taekwondo = 'Taekwondo',
  SoulLinker = 'SoulLinker',
  SoulReaper = 'SoulReaper',
  SoulAscetic = 'SoulAscetic',

  StarGladiator = 'StarGladiator',
  StarEmperor = 'StarEmperor',
  SkyEmperor = 'SkyEmperor',

  Gunslinger = 'Gunslinger',
  Rebellion = 'Rebellion',
  NightWatch = 'NightWatch',

  Ninja = 'Ninja',
  Oboro = 'Oboro',
  Kagerou = 'Kagerou',
  Shiranui = 'Shiranui',
  Shinkiro = 'Shinkiro',
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
  4252: ClassName.DragonKnight,
  4253: ClassName.Meister,
  4254: ClassName.ShadowCross,
  4255: ClassName.ArchMage,
  4256: ClassName.Cardinal,
  4257: ClassName.Windhawk,
  4258: ClassName.ImperialGuard,
  4259: ClassName.Biolo,
  4260: ClassName.AbyssChaser,
  4261: ClassName.ElementalMaster,
  4262: ClassName.Inquisitor,
  4263: ClassName.Troubadour,
  4264: ClassName.Trouvere,
  4302: ClassName.SkyEmperor,
  4303: ClassName.SoulAscetic,
  4304: ClassName.Shinkiro,
  4305: ClassName.Shiranui,
  4306: ClassName.NightWatch,
  4307: ClassName.HyperNovice,
  4308: ClassName.SpiritHandler,
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
export const ClassIcon: Record<keyof typeof ClassID, number> = {
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
  4252: 4252,
  4253: 4253,
  4254: 4254,
  4255: 4255,
  4256: 4256,
  4257: 4257,
  4258: 4258,
  4259: 4259,
  4260: 4260,
  4261: 4261,
  4262: 4262,
  4263: 4263,
  4264: 4264,
  4302: 4302,
  4303: 4303,
  4304: 4304,
  4305: 4305,
  4306: 4306,
  4307: 4307,
  4308: 4308,
} as const;
