import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { createBonusNameList, prettyItemDesc } from '../utils';
import { DropdownModel } from '../models/dropdown.model';
import { ItemModel } from '../models/item.model';
import { Observable, Subject, Subscription, debounceTime, tap } from 'rxjs';

const positions: DropdownModel[] = [
  { value: 'weaponList', label: 'Weapon' },
  { value: 'weaponCardList', label: 'Weapon Card' },

  { value: 'shieldList', label: 'Shield' },
  { value: 'shieldCardList', label: 'Shield Card' },

  { value: 'headUpperList', label: 'Head Upper' },
  { value: 'headMiddleList', label: 'Head Middle' },
  { value: 'headLowerList', label: 'Head Lower' },
  { value: 'headCardList', label: 'Head Card' },

  { value: 'enchants', label: 'Enchant Stone' },

  { value: 'armorList', label: 'Armor' },
  { value: 'armorCardList', label: 'Armor Card' },
  { value: 'garmentList', label: 'Garment' },
  { value: 'garmentCardList', label: 'Garment Card' },
  { value: 'bootList', label: 'Boot' },
  { value: 'bootCardList', label: 'Boot Card' },
  { value: 'accList', label: 'Acc' },
  { value: 'accCardList', label: 'Acc Card' },

  { value: 'petList', label: 'Pet' },

  { value: 'costumeList', label: 'Costume' },

  { value: 'shadowWeaponList', label: 'Shadow Weapon' },
  { value: 'shadowArmorList', label: 'Shadow Armor' },
  { value: 'shadowShieldList', label: 'Shadow Shield' },
  { value: 'shadowBootList', label: 'Shadow Boot' },
  { value: 'shadowEarringList', label: 'Shadow Earring' },
  { value: 'shadowPendantList', label: 'Shadow Pendant' },
];

@Component({
  selector: 'app-item-search',
  templateUrl: './item-search.component.html',
  styleUrls: ['../ro-calculator.component.css', './item-search.component.css'],
})
export class ItemSearchComponent implements OnInit, OnDestroy {
  @Input({ required: true }) items!: Record<number, ItemModel>;
  @Input({ required: true }) selectedCharacter: any;
  @Input({ required: true }) equipableItems: (DropdownModel & { id: number; position: string })[];
  @Input({ required: true }) offensiveSkills: DropdownModel[] = [];
  @Input({ required: true }) onClassChanged: Observable<boolean>;

  private subscription: Subscription;
  private subscription2: Subscription;

  private selectItemSource = new Subject<number>();
  private onSelectItemChange$ = this.selectItemSource.asObservable();

  isShowSearchDialog = false;
  itemPositionOptions = positions;
  selectedItemPositions: string[] = [];
  itemSearchFirst = 0;
  totalFilteredItems = 0;

  bonusNameList = createBonusNameList() as any;
  selectedBonus: string[] = [];

  filteredItems: DropdownModel[] = [];
  isSerchMatchAllBonus = true;
  selectedFilteredItem: string;
  activeFilteredItemDesc: string;
  activeFilteredItem: (typeof this.equipableItems)[0];
  seletedItemId = 0;

  selectedOffensiveSkills: string[] = [];

  ngOnInit(): void {
    this.subscription = this.onClassChanged.subscribe(() => {
      this.clearItemSearch();
    });
    this.subscription2 = this.onSelectItemChange$
      .pipe(
        tap(() => (this.seletedItemId = null)),
        debounceTime(50),
      )
      .subscribe((itemId) => {
        this.seletedItemId = itemId;
      });
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
    this.subscription2?.unsubscribe();
  }

  onItemSearchFilterChange() {
    const selectedBonus = [...this.selectedBonus.filter(Boolean)];
    const selectedPositions = new Set([...(this.selectedItemPositions || []).filter(Boolean)]);

    const displayItems = [];
    for (const equipableItem of this.equipableItems) {
      const item = this.items[equipableItem.value] as ItemModel;
      if (!item?.script) {
        console.log('No Script', { item, equipableItem });
        continue;
      }
      if (selectedPositions.size > 0 && !selectedPositions.has(equipableItem.position)) continue;
      if (this.selectedOffensiveSkills?.length > 0) {
        const found = this.selectedOffensiveSkills.some(
          (skillName) =>
            item.script[skillName] ||
            item.script[`chance__${skillName}`] ||
            item.script[`cd__${skillName}`] ||
            item.script[`vct__${skillName}`] ||
            item.script[`fct__${skillName}`] ||
            item.script[`fix_vct__${skillName}`],
        );
        if (!found) continue;
      }

      const foundBonus = this.isSerchMatchAllBonus
        ? selectedBonus.every((bonus) => item.script[bonus])
        : selectedBonus.length === 0 || selectedBonus.some((bonus) => item.script[bonus]);
      if (foundBonus) {
        displayItems.push(equipableItem);
      }
    }
    this.totalFilteredItems = displayItems.length;
    this.filteredItems = displayItems;
    this.activeFilteredItem = undefined;
    this.activeFilteredItemDesc = undefined;
    this.selectItemSource.next(null);
    setTimeout(() => {
      this.itemSearchFirst = 0;
    }, 10);
  }

  onSelectFilteredItem(item: any) {
    // console.log({ item, activeFilteredItemID: this.activeFilteredItemID });
    // console.log({ item });
    this.selectItemSource.next((item as (typeof this.equipableItems)[0]).value as number);

    this.activeFilteredItemDesc = prettyItemDesc(this.items[this.activeFilteredItem?.id]?.description);
  }

  private clearItemSearch() {
    this.filteredItems = [];
    this.selectedOffensiveSkills = [];
    this.totalFilteredItems = 0;
    this.itemSearchFirst = 0;
    this.selectedFilteredItem = undefined;
    this.activeFilteredItem = undefined;
    this.activeFilteredItemDesc = undefined;
  }

  showSearchDialog() {
    this.isShowSearchDialog = true;
  }
}
