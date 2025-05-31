import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { getEnchants } from 'src/app/constants';
import { ItemModel } from 'src/app/models/item.model';
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
export class EquipmentShadowComponent implements OnInit, OnChanges {
  @Input() readonly items!: Record<number, ItemModel>;
  @Input({ required: true }) itemType!: string;
  @Input({ required: true }) placeholder: string;
  @Input() mapEnchant!: Map<string, ItemModel>;

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

  @Input() enchant3Id = undefined;
  @Output() enchant3IdChange = new EventEmitter<number>();

  @Input() enchant4Id = undefined;
  @Output() enchant4IdChange = new EventEmitter<number>();

  private itemTypeMap = {};

  private readonly requireSet = new Set(['items', 'itemList', 'mapEnchant',]);
  private isInternalItemIdChange = false;

  enchant3List: DropdownModel[] = [];
  enchant4List: DropdownModel[] = [];

  constructor() { }

  ngOnInit(): void {
    this.itemTypeMap = {
      itemId: this.itemType,
      itemRefine: `${this.itemType}Refine`,
      enchant3Id: `${this.itemType}Enchant2`,
      enchant4Id: `${this.itemType}Enchant3`,
    };
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ((changes['items'])) {
      if (!changes['items']?.isFirstChange() || changes['items'].currentValue) {
        this.requireSet.delete('items');
      }
    }
    if (changes['itemList'] && !changes['itemList']?.isFirstChange()) {
      this.requireSet.delete('itemList');
    }
    if ((changes['mapEnchant'])) {
      if (!changes['mapEnchant']?.isFirstChange() || changes['mapEnchant'].currentValue?.size) {
        this.requireSet.delete('mapEnchant');
      }
    }

    if (this.requireSet.size === 0) {
      this.requireSet.add('x1').add('x2').add('x3').add('x4').add('x5').add('x6');

      setTimeout(() => {
        this.onSelectItem('itemId', this.itemId, this.itemRefine, false);
      }, 0);
    } else if (changes['itemId'] && this.requireSet.size === 6) {
      // handle property was set from main component (when load data)
      if (!this.isInternalItemIdChange) {
        setTimeout(() => {
          // console.log(this.itemType, 'changes itemId isInternalItemIdChange ____ ', this.isInternalItemIdChange, changes['itemId'])
          this.onSelectItem('itemId', this.itemId, this.itemRefine, false);
        }, 0);
      }

      this.isInternalItemIdChange = false;
    }
  }

  private getItem(mainItemId?: number) {
    return this.items?.[mainItemId || this.itemId] ?? ({} as ItemModel);
  }

  private setEnchantList() {
    const { aegisName, name } = this.getItem();
    const enchants = getEnchants(aegisName) ?? getEnchants(name);

    const [_, __, e3, e4] = Array.isArray(enchants) ? enchants : [];
    // console.log({ mainItemId, e2, e3, e4 });
    const clearModel = () => {
      for (const idx of [3, 4]) {
        const enchantList = this[`enchant${idx}List`] as DropdownModel[];
        const property = `enchant${idx}Id`;
        const currentEnchantValue = this[property];
        if (this.itemId && currentEnchantValue != null && !enchantList.find((a) => a.value === currentEnchantValue)) {
          this[property] = undefined;
          this.onSelectItem(property);
        }
      }
    };

    this.enchant3List = (e3 ?? []).map((a: any) => this.mapEnchant.get(a)).map((a: any) => ({ label: a.name, value: a.id }));
    this.enchant4List = (e4 ?? []).map((a: any) => this.mapEnchant.get(a)).map((a: any) => ({ label: a.name, value: a.id }));

    clearModel();
  }

  onSelectItem(itemType: string, itemId = 0, refine = 0, isEmit = true) {
    if (itemType === 'itemId') {
      this.setEnchantList();
      this.itemIdChange.emit(this.itemId);
      this.itemRefineChange.emit(this.itemRefine);
    } else {
      const val = this[`${itemType}`];
      const e = this[`${itemType}Change`];
      if (e instanceof EventEmitter) {
        e.emit(val);
      }
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
