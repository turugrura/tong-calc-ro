import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { PaginatorState } from 'primeng/paginator';
import { Subject, Subscription, catchError, debounceTime, of, switchMap, tap, throwError } from 'rxjs';
import { EcommerceService, ProductItemModel, StoreModel } from 'src/app/api-services';
import { ItemModel } from '../../ro-calculator/models/item.model';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-store-management',
  templateUrl: './store-management.component.html',
  styleUrls: ['./store-management.component.css'],
  providers: [MessageService],
})
export class StoreManagementComponent implements OnInit, OnDestroy {
  @Input({ required: true }) item = {} as Record<number, ItemModel>;

  private subs: Subscription[] = [];
  private searchSource = new Subject<boolean>();
  private searchEvent$ = this.searchSource.asObservable();

  myStore = {} as StoreModel;
  myProductItems: ProductItemModel[] = [];
  isLoading = false;

  totalRecord = 0;
  firstRecord = 0;
  pageOptions = [20];
  pageLimit = this.pageOptions[0];

  showStoreDialog = false;
  showCreateNewItemDialog = false;
  showConfirmDeleteDialog = false;
  selectedItems = [];

  constructor(private readonly ecommerceService: EcommerceService, private readonly messageService: MessageService) {}

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

          return of(null);
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
          return of(null);
        }),
      )
      .subscribe(() => {
        this.isLoading = false;
      });
    this.subs.push(s1);
  }

  private loadMyStore() {
    return this.ecommerceService.getMyStore().pipe(
      tap(() => {
        this.searchSource.next(true);
      }),
      catchError(() => {
        return of(null);
      }),
    );
  }

  private loadMyItems() {
    return this.ecommerceService.getMyProducts({ skip: this.firstRecord, take: this.pageLimit }).pipe(
      tap((p) => {
        this.myProductItems = p.items;
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

  deleteSelectedItems() {
    this.showConfirmDeleteDialog = true;
  }

  confirmDeleteSelected() {
    this.showConfirmDeleteDialog = false;
    // this.products = this.products.filter(val => !this.selectedProducts.includes(val));
    this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Products Deleted', life: 3000 });
    // this.selectedProducts = [];
  }

  onCreateItemBtnClick() {
    this.showCreateNewItemDialog = true;
  }

  onCreateStoreBtnClick() {
    this.showStoreDialog = true;
  }

  onSaveStoreChange(storeSaved: StoreModel) {
    console.log({ storeSaved });
  }
}
