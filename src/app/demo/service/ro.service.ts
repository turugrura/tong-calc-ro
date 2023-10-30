import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ClassName } from 'src/app/layout/pages/ro-calculator/jobs/_class-name';

@Injectable()
export class RoService {
  constructor(private http: HttpClient) {
    // const a = [] as any[];

    // this.getHpSpTable<{ Body: HpSpTable }>().subscribe(({ Body: data }) => {
    //   console.log({ data });
    //   for (const rec of data) {
    //     const curJob = rec.Jobs;
    //     const found = a.find(({ jobs }) => {
    //       if (jobs['Novice'] && curJob['Super_Novice']) {
    //         console.log('compare ', { jobs: { ...jobs }, curJob: { ...curJob } });
    //       }
    //       return Object.keys(curJob).some((job) => jobs[job] === true);
    //     });

    //     if (found) {
    //       found.jobs = { ...found.jobs, ...rec.Jobs };
    //       found.baseHp = {
    //         ...(found.baseHp || {}),
    //         ...rec.BaseHp?.reduce((s, { Hp, Level }) => {
    //           s[Level] = Hp;
    //           return s;
    //         }, {}),
    //       };

    //       found.baseSp = {
    //         ...(found.baseSp || {}),
    //         ...rec.BaseSp?.reduce((s, { Sp, Level }) => {
    //           s[Level] = Sp;
    //           return s;
    //         }, {}),
    //       };
    //     } else {
    //       a.push({
    //         jobs: rec.Jobs,
    //         baseHp:
    //           rec.BaseHp?.reduce((s, { Hp, Level }) => {
    //             s[Level] = Hp;
    //             return s;
    //           }, {}) || undefined,
    //         baseSp:
    //           rec.BaseSp?.reduce((s, { Sp, Level }) => {
    //             s[Level] = Sp;
    //             return s;
    //           }, {}) || undefined,
    //       });
    //     }
    //   }

    //   console.log(a);
    // });

    this.getHpSpTable<any[]>().subscribe((data) => {
      const ls = {};
      for (const cName of Object.values(ClassName)) {
        const i = data.findIndex((a) => {
          return a.jobs[cName] === true;
        });
        ls[cName] = i;
      }
      console.log(ls);
    });
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

  // getHpSpTable<T>(): Observable<T> {
  //   return this.fetchYaml('job_basepoints.yml');
  // }

  // private fetchYaml(fileName: string): any {
  //   return this.http.get(`/assets/demo/data/${fileName}`, { responseType: 'text' }).pipe(map(yaml.load));
  // }
}
