import { CharacterBase } from './jobs/_character-base.abstract';
import { ClassName } from './jobs/_class-name';
import { EquipmentSummaryModel } from './models/equipment-summary.model';
import { HpSpTable } from './models/hp-sp-table.model';
import { InfoForClass } from './models/info-for-class.model';
import { StatusSummary } from './models/status-summary.model';

const hpSpIndex: Record<ClassName, number> = {
  [ClassName.Swordman]: 2,
  [ClassName.Paladin]: 20,
  [ClassName.RoyalGuard]: 21,
  [ClassName.LordKnight]: 8,
  [ClassName.RuneKnight]: 9,
  [ClassName.Archer]: 4,
  [ClassName.Bard]: 30,
  [ClassName.Wanderer]: 33,
  [ClassName.Dance]: 32,
  [ClassName.Minstrel]: 31,
  [ClassName.Sniper]: 16,
  [ClassName.Ranger]: 17,
  [ClassName.Merchant]: 6,
  [ClassName.Whitesmith]: 14,
  [ClassName.Mechanic]: 15,
  [ClassName.Creator]: 28,
  [ClassName.Genetic]: 29,
  [ClassName.ArchBishop]: 11,
  [ClassName.Sura]: 23,
  [ClassName.Thief]: 7,
  [ClassName.AssassinCross]: 18,
  [ClassName.GuillotineCross]: 19,
  [ClassName.Rogue]: 26,
  [ClassName.ShadowChaser]: 27,
  [ClassName.Sage]: 24,
  [ClassName.Sorcerer]: 25,
  [ClassName.Mage]: 3,
  [ClassName.Wizard]: 12,
  [ClassName.Warlock]: 13,
  [ClassName.Doram]: 42,
  [ClassName.Taekwondo]: 39,
  [ClassName.SoulLinker]: 41,
  [ClassName.SoulReaper]: 44,
  [ClassName.StarEmperor]: 43,
  [ClassName.Rebellion]: 35,
  [ClassName.Ninja]: 36,
  [ClassName.Oboro]: 38,
  [ClassName.Kagerou]: 37,
};

export class HpSpCalculator {
  private hpSpTable: HpSpTable;
  private _totalBonus: EquipmentSummaryModel;
  private _totalStatus: StatusSummary;
  private _level = 0;

  private _dataIndex = 0;

  private _maxHp = 0;
  private _maxSp = 0;

  setHpSpTable(hpSpTable: HpSpTable) {
    this.hpSpTable = hpSpTable;

    return this;
  }

  setAllInfo(info: Omit<InfoForClass, 'weapon' | 'monster'>) {
    const { model, status, totalBonus } = info;

    this.setLevel(model.level);
    this.setTotalBonus(totalBonus);
    this.setTotalStatus(status);

    return this;
  }

  setClass(cClass: CharacterBase) {
    this._dataIndex = hpSpIndex[cClass.className];

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

  calculate() {
    const baseHp = this.hpSpTable[this._dataIndex].baseHp[this._level];
    const baseSp = this.hpSpTable[this._dataIndex].baseSp[this._level];

    let maxHp = Math.floor(baseHp * 1.25);
    maxHp += Math.floor(maxHp * (1 + this._totalStatus.totalVit * 0.01));
    maxHp += this._totalBonus.hp;
    this._maxHp = maxHp + Math.floor(maxHp * (this._totalBonus.hpPercent * 0.01));

    let maxSp = Math.floor(baseSp * 1.25);
    maxSp += Math.floor(this._maxSp * (1 + this._totalStatus.totalInt * 0.01));
    maxSp += this._totalBonus.sp;
    const buffedSp = Math.floor(maxSp * (this._totalBonus['buffedInt'] || 0));
    this._maxSp = maxSp + Math.floor(maxSp * (this._totalBonus.spPercent * 0.01)) + buffedSp;

    return this;
  }

  getTotalSummary() {
    return {
      maxHp: this._maxHp,
      maxSp: this._maxSp,
    };
  }
}
