import { AfterViewInit, Component, EventEmitter, Input, Output } from '@angular/core';
import { DropdownModel } from '../../../../models/dropdown.model';
import { ItemModel } from '../../../../models/item.model';
import { ItemTypeEnum, OptionableItemTypeSet } from '../../../../constants/item-type.enum';
import { ExtraOptionTable } from '../../../../constants/extra-option-table';
import { getGradeList } from '../../../../utils';
import { getEnchants } from 'src/app/constants/enchant_item';

@Component({
  selector: 'app-equipment',
  templateUrl: './equipment.component.html',
  styleUrls: ['../ro-calculator.component.css'],
})
export class EquipmentComponent implements AfterViewInit {
  @Input({ required: true }) itemType!: string;
  @Input({ required: true }) placeholder: string;
  @Input() isWeapon = false;

  @Input() items!: Record<number, ItemModel>;
  @Input() itemList: DropdownModel[] = [];
  @Input() refineList: DropdownModel[] = [];
  @Input() cardList: DropdownModel[] = [];
  @Input() mapEnchant!: Map<string, ItemModel>;
  @Input() optionList: any[] = [];

  @Output() selectItemChange = new EventEmitter<any>();
  @Output() clearItemEvent = new EventEmitter<string>();
  @Output() optionChange = new EventEmitter<string>();
  @Output() gradeChange = new EventEmitter<string>();

  @Input() itemId = undefined;
  @Output() itemIdChange = new EventEmitter<number>();

  @Input() itemRefine = undefined;
  @Output() itemRefineChange = new EventEmitter<number>();

  @Input() itemGrade: string = undefined;
  @Output() itemGradeChange = new EventEmitter<string>();

  @Input() card1Id = undefined;
  @Output() card1IdChange = new EventEmitter<number>();

  @Input() card2Id = undefined;
  @Output() card2IdChange = new EventEmitter<number>();

  @Input() card3Id = undefined;
  @Output() card3IdChange = new EventEmitter<number>();

  @Input() card4Id = undefined;
  @Output() card4IdChange = new EventEmitter<number>();

  @Input() enchant1Id = undefined;
  @Output() enchant1IdChange = new EventEmitter<number>();

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

  @Input() option3Value = undefined;
  @Output() option3ValueChange = new EventEmitter<string>();

  totalCardSlots = 0;
  enchant1List: DropdownModel[] = [];
  enchant2List: DropdownModel[] = [];
  enchant3List: DropdownModel[] = [];
  enchant4List: DropdownModel[] = [];
  totalExtraOption = 0;
  gradeList: DropdownModel[] = [];

  private itemTypeMap = {};

  constructor() { }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.itemTypeMap = {
        itemId: this.itemType,
        itemRefine: `${this.itemType}Refine`,
        itemGrade: `${this.itemType}Grade`,
        card1Id: this.isWeapon ? `${this.itemType}Card1` : `${this.itemType}Card`,
        card2Id: `${this.itemType}Card2`,
        card3Id: `${this.itemType}Card3`,
        card4Id: `${this.itemType}Card4`,
        enchant1Id: `${this.itemType}Enchant0`,
        enchant2Id: `${this.itemType}Enchant1`,
        enchant3Id: `${this.itemType}Enchant2`,
        enchant4Id: `${this.itemType}Enchant3`,
      };
      this.onSelectItem('itemId', this.itemId, this.itemRefine, false);
    }, 300);
  }

  get isHeadCardable() {
    return this.itemType === 'headMiddle' || this.itemType === 'headUpper';
  }

  private setEnchantList(mainItemId: number) {
    const { aegisName, name, canGrade } = this.items[mainItemId] ?? ({} as ItemModel);
    const enchants = getEnchants(aegisName) ?? getEnchants(name);

    const [e1, e2, e3, e4] = Array.isArray(enchants) ? enchants : [];
    // console.log({ mainItemId, e2, e3, e4 });
    const clearModel = () => {
      for (const idx of [1, 2, 3, 4]) {
        const enchantList = this[`enchant${idx}List`] as DropdownModel[];
        const property = `enchant${idx}Id`;
        const currentEnchantValue = this[property]
        if (this.itemId && !enchantList.find((a) => a.value === currentEnchantValue)) {
          this[property] = undefined;
          this.onSelectItem(property);
        }
      }
    };

    this.enchant1List = (e1 ?? []).map((a: any) => this.mapEnchant.get(a)).map((a: any) => ({ label: a.name, value: a.id }));
    this.enchant2List = (e2 ?? []).map((a: any) => this.mapEnchant.get(a)).map((a: any) => ({ label: a.name, value: a.id }));
    this.enchant3List = (e3 ?? []).map((a: any) => this.mapEnchant.get(a)).map((a: any) => ({ label: a.name, value: a.id }));
    this.enchant4List = (e4 ?? []).map((a: any) => this.mapEnchant.get(a)).map((a: any) => ({ label: a.name, value: a.id }));

    this.gradeList = canGrade ? getGradeList() : [];

    clearModel();
  }

  onSelectItem(itemType: string, itemId = 0, refine = 0, isEmit = true) {
    if (itemType === 'itemId') {
      const item = this.items[itemId];
      this.totalCardSlots = item?.slots || 0;
      this.setEnchantList(itemId);
      this.itemIdChange.emit(this.itemId);
      this.itemRefineChange.emit(this.itemRefine);
      this.itemGrade = null;
      this.itemGradeChange.emit(this.itemGrade);

      if (this.totalCardSlots < 4 && this.card4Id) {
        this.card4Id = undefined;
        this.card4IdChange.emit();
      }
      if (this.totalCardSlots < 3 && this.card3Id) {
        this.card3Id = undefined;
        this.card3IdChange.emit();
      }
      if (this.totalCardSlots < 2 && this.card2Id) {
        this.card2Id = undefined;
        this.card2IdChange.emit();
      }
      if (this.totalCardSlots < 1 && this.card1Id) {
        this.card1Id = undefined;
        this.card1IdChange.emit();
      }

      if (this.itemType === ItemTypeEnum.weapon) {
        this.totalExtraOption = 3;
      }
      if (this.itemType !== ItemTypeEnum.weapon && OptionableItemTypeSet.has(this.itemType as any)) {
        const itemAegisName = item?.aegisName;
        this.totalExtraOption = ExtraOptionTable[itemAegisName] || 0;
      }
    } else {
      const e = this[`${itemType}Change`];
      const val = this[`${itemType}`];
      if (e instanceof EventEmitter) {
        e.emit(val);
      }
    }

    if (isEmit) {
      this.selectItemChange.emit({ itemType: this.itemTypeMap[itemType], itemId, refine });
    }
  }

  onClearItem(itemType: string) {
    this.clearItemEvent.emit(itemType);
  }

  onSelectGrade(grade: string) {
    this.itemGradeChange.emit(grade);
    this.gradeChange.emit(grade);
  }

  onOptionChange(optionType: string, optionValue: any) {
    const e = this[`${optionType}Change`];
    if (e instanceof EventEmitter) {
      e.emit(optionValue?.value);
    }

    this.optionChange.emit(optionValue);
  }
}
