import { MainModel } from '../models/main.model';

export const createMainModel = (): MainModel => ({
  class: 1,
  level: 99,
  jobLevel: 1,

  str: 1,
  jobStr: undefined,
  agi: 1,
  jobAgi: undefined,
  vit: 1,
  jobVit: undefined,
  int: 1,
  jobInt: undefined,
  dex: 1,
  jobDex: undefined,
  luk: 1,
  jobLuk: undefined,

  pow: 0,
  jobPow: 0,
  sta: 0,
  jobSta: 0,
  wis: 0,
  jobWis: 0,
  spl: 0,
  jobSpl: 0,
  con: 0,
  jobCon: 0,
  crt: 0,
  jobCrt: 0,

  selectedAtkSkill: undefined,
  rawOptionTxts: [],
  propertyAtk: undefined,
  weapon: undefined,
  weaponRefine: undefined,
  weaponGrade: undefined,
  weaponCard1: undefined,
  weaponCard2: undefined,
  weaponCard3: undefined,
  weaponCard4: undefined,
  weaponEnchant1: undefined,
  weaponEnchant2: undefined,
  weaponEnchant3: undefined,
  leftWeapon: undefined,
  leftWeaponRefine: undefined,
  leftWeaponGrade: undefined,
  leftWeaponCard1: undefined,
  leftWeaponCard2: undefined,
  leftWeaponCard3: undefined,
  leftWeaponCard4: undefined,
  leftWeaponEnchant1: undefined,
  leftWeaponEnchant2: undefined,
  leftWeaponEnchant3: undefined,
  ammo: undefined,
  headUpper: undefined,
  headUpperRefine: undefined,
  headUpperGrade: undefined,
  headUpperCard: undefined,
  headUpperEnchant1: undefined,
  headUpperEnchant2: undefined,
  headUpperEnchant3: undefined,
  headMiddle: undefined,
  headMiddleCard: undefined,
  headMiddleGrade: undefined,
  headMiddleEnchant1: undefined,
  headMiddleEnchant2: undefined,
  headMiddleEnchant3: undefined,
  headLower: undefined,
  headLowerGrade: undefined,
  headLowerEnchant1: undefined,
  headLowerEnchant2: undefined,
  headLowerEnchant3: undefined,
  armor: undefined,
  armorRefine: undefined,
  armorGrade: undefined,
  armorCard: undefined,
  armorEnchant1: undefined,
  armorEnchant2: undefined,
  armorEnchant3: undefined,
  shield: undefined,
  shieldRefine: undefined,
  shieldCard: undefined,
  shieldGrade: undefined,
  shieldEnchant1: undefined,
  shieldEnchant2: undefined,
  shieldEnchant3: undefined,
  garment: undefined,
  garmentRefine: undefined,
  garmentCard: undefined,
  garmentGrade: undefined,
  garmentEnchant1: undefined,
  garmentEnchant2: undefined,
  garmentEnchant3: undefined,
  boot: undefined,
  bootRefine: undefined,
  bootCard: undefined,
  bootGrade: undefined,
  bootEnchant1: undefined,
  bootEnchant2: undefined,
  bootEnchant3: undefined,
  accLeft: undefined,
  accLeftCard: undefined,
  accLeftGrade: undefined,
  accLeftEnchant1: undefined,
  accLeftEnchant2: undefined,
  accLeftEnchant3: undefined,
  accRight: undefined,
  accRightCard: undefined,
  accRightGrade: undefined,
  accRightEnchant1: undefined,
  accRightEnchant2: undefined,
  accRightEnchant3: undefined,
  pet: undefined,

  costumeUpper: undefined,

  costumeEnchantUpper: undefined,
  costumeEnchantMiddle: undefined,
  costumeEnchantLower: undefined,
  costumeEnchantGarment: undefined,
  costumeEnchantGarment4: undefined,

  shadowWeapon: undefined,
  shadowWeaponRefine: undefined,
  shadowArmor: undefined,
  shadowArmorRefine: undefined,
  shadowShield: undefined,
  shadowShieldRefine: undefined,
  shadowBoot: undefined,
  shadowBootRefine: undefined,
  shadowEarring: undefined,
  shadowEarringRefine: undefined,
  shadowPendant: undefined,
  shadowPendantRefine: undefined,

  skillBuffs: [],
  skillBuffMap: {},

  activeSkillMap: {},
  activeSkills: [],
  passiveSkills: [],
  passiveSkillMap: {},
  consumables: [],
  consumables2: [],
  aspdPotion: undefined,
  aspdPotions: [],
});