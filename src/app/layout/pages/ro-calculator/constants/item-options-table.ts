import { ItemOptionNumber } from './item-option-number.enum';
import { ItemTypeEnum } from './item-type.enum';

export const ItemOptionTable: [ItemTypeEnum, [ItemOptionNumber, ItemOptionNumber]][] = [
  [ItemTypeEnum.shield, [ItemOptionNumber.Shield_1, ItemOptionNumber.Shield_2]],
  [ItemTypeEnum.headUpper, [ItemOptionNumber.H_Upper_1, ItemOptionNumber.H_Upper_2]],
  [ItemTypeEnum.headMiddle, [ItemOptionNumber.H_Mid_1, ItemOptionNumber.H_Mid_2]],
  // [ItemTypeEnum.headLower, [ExtraOption.H_Low_1, ExtraOption.H_Low_2]],
  [ItemTypeEnum.armor, [ItemOptionNumber.Armor_1, ItemOptionNumber.Armor_2]],
  [ItemTypeEnum.garment, [ItemOptionNumber.Garment_1, ItemOptionNumber.Garment_2]],
  // [ItemTypeEnum.boot, [ExtraOption.Boot_1, ExtraOption.Boot_2]],
  [ItemTypeEnum.accLeft, [ItemOptionNumber.A_Left_1, ItemOptionNumber.A_Left_2]],
  [ItemTypeEnum.accRight, [ItemOptionNumber.A_Right_1, ItemOptionNumber.A_Right_2]],
];
