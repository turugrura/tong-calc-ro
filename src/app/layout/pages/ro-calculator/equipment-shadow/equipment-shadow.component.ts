import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { DropdownModel } from '../../../../models/dropdown.model';

interface EventEmitterResultModel {
  itemType: string;
  itemId?: number;
  refine?: number;
}

@Component({
  selector: 'app-equipment-shadow',
  templateUrl: './equipment-shadow.component.html',
  styleUrls: ['../ro-calculator.component.css'],
})
export class EquipmentShadowComponent implements OnChanges {
  @Input({ required: true }) itemType!: string;
  @Input({ required: true }) placeholder: string;

  @Input() itemList: DropdownModel[] = [];
  @Input() refineList: DropdownModel[] = [];
  @Input() optionList: any[] = [];

  @Output() selectItemChange = new EventEmitter<EventEmitterResultModel>();
  @Output() clearItemEvent = new EventEmitter<string>();
  @Output() optionChange = new EventEmitter<string>();

  @Input() itemId = undefined;
  @Output() itemIdChange = new EventEmitter<number>();

  @Input() itemRefine = undefined;
  @Output() itemRefineChange = new EventEmitter<number>();

  @Input() optionValue = undefined;
  @Output() optionValueChange = new EventEmitter<string>();

  private itemTypeMap = {};

  private readonly requireSet = new Set(['itemList',])

  constructor() { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['itemList'] && !changes['itemList']?.isFirstChange()) {
      this.requireSet.delete('itemList')
    }

    if (this.requireSet.size === 0) {
      this.requireSet.add('x1').add('x2').add('x3').add('x4').add('x5').add('x6')

      setTimeout(() => {
        this.itemTypeMap = {
          itemId: this.itemType,
          itemRefine: `${this.itemType}Refine`,
        };
        this.onSelectItem('itemId', this.itemId, this.itemRefine, false);
      }, 0);
    }
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
