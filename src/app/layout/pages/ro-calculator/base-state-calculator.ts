import { CharacterBase } from './jobs/_character-base.abstract';

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
  private cachedTotalPoint = new Map<number, number>();
  private cachedUsingPoint = new Map<number, number>();

  get availablePoint() {
    return this._totalPoint - this._usedPoint;
  }

  get summary() {
    return {
      totalPoint: this._totalPoint,
      usedPoint: this._usedPoint,
      availablePoint: this.availablePoint,
    };
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

  calculate() {
    this._totalPoint = this._initialPoint + this.calcTotalPoint(this._baseLevel);
    this._usedPoint = this._statuslevels.reduce((total, statusLevel) => {
      return total + this.calcUsingPoint(statusLevel);
    }, 0);

    return this;
  }

  private calcTotalPoint(level: number) {
    if (this.cachedTotalPoint.has(level)) return this.cachedTotalPoint.get(level);
    if (level <= 1) return 0;

    const previousLevelPoint = this.calcTotalPoint(level - 1);
    this.cachedTotalPoint.set(level - 1, previousLevelPoint);
    if (level < 100) return Math.floor((level - 1) / 5) + 3 + previousLevelPoint;
    if (level <= 150) return Math.floor((level - 1) / 10) + 13 + previousLevelPoint;
    if (level <= 200) return Math.floor((level - 1 - 150) / 7) + 28 + previousLevelPoint;

    return 0;
  }

  private calcUsingPoint(level: number) {
    if (this.cachedUsingPoint.has(level)) return this.cachedUsingPoint.get(level);
    if (level <= 1) return 0;

    const previousLevelPoint = this.calcUsingPoint(level - 1);
    this.cachedUsingPoint.set(level - 1, previousLevelPoint);
    if (level <= 100) return Math.floor((level - 2) / 10) + 2 + previousLevelPoint;
    if (level <= 130) return Math.floor((level - 101) / 5) * 4 + 16 + previousLevelPoint;

    return 0;
  }
}
