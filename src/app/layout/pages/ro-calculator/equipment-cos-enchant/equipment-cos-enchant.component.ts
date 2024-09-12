import { AfterViewInit, Component, EventEmitter, Input, Output } from '@angular/core';
import { DropdownModel } from '../../../../models/dropdown.model';

@Component({
  selector: 'app-equipment-cos-enchant',
  templateUrl: './equipment-cos-enchant.component.html',
  styleUrls: ['./equipment-cos-enchant.component.css', '../ro-calculator.component.css'],
})
export class EquipmentCosEnchantComponent implements AfterViewInit {
  @Input({ required: true }) itemType!: string;
  @Input({ required: true }) placeholder: string;

  @Input() itemList: DropdownModel[] = [];
  @Output() selectItemChange = new EventEmitter<any>();
  @Output() clearItemEvent = new EventEmitter<string>();

  @Input() itemId = undefined;
  @Output() itemIdChange = new EventEmitter<number>();

  private itemTypeMap = {};

  constructor() {}

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.itemTypeMap = {
        itemId: this.itemType,
      };
      this.onSelectItem('itemId', this.itemId, false);
    }, 300);
  }

  onSelectItem(itemType: string, itemId = 0, isEmit = true) {
    this.itemIdChange.emit(this.itemId);

    if (isEmit) {
      this.selectItemChange.emit({ itemType: this.itemTypeMap[itemType], itemId });
    }
  }

  onClearItem() {
    this.clearItemEvent.emit(this.itemType);
  }
}
