import { ElementType } from '../constants/element-type.const';

export interface MainModel {
  class: number;
  level: number;
  jobLevel: number;
  str: number;
  itemStr?: number;
  jobStr?: number;
  agi: number;
  itemAgi?: number;
  jobAgi?: number;
  vit: number;
  itemVit?: number;
  jobVit?: number;
  int: number;
  itemInt?: number;
  jobInt?: number;
  dex: number;
  itemDex?: number;
  jobDex?: number;
  luk: number;
  itemLuk?: number;
  jobLuk?: number;
  selectedAtkSkill?: string;
  propertyAtk?: ElementType;
  rawOptionTxts: string[];
  weapon?: number;
  weaponRefine?: number;
  weaponCard1?: number;
  weaponCard2?: number;
  weaponCard3?: number;
  weaponCard4?: number;
  weaponEnchant1?: number;
  weaponEnchant2?: number;
  weaponEnchant3?: number;
  ammo?: number;
  headUpper?: number;
  headUpperRefine?: number;
  headUpperCard?: number;
  headUpperEnchant1?: number;
  headUpperEnchant2?: number;
  headUpperEnchant3?: number;
  headMiddle?: number;
  headMiddleCard?: number;
  headMiddleEnchant1?: number;
  headMiddleEnchant2?: number;
  headMiddleEnchant3?: number;
  headLower?: number;
  headLowerEnchant1?: number;
  headLowerEnchant2?: number;
  headLowerEnchant3?: number;
  armor?: number;
  armorRefine?: number;
  armorCard?: number;
  armorEnchant1?: number;
  armorEnchant2?: number;
  armorEnchant3?: number;
  shield?: number;
  shieldRefine?: number;
  shieldCard?: number;
  shieldEnchant1?: number;
  shieldEnchant2?: number;
  shieldEnchant3?: number;
  garment?: number;
  garmentRefine?: number;
  garmentCard?: number;
  garmentEnchant1?: number;
  garmentEnchant2?: number;
  garmentEnchant3?: number;
  boot?: number;
  bootRefine?: number;
  bootCard?: number;
  bootEnchant1?: number;
  bootEnchant2?: number;
  bootEnchant3?: number;
  accLeft?: number;
  accLeftCard?: number;
  accLeftEnchant1?: number;
  accLeftEnchant2?: number;
  accLeftEnchant3?: number;
  accRight?: number;
  accRightCard?: number;
  accRightEnchant1?: number;
  accRightEnchant2?: number;
  accRightEnchant3?: number;
  pet?: number;

  costumeEnchantUpper?: number;
  costumeEnchantMiddle?: number;
  costumeEnchantLower?: number;
  costumeEnchantGarment?: number;

  costumeEnhUpper?: number;
  costumeEnhMiddle?: number;
  costumeEnhLower?: number;
  costumeEnhGarment?: number;
  shadowWeapon?: number;
  shadowWeaponRefine?: number;
  shadowArmor?: number;
  shadowArmorRefine?: number;
  shadowShield?: number;
  shadowShieldRefine?: number;
  shadowBoot?: number;
  shadowBootRefine?: number;
  shadowEarring?: number;
  shadowEarringRefine?: number;
  shadowPendant?: number;
  shadowPendantRefine?: number;

  skillBuffs: number[];

  activeSkills: number[];
  passiveSkills: number[];
  consumables: number[];
  consumables2: number[];
  aspdPotion?: number;
  aspdPotions: number[];
}