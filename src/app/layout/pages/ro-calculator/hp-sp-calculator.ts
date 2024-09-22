import { ItemTypeEnum, MainItemWithRelations } from '../../../constants/item-type.enum';
import { CharacterBase } from '../../../jobs/_character-base.abstract';
import { EquipmentSummaryModel } from '../../../models/equipment-summary.model';
import { HpSpTable } from '../../../models/hp-sp-table.model';
import { InfoForClass } from '../../../models/info-for-class.model';
import { StatusSummary } from '../../../models/status-summary.model';
import { floor } from '../../../utils';

const mainEquipment = [
  ItemTypeEnum.weapon,
  ItemTypeEnum.leftWeapon,
  ItemTypeEnum.headUpper,
  ItemTypeEnum.headMiddle,
  ItemTypeEnum.headLower,
  ItemTypeEnum.armor,
  ItemTypeEnum.shield,
  ItemTypeEnum.garment,
  ItemTypeEnum.boot,
  ItemTypeEnum.accLeft,
  ItemTypeEnum.accRight,
];
const eligibleVitIntItems = Object.entries(MainItemWithRelations)
  .filter(([mainItem]) => mainEquipment.includes(mainItem as any))
  .flatMap(([mainItem, relatedItems]) => {
    return [mainItem, ...relatedItems];
  });

export class HpSpCalculator {
  private hpSpTable: HpSpTable;
  private _totalBonus: EquipmentSummaryModel;
  private _totalStatus: StatusSummary;
  private _level = 0;

  private _dataIndex = 0;

  private _maxHp = 0;
  private _maxSp = 0;
  private _baseHp = 0;
  private _baseSp = 0;

  private _shadowHP = 0;
  private _equipmentVit = 0;
  private _equipmentInt = 0;

  // bonus flag
  private _isUseHpL = false;

  private _bonusMainClass = 1.25;

  setHpSpTable(hpSpTable: HpSpTable) {
    this.hpSpTable = hpSpTable;

    return this;
  }

  setAllInfo(info: Omit<InfoForClass, 'weapon' | 'monster'> & { baseHp: number; baseSp: number }) {
    const { model, status, totalBonus, equipmentBonus, baseHp, baseSp } = info;
    // this._baseHp = baseHp || 0;
    // this._baseSp = baseSp || 0;

    const { shadowArmor, shadowShield, shadowBoot, shadowEarring, shadowPendant } = equipmentBonus;
    let totalShadowRefine = shadowArmor.refine || 0;
    totalShadowRefine += shadowShield.refine || 0;
    totalShadowRefine += shadowBoot.refine || 0;
    totalShadowRefine += shadowEarring.refine || 0;
    totalShadowRefine += shadowPendant.refine || 0;
    this._shadowHP = totalShadowRefine * 10;

    let equipmentVit = 0;
    let equipmentInt = 0;

    for (const equipmentName of eligibleVitIntItems) {
      equipmentVit += equipmentBonus[equipmentName]?.vit || 0;
      equipmentInt += equipmentBonus[equipmentName]?.int || 0;
    }
    this._equipmentVit = equipmentVit;
    this._equipmentInt = equipmentInt;

    this.setLevel(model.level);
    this.setTotalBonus(totalBonus);
    this.setTotalStatus(status);

    return this;
  }

  setClass(cClass: CharacterBase) {
    const dataIdx = this.hpSpTable.findIndex((a) => a.jobs[cClass.className]);
    this._dataIndex = dataIdx;
    this._bonusMainClass = cClass.isExpandedClass ? 1 : 1.25

    return this;
  }

  setBonusFlag(params: { isUseHpL: boolean }) {
    const { isUseHpL } = params;

    this._isUseHpL = isUseHpL;

    return this;
  }

  private setLevel(level: number) {
    this._level = level;

    return this;
  }

  private setTotalBonus(totalBonus: EquipmentSummaryModel) {
    this._totalBonus = totalBonus;

    return this;
  }

  private setTotalStatus(status: StatusSummary) {
    this._totalStatus = status;

    return this;
  }

  private getBonusHpL() {
    if (this._isUseHpL) {
      return 2500 + floor((this._level * 10) / 3);
    }

    return 0;
  }

  calculate() {
    try {
      const baseHp = this.hpSpTable[this._dataIndex].baseHp[this._level];
      const baseSp = this.hpSpTable[this._dataIndex].baseSp[this._level];

      const { hp, hpPercent, sp, spPercent } = this._totalBonus;
      // console.log({ baseHp, baseSp, hp, hpPercent, sp, spPercent });

      let maxHp = floor(baseHp * this._bonusMainClass) + this._baseHp;
      maxHp = floor(maxHp * (1 + this._totalStatus.totalVit * 0.01));
      maxHp += hp + this._shadowHP + this._equipmentVit;
      maxHp += this.getBonusHpL();
      this._maxHp = maxHp + floor(maxHp * ((hpPercent || 0) * 0.01));

      let maxSp = floor(baseSp * this._bonusMainClass) + this._baseSp;
      maxSp = floor(maxSp * (1 + this._totalStatus.totalInt * 0.01));
      maxSp += sp + this._equipmentInt;
      this._maxSp = maxSp + floor(maxSp * ((spPercent || 0) * 0.01));
    } catch (error) {
      console.error('hp calculation', error);
    }
    return this;
  }

  getTotalSummary() {
    return {
      maxHp: this._maxHp,
      maxSp: this._maxSp,
    };
  }
}
