import { Component, OnDestroy, OnInit } from '@angular/core';
import { AutoCompleteCompleteEvent } from 'primeng/autocomplete';
import { PaginatorState } from 'primeng/paginator';
import { Subject, Subscription, catchError, debounceTime, of, switchMap, tap, throwError } from 'rxjs';
import { EcommerceService, ProductItemModel } from 'src/app/api-services';
import { RoService } from 'src/app/demo/service/ro.service';
import { ItemModel } from '../ro-calculator/models/item.model';
import { ItemTypeId } from '../ro-calculator/constants/item.const';
import { DropdownModel } from '../ro-calculator/models/dropdown.model';
import { prettyItemDesc } from '../ro-calculator/utils';

const filterableItemTypes: DropdownModel[] = [
  { label: 'Weapon', value: ItemTypeId.WEAPON },
  { label: 'Armor', value: ItemTypeId.ARMOR },
  { label: 'Card', value: ItemTypeId.CARD },
  { label: 'Consumable', value: ItemTypeId.CONSUMABLE },
  { label: 'ETC', value: ItemTypeId.ETC },
];

interface ProductItemModelX extends ProductItemModel {
  typeName: string;
  enchantInfos: { id: number; name: string }[];
}

@Component({
  selector: 'app-marketplace',
  templateUrl: './marketplace.component.html',
  styleUrls: ['./marketplace.component.css'],
})
export class MarketplaceComponent implements OnInit, OnDestroy {
  private searchSource$ = new Subject<boolean>();
  private searchEvent = this.searchSource$.asObservable();

  private textSearchSource$ = new Subject<AutoCompleteCompleteEvent>();
  private textSearchEvent = this.textSearchSource$.asObservable();

  private selecteItemSource$ = new Subject<number>();
  private selecteItemEvent = this.selecteItemSource$.asObservable();

  private itemNames = [] as { raw: string; lower: string }[];
  item: Record<number, ItemModel>;
  suggestionTexts = [] as string[];

  private subs: Subscription[] = [];

  products: ProductItemModelX[] = [];
  productMap = new Map<number, ProductItemModel>();
  itemTypeIds = filterableItemTypes;
  itemTypeNameMap = filterableItemTypes.reduce((mapped, item) => {
    mapped[item.value] = item.label;

    return mapped;
  }, {});

  isLoading = false;

  totalRecord = 0;
  firstRecord = 0;
  pageOptions = [20];
  pageLimit = this.pageOptions[0];

  selectedItemRow = undefined;
  selectedItemDescs: { id: number; name: string; desc: string }[];

  searchText = '';
  selectedStoreId = '';
  selectedItemTypeId = undefined;

  constructor(private readonly ecommerceService: EcommerceService, private readonly roService: RoService) {}

  ngOnInit() {
    this.loadItemNames();
    this.subscribeSearch();
  }

  ngOnDestroy(): void {
    for (const s of this.subs) {
      s?.unsubscribe();
    }
  }

  private loadItemNames() {
    this.roService.getItems<Record<number, ItemModel>>().subscribe((items) => {
      const names: typeof this.itemNames = [];
      for (const item of Object.values(items)) {
        names.push({
          raw: item.name,
          lower: item.name.toLowerCase(),
        });
      }

      this.item = items;
      this.itemNames = names.sort((a, b) => (a.lower > b.lower ? 1 : -1));
    });
  }

  private subscribeSearch() {
    const s1 = this.searchEvent
      .pipe(
        tap(() => (this.isLoading = true)),
        debounceTime(500),
        switchMap(() => this.searchProducts()),
        catchError((err) => {
          console.error(err);

          return of({});
        }),
      )
      .subscribe(() => {
        this.isLoading = false;
      });
    this.subs.push(s1);

    const s2 = this.textSearchEvent.pipe(debounceTime(300)).subscribe((e) => {
      const suggestionTexts: typeof this.suggestionTexts = [];
      const searchText = e.query?.toLowerCase() || '';
      for (const { raw, lower } of this.itemNames) {
        if (lower.includes(searchText)) {
          suggestionTexts.push(raw);
        }

        if (suggestionTexts.length >= 10) break;
      }
      this.suggestionTexts = suggestionTexts;
    });
    this.subs.push(s2);

    const s3 = this.selecteItemEvent.pipe(debounceTime(300)).subscribe((itemId) => {
      const productItem = this.productMap.get(itemId);
      if (!productItem) {
        this.selectedItemDescs = [];
        return;
      }

      const uniqueItemId = new Set([...(productItem.cardIds || []), ...(productItem.enchantIds || [])]);
      uniqueItemId.delete(0);

      const itemIds = [itemId, ...uniqueItemId];
      this.selectedItemDescs = itemIds.map((id) => {
        const item = this.item[id];

        return {
          id,
          desc: prettyItemDesc(item?.description),
          name: item?.name,
        };
      });
    });
    this.subs.push(s3);
  }

  private searchProducts() {
    return this.ecommerceService
      .searchProducts({
        name: this.searchText || undefined,
        storeId: this.selectedStoreId || undefined,
        type: this.selectedItemTypeId || undefined,
        skip: this.firstRecord,
        take: this.pageLimit,
      })
      .pipe(
        switchMap((item) => {
          this.productMap.clear();
          this.products = item.items.map((a) => {
            this.productMap.set(a.itemId, a);
            const xIds = [...(a.cardIds || []), ...(a.enchantIds || [])].filter(Boolean);

            return {
              ...a,
              typeName: this.itemTypeNameMap[a.type],
              enchantInfos: xIds.map((id) => ({ id, name: this.item[id]?.name || '' })),
            };
          });
          this.totalRecord = item.totalItem;

          return of(item);
        }),
        catchError((err) => {
          this.products = [];
          this.totalRecord = 0;

          return throwError(() => err);
        }),
      );
  }

  pageChange(event: PaginatorState) {
    this.firstRecord = event.first;
    this.pageLimit = event.rows;
    this.searchSource$.next(true);
  }

  search(event: AutoCompleteCompleteEvent) {
    this.textSearchSource$.next(event);
  }

  onSearchBtnClick() {
    this.firstRecord = 0;
    this.pageLimit = 20;
    this.searchSource$.next(true);
  }

  onRowSelect(e) {
    this.selecteItemSource$.next(e?.data?.itemId);
  }
}
