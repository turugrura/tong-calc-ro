import { Component, Input } from '@angular/core';
import { floor } from '../utils';

@Component({
  selector: 'app-calc-value',
  templateUrl: './calc-value.component.html',
  styleUrls: ['./calc-value.component.css', '../ro-calculator.component.css'],
})
export class CalcValueComponent {
  @Input({ required: true }) label: string;
  @Input() styleClass: string;
  @Input() unit: string;
  @Input() min: number;
  @Input({ required: true }) max: number;
  @Input() totalHit: number;

  @Input() showPercentDiff = false;
  @Input() enableCompare = false;
  @Input() isGreaterIsBetter = true;
  @Input() styleClass2: string;
  @Input() min2: number;
  @Input() max2: number;

  constructor() {}

  get compareStyleClass() {
    if (!this.isDisplayCompare) return this.styleClass2;

    const isGreater = this.max2 > this.max;

    if (this.isGreaterIsBetter) {
      return isGreater ? 'compare_greater' : 'compare_lower';
    }

    return isGreater ? 'compare_lower' : 'compare_greater';
  }

  get isDisplayRangeDmg() {
    return this.min != null && this.min !== this.max;
  }

  get isDisplayRangeDmg2() {
    return this.min2 != null && this.min2 !== this.max2;
  }

  get isDisplayCompare() {
    const isDiffVale = this.max !== this.max2;

    return this.enableCompare && this.max2 != null && isDiffVale;
  }

  get _min() {
    return this.min || 0;
  }
  get _min2() {
    return this.min2 || 0;
  }
  get _max() {
    return this.max || 0;
  }
  get _max2() {
    return this.max2 || 0;
  }

  get _diffPercent() {
    if (!this.isDisplayCompare || !this.showPercentDiff) return '';

    const avg1 = (this._min + this.max) / 2;
    const avg2 = (this._min2 + this.max2) / 2;

    const percentage = ((avg2 - avg1) * 100) / avg1;
    const prefix = percentage > 0 ? '+' : '';

    return `(${prefix}${floor(percentage, 1)} %)`;
  }
}
