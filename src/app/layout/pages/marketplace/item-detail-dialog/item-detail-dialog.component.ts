import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-item-detail-dialog',
  templateUrl: './item-detail-dialog.component.html',
  styleUrls: ['./item-detail-dialog.component.css'],
})
export class ItemDetailDialogComponent implements OnInit {
  @Input({ required: true }) showDialog = false;

  productItem = {} as any;

  constructor() {}

  ngOnInit() {
    console.log('HI');
  }

  hideDialog() {
    this.showDialog = false;
  }

  saveProduct() {
    console.log('saveProduct');
  }
}
