import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
    selector: 'app-status-input',
    templateUrl: './status-input.component.html',
    styleUrls: ['./status-input.component.css', '../ro-calculator.component.css'],
    standalone: false
})
export class StatusInputComponent {
  @Input({ required: true }) label: string;
  @Input({ required: true }) dropdownList: any[];

  @Input({ required: true }) value = undefined;
  @Output() valueChange = new EventEmitter<number>();

  @Input({ required: true }) extraValue: number;
  @Input() badgeSeverity: 'success' | 'info' | 'warning' | 'danger' = 'info';
  @Input() disabled = false;

  constructor() {}

  onBaseStatusChange() {
    this.valueChange.emit(this.value);
  }
}
