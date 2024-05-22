import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { BaseAPIService } from './base-api.service';
import {
  CreateProductListRequest,
  CreateStoreRequest,
  SearchProductModel,
  SearchProductRequest,
  StoreModel,
} from './models';

@Injectable()
export class EcommerceService extends BaseAPIService {
  constructor(protected readonly http: HttpClient, protected readonly jwtHelper: JwtHelperService) {
    super();
  }

  searchProducts(body: SearchProductRequest) {
    return this.post<SearchProductModel>(this.API.searchProducts, body, false);
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

  getMyProducts(body: Pick<SearchProductRequest, 'skip' | 'take'>) {
    return this.post<SearchProductModel>(this.API.getMyProducts, body);
  }

  bulkCreateMyProducts(body: CreateProductListRequest) {
    return this.post<SearchProductModel>(this.API.getMyProducts, body);
  }
}
