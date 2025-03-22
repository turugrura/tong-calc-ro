import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
    selector: 'app-battle-monster-summary',
    templateUrl: './battle-monster-summary.component.html',
    styleUrls: ['./battle-monster-summary.component.css', '../ro-calculator.component.css'],
    standalone: false
})
export class BattleMonsterSummaryComponent {
  @Input({ required: true }) totalSummary = {} as any;
  @Input({ required: true }) isInProcessingPreset: boolean;

  @Output() showElementTableClick = new EventEmitter<any>();

  constructor() {}

  onShowElementalTableClick() {
    this.showElementTableClick.emit(1);
  }
}
