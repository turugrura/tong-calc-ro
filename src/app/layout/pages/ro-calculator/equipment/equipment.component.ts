import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { DropdownModel } from '../../../../models/dropdown.model';
import { ItemModel } from '../../../../models/item.model';
import { ItemTypeEnum, OptionableItemTypeSet } from '../../../../constants/item-type.enum';
import { ExtraOptionTable } from '../../../../constants/extra-option-table';
import { createNumberDropdownList, getGradeList } from '../../../../utils';
import { getEnchants } from 'src/app/constants/enchant_item';

interface EventEmitterResultModel {
  itemType: string;
  itemId?: number;
  refine?: number;
  grade?: string;
}

@Component({
    selector: 'app-equipment',
    templateUrl: './equipment.component.html',
    styleUrls: ['../ro-calculator.component.css'],
    standalone: false
})
export class EquipmentComponent implements OnChanges, OnInit {
  @Input({ required: true }) readonly itemType!: string;
  @Input({ required: true }) readonly placeholder: string;
  @Input() isEndWithSpace = false;
  @Input() readonly overlayLabel!: string;

  @Input() readonly items!: Record<number, ItemModel>;
  @Input() itemList: DropdownModel[] = [];
  @Input() refineList: DropdownModel[] = [];
  @Input() cardList: DropdownModel[] = [];
  @Input() mapEnchant!: Map<string, ItemModel>;
  @Input() optionList: any[] = [];

  @Output() selectItemChange = new EventEmitter<EventEmitterResultModel>();
  @Output() clearItemEvent = new EventEmitter<string>();
  @Output() optionChange = new EventEmitter<string>();
  @Output() gradeChange = new EventEmitter<EventEmitterResultModel>();

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
  private readonly requireSet = new Set(['items', 'itemList', 'mapEnchant',])
  private isInternalItemIdChange = false;

  constructor() { }

  ngOnInit(): void {
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
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    // console.log(this.itemType, 'changes', changes)
    if ((changes['items'])) {
      if (!changes['items']?.isFirstChange() || changes['items'].currentValue) {
        this.requireSet.delete('items')
      }
    }
    if (changes['itemList'] && !changes['itemList']?.isFirstChange()) {
      this.requireSet.delete('itemList')
    }
    if ((changes['mapEnchant'])) {
      if (!changes['mapEnchant']?.isFirstChange() || changes['mapEnchant'].currentValue?.size) {
        this.requireSet.delete('mapEnchant')
      }
    }
    // if (this.itemType === 'weapon' && changes['mapEnchant']) {
    //   console.log({ size: this.mapEnchant?.size, isFirst: changes['mapEnchant']?.isFirstChange() })
    // }

    if (this.requireSet.size === 0) {
      this.requireSet.add('x1').add('x2').add('x3').add('x4').add('x5').add('x6')

      setTimeout(() => {
        // console.log(this.itemType, 'initial item ____ ', this.isInternalItemIdChange, changes['itemId'])
        this.onSelectItem('itemId', this.itemId, this.itemRefine, false)
      }, 0);
    } else if (changes['itemId'] && this.requireSet.size === 6) {
      // handle property was set from main component (when load data)
      if (!this.isInternalItemIdChange) {
        setTimeout(() => {
          // console.log(this.itemType, 'changes itemId isInternalItemIdChange ____ ', this.isInternalItemIdChange, changes['itemId'])
          this.onSelectItem('itemId', this.itemId, this.itemRefine, false)
        }, 0);
      }

      this.isInternalItemIdChange = false;
    }
  }

  get isHeadCardable() {
    return this.itemType === ItemTypeEnum.headMiddle || this.itemType === ItemTypeEnum.headUpper;
  }

  get isAcc() {
    return this.itemType === ItemTypeEnum.accLeft || this.itemType === ItemTypeEnum.accRight;
  }

  get isWeapon() {
    return this.itemType === ItemTypeEnum.weapon || this.itemType === ItemTypeEnum.leftWeapon;
  }

  get isAccR() {
    return this.itemType === ItemTypeEnum.accRight;
  }

  get isEndWithSpace2() {
    return this.isAccR && this.isEndWithSpace && (!this.itemId || !this.enchant3List.length);
  }

  get isRefinable() {
    return this.getItem(this.itemId).isRefinable ?? false
  }

  private getItem(mainItemId?: number) {
    return this.items?.[mainItemId || this.itemId] ?? ({} as ItemModel);
  }

  private setEnchantList() {
    const { aegisName, name, canGrade } = this.getItem();
    const enchants = getEnchants(aegisName) ?? getEnchants(name);

    const [e1, e2, e3, e4] = Array.isArray(enchants) ? enchants : [];
    // console.log({ mainItemId, e2, e3, e4 });
    const clearModel = () => {
      for (const idx of [1, 2, 3, 4]) {
        const enchantList = this[`enchant${idx}List`] as DropdownModel[];
        const property = `enchant${idx}Id`;
        const currentEnchantValue = this[property]
        if (this.itemId && currentEnchantValue != null && !enchantList.find((a) => a.value === currentEnchantValue)) {
          // console.log({ property })
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

  onSelectItem(itemType: string, itemId = 0, refine = 0, isEmitItemChange = true) {
    // console.log('_onSelectItem', { itemType, itemId, refine })
    if (itemType === 'itemId') {
      const item = this.getItem(itemId);
      this.totalCardSlots = item?.slots || 0;
      this.setEnchantList();
      this.itemIdChange.emit(this.itemId);
      this.itemRefineChange.emit(this.itemRefine);

      if (!this.gradeList.length) {
        this.itemGrade = null;
        this.onSelectGrade(this.itemGrade);
      }

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

      if (this.isWeapon) {
        this.totalExtraOption = 3;
      } else if (OptionableItemTypeSet.has(this.itemType as any)) {
        const itemAegisName = item?.aegisName;
        this.totalExtraOption = ExtraOptionTable[itemAegisName] || 0;
      }

      if (this.isAcc) {
        if (this.isRefinable) {
          this.refineList = createNumberDropdownList({ from: 0, to: 18 })
        } else {
          this.refineList = []
          if (this.itemRefine > 0) {
            this.itemRefine = 0;
            this.itemRefineChange.emit(this.itemRefine);
          }
        }
      }
    } else {
      const e = this[`${itemType}Change`];
      const val = this[`${itemType}`];
      if (e instanceof EventEmitter) {
        e.emit(val);
      }
    }

    // console.log({ itemType, t: this.itemTypeMap[itemType], itemId })

    if (isEmitItemChange) {
      this.selectItemChange.emit({ itemType: this.itemTypeMap[itemType], itemId, refine });
    }
  }

  onClearItem(itemType: string) {
    this.clearItemEvent.emit(itemType);
  }

  onSelectGrade(grade: string) {
    this.itemGradeChange.emit(grade);
    this.gradeChange.emit({ itemType: this.itemType, itemId: this.itemId, grade });
  }

  onOptionChange(optionType: string, optionValue: any) {
    const e = this[`${optionType}Change`];
    if (e instanceof EventEmitter) {
      e.emit(optionValue?.value);
    }

    this.optionChange.emit(optionValue);
  }
}
