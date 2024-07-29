import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ElementType } from '../constants/element-type.const';
import { MonsterModel } from '../models/monster.model';
import { SelectItemGroup } from 'primeng/api';
import { Subject, Subscription, debounceTime, tap } from 'rxjs';
import { ElementMapper } from '../constants/element-mapper';

interface MonsterSelectItemGroup extends SelectItemGroup {
  items: any[];
}

interface MonsterElementSummary extends Record<ElementType, number> {
  info: string;
  pureElementName: string;
  NeutralStyle: string;
  WaterStyle: string;
  EarthStyle: string;
  FireStyle: string;
  WindStyle: string;
  PoisonStyle: string;
  HolyStyle: string;
  DarkStyle: string;
  GhostStyle: string;
  UndeadStyle: string;
}

@Component({
  selector: 'app-elemental-table',
  templateUrl: './elemental-table.component.html',
  styleUrls: ['./elemental-table.component.css', '../ro-calculator.component.css'],
})
export class ElementalTableComponent implements OnInit, OnDestroy {
  @Input({ required: true }) monsterMap: Record<number, MonsterModel>;
  @Input({ required: true }) groupMonsterList: MonsterSelectItemGroup[] = [];

  private _selectedMonsterIds = [] as number[];
  @Input()
  public set allSelectedMonsterIds(values: number[]) {
    if (!Array.isArray(values)) return;

    this._selectedMonsterIds = [...values];
    this.selectMonsterEvent.next(undefined);
  }

  private subs = [] as Subscription[];
  private selectMonsterEvent = new Subject<number>();
  private selectMonsterHandler$ = this.selectMonsterEvent.asObservable();

  private toggleShowEleTableSource = new Subject<boolean>();
  private toggleShowEleTableEvent$ = this.toggleShowEleTableSource.asObservable();

  elementalTable = [] as MonsterElementSummary[];
  elementalTable1 = [] as MonsterElementSummary[];
  elementalTable2 = [] as MonsterElementSummary[];
  elementalTable3 = [] as MonsterElementSummary[];
  elementalTable4 = [] as MonsterElementSummary[];

  calcMonsters = [] as MonsterElementSummary[];
  selectedMonsterIds = [] as number[];
  isProcessing = false;
  isShowElementalTable = localStorage.getItem('isShowElementalTable') !== 'false';

  constructor() {
    const s1 = this.selectMonsterHandler$
      .pipe(
        tap(() => (this.isProcessing = true)),
        debounceTime(400),
      )
      .subscribe(() => {
        const [monsterId, ...restMonsters] = this._selectedMonsterIds;
        if (monsterId) {
          this.selectedMonsterIds = [...new Set([monsterId, ...(this.selectedMonsterIds || []), ...restMonsters])];
          this._selectedMonsterIds = [];
        }
        this.calculateMonsterElemental();
        this.isProcessing = false;
      });

    const s2 = this.toggleShowEleTableEvent$.pipe(debounceTime(500)).subscribe(() => {
      localStorage.setItem('isShowElementalTable', `${this.isShowElementalTable}`);
    });

    this.subs.push(s1, s2);
  }

  ngOnInit(): void {
    const table1 = [];
    const table2 = [];
    const table3 = [];
    const table4 = [];

    Object.entries(ElementMapper).forEach(([name, property]) => {
      const [pureElementName, elementLv] = name.split(' ');
      const data = {
        info: name,
        pureElementName,
        ...property,
        NeutralStyle: this.getElementStyle(property.Neutral),
        WaterStyle: this.getElementStyle(property.Water),
        EarthStyle: this.getElementStyle(property.Earth),
        FireStyle: this.getElementStyle(property.Fire),
        WindStyle: this.getElementStyle(property.Wind),
        PoisonStyle: this.getElementStyle(property.Poison),
        HolyStyle: this.getElementStyle(property.Holy),
        DarkStyle: this.getElementStyle(property.Dark),
        GhostStyle: this.getElementStyle(property.Ghost),
        UndeadStyle: this.getElementStyle(property.Undead),
      };

      if (elementLv === '1') table1.push(data);
      if (elementLv === '2') table2.push(data);
      if (elementLv === '3') table3.push(data);
      if (elementLv === '4') table4.push(data);
    });

    this.elementalTable1 = table1;
    this.elementalTable2 = table2;
    this.elementalTable3 = table3;
    this.elementalTable4 = table4;
  }

  ngOnDestroy(): void {
    for (const sub of this.subs) {
      sub?.unsubscribe();
    }
  }

  private getElementStyle(multiplier: number) {
    if (multiplier > 100) return 'text-green-400';
    if (multiplier === 0) return 'text-red-500';
    if (multiplier < 100) return 'text-red-300';

    return '';
  }

  private calculateMonsterElemental() {
    this.calcMonsters = (this.selectedMonsterIds ?? []).map((id) => {
      const { name, stats } = this.monsterMap[id] || ({} as MonsterModel);
      const { raceName, scaleName, elementName, elementShortName } = stats || {};
      const elementTable = ElementMapper[elementName];

      return {
        info: `${name} (${raceName} , ${scaleName} , ${elementName})`,
        pureElementName: elementShortName,
        Neutral: elementTable?.Neutral,
        NeutralStyle: this.getElementStyle(elementTable?.Neutral),
        Water: elementTable?.Water,
        WaterStyle: this.getElementStyle(elementTable?.Water),
        Earth: elementTable?.Earth,
        EarthStyle: this.getElementStyle(elementTable?.Earth),
        Fire: elementTable?.Fire,
        FireStyle: this.getElementStyle(elementTable?.Fire),
        Wind: elementTable?.Wind,
        WindStyle: this.getElementStyle(elementTable?.Wind),
        Poison: elementTable?.Poison,
        PoisonStyle: this.getElementStyle(elementTable?.Poison),
        Holy: elementTable?.Holy,
        HolyStyle: this.getElementStyle(elementTable?.Holy),
        Dark: elementTable?.Dark,
        DarkStyle: this.getElementStyle(elementTable?.Dark),
        Ghost: elementTable?.Ghost,
        GhostStyle: this.getElementStyle(elementTable?.Ghost),
        Undead: elementTable?.Undead,
        UndeadStyle: this.getElementStyle(elementTable?.Undead),
      };
    });
  }

  onMonsterListChange() {
    this.selectMonsterEvent.next(undefined);
  }

  onToggleShowEleTableClick() {
    this.toggleShowEleTableSource.next(undefined);
  }
}
