import { AfterViewInit, Component, EventEmitter, Input, Output } from '@angular/core';
import { DropdownModel } from '../../../../models/dropdown.model';

@Component({
  selector: 'app-equipment-shadow',
  templateUrl: './equipment-shadow.component.html',
  styleUrls: ['../ro-calculator.component.css'],
})
export class EquipmentShadowComponent implements AfterViewInit {
  @Input({ required: true }) itemType!: string;
  @Input({ required: true }) placeholder: string;

  @Input() itemList: DropdownModel[] = [];
  @Input() refineList: DropdownModel[] = [];
  @Input() optionList: any[] = [];

  @Output() selectItemChange = new EventEmitter<any>();
  @Output() clearItemEvent = new EventEmitter<string>();
  @Output() optionChange = new EventEmitter<string>();

  @Input() itemId = undefined;
  @Output() itemIdChange = new EventEmitter<number>();

  @Input() itemRefine = undefined;
  @Output() itemRefineChange = new EventEmitter<number>();

  @Input() optionValue = undefined;
  @Output() optionValueChange = new EventEmitter<string>();

  private itemTypeMap = {};

  constructor() {}

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.itemTypeMap = {
        itemId: this.itemType,
        itemRefine: `${this.itemType}Refine`,
      };
      this.onSelectItem('itemId', this.itemId, this.itemRefine, false);
    }, 300);
  }

  onSelectItem(itemType: string, itemId = 0, refine = 0, isEmit = true) {
    if (itemType === 'itemId') {
      this.itemIdChange.emit(this.itemId);
      this.itemRefineChange.emit(this.itemRefine);
    } else {
      const val = this[`${itemType}`];
      this.itemRefineChange.emit(val);
    }

    if (isEmit) {
      this.selectItemChange.emit({ itemType: this.itemTypeMap[itemType], itemId, refine });
    }
  }

  onClearItem() {
    this.clearItemEvent.emit(this.itemType);
  }

  onOptionChange(optionValue: any) {
    this.optionValueChange.emit(optionValue?.value);
    this.optionChange.emit(optionValue);
  }
}
