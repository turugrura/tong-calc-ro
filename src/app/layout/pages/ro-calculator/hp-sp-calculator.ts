import { CharacterBase } from './jobs/_character-base.abstract';
import { EquipmentSummaryModel } from './models/equipment-summary.model';
import { HpSpTable } from './models/hp-sp-table.model';
import { InfoForClass } from './models/info-for-class.model';
import { StatusSummary } from './models/status-summary.model';
import { floor } from './utils';

export class HpSpCalculator {
  private hpSpTable: HpSpTable;
  private _totalBonus: EquipmentSummaryModel;
  private _totalStatus: StatusSummary;
  private _level = 0;

  private _dataIndex = 0;

  private _maxHp = 0;
  private _maxSp = 0;

  private _shadowHP = 0;

  // bonus flag
  private _isUseHpL = false;

  setHpSpTable(hpSpTable: HpSpTable) {
    this.hpSpTable = hpSpTable;

    return this;
  }

  setAllInfo(info: Omit<InfoForClass, 'weapon' | 'monster'>) {
    const { model, status, totalBonus, equipmentBonus } = info;
    const { shadowArmor, shadowShield, shadowBoot, shadowEarring, shadowPendant } = equipmentBonus;
    let totalShadowRefine = shadowArmor.refine || 0;
    totalShadowRefine += shadowShield.refine || 0;
    totalShadowRefine += shadowBoot.refine || 0;
    totalShadowRefine += shadowEarring.refine || 0;
    totalShadowRefine += shadowPendant.refine || 0;
    this._shadowHP = totalShadowRefine * 10;

    this.setLevel(model.level);
    this.setTotalBonus(totalBonus);
    this.setTotalStatus(status);

    return this;
  }

  setClass(cClass: CharacterBase) {
    const dataIdx = this.hpSpTable.findIndex((a) => a.jobs[cClass.className]);
    this._dataIndex = dataIdx;

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
      console.log({ baseHp, baseSp, hp, hpPercent, sp, spPercent });

      let maxHp = floor(baseHp * 1.25);
      maxHp = floor(maxHp * (1 + this._totalStatus.totalVit * 0.01));
      maxHp += hp + this._shadowHP;
      maxHp += this.getBonusHpL();
      this._maxHp = maxHp + floor(maxHp * ((hpPercent || 0) * 0.01));

      let maxSp = floor(baseSp * 1.25);
      maxSp = floor(maxSp * (1 + this._totalStatus.totalInt * 0.01));
      maxSp += sp;
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
