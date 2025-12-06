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
  @Input() sizeTableName = 'Size';
  @Input({ required: true }) classTable: any[];
  @Input({ required: true }) skillMultiplierTable: any[];
  @Input() atkTypeTable: any[] = [];

  constructor() { }

  get isShowElementTable() {
    return this.elementTable?.length > 0;
  }

  get isShowSizeTable() {
    return this.sizeTable?.length > 0;
  }

  get isShowSkillMultiplierTable() {
    return this.skillMultiplierTable?.length > 0;
  }

  get isShowAtkTypeTable() {
    return this.atkTypeTable?.length > 0;
  }
}
