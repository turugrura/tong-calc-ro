export interface ItemModel {
  id: number;
  aegisName: string;
  name: string;
  unidName: string;
  resName: string;
  description: string;
  slots: number;
  itemTypeId: number;
  itemSubTypeId: number;
  itemLevel: any;
  attack: any;
  propertyAtk?: any;
  defense: any;
  weight: number;
  requiredLevel: any;
  location: any;
  compositionPos: number;
  cardPrefix?: string;
  grades?: string[];
  script: Record<string, any[]>;
}
