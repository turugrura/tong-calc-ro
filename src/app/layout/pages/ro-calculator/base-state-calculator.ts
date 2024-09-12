import { CharacterBase } from '../../../jobs/_character-base.abstract';

/**
=IFS(A2 <= 1, 100
,A2 < 100, FLOOR((A2-1) / 5) + 3
,A2 <= 150, FLOOR((A2-1) / 10) + 13
,A2 <= 200, FLOOR(((A2-1)-150) / 7) + 28
)

=IFS(A2<=1, 0
,A2<= 100, FLOOR((A2 - 2)/10) + 2
,A2 <= 130, FLOOR((A2 - 101)/5)*4 + 16
)
 */
export class BaseStateCalculator {
  private _baseLevel = 1;
  private _statuslevels: number[] = [];
  private _initialPoint = 100;
  private _totalPoint = 100;
  private _usedPoint = 100;

  private readonly MAX_LVL_FOR_TRAIT = 275;
  private _traitStatuslevels: number[] = [];
  private _totalTraitPoint = 100;
  private _usedTraitPoint = 100;

  private cachedTotalPoint = new Map<number, number>();
  private cachedUsingPoint = new Map<number, number>();
  private cachedTotalTraitPoint = new Map<number, number>();

  constructor() {
    this.cacheTotalTraitPoint();
  }

  get availablePoint() {
    return this._totalPoint - this._usedPoint;
  }

  get availableTraitPoint() {
    return this._totalTraitPoint - this._usedTraitPoint;
  }

  get summary() {
    const response = {
      totalPoint: this._totalPoint,
      usedPoint: this._usedPoint,
      availablePoint: this.availablePoint,
      appropriateLevel: 0,

      totalTraitPoint: this._totalTraitPoint,
      usedTraitPoint: this._usedTraitPoint,
      availableTraitPoint: this.availableTraitPoint,
      appropriateLevelForTrait: 0,
    };

    const baseLevel = this._baseLevel;
    if (response.availablePoint < 0) {
      const start = baseLevel + 1;
      for (let level = start; level <= 200; level++) {
        const availablePoint = this.setLevel(level).calculate().availablePoint;

        if (availablePoint > 0) {
          response.appropriateLevel = level;
          break;
        }
      }

      if (response.appropriateLevel === 0) {
        response.appropriateLevel = 201;
      }
    }

    if (response.availableTraitPoint < 0) {
      const start = baseLevel + 1;
      for (let level = start; level <= this.MAX_LVL_FOR_TRAIT; level++) {
        const availablePoint = this.cachedTotalTraitPoint.get(level) - response.usedTraitPoint;

        if (availablePoint > 0) {
          response.appropriateLevelForTrait = level;
          break;
        }
      }

      if (response.appropriateLevelForTrait === 0) {
        response.appropriateLevelForTrait = 301;
      }
    }

    return response;
  }

  setClass(_class: CharacterBase) {
    this._initialPoint = _class.initialStatPoint;

    return this;
  }

  setLevel(level: number) {
    this._baseLevel = level;

    return this;
  }

  setMainStatusLevels(levels: number[]) {
    this._statuslevels = levels;

    return this;
  }

  setTraitStatusLevels(levels: number[]) {
    this._traitStatuslevels = levels;

    return this;
  }

  calculate() {
    this._totalPoint = this._initialPoint + this.calcTotalPoint(this._baseLevel);
    this._usedPoint = this._statuslevels.reduce((total, statusLevel) => {
      return total + this.calcUsingPoint(statusLevel);
    }, 0);

    this._totalTraitPoint = this.cachedTotalTraitPoint.get(this._baseLevel) || 0;
    this._usedTraitPoint = this._traitStatuslevels.reduce((pre, cur) => pre + cur, 0);

    return this;
  }

  private calcTotalPoint(level: number) {
    if (this.cachedTotalPoint.has(level)) return this.cachedTotalPoint.get(level);
    if (!level || level <= 1) return 0;

    const previousLevelPoint = this.calcTotalPoint(level - 1);
    this.cachedTotalPoint.set(level - 1, previousLevelPoint);
    if (level < 100) return Math.floor((level - 1) / 5) + 3 + previousLevelPoint;
    if (level <= 150) return Math.floor((level - 1) / 10) + 13 + previousLevelPoint;
    if (level <= 200) return Math.floor((level - 1 - 150) / 7) + 28 + previousLevelPoint;

    return previousLevelPoint;
  }

  private calcUsingPoint(level: number) {
    if (this.cachedUsingPoint.has(level)) return this.cachedUsingPoint.get(level);
    if (!level || level <= 1) return 0;

    const previousLevelPoint = this.calcUsingPoint(level - 1);
    this.cachedUsingPoint.set(level - 1, previousLevelPoint);
    if (level <= 100) return Math.floor((level - 2) / 10) + 2 + previousLevelPoint;
    if (level <= 130) return Math.floor((level - 101) / 5) * 4 + 16 + previousLevelPoint;

    return 0;
  }

  private cacheTotalTraitPoint() {
    let total = 7;
    this.cachedTotalTraitPoint.set(200, total);

    for (let lvl = 201; lvl <= this.MAX_LVL_FOR_TRAIT; lvl++) {
      total += 3;
      if (lvl % 5 === 0) total += 4;

      this.cachedTotalTraitPoint.set(lvl, total);
    }
  }
}
