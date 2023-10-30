import { CharacterBase } from './jobs/_character-base.abstract';
import { ClassName } from './jobs/_class-name';
import { EquipmentSummaryModel } from './models/equipment-summary.model';
import { HpSpTable } from './models/hp-sp-table.model';
import { InfoForClass } from './models/info-for-class.model';
import { StatusSummary } from './models/status-summary.model';

const hpSpIndex: Record<ClassName, number> = {
  [ClassName.Swordman]: 1,
  [ClassName.Paladin]: 19,
  [ClassName.RoyalGuard]: 20,
  [ClassName.LordKnight]: 7,
  [ClassName.RuneKnight]: 8,
  [ClassName.Archer]: 3,
  [ClassName.Bard]: 29,
  [ClassName.Wanderer]: 32,
  [ClassName.Dance]: 31,
  [ClassName.Minstrel]: 30,
  [ClassName.Sniper]: 15,
  [ClassName.Ranger]: 16,
  [ClassName.Merchant]: 5,
  [ClassName.Whitesmith]: 13,
  [ClassName.Mechanic]: 14,
  [ClassName.Creator]: 27,
  [ClassName.Genetic]: 28,
  [ClassName.ArchBishop]: 10,
  [ClassName.Sura]: 22,
  [ClassName.Thief]: 6,
  [ClassName.AssassinCross]: 17,
  [ClassName.GuillotineCross]: 18,
  [ClassName.Rogue]: 25,
  [ClassName.ShadowChaser]: 26,
  [ClassName.Sage]: 23,
  [ClassName.Sorcerer]: 24,
  [ClassName.Mage]: 2,
  [ClassName.Wizard]: 11,
  [ClassName.Warlock]: 12,
  [ClassName.Doram]: 41,
  [ClassName.Taekwondo]: 38,
  [ClassName.SoulLinker]: 40,
  [ClassName.SoulReaper]: 43,
  [ClassName.StarEmperor]: 42,
  [ClassName.Rebellion]: 33,
  [ClassName.Ninja]: 35,
  [ClassName.Oboro]: 37,
  [ClassName.Kagerou]: 36,
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
    // const baseHp = this.hpSpTable[this._dataIndex].baseHp[this._level];
    // const baseSp = this.hpSpTable[this._dataIndex].baseSp[this._level];

    // let maxHp = Math.floor(baseHp * 1.25);
    // maxHp += Math.floor(maxHp * (1 + this._totalStatus.totalVit * 0.01));
    // maxHp += this._totalBonus.hp;
    // this._maxHp = maxHp + Math.floor(maxHp * ((this._totalBonus.hpPercent || 0) * 0.01));

    // let maxSp = Math.floor(baseSp * 1.25);
    // maxSp += Math.floor(this._maxSp * (1 + this._totalStatus.totalInt * 0.01));
    // maxSp += this._totalBonus.sp;
    // const buffedSp = Math.floor(maxSp * (this._totalBonus['buffedInt'] || 0));
    // this._maxSp = maxSp + Math.floor(maxSp * ((this._totalBonus.spPercent || 0) * 0.01)) + buffedSp;

    return this;
  }

  getTotalSummary() {
    return {
      maxHp: this._maxHp,
      maxSp: this._maxSp,
    };
  }
}
