export interface PresetModel {
  class: number;
  level: number;
  jobLevel: number;
  str: number;
  jobStr: number;
  agi: number;
  jobAgi: number;
  vit: number;
  jobVit: number;
  int: number;
  jobInt: number;
  dex: number;
  jobDex: number;
  luk: number;
  jobLuk: number;
  selectedAtkSkill: string;
  rawOptionTxts: any[];
  propertyAtk: string;
  ammo: number;
  weapon: number;
  weaponRefine: number;
  weaponCard1: number;
  weaponCard2: number;
  weaponCard3: number;
  weaponCard4: number;
  weaponEnchant1: number;
  weaponEnchant2: number;
  weaponEnchant3: number;
  leftWeapon: number;
  leftWeaponRefine: number;
  leftWeaponCard1: number;
  leftWeaponCard2: number;
  leftWeaponCard3: number;
  leftWeaponCard4: number;
  leftWeaponEnchant1: number;
  leftWeaponEnchant2: number;
  leftWeaponEnchant3: number;
  shield: number;
  shieldRefine: number;
  shieldCard: number;
  shieldEnchant1: number;
  shieldEnchant2: number;
  shieldEnchant3: number;
  headUpper: number;
  headUpperRefine: number;
  headUpperCard: number;
  headUpperEnchant1: number;
  headUpperEnchant2: number;
  headUpperEnchant3: number;
  headMiddle: number;
  headMiddleCard: number;
  headMiddleEnchant1: number;
  headMiddleEnchant2: number;
  headMiddleEnchant3: number;
  headLower: number;
  headLowerEnchant1: number;
  headLowerEnchant2: number;
  headLowerEnchant3: number;
  armor: number;
  armorRefine: number;
  armorCard: number;
  armorEnchant1: number;
  armorEnchant2: number;
  armorEnchant3: number;
  garment: number;
  garmentRefine: number;
  garmentCard: number;
  garmentEnchant1: number;
  garmentEnchant2: number;
  garmentEnchant3: number;
  boot: number;
  bootRefine: number;
  bootCard: number;
  bootEnchant1: number;
  bootEnchant2: number;
  bootEnchant3: number;
  accLeft: number;
  accLeftCard: number;
  accLeftEnchant1: number;
  accLeftEnchant2: number;
  accLeftEnchant3: number;
  accRight: number;
  accRightCard: number;
  accRightEnchant1: number;
  accRightEnchant2: number;
  accRightEnchant3: number;
  pet: number;
  costumeEnchantUpper: number;
  costumeEnchantMiddle: number;
  costumeEnchantLower: number;
  costumeEnchantGarment: number;
  costumeEnchantGarment4: number;
  shadowWeapon: number;
  shadowWeaponRefine: number;
  shadowArmor: number;
  shadowArmorRefine: number;
  shadowShield: number;
  shadowShieldRefine: number;
  shadowBoot: number;
  shadowBootRefine: number;
  shadowEarring: number;
  shadowEarringRefine: number;
  shadowPendant: number;
  shadowPendantRefine: number;
  skillBuffMap: { [key: string]: number };
  skillBuffs: number[];
  activeSkillMap: { [key: string]: number };
  activeSkills: number[];
  passiveSkillMap: { [key: string]: number };
  passiveSkills: number[];
  consumableMap: { [key: string]: number };
  consumables: any[];
  consumable2Map: { [key: string]: number };
  consumables2: any[];
  aspdPotion: number;
  aspdPotionMap: { [key: string]: number };
  aspdPotions: any[];
}