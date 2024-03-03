import { Component, OnDestroy, OnInit } from '@angular/core';
import { PresetService, PublishPresetModel, PublishPresetsReponse } from 'src/app/api-services';
import { availableTags } from '../ro-calculator/constants/available-tags';
import { ClassID, ClassIcon } from '../ro-calculator/jobs/_class-name';
import { DropdownModel } from '../ro-calculator/models/dropdown.model';
import { RoService } from 'src/app/demo/service/ro.service';
import {
  Observable,
  Subject,
  Subscription,
  catchError,
  debounceTime,
  forkJoin,
  of,
  switchMap,
  tap,
  throwError,
} from 'rxjs';
import { ItemModel } from '../ro-calculator/models/item.model';
import { MonsterModel } from '../ro-calculator/models/monster.model';
import { PaginatorState } from 'primeng/paginator';

const Characters: (DropdownModel & { icon: number })[] = [
  { label: ClassID[11], value: 11, icon: ClassIcon[11] },
  { label: ClassID[12], value: 12, icon: ClassIcon[12] },
  { label: ClassID[7], value: 7, icon: ClassIcon[7] },
  { label: ClassID[13], value: 13, icon: ClassIcon[13] },
  { label: ClassID[2], value: 2, icon: ClassIcon[2] },
  { label: ClassID[21], value: 21, icon: ClassIcon[21] },
  { label: ClassID[22], value: 22, icon: ClassIcon[22] },
  { label: ClassID[5], value: 5, icon: ClassIcon[5] },
  { label: ClassID[4], value: 4, icon: ClassIcon[4] },
  { label: ClassID[6], value: 6, icon: ClassIcon[6] },
  { label: ClassID[8], value: 8, icon: ClassIcon[8] },
  { label: ClassID[10], value: 10, icon: ClassIcon[10] },
  { label: ClassID[9], value: 9, icon: ClassIcon[9] },
  { label: ClassID[30], value: 30, icon: ClassIcon[30] },
  { label: ClassID[3], value: 3, icon: ClassIcon[3] },
  { label: ClassID[33], value: 33, icon: ClassIcon[33] },
  { label: ClassID[17], value: 17, icon: ClassIcon[17] },
  { label: ClassID[18], value: 18, icon: ClassIcon[18] },
  { label: ClassID[1], value: 1, icon: ClassIcon[1] },
  { label: ClassID[31], value: 31, icon: ClassIcon[31] },
];

@Component({
  selector: 'app-shared-preset',
  templateUrl: './shared-preset.component.html',
  styleUrls: ['./shared-preset.component.css'],
})
export class SharedPresetComponent implements OnInit, OnDestroy {
  availableTags = availableTags.map((a) => {
    return { ...a };
  });
  tagLabelMap = availableTags.reduce((pre, cur) => {
    pre[cur.value] = cur;

    return pre;
  }, {});

  isLoading = false;
  items: PublishPresetModel[] = [];
  totalRecord = 0;
  firstRecord = 0;
  pageOptions = [5, 10, 20];
  pageLimit = this.pageOptions[0];

  allClasses = Characters;
  itemMap: Record<number, ItemModel>;
  monsterDataMap: Record<number, MonsterModel>;

  selectedTag = 'no_tag'; //this.availableTags[0].value as string;
  selectedClassId = this.allClasses[0].value as number;

  searchSource = new Subject<number>();
  searchEvent$ = this.searchSource.asObservable();

  likeSource = new Subject<{ tagId: string; isLike: boolean }>();
  likeEvent$ = this.likeSource.asObservable();

  subscriptions = [] as Subscription[];
  viewDetail = {} as any;

  constructor(private readonly presetService: PresetService, private readonly roService: RoService) {}

  ngOnInit() {
    this.initData()
      .pipe(
        tap(() => {
          return this.searchSource.next(1);
        }),
      )
      .subscribe();

    this.subscribeSearch();
    this.subscribeLike();
  }

  ngOnDestroy(): void {
    for (const s of this.subscriptions) {
      s?.unsubscribe();
    }
  }

  private initData() {
    return forkJoin([
      this.roService.getItems<Record<number, ItemModel>>(),
      this.roService.getMonsters<Record<number, MonsterModel>>(),
    ]).pipe(
      tap(([items, monsters]) => {
        this.itemMap = items;
        this.monsterDataMap = monsters;
        // this.selectedMonsterName = this.monsterDataMap[this.selectedMonster]?.name;

        // this.setMonsterDropdownList();
      }),
    );
  }

  private subscribeSearch() {
    const s = this.searchEvent$
      .pipe(
        tap(() => (this.isLoading = true)),
        debounceTime(500 * 1),
        switchMap(() => {
          const empty = of({ items: [], totalItem: 0 }) as Observable<PublishPresetsReponse>;
          if (!this.selectedClassId) return empty;

          return this.presetService
            .getPublishPresets({
              classId: this.selectedClassId,
              skip: this.firstRecord,
              take: this.pageLimit,
              tagName: this.selectedTag,
            })
            .pipe(
              catchError(() => {
                return empty;
              }),
            );
        }),
      )
      .subscribe((searchRes) => {
        this.items = searchRes.items;
        this.totalRecord = searchRes.totalItem;
        this.isLoading = false;
      });

    this.subscriptions.push(s);
  }

  search() {
    this.searchSource.next(1);
  }

  private subscribeLike() {
    const s = this.likeEvent$
      .pipe(
        tap(() => (this.isLoading = true)),
        debounceTime(300),
        switchMap(({ tagId: id, isLike }) => {
          const ob = isLike ? this.presetService.likePresetTags(id) : this.presetService.unlikePresetTag(id);

          return ob;
        }),
        catchError((err) => {
          this.isLoading = false;

          return throwError(() => err);
        }),
      )
      .subscribe((likeRes) => {
        const item = this.items.find((a) => a.tagId === likeRes.id);
        if (item) {
          item.liked = likeRes.liked;
          item.tags[this.selectedTag] = likeRes.totalLike;
        }
        this.isLoading = false;
      });

    this.subscriptions.push(s);
  }

  likePreset(tagId: string, isLike: boolean) {
    this.likeSource.next({ tagId, isLike });
  }

  pageChange(event: PaginatorState) {
    this.firstRecord = event.first;
    this.pageLimit = event.rows;
    this.search();
  }
}
