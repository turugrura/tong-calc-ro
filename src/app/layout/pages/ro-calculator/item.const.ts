export enum ItemType {
  WEAPON = 'Weapon',
  ARMOR = 'Armor',
  CONSUMABLE = 'Consumable',
  CARD = 'Card',
  ETC = 'Etc',
}

export const ItemTypeIdMap = {
  1: ItemType.WEAPON,
  2: ItemType.ARMOR,
  5: ItemType.ETC,
  6: ItemType.CARD,
} as const;

export enum ItemTypeId {
  WEAPON = 1,
  ARMOR = 2,
  CONSUMABLE = 3,
  ETC = 5,
  CARD = 6,
}
