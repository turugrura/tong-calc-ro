import { ElementType, WeaponSubTypeName, WeaponSubTypeNameMapById, WeaponTypeName, WeaponTypeNameMapBySubTypeId } from '../constants';
import { ItemModel } from '../models/item.model';
import { floor } from '../utils';

const weaponUpgradeTable: Record<number, Record<number, { bonus: number; overUpgrade: number; highUpgrade: number; pAtkOrSMatk: number }>> = {
  1: {
    1: { bonus: 2, overUpgrade: 0, highUpgrade: 0, pAtkOrSMatk: 0 },
    2: { bonus: 4, overUpgrade: 0, highUpgrade: 0, pAtkOrSMatk: 0 },
    3: { bonus: 6, overUpgrade: 0, highUpgrade: 0, pAtkOrSMatk: 0 },
    4: { bonus: 8, overUpgrade: 0, highUpgrade: 0, pAtkOrSMatk: 0 },
    5: { bonus: 10, overUpgrade: 0, highUpgrade: 0, pAtkOrSMatk: 0 },
    6: { bonus: 12, overUpgrade: 0, highUpgrade: 0, pAtkOrSMatk: 0 },
    7: { bonus: 14, overUpgrade: 0, highUpgrade: 0, pAtkOrSMatk: 0 },
    8: { bonus: 16, overUpgrade: 2, highUpgrade: 0, pAtkOrSMatk: 0 },
    9: { bonus: 18, overUpgrade: 4, highUpgrade: 0, pAtkOrSMatk: 0 },
    10: { bonus: 20, overUpgrade: 6, highUpgrade: 0, pAtkOrSMatk: 0 },
    11: { bonus: 22, overUpgrade: 8, highUpgrade: 0, pAtkOrSMatk: 0 },
    12: { bonus: 24, overUpgrade: 10, highUpgrade: 0, pAtkOrSMatk: 0 },
    13: { bonus: 26, overUpgrade: 12, highUpgrade: 0, pAtkOrSMatk: 0 },
    14: { bonus: 28, overUpgrade: 14, highUpgrade: 0, pAtkOrSMatk: 0 },
    15: { bonus: 30, overUpgrade: 16, highUpgrade: 0, pAtkOrSMatk: 0 },
    16: { bonus: 32, overUpgrade: 18, highUpgrade: 16, pAtkOrSMatk: 0 },
    17: { bonus: 34, overUpgrade: 20, highUpgrade: 17, pAtkOrSMatk: 0 },
    18: { bonus: 36, overUpgrade: 22, highUpgrade: 18, pAtkOrSMatk: 0 },
    19: { bonus: 38, overUpgrade: 24, highUpgrade: 19, pAtkOrSMatk: 0 },
    20: { bonus: 40, overUpgrade: 26, highUpgrade: 20, pAtkOrSMatk: 0 },
  },
  2: {
    1: { bonus: 3, overUpgrade: 0, highUpgrade: 0, pAtkOrSMatk: 0 },
    2: { bonus: 6, overUpgrade: 0, highUpgrade: 0, pAtkOrSMatk: 0 },
    3: { bonus: 9, overUpgrade: 0, highUpgrade: 0, pAtkOrSMatk: 0 },
    4: { bonus: 12, overUpgrade: 0, highUpgrade: 0, pAtkOrSMatk: 0 },
    5: { bonus: 15, overUpgrade: 0, highUpgrade: 0, pAtkOrSMatk: 0 },
    6: { bonus: 18, overUpgrade: 0, highUpgrade: 0, pAtkOrSMatk: 0 },
    7: { bonus: 21, overUpgrade: 5, highUpgrade: 0, pAtkOrSMatk: 0 },
    8: { bonus: 24, overUpgrade: 10, highUpgrade: 0, pAtkOrSMatk: 0 },
    9: { bonus: 27, overUpgrade: 15, highUpgrade: 0, pAtkOrSMatk: 0 },
    10: { bonus: 30, overUpgrade: 20, highUpgrade: 0, pAtkOrSMatk: 0 },
    11: { bonus: 33, overUpgrade: 25, highUpgrade: 0, pAtkOrSMatk: 0 },
    12: { bonus: 36, overUpgrade: 30, highUpgrade: 0, pAtkOrSMatk: 0 },
    13: { bonus: 39, overUpgrade: 35, highUpgrade: 0, pAtkOrSMatk: 0 },
    14: { bonus: 42, overUpgrade: 40, highUpgrade: 0, pAtkOrSMatk: 0 },
    15: { bonus: 45, overUpgrade: 45, highUpgrade: 0, pAtkOrSMatk: 0 },
    16: { bonus: 48, overUpgrade: 50, highUpgrade: 32, pAtkOrSMatk: 0 },
    17: { bonus: 51, overUpgrade: 55, highUpgrade: 34, pAtkOrSMatk: 0 },
    18: { bonus: 54, overUpgrade: 60, highUpgrade: 36, pAtkOrSMatk: 0 },
    19: { bonus: 57, overUpgrade: 65, highUpgrade: 38, pAtkOrSMatk: 0 },
    20: { bonus: 60, overUpgrade: 70, highUpgrade: 40, pAtkOrSMatk: 0 },
  },
  3: {
    1: { bonus: 5, overUpgrade: 0, highUpgrade: 0, pAtkOrSMatk: 0 },
    2: { bonus: 10, overUpgrade: 0, highUpgrade: 0, pAtkOrSMatk: 0 },
    3: { bonus: 15, overUpgrade: 0, highUpgrade: 0, pAtkOrSMatk: 0 },
    4: { bonus: 20, overUpgrade: 0, highUpgrade: 0, pAtkOrSMatk: 0 },
    5: { bonus: 25, overUpgrade: 0, highUpgrade: 0, pAtkOrSMatk: 0 },
    6: { bonus: 30, overUpgrade: 8, highUpgrade: 0, pAtkOrSMatk: 0 },
    7: { bonus: 35, overUpgrade: 16, highUpgrade: 0, pAtkOrSMatk: 0 },
    8: { bonus: 40, overUpgrade: 24, highUpgrade: 0, pAtkOrSMatk: 0 },
    9: { bonus: 45, overUpgrade: 32, highUpgrade: 0, pAtkOrSMatk: 0 },
    10: { bonus: 50, overUpgrade: 40, highUpgrade: 0, pAtkOrSMatk: 0 },
    11: { bonus: 55, overUpgrade: 48, highUpgrade: 0, pAtkOrSMatk: 0 },
    12: { bonus: 60, overUpgrade: 56, highUpgrade: 0, pAtkOrSMatk: 0 },
    13: { bonus: 65, overUpgrade: 64, highUpgrade: 0, pAtkOrSMatk: 0 },
    14: { bonus: 70, overUpgrade: 72, highUpgrade: 0, pAtkOrSMatk: 0 },
    15: { bonus: 75, overUpgrade: 80, highUpgrade: 0, pAtkOrSMatk: 0 },
    16: { bonus: 80, overUpgrade: 88, highUpgrade: 32, pAtkOrSMatk: 0 },
    17: { bonus: 85, overUpgrade: 96, highUpgrade: 34, pAtkOrSMatk: 0 },
    18: { bonus: 90, overUpgrade: 104, highUpgrade: 36, pAtkOrSMatk: 0 },
    19: { bonus: 95, overUpgrade: 112, highUpgrade: 38, pAtkOrSMatk: 0 },
    20: { bonus: 100, overUpgrade: 120, highUpgrade: 40, pAtkOrSMatk: 0 },
  },
  4: {
    1: { bonus: 7, overUpgrade: 0, highUpgrade: 0, pAtkOrSMatk: 0 },
    2: { bonus: 14, overUpgrade: 0, highUpgrade: 0, pAtkOrSMatk: 0 },
    3: { bonus: 21, overUpgrade: 0, highUpgrade: 0, pAtkOrSMatk: 0 },
    4: { bonus: 28, overUpgrade: 0, highUpgrade: 0, pAtkOrSMatk: 0 },
    5: { bonus: 35, overUpgrade: 14, highUpgrade: 0, pAtkOrSMatk: 0 },
    6: { bonus: 42, overUpgrade: 28, highUpgrade: 0, pAtkOrSMatk: 0 },
    7: { bonus: 49, overUpgrade: 42, highUpgrade: 0, pAtkOrSMatk: 0 },
    8: { bonus: 56, overUpgrade: 56, highUpgrade: 0, pAtkOrSMatk: 0 },
    9: { bonus: 63, overUpgrade: 70, highUpgrade: 0, pAtkOrSMatk: 0 },
    10: { bonus: 70, overUpgrade: 84, highUpgrade: 0, pAtkOrSMatk: 0 },
    11: { bonus: 77, overUpgrade: 98, highUpgrade: 0, pAtkOrSMatk: 0 },
    12: { bonus: 84, overUpgrade: 112, highUpgrade: 0, pAtkOrSMatk: 0 },
    13: { bonus: 91, overUpgrade: 126, highUpgrade: 0, pAtkOrSMatk: 0 },
    14: { bonus: 98, overUpgrade: 140, highUpgrade: 0, pAtkOrSMatk: 0 },
    15: { bonus: 105, overUpgrade: 154, highUpgrade: 0, pAtkOrSMatk: 0 },
    16: { bonus: 112, overUpgrade: 168, highUpgrade: 48, pAtkOrSMatk: 0 },
    17: { bonus: 119, overUpgrade: 182, highUpgrade: 51, pAtkOrSMatk: 0 },
    18: { bonus: 126, overUpgrade: 196, highUpgrade: 54, pAtkOrSMatk: 0 },
    19: { bonus: 133, overUpgrade: 210, highUpgrade: 57, pAtkOrSMatk: 0 },
    20: { bonus: 140, overUpgrade: 224, highUpgrade: 60, pAtkOrSMatk: 0 },
  },
  5: {
    1: { bonus: 8, overUpgrade: 0, highUpgrade: 0, pAtkOrSMatk: 2 },
    2: { bonus: 16, overUpgrade: 0, highUpgrade: 0, pAtkOrSMatk: 4 },
    3: { bonus: 24, overUpgrade: 0, highUpgrade: 0, pAtkOrSMatk: 6 },
    4: { bonus: 32, overUpgrade: 0, highUpgrade: 0, pAtkOrSMatk: 8 },
    5: { bonus: 40, overUpgrade: 0, highUpgrade: 0, pAtkOrSMatk: 10 },
    6: { bonus: 48, overUpgrade: 0, highUpgrade: 0, pAtkOrSMatk: 12 },
    7: { bonus: 56, overUpgrade: 0, highUpgrade: 0, pAtkOrSMatk: 14 },
    8: { bonus: 64, overUpgrade: 0, highUpgrade: 0, pAtkOrSMatk: 16 },
    9: { bonus: 72, overUpgrade: 0, highUpgrade: 0, pAtkOrSMatk: 18 },
    10: { bonus: 80, overUpgrade: 0, highUpgrade: 0, pAtkOrSMatk: 20 },
    11: { bonus: 88, overUpgrade: 0, highUpgrade: 0, pAtkOrSMatk: 22 },
    12: { bonus: 96, overUpgrade: 0, highUpgrade: 0, pAtkOrSMatk: 24 },
    13: { bonus: 104, overUpgrade: 0, highUpgrade: 0, pAtkOrSMatk: 26 },
    14: { bonus: 112, overUpgrade: 0, highUpgrade: 0, pAtkOrSMatk: 28 },
    15: { bonus: 120, overUpgrade: 0, highUpgrade: 0, pAtkOrSMatk: 30 },
    16: { bonus: 128, overUpgrade: 0, highUpgrade: 0, pAtkOrSMatk: 32 },
    17: { bonus: 136, overUpgrade: 0, highUpgrade: 0, pAtkOrSMatk: 34 },
    18: { bonus: 144, overUpgrade: 0, highUpgrade: 0, pAtkOrSMatk: 36 },
    19: { bonus: 152, overUpgrade: 0, highUpgrade: 0, pAtkOrSMatk: 38 },
    20: { bonus: 160, overUpgrade: 0, highUpgrade: 0, pAtkOrSMatk: 40 },
  },
};

const IsLongRange: Partial<Record<WeaponTypeName, boolean>> = {
  gun: true,
  bow: true,
  whip: true,
  instrument: true,
};

const gradeBonusPercentage = {
  D: 0.8,
  C: 2.4,
  B: 4,
  A: 8,
};

export class Weapon {
  private _propertyAtk: ElementType = ElementType.Neutral;
  private _rangeType = '';
  private _typeName: WeaponTypeName;
  private _subTypeName: WeaponSubTypeName;
  private _baseWeaponAtk = 0;
  private _baseWeaponMatk = 0;
  private _itemSubTypeId = 0;
  private _baseWeaponLevel = 0;
  private _refineBonus = 0;
  private _overUpgradeBonus = 0;
  private _highUpgradeBonus = 0;
  private _pAtkOrSMatk = 0;
  private _weight = 0;

  set(params: { itemData: ItemModel; refineLevel: number; grade: string }) {
    const { itemData, refineLevel, grade } = params;
    const { itemLevel, attack, script, itemSubTypeId, weight, propertyAtk } = itemData || {};
    this._propertyAtk = propertyAtk;
    this._baseWeaponAtk = attack || 0;
    this._weight = weight || 0;
    this._baseWeaponMatk = Number(script?.['matk']?.[0]) || 0;
    this._itemSubTypeId = itemSubTypeId;
    this._baseWeaponLevel = itemLevel || 0;
    this._typeName = WeaponTypeNameMapBySubTypeId[itemSubTypeId];
    this._subTypeName = WeaponSubTypeNameMapById[itemSubTypeId];
    this._rangeType = IsLongRange[this._typeName] ? 'range' : 'melee';

    if (refineLevel > 0 && itemLevel > 0) {
      const { bonus, highUpgrade, overUpgrade, pAtkOrSMatk } = weaponUpgradeTable[itemLevel][refineLevel];
      const gradeBonus = floor((gradeBonusPercentage[grade?.toUpperCase()] || 0) * refineLevel);
      this._refineBonus = bonus + gradeBonus;
      this._overUpgradeBonus = overUpgrade;
      this._highUpgradeBonus = highUpgrade;
      this._pAtkOrSMatk = pAtkOrSMatk;
    } else {
      this._refineBonus = 0;
      this._overUpgradeBonus = 0;
      this._highUpgradeBonus = 0;
      this._pAtkOrSMatk = 0;
    }

    return this;
  }

  isType(...wTypes: WeaponTypeName[]): boolean {
    if (!this._typeName) return false;

    return wTypes.some((t) => t === this._typeName);
  }

  isSubType(...wSubTypes: WeaponSubTypeName[]): boolean {
    if (!this._typeName) return false;

    return wSubTypes.some((t) => t === this._subTypeName);
  }

  get data() {
    return {
      propertyAtk: this._propertyAtk,
      itemSubTypeId: this._itemSubTypeId,
      rangeType: this._rangeType,
      typeName: this._typeName,
      subTypeName: this._subTypeName,
      baseWeaponAtk: this._baseWeaponAtk,
      baseWeaponMatk: this._baseWeaponMatk,
      baseWeaponLevel: this._baseWeaponLevel,
      refineBonus: this._refineBonus,
      overUpgradeBonus: this._overUpgradeBonus,
      highUpgradeBonus: this._highUpgradeBonus,
      pAtkOrSMatk: this._pAtkOrSMatk,
      weight: this._weight,
    };
  }
}
