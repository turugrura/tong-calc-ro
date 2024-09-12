export const WeaponSubTypeNameMapById = {
  256: 'Dagger',
  257: 'Sword',
  258: 'Two-Handed Sword',
  259: 'Spear',
  260: 'Two-Handed Spear',
  261: 'Axe',
  262: 'Two-Handed Axe',
  263: 'Mace',
  264: 'Two-Handed Mace',
  265: 'Rod',
  266: 'Two-Handed Rod',
  267: 'Bow',
  268: 'Fistweapon',
  269: 'Instrument',
  270: 'Whip',
  271: 'Book',
  272: 'Katar',
  273: 'Revolver',
  274: 'Rifle',
  275: 'Gatling Gun',
  276: 'Shotgun',
  277: 'Grenade Launcher',
  278: 'Shuriken',
} as const;

export const WeaponTypeNameMapBySubTypeId = {
  256: 'dagger',
  257: 'sword',
  258: 'twohandSword',
  259: 'spear',
  260: 'twohandSpear',
  261: 'axe',
  262: 'twohandAxe',
  263: 'mace',
  264: 'twohandMace',
  265: 'rod',
  266: 'twohandRod', //rod staff
  267: 'bow',
  268: 'fist', // knuckle
  269: 'instrument',
  270: 'whip',
  271: 'book',
  272: 'katar',
  273: 'gun',
  274: 'gun',
  275: 'gun',
  276: 'gun',
  277: 'gun',
  278: 'shuriken',
} as const;

type Keys = keyof typeof WeaponTypeNameMapBySubTypeId;
export type WeaponTypeName = (typeof WeaponTypeNameMapBySubTypeId)[Keys];
export type WeaponSubTypeName = (typeof WeaponSubTypeNameMapById)[Keys];
