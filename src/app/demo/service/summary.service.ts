import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, shareReplay } from 'rxjs';

@Injectable()
export class SummaryService {
  private cachedTotalSummary$: Observable<any>;
  private cachedClassSkillSummary$: Observable<any>;
  private cachedJobSummary$: Observable<any>;

  constructor(private http: HttpClient) {
    this.cachedTotalSummary$ = this.http.get<any>('assets/demo/data/x.json').pipe(shareReplay(1));
    this.cachedClassSkillSummary$ = this.http
      .get<any>('assets/demo/data/x_summaryClassSkillMap.json')
      .pipe(shareReplay(1));
    this.cachedJobSummary$ = this.http.get<any>('assets/demo/data/x_totalSelectedJobMap.json').pipe(shareReplay(1));
  }

  getTotalSummary<T>(): Observable<T> {
    return this.cachedTotalSummary$;
  }

  getClassSkillSummary<T>(): Observable<T> {
    return this.cachedClassSkillSummary$;
  }

  getJobSummary<T>(): Observable<T> {
    return this.cachedJobSummary$;
  }
}
