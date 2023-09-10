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
import { Rebelion } from './rebellion';
import { ItemModel } from './item.model';

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
  Arrow = 1024,
  Cannonball = 1025,
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

  CostumeEnhUpper = 71,
  CostumeEnhMiddle = 72,
  CostumeEnhLower = 73,
  CostumeEnhGarment = 74,

  ShadowWeapon = 280,
  ShadowArmor = 526,
  ShadowShield = 527,
  ShadowBoot = 528,
  ShadowEarning = 529,
  ShadowPendant = 530,
}
enum HeadLocation {
  Middle = 'Middle',
  Lower = 'Lower',
}

const Characters = [{ label: 'Rebelion', value: 1 }];

const itemTypes = Object.freeze(Object.values(ItemTypeEnum));
const mapItemType: Partial<Record<ItemTypeEnum, ItemTypeEnum[]>> = {
  [ItemTypeEnum.weapon]: [],
  [ItemTypeEnum.ammo]: [],
  [ItemTypeEnum.headUpper]: [],
  [ItemTypeEnum.headMiddle]: [],
  [ItemTypeEnum.headLower]: [],
  [ItemTypeEnum.shield]: [],
  [ItemTypeEnum.armor]: [],
  [ItemTypeEnum.garment]: [],
  [ItemTypeEnum.boot]: [],
  [ItemTypeEnum.accLeft]: [],
  [ItemTypeEnum.accRight]: [],

  [ItemTypeEnum.pet]: [],

  [ItemTypeEnum.costumeEnchantUpper]: [],
  [ItemTypeEnum.costumeEnchantMiddle]: [],
  [ItemTypeEnum.costumeEnchantLower]: [],
  [ItemTypeEnum.costumeEnchantGarment]: [],

  [ItemTypeEnum.costumeEnhUpper]: [],
  [ItemTypeEnum.costumeEnhMiddle]: [],
  [ItemTypeEnum.costumeEnhLower]: [],
  [ItemTypeEnum.costumeEnhGarment]: [],
  [ItemTypeEnum.shadowWeapon]: [],
  [ItemTypeEnum.shadowArmor]: [],
  [ItemTypeEnum.shadowShield]: [],
  [ItemTypeEnum.shadowBoot]: [],
  [ItemTypeEnum.shadowEarning]: [],
  [ItemTypeEnum.shadowPendant]: [],
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
  element?: string;
}

const toDropdownList = <T extends {}>(
  list: T[],
  labelKey: keyof T,
  valueKey: keyof T,
  elementKey?: keyof T
): DropdownModel[] => {
  return list.map((a) => ({
    label: a[labelKey],
    value: a[valueKey],
    element: elementKey
      ? (a[elementKey] ?? a['stats']?.[elementKey] ?? '').replace('/s+d+/', '')
      : undefined,
  }));
};

interface SkillBuff<
  T extends DropdownModel | { bonus: Record<string, number> }
> {
  [key: string]: {
    [key2 in 'checkbox' | 'dropdown']?: T[];
  };
  // Record
}
const skillBuffs = {
  impositioManus: {
    name: 'Impositio Manus',
    label: 'Impositio Manus',
    dropdown: [
      { label: 'Yes', value: 1, bonus: { atk: 25 } },
      { label: 'No', value: 2 },
    ],
  },
  advBlessing: {
    name: 'Clementia',
    label: 'Clementia',
    dropdown: [
      {
        label: 'B +2',
        value: 2,
        bonus: { str: 12, int: 12, dex: 12, hit: 20 },
      },
      {
        label: 'B +3',
        value: 3,
        bonus: { str: 13, int: 13, dex: 13, hit: 20 },
      },
      {
        label: 'B +4',
        value: 4,
        bonus: { str: 14, int: 14, dex: 14, hit: 20 },
      },
      {
        label: 'B +5',
        value: 5,
        bonus: { str: 15, int: 15, dex: 15, hit: 20 },
      },
      {
        label: 'B +6',
        value: 6,
        bonus: { str: 16, int: 16, dex: 16, hit: 20 },
      },
    ],
  },
  advAgiUp: {
    name: 'Cantocandidus',
    label: 'Cantocandidus',
    dropdown: [
      {
        label: 'A +2',
        value: 2,
        bonus: { agi: 13, aspdPercent: 11 },
      },
      {
        label: 'A +3',
        value: 3,
        bonus: { agi: 14, aspdPercent: 12 },
      },
      {
        label: 'A +4',
        value: 4,
        bonus: { agi: 15, aspdPercent: 13 },
      },
      {
        label: 'A +5',
        value: 5,
        bonus: { agi: 16, aspdPercent: 14 },
      },
      {
        label: 'A +6',
        value: 6,
        bonus: { agi: 17, aspdPercent: 15 },
      },
    ],
  },
  expiatio: {
    name: 'Expiatio',
    label: 'Expiatio',
    dropdown: [
      {
        label: 'Yes',
        value: 1,
        bonus: { p_pene_race_all: 25, m_pene_race_all: 25 },
      },
      { label: 'No', value: 2 },
    ],
  },
};

const createNumberDropdownList = (
  from: number,
  to: number
): DropdownModel[] => {
  return Array.from({ length: to - from + 1 }, (_, k) => {
    const num = k + 1;
    return {
      label: num.toString(),
      value: num,
    };
  });
};

@Component({
  selector: 'app-ro-calculator',
  templateUrl: './ro-calculator.component.html',
  styleUrls: ['./ro-calculator.component.css'],
})
export class RoCalculatorComponent implements OnInit, OnChanges, OnDestroy {
  updateItemEvent = new Subject();
  items!: Record<number, ItemModel>;
  mapEnchant!: Map<string, ItemModel>;
  skillBuffs = skillBuffs;

  model = {
    selectedAtkSkill: undefined,
    class: undefined,
    level: 1,
    jobLevel: 1,
    str: 1,
    itemStr: undefined,
    jobStr: undefined,
    agi: 1,
    itemAgi: undefined,
    jobAgi: undefined,
    vit: 1,
    itemVit: undefined,
    jobVit: undefined,
    int: 1,
    itemInt: undefined,
    jobInt: undefined,
    dex: 1,
    itemDex: undefined,
    jobDex: undefined,
    luk: 1,
    itemLuk: undefined,
    jobLuk: undefined,
    weapon: undefined,
    weaponRefine: undefined,
    weaponCard1: undefined,
    weaponCard2: undefined,
    weaponCard3: undefined,
    weaponEnchant1: undefined,
    weaponEnchant2: undefined,
    weaponEnchant3: undefined,
    ammo: undefined,
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

    costumeEnchantUpper: undefined,
    costumeEnchantMiddle: undefined,
    costumeEnchantLower: undefined,
    costumeEnchantGarment: undefined,

    costumeEnhUpper: undefined,
    costumeEnhMiddle: undefined,
    costumeEnhLower: undefined,
    costumeEnhGarment: undefined,
    shadowWeapon: undefined,
    shadowWeaponEnchant1: undefined,
    shadowArmor: undefined,
    shadowArmorEnchant1: undefined,
    shadowShield: undefined,
    shadowShieldEnchant1: undefined,
    shadowBoot: undefined,
    shadowBootEnchant1: undefined,
    shadowEarning: undefined,
    shadowEarningEnchant1: undefined,
    shadowPendant: undefined,
    shadowPendantEnchant1: undefined,

    impositioManus: undefined,
    advBlessing: undefined,
    advAgiUp: undefined,
    expiatio: undefined,

    activeSkills: [],
    passiveSkills: [],
    consumables: [],
  };

  basicEnchants: DropdownModel[] = []; // atk atk%, aspd, state
  refineList = createNumberDropdownList(0, 20);
  mainStatusList = createNumberDropdownList(1, 130);
  levelList = createNumberDropdownList(1, 200);
  jobList = createNumberDropdownList(1, 65);

  weaponList: DropdownModel[] = [];
  weaponCardList: DropdownModel[] = [];
  weaponEnchant1List: DropdownModel[] = [];
  weaponEnchant2List: DropdownModel[] = [];
  weaponEnchant3List: DropdownModel[] = [];
  ammoList: DropdownModel[] = [];
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

  costumeEnhUpperList: DropdownModel[] = [];
  costumeEnhMiddleList: DropdownModel[] = [];
  costumeEnhLowerList: DropdownModel[] = [];
  costumeEnhGarmentList: DropdownModel[] = [];

  shadowWeaponList: DropdownModel[] = [];
  shadowArmorList: DropdownModel[] = [];
  shadowShieldList: DropdownModel[] = [];
  shadowBootList: DropdownModel[] = [];
  shadowEarningList: DropdownModel[] = [];
  shadowPendantList: DropdownModel[] = [];

  characterList = Characters;
  selectedCharacterId = 1;
  selectedCharacter = new Rebelion();
  atkSkills = [];
  passiveSkills = [];
  activeSkills = [];
  consumableList: DropdownModel[] = [];

  totalPoints = 0;
  availablePoints = 0;
  monsterList: DropdownModel[] = [];
  selectedMonster = 21067;
  minDamage = 0;
  maxDamage = 0;

  calculator = new Calculator();
  stateCalculator = new BaseStateCalculator();

  itemSummary: any;
  itemSummary2: any;
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
    return this.selectedCharacterId === 10;
  }

  logModel() {
    // console.log({ model: { ...this.model } });

    const { activeSkills, passiveSkills, selectedAtkSkill } = this.model;
    const { equipAtks, masteryAtks, skillNames, learnedSkillMap } =
      this.selectedCharacter.getSkillBonusAndName({
        activeIds: activeSkills,
        passiveIds: passiveSkills,
      });

    const consumeData = this.model.consumables.map(
      (id) => this.items[id].script
    );
    this.calculator.setConsumables(consumeData);

    const buffs = {};
    const addBuffBonus = (buffKey: string) => {
      if (!this.model[buffKey]) return;

      const { bonus } = this.skillBuffs[buffKey].dropdown.find(
        (a) => a.value === this.model[buffKey]
      );
      if (!bonus) return;

      buffs[this.skillBuffs[buffKey].name] = bonus;
    };
    Object.keys(this.skillBuffs).forEach(addBuffBonus);

    const calc = this.calculator
      .setModel(this.model)
      .setEquipAtkSkillAtk({ ...equipAtks, ...buffs })
      .setMasterySkillAtk(masteryAtks)
      .setUsedSkillNames(skillNames)
      .setLearnedSkills(learnedSkillMap)
      .setMonster(monsterData[this.selectedMonster]);

    // calc.setWeapon(this.model.weapon, this.model.weaponRefine).calculate();
    const skillFormular = this.atkSkills.find(
      (a) => a.value === selectedAtkSkill
    ).formular;

    const { minDamage, maxDamage } = calc.calculateSkillDamage(
      selectedAtkSkill,
      10,
      skillFormular
    );
    this.minDamage = minDamage;
    this.maxDamage = maxDamage;
    this.totalSummary = calc.getTotalummary();
    this.modelSummary = calc.getModelSummary();
    const x = calc.getItemSummary();
    const part1 = Object.entries(x).filter((a, index) => {
      return index < 13;
    });
    const part2 = Object.entries(x).filter((a, index) => {
      return index >= 13;
    });
    this.itemSummary = part1.reduce((total, [key, value]) => {
      total[key] = value;
      return total;
    }, {});
    this.itemSummary2 = part2.reduce((total, [key, value]) => {
      total[key] = value;
      return total;
    }, {});
  }

  initialSkillArray() {
    const { activeSkills, passiveSkills } = this.selectedCharacter;
    if (this.model.activeSkills?.length !== activeSkills.length) {
      this.model.activeSkills = [];
    }
    if (this.model.passiveSkills?.length !== passiveSkills.length) {
      this.model.passiveSkills = [];
    }
  }

  loadItemSet() {
    this.isLoadingItemSet = true;
    const str = localStorage.getItem('ro-set');
    this.model = { ...this.model, ...JSON.parse(str || '{}') };
    this.model.selectedAtkSkill =
      this.model.selectedAtkSkill || this.atkSkills[0]?.value;

    this.initialSkillArray();
    this.setJobBonus();

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
          }
          this.onBaseStatusChange();
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
    this.activeSkills = this.selectedCharacter.activeSkills;
    this.passiveSkills = this.selectedCharacter.passiveSkills;
    this.atkSkills = this.selectedCharacter.atkSkills;
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
      this.loadItemSet();
    });
  }

  setJobBonus() {
    const { str, agi, vit, int, dex, luk } =
      this.selectedCharacter.getJobBonusStatus(this.model.jobLevel);
    this.model.jobStr = str;
    this.model.jobAgi = agi;
    this.model.jobVit = vit;
    this.model.jobInt = int;
    this.model.jobDex = dex;
    this.model.jobLuk = luk;
  }

  private setDropdownList() {
    const weaponList = [];
    const weaponCardList = [];
    const ammoList: ItemModel[] = [];
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

    const costumeEnhUpperList = [];
    const costumeEnhMiddleList = [];
    const costumeEnhLowerList = [];
    const costumeEnhGarmentList = [];

    const shadowArmorList = [];
    const shadowShieldList = [];
    const shadowBootList = [];
    const shadowEarningList = [];
    const shadowPendantList = [];
    const shadowWeaponList = [];

    const consumableList = [];

    for (const item of Object.values(this.items) as unknown as ItemModel[]) {
      const { itemTypeId, itemSubTypeId, compositionPos, location } = item;

      switch (itemTypeId) {
        case ItemTypeId.WEAPON:
          weaponList.push(item);
          continue;
        case ItemTypeId.CONSUMABLE:
          consumableList.push(item);
          continue;
        case ItemTypeId.AMMO:
          ammoList.push(item);
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
        case ItemSubTypeId.ShadowArmor:
          shadowArmorList.push(item);
          continue;
        case ItemSubTypeId.ShadowShield:
          shadowShieldList.push(item);
          continue;
        case ItemSubTypeId.ShadowBoot:
          shadowBootList.push(item);
          continue;
        case ItemSubTypeId.ShadowEarning:
          shadowEarningList.push(item);
          continue;
        case ItemSubTypeId.ShadowPendant:
          shadowPendantList.push(item);
          continue;
        case ItemSubTypeId.ShadowWeapon:
          shadowWeaponList.push(item);
          continue;
        case ItemSubTypeId.CostumeEnhUpper:
          costumeEnhUpperList.push(item);
          continue;
        case ItemSubTypeId.CostumeEnhMiddle:
          costumeEnhMiddleList.push(item);
          continue;
        case ItemSubTypeId.CostumeEnhLower:
          costumeEnhLowerList.push(item);
          continue;
        case ItemSubTypeId.CostumeEnhGarment:
          costumeEnhGarmentList.push(item);
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

    this.weaponList = toDropdownList(weaponList, 'name', 'id');
    this.weaponCardList = toDropdownList(weaponCardList, 'name', 'id');
    this.ammoList = toDropdownList(ammoList, 'name', 'id', 'propertyAtk');
    this.headUpperList = toDropdownList(headUpperList, 'name', 'id');
    this.headMiddleList = toDropdownList(headMiddleList, 'name', 'id');
    this.headLowerList = toDropdownList(headLowerList, 'name', 'id');
    this.headCardList = toDropdownList(headCardList, 'name', 'id');
    this.armorList = toDropdownList(armorList, 'name', 'id');
    this.armorCardList = toDropdownList(armorCardList, 'name', 'id');
    this.shieldList = toDropdownList(shieldList, 'name', 'id');
    this.shieldCardList = toDropdownList(shieldCardList, 'name', 'id');
    this.garmentList = toDropdownList(garmentList, 'name', 'id');
    this.garmentCardList = toDropdownList(garmentCardList, 'name', 'id');
    this.bootList = toDropdownList(bootList, 'name', 'id');
    this.bootCardList = toDropdownList(bootCardList, 'name', 'id');
    this.accLeftList = toDropdownList(accLeftList, 'name', 'id');
    this.accLeftCardList = toDropdownList(accLeftCardList, 'name', 'id');
    this.accRightList = toDropdownList(accRightList, 'name', 'id');
    this.accRightCardList = toDropdownList(accRightCardList, 'name', 'id');
    this.petList = petList.map((a) => ({ label: a.name, value: a.id }));

    this.monsterList = toDropdownList(
      Object.values(monsterData),
      'name',
      'id',
      'elementName' as any
    );
    this.consumableList = toDropdownList(consumableList, 'name', 'id');

    this.costumeEnhUpperList = toDropdownList(
      costumeEnhUpperList,
      'name',
      'id'
    );
    this.costumeEnhMiddleList = toDropdownList(
      costumeEnhMiddleList,
      'name',
      'id'
    );
    this.costumeEnhLowerList = toDropdownList(
      costumeEnhLowerList,
      'name',
      'id'
    );
    this.costumeEnhGarmentList = toDropdownList(
      costumeEnhGarmentList,
      'name',
      'id'
    );

    this.shadowArmorList = toDropdownList(shadowArmorList, 'name', 'id');
    this.shadowShieldList = toDropdownList(shadowShieldList, 'name', 'id');
    this.shadowBootList = toDropdownList(shadowBootList, 'name', 'id');
    this.shadowEarningList = toDropdownList(shadowEarningList, 'name', 'id');
    this.shadowPendantList = toDropdownList(shadowPendantList, 'name', 'id');
    this.shadowWeaponList = toDropdownList(shadowWeaponList, 'name', 'id');
  }

  setEnchantList(itemId: number) {
    // console.log({ itemId });
    const { itemSubTypeId, enchants, location } =
      this.items[itemId] ?? ({} as ItemModel);

    const [_, e2, e3, e4] = Array.isArray(enchants) ? enchants : [];
    const clearModel = (prefix) => {
      for (const idx of [1, 2, 3]) {
        const enchantList = this[
          `${prefix}Enchant${idx}List`
        ] as DropdownModel[];
        const itemType = `${prefix}Enchant${idx}` as ItemTypeEnum;
        if (!enchantList.find((a) => a.value === this.model[itemType])) {
          this.model[itemType] = undefined;
          this.calculator.setItem(itemType, null);
        }
      }
    };

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
          clearModel('headMiddle');
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
          clearModel('headLower');
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
          clearModel('headUpper');
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
        clearModel('shield');
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
        clearModel('armor');
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
        clearModel('garment');
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
        clearModel('boot');
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
        clearModel('accLeft');
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
        clearModel('accRight');
        break;
    }
  }

  onSelectItem(
    itemType: string,
    itemId = 0,
    refine = 0,
    isClearRelated = false
  ) {
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

    if (isClearRelated) {
      this.onClearItem(itemType);
    }

    this.updateItemEvent.next(1);
  }

  onClearItem(itemType: string) {
    const relatedItems = mapItemType[
      itemType as ItemTypeEnum
    ] as ItemTypeEnum[];
    if (relatedItems) {
      for (const _itemType of relatedItems) {
        this.model[_itemType] = undefined;
        this.onSelectItem(_itemType);
      }
    }
  }

  onBaseStatusChange() {
    this.setJobBonus();

    const { str, agi, vit, int, dex, luk } = this.model;
    const mainStatuses = [str, agi, vit, int, dex, luk];
    const { availablePoint } = this.stateCalculator
      .setLevel(this.model.level)
      .setMainStatusLevels(mainStatuses)
      .calculate().summary;
    this.availablePoints = availablePoint;
    this.updateItemEvent.next(1);
  }

  onConsumableChange() {
    this.updateItemEvent.next(1);
  }

  onSkillClassChange() {
    this.updateItemEvent.next(1);
  }

  onSkillBuffChange() {
    this.updateItemEvent.next(1);
  }

  onMonsterChange() {
    this.updateItemEvent.next(1);
  }
}
