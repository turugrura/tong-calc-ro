import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable()
export class RoService {
  constructor(private http: HttpClient) {}

  getItems<T>(): Observable<T> {
    return this.http.get<any>('assets/demo/data/item.json');
  }

  getMonsters<T>(): Observable<T> {
    return this.http.get<any>('assets/demo/data/monster.json');
  }
}
