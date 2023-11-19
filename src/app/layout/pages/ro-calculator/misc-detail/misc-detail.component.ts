import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-misc-detail',
  templateUrl: './misc-detail.component.html',
  styleUrls: ['../ro-calculator.component.css'],
})
export class MiscDetailComponent {
  @Input({ required: true }) elementTable: any[];
  @Input({ required: true }) raceTable: any[];
  @Input({ required: true }) sizeTable: any[];
  @Input({ required: true }) skillMultiplierTable: any[];

  constructor() {}
}
