export interface ItemModel {
  classNum: number;
  sets: Set[];
  soldBy: any[];
  id: number;
  aegisName: string;
  name: string;
  unidName: string;
  resName: string;
  unidResName: string;
  description: string;
  unidDescription: string;
  slots: number;
  setname: any;
  itemTypeId: number;
  itemSubTypeId: number;
  itemSummonInfoContainedIn: ItemSummonInfoContainedIn[];
  itemSummonInfoContains: any[];
  attack: number;
  defense: any;
  weight: number;
  requiredLevel: number;
  limitLevel: any;
  itemLevel: number;
  job: number;
  compositionPos: any;
  attribute: number;
  location: any;
  locationId: number;
  accessory: any;
  price: any;
  range: any;
  matk: any;
  gender: any;
  refinable: boolean;
  indestructible: any;
  itemMoveInfo: ItemMoveInfo;
  rewardForAchievement: any[];
  cardPrefix: any;
  pets: any[];
  hasScript: boolean;
  script: Record<string, string[]>;
}

export interface Set {
  name: string;
  items: Item[];
}

export interface Item {
  itemId: number;
  name: string;
}

export interface ItemSummonInfoContainedIn {
  internalType: string;
  Type: number;
  sourceId: number;
  sourceName: string;
  targetId: number;
  targetName: string;
  count: number;
  totalOfSource: number;
  summonType: string;
  chance: number;
}

export interface ItemMoveInfo {
  drop: boolean;
  trade: boolean;
  store: boolean;
  cart: boolean;
  sell: boolean;
  mail: boolean;
  auction: boolean;
  guildStore: boolean;
}
