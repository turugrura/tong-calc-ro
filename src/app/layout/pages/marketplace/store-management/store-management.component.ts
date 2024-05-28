import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { PaginatorState } from 'primeng/paginator';
import { EMPTY, Observable, Subject, Subscription, catchError, debounceTime, switchMap, tap, throwError } from 'rxjs';
import { EcommerceService, ItemAndStoreModel, ProductItemModel, StoreModel } from 'src/app/api-services';
import { ItemModel } from '../../ro-calculator/models/item.model';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DropdownModel } from '../../ro-calculator/models/dropdown.model';

@Component({
  selector: 'app-store-management',
  templateUrl: './store-management.component.html',
  styleUrls: ['./store-management.component.css'],
  providers: [MessageService],
})
export class StoreManagementComponent implements OnInit, OnDestroy {
  @Input({ required: true }) itemMap = {} as Record<number, ItemModel>;
  @Input({ required: true }) filterableItemTypes!: DropdownModel[];

  private subs: Subscription[] = [];
  private searchSource = new Subject<boolean>();
  private searchEvent$ = this.searchSource.asObservable();

  myStore = {} as StoreModel;
  myProductItems: (ItemAndStoreModel & { name: string; enchantInfos: { id: number; name: string }[] })[] = [];
  isLoading = false;

  totalRecord = 0;
  firstRecord = 0;
  pageOptions = [20];
  pageLimit = this.pageOptions[0];

  itemModel = { cardIds: [], opts: [], enchantIds: [] } as Partial<ProductItemModel>;
  showStoreDialog = false;
  showItemManagementDialog = false;
  selectedItems = [] as typeof this.myProductItems;

  constructor(
    private readonly ecommerceService: EcommerceService,
    private readonly messageService: MessageService,
    private readonly confirmationService: ConfirmationService,
  ) {}

  ngOnInit() {
    this.subscribeSearch();
    this.loadMyStore()
      .pipe(
        tap(() => (this.isLoading = true)),
        switchMap((store) => {
          if (store) {
            this.myStore = store;
            return this.loadMyItems();
          }

          return EMPTY;
        }),
        catchError(() => {
          this.isLoading = false;
          return EMPTY;
        }),
      )
      .subscribe(() => {
        this.isLoading = false;
      });
  }

  ngOnDestroy(): void {
    for (const s of this.subs) {
      s?.unsubscribe();
    }
  }

  private subscribeSearch() {
    const s1 = this.searchEvent$
      .pipe(
        tap(() => (this.isLoading = true)),
        debounceTime(300),
        switchMap(() => this.loadMyItems()),
        catchError(() => {
          this.isLoading = false;

          return EMPTY;
        }),
      )
      .subscribe(() => {
        this.isLoading = false;
      });
    this.subs.push(s1);
  }

  private loadMyStore() {
    return this.ecommerceService.getMyStore().pipe(
      catchError((err) => {
        return throwError(() => err);
      }),
    );
  }

  private loadMyItems() {
    return this.ecommerceService.getMyProducts({ skip: this.firstRecord, take: this.pageLimit }).pipe(
      tap((p) => {
        this.myProductItems = p.items.map((a) => {
          const xIds = [...(a.cardIds || []), ...(a.enchantIds || [])].filter(Boolean);

          return {
            ...a,
            name: this.itemMap[a.itemId]?.name,
            enchantInfos: xIds.map((id) => ({ id, name: this.itemMap[id]?.name || '' })),
          };
        });
      }),
      catchError((err) => {
        this.myProductItems = [];

        return throwError(() => err);
      }),
    );
  }

  onSaveStoreEvent(store: StoreModel) {
    if (this.myStore?.id) {
      this.ecommerceService
        .createMyStore(store)
        .pipe(tap(() => (this.isLoading = true)))
        .subscribe();
    } else {
      this.ecommerceService.updateMyStore;
    }
  }

  pageChange(event: PaginatorState) {
    this.firstRecord = event.first;
    this.pageLimit = event.rows;
    this.searchSource.next(true);
  }

  onDeleteSelectedItemsClick() {
    this.onDeleteProductClick(this.selectedItems);
  }

  onCreateItemBtnClick() {
    this.itemModel = { cardIds: [], opts: [], enchantIds: [] };
    this.showItemManagementDialog = true;
  }

  onCreateStoreBtnClick() {
    this.showStoreDialog = true;
  }

  onSaveStoreChange(storeSaved: StoreModel) {
    console.log({ storeSaved });
  }

  onSaveItemChange(_item: ProductItemModel) {
    if (this.totalRecord < this.pageLimit) {
      this.loadMyItems().subscribe();
    }
  }

  onEditItemClick(item: ProductItemModel) {
    this.itemModel = { ...item };
    this.showItemManagementDialog = true;
  }

  onDeleteProductClick(item: (typeof this.myProductItems)[0] | typeof this.myProductItems) {
    let message: string;
    let ids = [];
    if (Array.isArray(item)) {
      message = `Delete ${item.length} items ?`;
      ids = item.map((a) => a.id);
    } else {
      message = 'Delete "' + item.name + '" ?';
      ids = [item.id];
    }

    const operation = this.ecommerceService.bulkDeleteMyProducts({ ids }).pipe(
      switchMap(() => this.loadMyItems()),
      catchError((err) => {
        this.messageService.add({
          severity: 'error',
          detail: 'Error: ' + err?.message || err?.statusText,
          life: 3000,
        });
        this.isLoading = false;

        return EMPTY;
      }),
    );
    this.confirmOperation(operation, {
      message,
      icon: 'pi pi-exclamation-triangle',
      successMsg: 'Deleted',
    });
  }

  onPublishItemBtnClick(isPublished: boolean) {
    const targetItems = this.selectedItems
      .filter((item) => item.isPublished !== isPublished)
      .map((a) => ({ id: a.id, isPublished }));
    if (!targetItems.length) return;

    const operation = this.ecommerceService.bulkPatchMyProducts(targetItems).pipe(
      tap((updatedItems) => {
        for (const item of updatedItems) {
          const found = this.selectedItems.find((a) => a.id === item.id);
          if (!found) continue;

          found.isPublished = item.isPublished;
        }
      }),
      catchError((err) => {
        this.messageService.add({
          severity: 'error',
          detail: 'Error: ' + err?.message || err?.statusText,
          life: 3000,
        });
        this.isLoading = false;

        return EMPTY;
      }),
    );

    this.confirmOperation(operation, {
      message: `Publish ${this.selectedItems.length} items ?`,
      icon: 'pi pi-exclamation-triangle',
      successMsg: 'Published',
    });
  }

  onRenewExpDateItemBtnClick() {
    if (!this.selectedItems.length) return;

    const operation = this.ecommerceService
      .bulkRenewExpDateMyProducts({ ids: this.selectedItems.map((a) => a.id) })
      .pipe(
        tap((updatedItems) => {
          for (const item of updatedItems) {
            const found = this.selectedItems.find((a) => a.id === item.id);
            if (!found) continue;

            found.expDate = item.expDate;
          }
        }),
        catchError((err) => {
          this.messageService.add({
            severity: 'error',
            detail: 'Error: ' + err?.message || err?.statusText,
            life: 3000,
          });
          this.isLoading = false;

          return EMPTY;
        }),
      );
    this.confirmOperation(operation, {
      message: `Renew an expire date ${this.selectedItems.length} items ?`,
      icon: 'pi pi-exclamation-triangle',
      successMsg: 'Renewed',
    });
  }

  private confirmOperation<T>(obs: Observable<T>, confirmMsg: { message: string; icon: string; successMsg: string }) {
    const { message, icon, successMsg } = confirmMsg;

    this.confirmationService.confirm({
      header: 'Confirm',
      message,
      icon,
      accept: () => {
        this.isLoading = true;

        obs
          .pipe(
            catchError((err) => {
              this.messageService.add({
                severity: 'error',
                detail: 'Error: ' + err?.message || err?.statusText,
                life: 3000,
              });
              this.isLoading = false;

              return EMPTY;
            }),
          )
          .subscribe(() => {
            this.messageService.add({ severity: 'success', detail: successMsg, life: 3000 });
            this.isLoading = false;
          });
      },
    });
  }
}
