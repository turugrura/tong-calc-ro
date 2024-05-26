import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { BehaviorSubject, Subject, Subscription, catchError, debounceTime, of, tap } from 'rxjs';
import { EcommerceService, ProductItemModel } from 'src/app/api-services';
import { DropdownModel } from '../../ro-calculator/models/dropdown.model';
import { ItemModel } from '../../ro-calculator/models/item.model';
import { prettyItemDesc } from '../../ro-calculator/utils';
import { ItemTypeId } from '../../ro-calculator/constants/item.const';
import { getEnchants } from '../../ro-calculator/constants/enchant-table';
import { createNumberDropdownList } from '../../ro-calculator/utils/create-number-dropdown-list';
import { Table } from 'primeng/table';
import { CardPosition } from '../../ro-calculator/constants/card-position.enum';
import { sortObj } from '../../ro-calculator/utils/sort-obj';
import { ItemListModel } from '../../ro-calculator/models/item-list.model';
import { toDropdownList } from '../../ro-calculator/utils/to-drowdown-list';
import { ItemSubTypeId } from '../../ro-calculator/constants/item-sub-type.enum';
import { HeadGearLocation } from '../../ro-calculator/constants/head-gear-location';
import { createExtraOptionList } from '../../ro-calculator/utils/create-extra-option-list';
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'app-item-detail-dialog',
  templateUrl: './item-detail-dialog.component.html',
  styleUrls: ['./item-detail-dialog.component.css'],
})
export class ItemDetailDialogComponent implements OnInit, OnDestroy {
  @Input({ required: true }) itemMap!: Record<number, ItemModel>;

  @Input({ required: true }) showDialog = false;
  @Output() showDialogChange = new EventEmitter<boolean>();

  private itemDetail$ = new BehaviorSubject<Partial<ProductItemModel>>(undefined);
  @Input({ required: true })
  set itemDetail(val: Partial<ProductItemModel>) {
    this.itemDetail$.next(val);
  }
  get itemDetail() {
    return this.itemDetail$.value;
  }

  @Output() saveItemChange = new EventEmitter<ProductItemModel>();

  @ViewChild('dt2') dt!: Table;

  private selectItemSource = new Subject<number>();
  private onSelectItemChange$ = this.selectItemSource.asObservable();

  private textSearchSource = new Subject<string>();
  private onTextSearchChange$ = this.textSearchSource.asObservable();

  private subs: Subscription[] = [];

  isLoading = false;

  isCreateItem = false;
  itemFilterLoading = false;
  allItems = [] as DropdownModel[];
  mapEnchant!: Map<string, ItemModel>;
  refineList = createNumberDropdownList({ from: 0, to: 18 });
  cardList: DropdownModel[] = [];
  enchant2List: DropdownModel[] = [];
  enchant3List: DropdownModel[] = [];
  enchant4List: DropdownModel[] = [];
  optionList: any[] = createExtraOptionList();
  itemList: ItemListModel = {} as any;
  totalCardSlots = 0;
  isRefinable = false;

  itemSearchFirst = 0;
  totalFilteredItems = 0;

  filteredItems: DropdownModel[] = [];
  isSerchMatchAllBonus = true;
  selectedFilteredItem: string;
  activeFilteredItemDesc: string;
  activeFilteredItem = undefined as any;
  seletedItemId = 0;

  constructor(
    private readonly ecommerceService: EcommerceService,
    private readonly messageService: MessageService,
    private readonly confirmationService: ConfirmationService,
  ) {}

  ngOnInit() {
    const s1 = this.onSelectItemChange$
      .pipe(
        tap(() => (this.seletedItemId = null)),
        debounceTime(100),
      )
      .subscribe((itemId) => {
        const item = this.itemMap[itemId];
        this.seletedItemId = itemId;
        this.itemDetail.itemId = itemId;
        this.itemDetail.name = item?.name;
        this.itemDetail.type = item?.itemTypeId;
        this.itemDetail.subType = item?.itemSubTypeId;

        this.isRefinable = item?.itemTypeId === ItemTypeId.WEAPON || item?.itemTypeId === ItemTypeId.ARMOR;
        if (!this.isRefinable) {
          this.itemDetail.refine = 0;
        }

        this.totalCardSlots = item?.slots || 0;

        this.setEnchantList();
        this.displayCards();
        this.cleanCardEnchant(this.itemDetail);

        this.activeFilteredItemDesc = prettyItemDesc(item?.description);
      });
    this.subs.push(s1);

    const s2 = this.onTextSearchChange$
      .pipe(
        tap(() => (this.itemFilterLoading = true)),
        debounceTime(300),
      )
      .subscribe((text) => {
        this.dt.filterGlobal(text, 'contains');
        this.itemFilterLoading = false;
      });
    this.subs.push(s2);

    const s3 = this.itemDetail$.subscribe((item) => {
      this.isCreateItem = !item.id;
      this.activeFilteredItem = this.filteredItems.find((a) => a.value === item.itemId);
      this.selectItemSource.next(item.itemId);
    });
    this.subs.push(s3);

    this.mapEnchant = new Map(
      Object.values(this.itemMap)
        .filter((item) => item.itemTypeId === ItemTypeId.ENCHANT)
        .map((item) => {
          return [item.aegisName, item];
        }),
    );

    this.setCardList();
    this.setExchangableItems();
    this.setItemTable();
  }

  ngOnDestroy(): void {
    for (const s of this.subs) {
      s.unsubscribe();
    }
  }

  private setExchangableItems() {
    const allItems = [] as typeof this.allItems;
    for (const item of Object.values(this.itemMap)) {
      if (item.itemTypeId === ItemTypeId.ENCHANT) continue;
      if (item.itemTypeId === ItemTypeId.CARD) {
        if (item.itemSubTypeId !== ItemSubTypeId.Enchant) continue;
      }

      allItems.push({
        label: item.name,
        value: item.id,
      });
    }
    this.allItems = allItems;
  }

  private setEnchantList() {
    const { aegisName, name } = this.itemMap[this.seletedItemId] ?? ({} as ItemModel);
    const enchants = getEnchants(aegisName) ?? getEnchants(name);

    const [_, e2, e3, e4] = Array.isArray(enchants) ? enchants : [];
    // console.log({ name, e2, e3, e4 });

    const mapToEnchant = (enchantName) => this.mapEnchant.get(enchantName);
    const mapToOption = (a: ItemModel) => ({ label: a.name, value: a.id });

    this.enchant2List = (e2 ?? []).map(mapToEnchant).map(mapToOption);
    this.enchant3List = (e3 ?? []).map(mapToEnchant).map(mapToOption);
    this.enchant4List = (e4 ?? []).map(mapToEnchant).map(mapToOption);
  }

  private cleanCardEnchant(item: Partial<ProductItemModel>) {
    item.cardIds = item.cardIds.slice(0, this.totalCardSlots).map((id) => id || undefined);

    for (let seq = 1; seq <= 3; seq++) {
      const id = item.enchantIds[seq];
      if (!id) continue;

      const found = this[`enchant${seq + 1}List`]?.findIndex((a) => a.value === id) >= 0;
      if (!found) {
        item.enchantIds[seq] = undefined;
      }
    }
  }

  private setCardList() {
    const weaponCardList: ItemModel[] = [];
    const headCardList = [];
    const armorCardList = [];
    const shieldCardList = [];
    const garmentCardList = [];
    const bootCardList = [];
    const accCardList = [];

    const sortedItems = Object.values(this.itemMap).sort(sortObj('name'));
    for (const item of sortedItems) {
      const { itemTypeId, compositionPos } = item;
      if (itemTypeId !== ItemTypeId.CARD) continue;

      switch (compositionPos) {
        case CardPosition.Weapon:
          weaponCardList.push(item);
          continue;
        case CardPosition.Head:
          headCardList.push(item);
          continue;
        case CardPosition.Shield:
          shieldCardList.push(item);
          continue;
        case CardPosition.Armor:
          armorCardList.push(item);
          continue;
        case CardPosition.Garment:
          garmentCardList.push(item);
          continue;
        case CardPosition.Boot:
          bootCardList.push(item);
          continue;
        case CardPosition.AccL:
          accCardList.push({
            ...item,
            name: '[Left] ' + item.name,
            isHilight: true,
          });
          continue;
        case CardPosition.AccR:
          accCardList.push({
            ...item,
            name: '[Right] ' + item.name,
            isHilight: true,
          });
          continue;
        case CardPosition.Acc:
          accCardList.push(item);
          continue;
      }
    }

    this.itemList.weaponCardList = toDropdownList(weaponCardList, 'name', 'id');
    this.itemList.headCardList = toDropdownList(headCardList, 'name', 'id');
    this.itemList.armorCardList = toDropdownList(armorCardList, 'name', 'id');
    this.itemList.shieldCardList = toDropdownList(shieldCardList, 'name', 'id');
    this.itemList.garmentCardList = toDropdownList(garmentCardList, 'name', 'id');
    this.itemList.bootCardList = toDropdownList(bootCardList, 'name', 'id');
    this.itemList.accCardList = toDropdownList(accCardList, 'name', 'id', undefined, ['cardPrefix', 'isHilight']);
  }

  private displayCards() {
    let cards = [];

    const { itemTypeId, itemSubTypeId, location } = this.itemMap[this.seletedItemId] || {};
    if (itemTypeId === ItemTypeId.WEAPON) {
      cards = this.itemList.weaponCardList;
    }

    switch (itemSubTypeId as ItemSubTypeId) {
      case ItemSubTypeId.Upper:
        if (location !== HeadGearLocation.Lower) {
          cards = this.itemList.headCardList;
        }
        break;
      case ItemSubTypeId.Armor:
        cards = this.itemList.headCardList;
        break;
      case ItemSubTypeId.Garment:
        cards = this.itemList.headCardList;
        break;
      case ItemSubTypeId.Boot:
        cards = this.itemList.headCardList;
        break;
      case ItemSubTypeId.Acc:
      case ItemSubTypeId.Acc_L:
      case ItemSubTypeId.Acc_R:
        cards = this.itemList.headCardList;
        break;
      default:
        break;
    }

    this.cardList = cards;
  }

  private setItemTable() {
    const displayItems = [] as typeof this.filteredItems;
    for (const { value } of this.allItems) {
      const item = this.itemMap[value];
      if (!item) continue;

      displayItems.push({
        label: item.name,
        value: item.id,
      });
    }

    this.totalFilteredItems = displayItems.length;
    this.filteredItems = displayItems;
  }

  private get cleanedProductItem(): ProductItemModel {
    const item = {
      id: this.itemDetail.id,
      storeId: this.itemDetail.storeId,
      itemId: this.itemDetail.itemId,
      bundleId: this.itemDetail.bundleId,
      name: this.itemDetail.name,
      desc: this.itemDetail.desc,
      refine: this.itemDetail.refine,
      enchantIds: this.itemDetail.enchantIds,
      cardIds: this.itemDetail.cardIds,
      opts: this.itemDetail.opts,
      baht: this.itemDetail.baht,
      zeny: this.itemDetail.zeny,
      quantity: this.itemDetail.quantity,
      type: this.itemDetail.type,
      subType: this.itemDetail.subType,
    } as ProductItemModel;

    this.cleanCardEnchant(item);

    return item as ProductItemModel;
  }

  confirm() {
    this.confirmationService.confirm({
      header: 'Confirm',
      message: this.isCreateItem ? 'Create ?' : 'Update ?',
      accept: () => {
        // this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Created', life: 3000 });
        this.onSaveBtnClick(true);
      },
    });
  }

  onCancelBtnClick() {
    this.showDialogChange.emit(false);
  }

  onSaveBtnClick(isConfirmed = false) {
    if (!isConfirmed) {
      return this.confirm();
    }

    this.isLoading = true;
    const creanedItem = this.cleanedProductItem;

    const req = this.isCreateItem
      ? this.ecommerceService.bulkCreateMyProducts([creanedItem as ProductItemModel])
      : this.ecommerceService.bulkUpdateMyProducts([creanedItem as ProductItemModel]);
    req
      .pipe(
        debounceTime(100),
        catchError(() => of(null)),
      )
      .subscribe((items) => {
        this.isLoading = false;
        this.messageService.add({ severity: 'success', detail: this.isCreateItem ? 'Created' : 'Updated', life: 3000 });
        if (Array.isArray(items) && items.length > 0) {
          this.saveItemChange.emit(items[0]);
          this.showDialogChange.emit(false);
        }
      });
  }

  onSelectFilteredItem(_item: any) {
    this.selectItemSource.next(this.activeFilteredItem?.value);
  }

  log(aaa) {
    console.log({ aaa });
  }

  onTextFilterChange(event) {
    this.textSearchSource.next(event?.target?.value);
  }
}
