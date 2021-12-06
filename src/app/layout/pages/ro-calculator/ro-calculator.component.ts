import {
  Component,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { debounceTime, Subject } from 'rxjs';
import { BaseStateCalculator } from './base-state-calculator';
import { Calculator } from './calculator';
import { ItemTypeEnum } from './item-type.enum';
import { ItemTypeId } from './item.const';
import { monsterData } from './monster-data';
import { RoService } from 'src/app/demo/service/ro.service';

interface ItemModel {
  id: number;
  aegisName: string;
  name: string;
  unidName: string;
  resName: string;
  description: string;
  slots: number;
  itemTypeId: number;
  itemSubTypeId: number;
  itemLevel: any;
  attack: any;
  defense: any;
  weight: number;
  requiredLevel: any;
  location: any;
  compositionPos: number;
  enchants: [null, string[], string[], string[]];
}

enum CardPosition {
  Weapon = 0,
  Head = 769,
  Shield = 32,
  Armor = 16,
  Garment = 4,
  Boot = 64,
  Acc = 136,
  AccL = 128,
  AccR = 8,
}
enum ItemSubTypeId {
  Gatling_Gun = 275,
  Upper = 512,
  Shield = 514,
  Armor = 513,
  Garment = 515,
  Boot = 516,
  Acc = 517,
  Acc_R = 510,
  Acc_L = 511,
  Special = 768,
  Pet = 518,
  Enchant = 0,
}
enum HeadLocation {
  Middle = 'Middle',
  Lower = 'Lower',
}

const Characters = [{ label: 'Rebelion', value: 1 }];

const itemTypes = Object.freeze(Object.values(ItemTypeEnum));
const mapItemType: Partial<Record<ItemTypeEnum, ItemTypeEnum[]>> = {
  [ItemTypeEnum.weapon]: [],
  [ItemTypeEnum.headUpper]: [],
  [ItemTypeEnum.headMiddle]: [],
  [ItemTypeEnum.headLower]: [],
  [ItemTypeEnum.shield]: [],
  [ItemTypeEnum.armor]: [],
  [ItemTypeEnum.garment]: [],
  [ItemTypeEnum.boot]: [],
  [ItemTypeEnum.accLeft]: [],
  [ItemTypeEnum.accRight]: [],
};
for (const [_itemType, relatedItems] of Object.entries(mapItemType)) {
  relatedItems.push(
    ...itemTypes.filter(
      (a) =>
        a.startsWith(_itemType) && a !== _itemType && a !== `${_itemType}Refine`
    )
  );
}

interface DropdownModel {
  label: string;
  value: string | number;
}

@Component({
  selector: 'app-ro-calculator',
  templateUrl: './ro-calculator.component.html',
  styleUrls: ['./ro-calculator.component.css'],
})
export class RoCalculatorComponent implements OnInit, OnChanges, OnDestroy {
  updateItemEvent = new Subject();
  items!: Record<number, ItemModel>;
  mapEnchant!: Map<string, ItemModel>;

  model: any = {
    class: undefined,
    level: 1,
    jobLevel: 1,
    str: 1,
    extraStr: undefined,
    agi: 1,
    extraAgi: undefined,
    vit: 1,
    extraVit: undefined,
    int: 1,
    extraInt: undefined,
    dex: 1,
    extraDex: undefined,
    luk: 1,
    extraLuk: undefined,
    weapon: undefined,
    weaponRefine: undefined,
    weaponCard1: undefined,
    weaponCard2: undefined,
    weaponCard3: undefined,
    weaponEnchant1: undefined,
    weaponEnchant2: undefined,
    weaponEnchant3: undefined,
    headUpper: undefined,
    headUpperRefine: undefined,
    headUpperCard: undefined,
    headUpperEnchant1: undefined,
    headUpperEnchant2: undefined,
    headUpperEnchant3: undefined,
    headMiddle: undefined,
    headMiddleCard: undefined,
    headMiddleEnchant1: undefined,
    headMiddleEnchant2: undefined,
    headMiddleEnchant3: undefined,
    headLower: undefined,
    headLowerEnchant1: undefined,
    headLowerEnchant2: undefined,
    headLowerEnchant3: undefined,
    armor: undefined,
    armorRefine: undefined,
    armorCard: undefined,
    armorEnchant1: undefined,
    armorEnchant2: undefined,
    armorEnchant3: undefined,
    shield: undefined,
    shieldRefine: undefined,
    shieldCard: undefined,
    shieldEnchant1: undefined,
    shieldEnchant2: undefined,
    shieldEnchant3: undefined,
    garment: undefined,
    garmentRefine: undefined,
    garmentCard: undefined,
    garmentEnchant1: undefined,
    garmentEnchant2: undefined,
    garmentEnchant3: undefined,
    boot: undefined,
    bootRefine: undefined,
    bootCard: undefined,
    bootEnchant1: undefined,
    bootEnchant2: undefined,
    bootEnchant3: undefined,
    accLeft: undefined,
    accLeftCard: undefined,
    accLeftEnchant1: undefined,
    accLeftEnchant2: undefined,
    accLeftEnchant3: undefined,
    accRight: undefined,
    accRightCard: undefined,
    accRightEnchant1: undefined,
    accRightEnchant2: undefined,
    accRightEnchant3: undefined,
    pet: undefined,
  };

  refineList = [
    0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
  ].map((a) => ({
    label: a.toString(),
    value: a,
  }));

  weaponList: DropdownModel[] = [];
  weaponCardList: DropdownModel[] = [];
  weaponEnchant1List: DropdownModel[] = [];
  weaponEnchant2List: DropdownModel[] = [];
  weaponEnchant3List: DropdownModel[] = [];
  headUpperList: DropdownModel[] = [];
  headUpperEnchant1List: DropdownModel[] = [];
  headUpperEnchant2List: DropdownModel[] = [];
  headUpperEnchant3List: DropdownModel[] = [];
  headMiddleList: DropdownModel[] = [];
  headMiddleEnchant1List: DropdownModel[] = [];
  headMiddleEnchant2List: DropdownModel[] = [];
  headMiddleEnchant3List: DropdownModel[] = [];
  headLowerList: DropdownModel[] = [];
  headLowerEnchant1List: DropdownModel[] = [];
  headLowerEnchant2List: DropdownModel[] = [];
  headLowerEnchant3List: DropdownModel[] = [];
  headCardList: DropdownModel[] = [];
  armorList: DropdownModel[] = [];
  armorCardList: DropdownModel[] = [];
  armorEnchant1List: DropdownModel[] = [];
  armorEnchant2List: DropdownModel[] = [];
  armorEnchant3List: DropdownModel[] = [];
  shieldList: DropdownModel[] = [];
  shieldCardList: DropdownModel[] = [];
  shieldEnchant1List: DropdownModel[] = [];
  shieldEnchant2List: DropdownModel[] = [];
  shieldEnchant3List: DropdownModel[] = [];
  garmentList: DropdownModel[] = [];
  garmentCardList: DropdownModel[] = [];
  garmentEnchant1List: DropdownModel[] = [];
  garmentEnchant2List: DropdownModel[] = [];
  garmentEnchant3List: DropdownModel[] = [];
  bootList: DropdownModel[] = [];
  bootCardList: DropdownModel[] = [];
  bootEnchant1List: DropdownModel[] = [];
  bootEnchant2List: DropdownModel[] = [];
  bootEnchant3List: DropdownModel[] = [];
  accLeftList: DropdownModel[] = [];
  accLeftCardList: DropdownModel[] = [];
  accLeftEnchant1List: DropdownModel[] = [];
  accLeftEnchant2List: DropdownModel[] = [];
  accLeftEnchant3List: DropdownModel[] = [];
  accRightList: DropdownModel[] = [];
  accRightCardList: DropdownModel[] = [];
  accRightEnchant1List: DropdownModel[] = [];
  accRightEnchant2List: DropdownModel[] = [];
  accRightEnchant3List: DropdownModel[] = [];
  petList: DropdownModel[] = [];

  characterList = Characters;
  selectedCharacter = 1;
  totalPoints = 0;
  availablePoints = 0;
  monsterList: DropdownModel[] = [];
  selectedMonster = 21067;
  minDamage = 0;
  maxDamage = 0;

  calculator = new Calculator(this.model, monsterData[this.selectedMonster]);
  stateCalculator = new BaseStateCalculator();

  itemSummary: any;
  modelSummary: any;
  totalSummary: any;

  weaponDesc = '';

  isLoadingItemSet = false;
  hasItemChanged = false;

  constructor(private roService: RoService) {
    //
  }

  ngOnDestroy(): void {
    this.updateItemEvent?.complete();
    this.updateItemEvent?.unsubscribe();
  }

  ngOnChanges(_changes: SimpleChanges): void {
    // console.log({ model: { ...this.model } });
  }

  isShowShield() {
    return this.selectedCharacter === 10;
  }

  logModel() {
    // console.log({ model: { ...this.model } });
    const calc = this.calculator
      .setModel(this.model)
      .setMonster(monsterData[this.selectedMonster]);
    // calc.setWeapon(this.model.weapon, this.model.weaponRefine).calculate();
    const { minDamage, maxDamage } = calc.calculateDamage();
    this.minDamage = minDamage;
    this.maxDamage = maxDamage;
    this.itemSummary = calc.getItemSummary();
    this.totalSummary = calc.getTotalummary();
    this.modelSummary = calc.getModelSummary();
  }

  loadItemSet() {
    this.isLoadingItemSet = true;
    const str = localStorage.getItem('ro-set');
    this.model = JSON.parse(str || '{}');
    setTimeout(() => {
      try {
        if (str) {
          for (const itemType of Object.keys(mapItemType)) {
            const refine = this.model[`${itemType}Refine`];
            const itemId = this.model[itemType];
            this.setEnchantList(itemId);
            this.onSelectItem(itemType, itemId, refine);
            for (const relatedItemType of mapItemType[
              itemType as ItemTypeEnum
            ] ?? []) {
              this.onSelectItem(
                relatedItemType,
                this.model[relatedItemType],
                refine
              );
            }
            this.onBaseStatusChange();
          }
        }
      } catch (error) {
        console.error(error);
      } finally {
        this.isLoadingItemSet = false;
      }
    }, 500);
  }

  saveItemSet() {
    this.isLoadingItemSet = true;
    localStorage.setItem('ro-set', JSON.stringify(this.model));
    this.isLoadingItemSet = false;
    this.hasItemChanged = false;
  }

  ngOnInit() {
    this.updateItemEvent.pipe(debounceTime(750)).subscribe(() => {
      this.logModel();
      this.hasItemChanged = true;
    });

    this.roService.getItems<Record<number, ItemModel>>().then((items) => {
      this.items = items;
      this.calculator.setMasterItems(items);
      this.mapEnchant = new Map(
        (Object.values(items) as unknown as ItemModel[]).map((item) => {
          return [item.aegisName, item];
        })
      );
      this.setDropdownList();
    });
  }

  private setDropdownList() {
    const weaponList = [];
    const weaponCardList = [];
    const headUpperList = [];
    const headMiddleList = [];
    const headLowerList = [];
    const headCardList = [];
    const armorList = [];
    const armorCardList = [];
    const shieldList = [];
    const shieldCardList = [];
    const garmentList = [];
    const garmentCardList = [];
    const bootList = [];
    const bootCardList = [];
    const accLeftList = [];
    const accLeftCardList = [];
    const accRightList = [];
    const accRightCardList = [];
    const petList = [];

    for (const item of Object.values(this.items) as unknown as ItemModel[]) {
      const { itemTypeId, itemSubTypeId, compositionPos, location } = item;
      if (itemTypeId === ItemTypeId.WEAPON) {
        weaponList.push(item);

        continue;
      }

      switch (itemSubTypeId) {
        case ItemSubTypeId.Upper:
          if (location === HeadLocation.Middle) {
            headMiddleList.push(item);
          } else if (location === HeadLocation.Lower) {
            headLowerList.push(item);
          } else {
            headUpperList.push(item);
          }
          continue;
        case ItemSubTypeId.Shield:
          shieldList.push(item);
          continue;
        case ItemSubTypeId.Armor:
          armorList.push(item);
          continue;
        case ItemSubTypeId.Garment:
          garmentList.push(item);
          continue;
        case ItemSubTypeId.Boot:
          bootList.push(item);
          continue;
        case ItemSubTypeId.Acc_L:
          accLeftList.push(item);
          continue;
        case ItemSubTypeId.Acc_R:
          accRightList.push(item);
          continue;
        case ItemSubTypeId.Acc:
          accRightList.push(item);
          accLeftList.push(item);
          continue;
        case ItemSubTypeId.Pet:
          petList.push(item);
          continue;
      }

      if (itemTypeId === ItemTypeId.CARD) {
        switch (compositionPos) {
          case CardPosition.Weapon:
            weaponCardList.push(item);
            continue;
          case CardPosition.Head:
            headCardList.push(item);
            continue;
          case CardPosition.Shield:
            shieldCardList.push(item);
            continue;
          case CardPosition.Armor:
            armorCardList.push(item);
            continue;
          case CardPosition.Garment:
            garmentCardList.push(item);
            continue;
          case CardPosition.Boot:
            bootCardList.push(item);
            continue;
          case CardPosition.AccL:
            accLeftCardList.push(item);
            continue;
          case CardPosition.AccR:
            accRightCardList.push(item);
            continue;
          case CardPosition.Acc:
            accLeftCardList.push(item);
            accRightCardList.push(item);
            continue;
        }
      }
    }

    this.weaponList = weaponList.map((a) => ({
      label: a.name,
      value: a.id,
    }));
    this.weaponCardList = weaponCardList.map((a) => ({
      label: a.name,
      value: a.id,
    }));
    this.headUpperList = headUpperList.map((a) => ({
      label: a.name,
      value: a.id,
    }));
    this.headMiddleList = headMiddleList.map((a) => ({
      label: a.name,
      value: a.id,
    }));
    this.headLowerList = headLowerList.map((a) => ({
      label: a.name,
      value: a.id,
    }));
    this.headCardList = headCardList.map((a) => ({
      label: a.name,
      value: a.id,
    }));
    this.armorList = armorList.map((a) => ({ label: a.name, value: a.id }));
    this.armorCardList = armorCardList.map((a) => ({
      label: a.name,
      value: a.id,
    }));
    this.shieldList = shieldList.map((a) => ({
      label: a.name,
      value: a.id,
    }));
    this.shieldCardList = shieldCardList.map((a) => ({
      label: a.name,
      value: a.id,
    }));
    this.garmentList = garmentList.map((a) => ({
      label: a.name,
      value: a.id,
    }));
    this.garmentCardList = garmentCardList.map((a) => ({
      label: a.name,
      value: a.id,
    }));
    this.bootList = bootList.map((a) => ({ label: a.name, value: a.id }));
    this.bootCardList = bootCardList.map((a) => ({
      label: a.name,
      value: a.id,
    }));
    this.accLeftList = accLeftList.map((a) => ({
      label: a.name,
      value: a.id,
    }));
    this.accLeftCardList = accLeftCardList.map((a) => ({
      label: a.name,
      value: a.id,
    }));
    this.accRightList = accRightList.map((a) => ({
      label: a.name,
      value: a.id,
    }));
    this.accRightCardList = accRightCardList.map((a) => ({
      label: a.name,
      value: a.id,
    }));
    this.petList = petList.map((a) => ({ label: a.name, value: a.id }));

    this.monsterList = Object.values(monsterData).map((a) => ({
      label: a.name,
      value: a.id,
    }));
  }

  setEnchantList(itemId: number) {
    // console.log({ itemId });
    const { itemSubTypeId, enchants, location } =
      this.items[itemId] ?? ({} as ItemModel);

    const [_, e2, e3, e4] = Array.isArray(enchants) ? enchants : [];
    // console.log({ itemSubTypeId, e2, e3, e4 });

    switch (itemSubTypeId) {
      case ItemSubTypeId.Upper:
        if (location === HeadLocation.Middle) {
          this.headMiddleEnchant1List = (e2 ?? [])
            .map((a: any) => this.mapEnchant.get(a))
            .map((a: any) => ({ label: a.name, value: a.id }));
          this.headMiddleEnchant2List = (e3 ?? [])
            .map((a: any) => this.mapEnchant.get(a))
            .map((a: any) => ({ label: a.name, value: a.id }));
          this.headMiddleEnchant3List = (e4 ?? [])
            .map((a: any) => this.mapEnchant.get(a))
            .map((a: any) => ({ label: a.name, value: a.id }));
        } else if (location === HeadLocation.Lower) {
          this.headLowerEnchant1List = (e2 ?? [])
            .map((a: any) => this.mapEnchant.get(a))
            .map((a: any) => ({ label: a.name, value: a.id }));
          this.headLowerEnchant2List = (e3 ?? [])
            .map((a: any) => this.mapEnchant.get(a))
            .map((a: any) => ({ label: a.name, value: a.id }));
          this.headLowerEnchant3List = (e4 ?? [])
            .map((a: any) => this.mapEnchant.get(a))
            .map((a: any) => ({ label: a.name, value: a.id }));
        } else {
          this.headUpperEnchant1List = (e2 ?? [])
            .map((a: any) => this.mapEnchant.get(a))
            .map((a: any) => ({ label: a.name, value: a.id }));
          this.headUpperEnchant2List = (e3 ?? [])
            .map((a: any) => this.mapEnchant.get(a))
            .map((a: any) => ({ label: a.name, value: a.id }));
          this.headUpperEnchant3List = (e4 ?? [])
            .map((a: any) => this.mapEnchant.get(a))
            .map((a: any) => ({ label: a.name, value: a.id }));
        }
        break;
      case ItemSubTypeId.Shield:
        this.shieldEnchant1List = (e2 ?? [])
          .map((a: any) => this.mapEnchant.get(a))
          .map((a: any) => ({ label: a.name, value: a.id }));
        this.shieldEnchant2List = (e3 ?? [])
          .map((a: any) => this.mapEnchant.get(a))
          .map((a: any) => ({ label: a.name, value: a.id }));
        this.shieldEnchant3List = (e4 ?? [])
          .map((a: any) => this.mapEnchant.get(a))
          .map((a: any) => ({ label: a.name, value: a.id }));
        break;
      case ItemSubTypeId.Armor:
        this.armorEnchant1List = (e2 ?? [])
          .map((a: any) => this.mapEnchant.get(a))
          .map((a: any) => ({ label: a.name, value: a.id }));
        this.armorEnchant2List = (e3 ?? [])
          .map((a: any) => this.mapEnchant.get(a))
          .map((a: any) => ({ label: a.name, value: a.id }));
        this.armorEnchant3List = (e4 ?? [])
          .map((a: any) => this.mapEnchant.get(a))
          .map((a: any) => ({ label: a.name, value: a.id }));
        break;
      case ItemSubTypeId.Garment:
        this.garmentEnchant1List = (e2 ?? [])
          .map((a: any) => this.mapEnchant.get(a))
          .map((a: any) => ({ label: a.name, value: a.id }));
        this.garmentEnchant2List = (e3 ?? [])
          .map((a: any) => this.mapEnchant.get(a))
          .map((a: any) => ({ label: a.name, value: a.id }));
        this.garmentEnchant3List = (e4 ?? [])
          .map((a: any) => this.mapEnchant.get(a))
          .map((a: any) => ({ label: a.name, value: a.id }));
        break;
      case ItemSubTypeId.Boot:
        this.bootEnchant1List = (e2 ?? [])
          .map((a: any) => this.mapEnchant.get(a))
          .map((a: any) => ({ label: a.name, value: a.id }));
        this.bootEnchant2List = (e3 ?? [])
          .map((a: any) => this.mapEnchant.get(a))
          .map((a: any) => ({ label: a.name, value: a.id }));
        this.bootEnchant3List = (e4 ?? [])
          .map((a: any) => this.mapEnchant.get(a))
          .map((a: any) => ({ label: a.name, value: a.id }));
        break;
      case ItemSubTypeId.Acc:
      case ItemSubTypeId.Acc_L:
        this.accLeftEnchant1List = (e2 ?? [])
          .map((a: any) => this.mapEnchant.get(a))
          .map((a: any) => ({ label: a.name, value: a.id }));
        this.accLeftEnchant2List = (e3 ?? [])
          .map((a: any) => this.mapEnchant.get(a))
          .map((a: any) => ({ label: a.name, value: a.id }));
        this.accLeftEnchant3List = (e4 ?? [])
          .map((a: any) => this.mapEnchant.get(a))
          .map((a: any) => ({ label: a.name, value: a.id }));
        break;
      case ItemSubTypeId.Acc:
      case ItemSubTypeId.Acc_R:
        this.accRightEnchant1List = (e2 ?? [])
          .map((a: any) => this.mapEnchant.get(a))
          .map((a: any) => ({ label: a.name, value: a.id }));
        this.accRightEnchant2List = (e3 ?? [])
          .map((a: any) => this.mapEnchant.get(a))
          .map((a: any) => ({ label: a.name, value: a.id }));
        this.accRightEnchant3List = (e4 ?? [])
          .map((a: any) => this.mapEnchant.get(a))
          .map((a: any) => ({ label: a.name, value: a.id }));
        break;
    }
  }

  onSelectItem(itemType: string, itemId = 0, refine = 0) {
    this.weaponDesc = this.items[itemId]?.description
      .replaceAll('\n', '<br>')
      .replaceAll('^000000', '</font>')
      .replaceAll('^777777', '<font color=`#777777`>');

    // console.log({ itemType, itemId, refine });
    if (itemType === ItemTypeEnum.weapon) {
      this.calculator.setWeapon(itemId, refine);
    } else {
      this.calculator.setItem(itemType as ItemTypeEnum, itemId, refine);
    }
    this.updateItemEvent.next(1);
  }

  onClearItem(itemType: string) {
    const item = mapItemType[itemType as ItemTypeEnum] as ItemTypeEnum[];
    if (item) {
      for (const _itemType of item) {
        this.model[_itemType] = undefined;
        this.onSelectItem(_itemType);
      }
    }
  }

  onBaseStatusChange() {
    const { str, agi, vit, int, dex, luk } = this.model;
    const mainStatuses = [str, agi, vit, int, dex, luk];
    const { availablePoint } = this.stateCalculator
      .setLevel(this.model.level)
      .setMainStatusLevels(mainStatuses)
      .calculate().summary;
    this.availablePoints = availablePoint;
  }
}
