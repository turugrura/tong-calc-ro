import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { createBonusNameList } from '../utils';
import { DropdownModel } from '../models/dropdown.model';
import { ItemModel } from '../models/item.model';
import { Observable, Subscription } from 'rxjs';

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

  selectedOffensiveSkills: string[] = [];

  ngOnInit(): void {
    this.subscription = this.onClassChanged.subscribe(() => {
      this.clearItemSearch();
    });
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
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
    setTimeout(() => {
      this.itemSearchFirst = 0;
    }, 10);
  }

  onSelectFilteredItem(_item: any) {
    // console.log({ item, activeFilteredItemID: this.activeFilteredItemID });
    // this.activeFilteredItemID = this.equipItemIdItemTypeMap.get(selectedType);

    this.activeFilteredItemDesc = this.items[this.activeFilteredItem?.id]?.description
      .replaceAll('\n', '<br>')
      .replace(/\^(.{6})/g, '<font color="#$1">');
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
