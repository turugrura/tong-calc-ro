import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class RoService {
  constructor(private http: HttpClient) {}

  getItems<T>(): Promise<T> {
    return this.http
      .get<any>('assets/demo/data/item.json')
      .toPromise()
      .then((data) => data);
  }
}
