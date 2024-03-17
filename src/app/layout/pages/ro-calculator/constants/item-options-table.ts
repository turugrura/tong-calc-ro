import { ItemOptionNumber } from './item-option-number.enum';
import { ItemTypeEnum } from './item-type.enum';

export const ItemOptionTable: [ItemTypeEnum, ItemOptionNumber[]][] = [
  [ItemTypeEnum.shield, [ItemOptionNumber.Shield_1, ItemOptionNumber.Shield_2]],
  [ItemTypeEnum.headUpper, [ItemOptionNumber.H_Upper_1, ItemOptionNumber.H_Upper_2]],
  [ItemTypeEnum.headMiddle, [ItemOptionNumber.H_Mid_1, ItemOptionNumber.H_Mid_2]],
  // [ItemTypeEnum.headLower, [ItemOptionNumber.H_Low_1, ItemOptionNumber.H_Low_2]],
  [ItemTypeEnum.armor, [ItemOptionNumber.Armor_1, ItemOptionNumber.Armor_2, ItemOptionNumber.Armor_3]],
  [ItemTypeEnum.garment, [ItemOptionNumber.Garment_1, ItemOptionNumber.Garment_2]],
  // [ItemTypeEnum.boot, [ItemOptionNumber.Boot_1, ItemOptionNumber.Boot_2]],
  [ItemTypeEnum.accLeft, [ItemOptionNumber.A_Left_1, ItemOptionNumber.A_Left_2]],
  [ItemTypeEnum.accRight, [ItemOptionNumber.A_Right_1, ItemOptionNumber.A_Right_2]],

  [ItemTypeEnum.shadowWeapon, [ItemOptionNumber.SD_Wp_1]],
  [ItemTypeEnum.shadowArmor, [ItemOptionNumber.SD_Ar_1]],
  [ItemTypeEnum.shadowShield, [ItemOptionNumber.SD_Sh_1]],
  [ItemTypeEnum.shadowBoot, [ItemOptionNumber.SD_B_1]],
  [ItemTypeEnum.shadowEarring, [ItemOptionNumber.SD_Ear_1]],
  [ItemTypeEnum.shadowPendant, [ItemOptionNumber.SD_Pan_1]],
];

const WeaponTable: typeof ItemOptionTable = [
  [ItemTypeEnum.leftWeapon, [ItemOptionNumber.W_Right_1, ItemOptionNumber.W_Right_2, ItemOptionNumber.W_Right_3]],
  [ItemTypeEnum.weapon, [ItemOptionNumber.W_Left_1, ItemOptionNumber.W_Left_2, ItemOptionNumber.W_Left_3]],
];
const allTable: typeof ItemOptionTable = [...WeaponTable, ...ItemOptionTable];

export const ItemOptionMap = new Map<ItemTypeEnum, ItemOptionNumber[]>(allTable.map((a) => [a[0], a[1]]));
