import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DropdownModel } from '../dropdown.model';
import { ItemModel } from '../item.model';
import { getEnchants } from '../enchant-table';

@Component({
  selector: 'app-equipment',
  templateUrl: './equipment.component.html',
  styleUrls: ['./equipment.component.css'],
})
export class EquipmentComponent implements OnInit {
  @Input({ required: true }) itemType: string;
  @Input({ required: true }) placeholder: string;

  @Input() items!: Record<number, ItemModel>;
  @Input() itemList: DropdownModel[] = [];
  @Input() refineList: DropdownModel[] = [];
  @Input() cardList: DropdownModel[] = [];
  @Input() mapEnchant!: Map<string, ItemModel>;
  @Input() optionList: any[] = [];

  @Output() onSelectItemEvent = new EventEmitter<any>();
  @Output() onClearItemEvent = new EventEmitter<string>();
  @Output() onOptionChangeEvent = new EventEmitter<string>();

  @Input() totalOptions = 0;

  @Input() itemId = undefined;
  @Output() itemIdChange = new EventEmitter<number>();

  @Input() itemRefine = undefined;
  @Output() itemRefineChange = new EventEmitter<number>();

  @Input() card1Id = undefined;
  @Output() card1IdChange = new EventEmitter<number>();

  @Input() card2Id = undefined;
  @Output() card2IdChange = new EventEmitter<number>();

  @Input() card3Id = undefined;
  @Output() card3IdChange = new EventEmitter<number>();

  @Input() card4Id = undefined;
  @Output() card4IdChange = new EventEmitter<number>();

  @Input() enchant2Id = undefined;
  @Output() enchant2IdChange = new EventEmitter<number>();

  @Input() enchant3Id = undefined;
  @Output() enchant3IdChange = new EventEmitter<number>();

  @Input() enchant4Id = undefined;
  @Output() enchant4IdChange = new EventEmitter<number>();

  @Input() option1Value = undefined;
  @Output() option1ValueChange = new EventEmitter<string>();

  @Input() option2Value = undefined;
  @Output() option2ValueChange = new EventEmitter<string>();

  totalCardSlots = 0;
  enchant2List: DropdownModel[] = [];
  enchant3List: DropdownModel[] = [];
  enchant4List: DropdownModel[] = [];

  constructor() {}

  ngOnInit() {}

  private setEnchantList(mainItemId: number) {
    let { aegisName, name } = this.items[mainItemId] ?? ({} as ItemModel);
    const enchants = getEnchants(aegisName) ?? getEnchants(name);

    const [_, e2, e3, e4] = Array.isArray(enchants) ? enchants : [];
    // console.log({ mainItemId, e2, e3, e4 });
    const clearModel = () => {
      for (const idx of [2, 3, 4]) {
        const enchantList = this[`enchant${idx}List`] as DropdownModel[];
        if (this.itemId && !enchantList.find((a) => a.value === this.itemId)) {
          const property = `enchant${idx}Id`;
          this[property] = undefined;
          this.onSelectItem(property);
        }
      }
    };

    this.enchant2List = (e2 ?? [])
      .map((a: any) => this.mapEnchant.get(a))
      .map((a: any) => ({ label: a.name, value: a.id }));
    this.enchant3List = (e3 ?? [])
      .map((a: any) => this.mapEnchant.get(a))
      .map((a: any) => ({ label: a.name, value: a.id }));
    this.enchant4List = (e4 ?? [])
      .map((a: any) => this.mapEnchant.get(a))
      .map((a: any) => ({ label: a.name, value: a.id }));

    clearModel();
  }

  onSelectItem(itemType: string, itemId = 0, refine = 0) {
    if (itemType === 'itemId') {
      this.totalCardSlots = this.items[itemId]?.slots || 0;
      this.setEnchantList(itemId);
      this.itemIdChange.emit(this.itemId);
      this.itemRefineChange.emit(this.itemRefine);
    } else {
      const e = this[`${itemType}Change`];
      const val = this[`${itemType}`];
      if (e instanceof EventEmitter) {
        e.emit(val);
      }
    }

    this.onSelectItemEvent.emit({ itemType, itemId, refine });
  }

  onClearItem(itemType: string) {
    this.onClearItemEvent.emit(itemType);
  }

  onOptionChange(optionValue: string) {
    this.onOptionChangeEvent.emit(optionValue);
  }
}
