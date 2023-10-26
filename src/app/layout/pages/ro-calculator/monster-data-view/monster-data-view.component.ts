import { Component, EventEmitter, OnDestroy, OnInit } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { MonsterGroupNames } from '../constants/monster-spawn-mapper';
import { Subscription, debounceTime } from 'rxjs';
import { FilterService } from 'primeng/api';

@Component({
  selector: 'app-monster-data-view',
  templateUrl: './monster-data-view.component.html',
  styleUrls: ['../ro-calculator.component.css'],
})
export class MonsterDataViewComponent implements OnInit, OnDestroy {
  allMonsters: any[];
  products: any[];
  seletedGroupNames = [] as string[];
  groupNames = ['Boss', ...MonsterGroupNames];

  textSearch = '';
  textSearchChangeEvent = new EventEmitter();
  sub: Subscription;

  constructor(
    private ref: DynamicDialogRef,
    private dynamicDialogConfig: DynamicDialogConfig,
    private filterService: FilterService,
  ) {}

  ngOnInit() {
    this.allMonsters = this.getMonsters();
    this.products = this.allMonsters;

    this.sub = this.textSearchChangeEvent.pipe(debounceTime(400)).subscribe(() => {
      if (!this.textSearch) {
        this.products = this.allMonsters;
      } else {
        this.products = this.allMonsters.filter((monster) => {
          return this.filterService.filters['contains'](monster.name, this.textSearch);
        });
      }
    });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  private getMonsters() {
    return this.dynamicDialogConfig.data.monsters;
  }

  private isMatch(name: string) {
    if (!this.textSearch) return true;

    return this.filterService.filters['contains'](name, this.textSearch);
  }

  private isMatchGroup(groups: string[]) {
    if (!this.seletedGroupNames?.length) return true;

    return groups.findIndex((g) => this.seletedGroupNames.includes(g)) >= 0;
  }

  getSeverity(a: any) {
    switch (a) {
      case 'Boss':
        return 'danger';
    }

    return 'info';
  }

  onSelectMonster(a: any) {
    this.ref.close(a?.value);
  }

  onSelectGroupChange(isClear = false) {
    if (isClear) return this.onTextSearchChange();

    if (this.seletedGroupNames?.length > 0) {
      this.products = this.allMonsters.filter(({ groups, name }) => {
        return this.isMatchGroup(groups) && this.isMatch(name);
      });
    } else {
      this.products = this.allMonsters;
    }
  }

  onTextSearchChange() {
    this.textSearchChangeEvent.emit();
  }
}
