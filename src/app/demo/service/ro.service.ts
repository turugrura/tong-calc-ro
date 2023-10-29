import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable()
export class RoService {
  constructor(private http: HttpClient) {
    // this.getHpSpTable<any[]>().subscribe((data) => {
    //   const ls = {};
    //   for (const cName of Object.values(ClassName)) {
    //     const i = data.findIndex((a) => {
    //       return a.jobs[cName] === true;
    //     });
    //     ls[cName] = i;
    //   }
    //   console.log(ls);
    // });
  }

  getItems<T>(): Observable<T> {
    return this.http.get<any>('assets/demo/data/item.json');
  }

  getMonsters<T>(): Observable<T> {
    return this.http.get<any>('assets/demo/data/monster.json');
  }

  getHpSpTable<T>(): Observable<T> {
    return this.http.get<any>('assets/demo/data/hp_sp_table.json');
  }

  // private fetchYaml(fileName: string): any {
  //   return this.http.get(`/assets/demo/data/${fileName}`, { responseType: 'text' }).pipe(map(yaml.load));
  // }
}
