import { ExtraOptionTable } from '../constants/extra-option-table';
import { ItemOptionNumber } from '../constants/item-option-number.enum';
import { ItemOptionTable } from '../constants/item-options-table';
import { ItemTypeEnum } from '../constants/item-type.enum';
import { MainModel } from '../models/main.model';

const isShadowOption = {
  [ItemTypeEnum.shadowWeapon]: true,
  [ItemTypeEnum.shadowArmor]: true,
  [ItemTypeEnum.shadowShield]: true,
  [ItemTypeEnum.shadowBoot]: true,
  [ItemTypeEnum.shadowEarring]: true,
  [ItemTypeEnum.shadowPendant]: true,
};
const weaponOptionSlots = [
  ItemOptionNumber.W_Right_1,
  ItemOptionNumber.W_Right_2,
  ItemOptionNumber.W_Right_3,
  ItemOptionNumber.W_Left_1,
  ItemOptionNumber.W_Left_2,
  ItemOptionNumber.W_Left_3,
];

export const toRawOptionTxtList = (model: MainModel, itemMap) => {
  const rawOptionTxts = [...model.rawOptionTxts];
  for (const [_itemType, slotNumbers] of ItemOptionTable) {
    const itemId = model[_itemType];

    if (isShadowOption[_itemType]) {
      if (!itemId) rawOptionTxts[slotNumbers[0]] = null;
      continue;
    }

    let totalItemOptionSlot = 0;
    if (itemId) {
      const aegisName = itemMap[itemId]?.aegisName;
      totalItemOptionSlot = ExtraOptionTable[aegisName] || 0;
    }

    for (const [index, slot] of slotNumbers.entries()) {
      if (totalItemOptionSlot <= index) {
        rawOptionTxts[slot] = null;
      }
    }
  }

  for (const slot of weaponOptionSlots) {
    const val = rawOptionTxts[slot];
    if (val) {
      if (val.startsWith('baseHp')) {
        rawOptionTxts[slot] = null;
        rawOptionTxts[ItemOptionNumber.X_HP] = val;
      } else if (val.startsWith('baseSp')) {
        rawOptionTxts[slot] = null;
        rawOptionTxts[ItemOptionNumber.X_SP] = val;
      }
    }
  }

  return rawOptionTxts;
};
