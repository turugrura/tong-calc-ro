import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as yaml from 'js-yaml';
import { Observable, map, shareReplay, tap } from 'rxjs';
import { createRawTotalBonus } from 'src/app/utils';
import { environment } from 'src/environments/environment';
import { OFFENSIVE_SKILL_NAMES } from '../constants/skill-name';
import { validClassNameSet } from './valid-bonuses';

type baseStat = 'Str' | 'Agi' | 'Int' | 'Dex' | 'Luk' | 'Vit' | 'Pow' | 'Con' | 'Crt' | 'Spl' | 'Sta' | 'Wis';

interface JobStatBody {
  Jobs: Record<string, boolean>;
  BonusStats: ({ Level: number; } & Partial<Record<baseStat, number>>)[];
  HpFactor: number;
  SpIncrease: number;
  MaxWeight: number;
}

interface HpSpTable {
  Jobs: Record<string, boolean>;
  BaseSp: { Level: number; Sp: number; }[];
  BaseHp: { Level: number; Hp: number; }[];
}

@Injectable()
export class RoService {
  private cachedMonster$: Observable<any>;
  private cachedItems$: Observable<any>;
  private cachedHpSpTable$: Observable<any>;
  private _isFirst = true;

  constructor(private http: HttpClient) {
    this.cachedMonster$ = this.http.get<any>('assets/demo/data/monster.json').pipe(shareReplay(1));
    this.cachedItems$ = this.http.get<any>('assets/demo/data/item.json').pipe(
      shareReplay(1),
      tap((items) => {
        if (!this._isFirst || environment.production) return;

        this._isFirst = false;

        const validBonus = createRawTotalBonus();
        const validStatusSet = new Set(Object.keys(validBonus));

        const its = Object.values(items) as any[];
        const invalidBonusSet = new Set();
        const invalidClassNameSet = new Set();
        const validSkillNameSet = new Set(OFFENSIVE_SKILL_NAMES as any);

        for (const item of its) {
          const script = item.script as Record<string, string[]>;
          if (Array.isArray(item.usableClass)) {
            item.usableClass.filter((c) => !validClassNameSet.has(c)).forEach((c) => invalidClassNameSet.add(c));
          }
          if (Array.isArray(item.unusableClass)) {
            item.unusableClass.filter((c) => !validClassNameSet.has(c)).forEach((c) => invalidClassNameSet.add(c));
          }

          if (!script) continue;
          for (const bonusKey of Object.keys(script)) {
            const realKey = bonusKey
              .replace('fix_vct__', '')
              .replace('vct__', '')
              .replace('chance__', '')
              .replace('fctPercent__', '')
              .replace('fct__', '')
              .replace('acd__', '')
              .replace('cd__', '');
            if (validStatusSet.has(realKey)) continue;
            if (invalidBonusSet.has(realKey)) continue;
            if (validSkillNameSet.has(realKey)) continue;

            invalidBonusSet.add(realKey);
          }

          // for (const lineScript of Object.values(script).flat()) {
          //   const [_, jobStr] = lineScript.match(/USED\[(.+?)\]/i) || []
          //   if (jobStr) {
          //     jobStr.split('||').filter(jobName => !validClassNameSet.has(jobName as any)).forEach((c) => invalidClassNameSet.add(c))
          //   }
          // }
        }

        if (invalidBonusSet.size > 0) console.error('invalidBonusSet', [...invalidBonusSet]);
        if (invalidClassNameSet.size > 0) console.error('invalidClassNameSet', invalidClassNameSet);
      }),
    );
    this.cachedHpSpTable$ = this.http.get<any>('assets/demo/data/hp_sp_table.json').pipe(shareReplay(1));

    // this.doX();
    // this.generateHpSp()
  }

  getItems<T>(): Observable<T> {
    return this.cachedItems$;
  }

  getMonsters<T>(): Observable<T> {
    return this.cachedMonster$;
  }

  getHpSpTable<T>(): Observable<T> {
    return this.cachedHpSpTable$;
  }

  private generateHpSp() {
    const a = [] as any[];
    const expandedJobs = [
      // 'Sky_Emperor', 'Soul_Ascetic', 'Shinkiro', 'Shiranui',
      // 'Night_Watch', 'Hyper_Novice', 'Spirit_Handler',
    ];
    const targetJobs = [
      'Dragon_Knight', 'Meister', 'Shadow_Cross', 'Arch_Mage', 'Cardinal', 'Windhawk', 'Imperial_Guard', 'Biolo',
      'Abyss_Chaser', 'Elemental_Master', 'Inquisitor', 'Troubadour', 'Trouvere', ...expandedJobs];

    this.fetchYaml<{ Body: HpSpTable[]; }>('job_basepoints.yml').subscribe(({ Body: data }) => {
      console.log({ data });
      for (const rec of data) {
        const curJob = rec.Jobs;
        // console.log({ curJob })
        const jobNames = Object.keys(curJob);
        if (jobNames.length > 3 || !jobNames.some(n => targetJobs.includes(n))) continue;

        const divider = jobNames.some(n => expandedJobs.includes(n)) ? 1 : 1.25;

        const found = a.find(({ jobs }) => {
          // if (jobs['Novice'] && curJob['Super_Novice']) {
          //   console.log('compare ', { jobs: { ...jobs }, curJob: { ...curJob } });
          // }

          return jobNames.some((job) => jobs[job] === true);
        });

        if (found) {
          found.jobs = { ...found.jobs, ...rec.Jobs };
          found.baseHp = {
            ...(found.baseHp || {}),
            ...rec.BaseHp?.reduce((s, { Hp, Level }) => {
              s[Level] = Math.floor(Hp / divider);
              return s;
            }, {}),
          };
          found.baseSp = {
            ...(found.baseSp || {}),
            ...rec.BaseSp?.reduce((s, { Sp, Level }) => {
              s[Level] = Math.floor(Sp / divider);
              return s;
            }, {}),
          };
        } else {
          a.push({
            jobs: rec.Jobs,
            baseHp:
              rec.BaseHp?.filter(a => a.Level >= 200).reduce((s, { Hp, Level }) => {
                s[Level] = Math.floor(Hp / divider);
                // if (Level === 250) console.log([jobNames[0]], s[Level], 'before', Hp)
                return s;
              }, {}) || undefined,
            baseSp:
              rec.BaseSp?.reduce((s, { Sp, Level }) => {
                s[Level] = Math.floor(Sp / divider);
                // if (Level === 250) console.log([jobNames[0]], s[Level], 'before', Sp)
                return s;
              }, {}) || undefined,
          });
        }
      }
      console.log(a);
    }, err => console.error({ err }));

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

  // 1: [0, 0, 0, 0, 0, 1],
  // 2: [1, 0, 0, 0, 0, 1],
  doX() {
    this.fetchYaml<{ Body: JobStatBody[]; }>('job_stats.yml').subscribe(({ Body }) => {
      console.log({ Body });
      for (const job of Body) {
        const bastStat = {} as any;
        const traitStat = {} as any;
        for (let i = 1; i <= 70; i++) {
          let [str, agi, vit, int, dex, luk] = i === 1 ? [0, 0, 0, 0, 0, 0] : bastStat[i - 1];
          let [pow, sta, wis, spl, con, crt] = i === 1 ? [0, 0, 0, 0, 0, 0] : traitStat[i - 1];

          if (!job.BonusStats) {
            console.error({ ...job });
            break;
          }

          const { Level, Str, Agi, Vit, Int, Dex, Luk, Pow, Con, Crt, Spl, Sta, Wis } = job.BonusStats.find((a) => a.Level === i) || {};
          if (i === Level) {
            if (Str && Str > 0) str++;
            if (Agi && Agi > 0) agi++;
            if (Vit && Vit > 0) vit++;
            if (Int && Int > 0) int++;
            if (Dex && Dex > 0) dex++;
            if (Luk && Luk > 0) luk++;

            if (Pow && Pow > 0) pow++;
            if (Sta && Sta > 0) sta++;
            if (Wis && Wis > 0) wis++;
            if (Spl && Spl > 0) spl++;
            if (Con && Con > 0) con++;
            if (Crt && Crt > 0) crt++;
          }

          bastStat[i] = [str, agi, vit, int, dex, luk];
          traitStat[i] = [pow, sta, wis, spl, con, crt];
        }

        const jobNames = Object.keys(job.Jobs).join(',');
        if (traitStat[70]?.[0] === 0 && traitStat[70]?.[1] === 0 && traitStat[70]?.[2] === 0 && traitStat[70]?.[3] === 0) {
          console.log(jobNames, { bastStat });
        } else {
          console.log(jobNames, { bastStat, traitStat });
        }
      }
    });
  }

  private fetchYaml<T>(fileName: string): Observable<T> {
    return this.http.get(`/assets/demo/data/${fileName}`, { responseType: 'text' }).pipe(map(yaml.load));
  }
}
