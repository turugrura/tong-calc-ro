import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { catchError, of, tap } from 'rxjs';
import { EcommerceService, StoreModel } from 'src/app/api-services';

@Component({
  selector: 'app-store-detail-dialog',
  templateUrl: './store-detail-dialog.component.html',
  styleUrls: ['./store-detail-dialog.component.css'],
})
export class StoreDetailDialogComponent implements OnInit {
  @Input({ required: true }) showDialog = false;
  @Output() showDialogChange = new EventEmitter<boolean>();

  @Input({ required: true }) store = {} as StoreModel;
  @Output() storeModelChange = new EventEmitter<StoreModel>();

  isLoading = false;

  constructor(private readonly ecommerceService: EcommerceService) {}

  ngOnInit() {
    console.log('HI StoreDetailDialogComponent');
  }

  onCancelBtnClick() {
    this.showDialogChange.emit(false);
  }

  onSaveBtnClick() {
    console.log('saveStore');
    this.isLoading = true;

    const req = this.store?.id
      ? this.ecommerceService.updateMyStore(this.store)
      : this.ecommerceService.createMyStore(this.store);
    req
      .pipe(
        tap((store) => (this.store = store)),
        catchError(() => of(null)),
      )
      .subscribe((store) => {
        this.isLoading = false;
        this.storeModelChange.emit(store);
        this.showDialogChange.emit(false);
      });
  }
}
