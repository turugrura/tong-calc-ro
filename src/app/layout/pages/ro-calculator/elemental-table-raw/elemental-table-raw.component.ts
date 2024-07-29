import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-elemental-table-raw',
  templateUrl: './elemental-table-raw.component.html',
  styleUrls: ['./elemental-table-raw.component.css'],
})
export class ElementalTableRawComponent {
  @Input({ required: true }) calcMonsters = [] as any[];
  @Input() isLoading = false;

  constructor() {}
}
