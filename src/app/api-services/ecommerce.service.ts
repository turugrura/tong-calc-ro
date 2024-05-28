import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { BaseAPIService } from './base-api.service';
import {
  CreateItemListRequest,
  CreateStoreRequest,
  DeleteItemListRequest,
  PatchProductItemRequest,
  ProductItemModel,
  SearchProductModel,
  SearchProductRequest,
  StoreModel,
  UpdateItemListRequest,
} from './models';

@Injectable()
export class EcommerceService extends BaseAPIService {
  constructor(protected readonly http: HttpClient, protected readonly jwtHelper: JwtHelperService) {
    super();
  }

  getMyStore() {
    return this.get<StoreModel>(this.API.getMyStore);
  }

  createMyStore(body: CreateStoreRequest) {
    return this.post<StoreModel>(this.API.createMyStore, body);
  }

  updateMyStore(body: CreateStoreRequest) {
    return this.post<StoreModel>(this.API.updateMyStore, body);
  }

  searchProducts(body: SearchProductRequest) {
    return this.post<SearchProductModel>(this.API.searchProducts, body, false);
  }

  getMyProducts(body: Pick<SearchProductRequest, 'skip' | 'take'>) {
    return this.post<SearchProductModel>(this.API.getMyProducts, body);
  }

  bulkCreateMyProducts(body: CreateItemListRequest) {
    return this.post<ProductItemModel[]>(this.API.bulkCreateMyProducts, body);
  }

  bulkUpdateMyProducts(body: UpdateItemListRequest) {
    return this.post<ProductItemModel[]>(this.API.bulkUpdateMyProducts, body);
  }

  bulkPatchMyProducts(body: PatchProductItemRequest) {
    return this.post<ProductItemModel[]>(this.API.bulkPatchMyProducts, body);
  }

  bulkRenewExpDateMyProducts(body: { ids: string[] }) {
    return this.post<ProductItemModel[]>(this.API.bulkRenewExpDateMyProducts, body);
  }

  bulkDeleteMyProducts(body: DeleteItemListRequest) {
    return this.post<null>(this.API.bulkDeleteMyProducts, body);
  }
}
