import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import {
  debounceTime,
  delay,
  finalize,
  forkJoin,
  mergeMap,
  Observable,
  of,
  Subject,
  Subscription,
  take,
  tap,
} from 'rxjs';
import { BaseStateCalculator } from './base-state-calculator';
import { Calculator } from './calculator';
import { ItemTypeEnum, MainItemTypeSet } from './item-type.enum';
import { ItemTypeId } from './item.const';
import { RoService } from 'src/app/demo/service/ro.service';
import { ItemModel } from './item.model';
import {
  ConfirmEventType,
  ConfirmationService,
  MenuItem,
  MessageService,
  PrimeIcons,
  SelectItemGroup,
} from 'primeng/api';
import { RaceType } from './race-type.const';
import { ElementType } from './element-type.const';
import { ActiveSkillModel, AtkSkillModel, CharacterBase, PassiveSkillModel } from './jobs/char-class.abstract';
import { Ranger } from './jobs/ranger';
import { MonsterModel } from './monster.model';
import { getEnchants } from './enchant-table';
import { SoulReaper } from './jobs/soul-reaper';
import { DropdownModel } from './dropdown.model';
import { ItemListModel } from './item-list.model';
import { getMonsterSpawnMap } from './monster-spawn-mapper';
import { Rebelion } from './jobs/rebellion';
import { ShadowChaser } from './jobs/shadow-chaser';
import { GitCross } from './jobs/git-cross';
import { Mage } from './jobs/mage';
import { Sage } from './jobs/sage';
import { ArchBishop } from './jobs/arch-bishop';

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

interface MonsterSelectItemGroup extends SelectItemGroup {
  items: any[];
}

const Characters: DropdownModel[] = [
  { label: 'Rebelion', value: 1, instant: new Rebelion() },
  { label: 'Ranger', value: 2, instant: new Ranger() },
  { label: 'Soul Reaper', value: 3, instant: new SoulReaper() },
  { label: 'SC', value: 4, instant: new ShadowChaser() },
  { label: 'Git Cross', value: 5, instant: new GitCross() },
  { label: 'Sage', value: 6, instant: new Sage() },
  { label: 'Arch Bishop', value: 7, instant: new ArchBishop() },
];

const itemTypes = Object.freeze(Object.values(ItemTypeEnum));
const mapRelatedItem: Partial<Record<ItemTypeEnum, ItemTypeEnum[]>> = {
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
for (const [_itemType, relatedItems] of Object.entries(mapRelatedItem)) {
  relatedItems.push(
    ...itemTypes.filter((a) => a.startsWith(_itemType) && a !== _itemType && a !== `${_itemType}Refine`),
  );
}

const toDropdownList = <T extends {}>(
  list: T[],
  labelKey: keyof T,
  valueKey: keyof T,
  elementKey?: keyof T,
): DropdownModel[] => {
  return list.map((a) => ({
    label: a[labelKey],
    value: a[valueKey],
    element: elementKey ? a[elementKey] || '' : undefined,
    usableClass: a['usableClass'] || undefined,
  }));
};

const skillBuffs = {
  impositioManus: {
    name: 'Impositio Manus',
    label: 'Imp Lv 5',
    dropdown: [
      { label: 'Yes', value: 1, bonus: { atk: 25, matk: 25 } },
      { label: 'No', value: 2 },
    ],
  },
  advBlessing: {
    name: 'Clementia',
    label: 'Blessing',
    dropdown: [
      {
        label: 'Lv 10',
        value: 10,
        bonus: { str: 10, int: 10, dex: 10, hit: 20 },
      },
      // {
      //   label: 'Job 10',
      //   value: 11,
      //   bonus: { str: 11, int: 11, dex: 11, hit: 21 },
      // },
      {
        label: 'Job 20',
        value: 12,
        bonus: { str: 12, int: 12, dex: 12, hit: 22 },
      },
      {
        label: 'Job 30',
        value: 13,
        bonus: { str: 13, int: 13, dex: 13, hit: 23 },
      },
      {
        label: 'Job 40',
        value: 14,
        bonus: { str: 14, int: 14, dex: 14, hit: 24 },
      },
      {
        label: 'Job 50',
        value: 15,
        bonus: { str: 15, int: 15, dex: 15, hit: 25 },
      },
      {
        label: 'Job 60',
        value: 16,
        bonus: { str: 16, int: 16, dex: 16, hit: 26 },
      },
    ],
  },
  advAgiUp: {
    name: 'Cantocandidus',
    label: 'Agi UP',
    dropdown: [
      {
        label: 'Lv 10',
        value: 10,
        bonus: { agi: 12, aspdPercent: 10 },
      },
      // {
      //   label: 'Job 10',
      //   value: 11,
      //   bonus: { agi: 13, aspdPercent: 11 },
      // },
      {
        label: 'Job 20',
        value: 12,
        bonus: { agi: 14, aspdPercent: 12 },
      },
      {
        label: 'Job 30',
        value: 13,
        bonus: { agi: 15, aspdPercent: 13 },
      },
      {
        label: 'Job 40',
        value: 14,
        bonus: { agi: 16, aspdPercent: 14 },
      },
      {
        label: 'Job 50',
        value: 15,
        bonus: { agi: 17, aspdPercent: 15 },
      },
      {
        label: 'Job 60',
        value: 16,
        bonus: { agi: 18, aspdPercent: 16 },
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

const createNumberDropdownList = (from: number, to: number, prefixLabel?: string): DropdownModel[] => {
  return Array.from({ length: to - from + 1 }, (_, k) => {
    const num = k + from;
    return {
      label: `${prefixLabel || ''}${num}`,
      value: num,
    };
  });
};

const wait = (second: number) =>
  new Promise((resolve) =>
    setTimeout(() => {
      resolve(1);
    }, second * 1000),
  );

const waitRxjs = (second: number = 0.1) => {
  return of(null).pipe(delay(1000 * second), take(1));
};

const createExtraOptionList = () => {
  const atkTypes = ['Physical', 'Magical'];
  const atkProps = {
    Race: ['All', ...Object.values(RaceType)],
    Element: ['All', ...Object.values(ElementType)],
    Size: ['All', 'Small', 'Medium', 'Large'],
    Class: ['All', 'Monster', 'Boss'],
  };

  const items = [];
  for (const atkType of atkTypes) {
    const atk = atkType.at(0).toLowerCase();
    const item = {
      value: atk,
      label: atkType,
      children: [],
    };
    for (const [prop, finalProps] of Object.entries(atkProps)) {
      const propLow = prop.toLowerCase();
      item.children.push({
        value: `${atk}_${prop}`,
        label: prop,
        children: finalProps.map((finalProp) => {
          const finalPropLow = finalProp.toLowerCase();
          return {
            value: `${atk}_${prop}_${finalProp}`,
            label: finalProp,
            children: Array.from({ length: 25 }, (_, k) => {
              const num = k + 1;
              return {
                value: `${atk}_${propLow}_${finalPropLow}:${num}`,
                label: `${atk.toUpperCase()}. ${prop} ${finalProp} ${num}%`,
              };
            }),
          };
        }),
      });
    }

    items.push(item);
  }

  const options: [string, string, number, number][] = [
    ['Atk', 'atk', 10, 65],
    ['Atk %', 'atkPercent', 5, 30],
    ['Range', 'range', 1, 25],
    ['Cri Dmg', 'criDmg', 1, 20],
    ['ASPD %', 'aspdPercent', 1, 20],
    ['Delay', 'acd', 1, 15],
    ['Matk', 'matk', 10, 65],
    ['Matk %', 'matkPercent', 5, 30],
    ['VCT', 'vct', 1, 20],
    ['CRI', 'cri', 1, 20],
  ];
  for (const [label, prop, min, max] of options) {
    const item = {
      value: label,
      label,
      children: Array.from({ length: max - min + 1 }, (_, k) => {
        const num = k + min;
        return {
          label: `${label} ${num}`,
          value: `${prop}:${num}`,
        };
      }),
    };
    items.push(item);
  }

  return items;
};

const createMainStatOptionList = () => {
  const items = [];

  const options: [string, string, number, number][] = [
    ['Atk', 'atk', 1, 15],
    ['Matk', 'matk', 1, 15],
    ['ASPD', 'aspd', 1, 1],
    ['ASPD %', 'aspdPercent', 1, 5],
    ['All Stat', 'allStatus', 1, 10],
    ['Str', 'str', 1, 10],
    ['Agi', 'agi', 1, 10],
    ['Vit', 'vit', 1, 10],
    ['Int', 'int', 1, 10],
    ['Dex', 'dex', 1, 10],
    ['Luk', 'luk', 1, 10],
  ];
  for (const [label, prop, min, max] of options) {
    const item = {
      value: label,
      label,
      children: Array.from({ length: max - min + 1 }, (_, k) => {
        const num = k + min;
        return {
          label: `${label} ${num}`,
          value: `${prop}:${num}`,
        };
      }),
    };
    items.push(item);
  }

  return items;
};

@Component({
  selector: 'app-ro-calculator',
  templateUrl: './ro-calculator.component.html',
  styleUrls: ['./ro-calculator.component.css'],
  providers: [ConfirmationService, MessageService],
})
export class RoCalculatorComponent implements OnInit, OnDestroy {
  updateItemEvent = new Subject();
  updateMonsterListEvent = new Subject();

  loadBtnItems: MenuItem[];
  monsterDataMap: Record<number, MonsterModel> = {};
  items!: Record<number, ItemModel>;
  mapEnchant!: Map<string, ItemModel>;
  skillBuffs = skillBuffs;

  preSets: DropdownModel[] = [];
  selectedPreset = undefined;
  isInProcessingPreset = false;

  model = {
    class: 1,
    level: 99,
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
    selectedAtkSkill: undefined,
    propertyAtk: undefined,
    rawOptionTxts: [],
    weapon: undefined,
    weaponRefine: undefined,
    weaponCard1: undefined,
    weaponCard2: undefined,
    weaponCard3: undefined,
    weaponCard4: undefined,
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
    shadowWeaponRefine: undefined,
    shadowArmor: undefined,
    shadowArmorRefine: undefined,
    shadowShield: undefined,
    shadowShieldRefine: undefined,
    shadowBoot: undefined,
    shadowBootRefine: undefined,
    shadowEarning: undefined,
    shadowEarningRefine: undefined,
    shadowPendant: undefined,
    shadowPendantRefine: undefined,

    impositioManus: undefined,
    advBlessing: undefined,
    advAgiUp: undefined,
    expiatio: undefined,

    activeSkills: [],
    passiveSkills: [],
    consumables: [],
    consumables2: [],
    aspdPotion: undefined,
    aspdPotions: [],
  };
  private emptyModel = this.cloneModel(this.model);

  basicOptions = createMainStatOptionList();
  refineList = createNumberDropdownList(0, 20);
  shadowRefineList = createNumberDropdownList(0, 10);
  mainStatusList = createNumberDropdownList(1, 130);
  levelList = createNumberDropdownList(99, 185);
  jobList = createNumberDropdownList(1, 65);
  propertyAtkList = Object.values(ElementType).map<DropdownModel>((a) => ({ label: a, value: a, element: a }));

  optionList: any[] = createExtraOptionList();
  itemList: ItemListModel = {} as any;

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
  selectedCharacter: CharacterBase;
  atkSkills: AtkSkillModel<any>[] = [];
  passiveSkills: PassiveSkillModel[] = [];
  activeSkills: ActiveSkillModel[] = [];
  consumableList: DropdownModel[] = [];
  consumableList2: DropdownModel[][] = [
    [
      { label: 'Str 10', value: 14854 },
      { label: 'Str 15', value: 14616 },
      // { label: '20', value: 12429 },
    ],
    [
      { label: 'Agi 10', value: 14853 },
      { label: 'Agi 15', value: 14618 },
      // { label: '20', value: 12433 },
    ],
    [
      { label: 'Vit 10', value: 14849 },
      { label: 'Vit 15', value: 14617 },
      // { label: '20', value: 12431 },
    ],
    [
      { label: 'Int 10', value: 14852 },
      { label: 'Int 15', value: 14619 },
      // { label: '20', value: 12430 },
    ],
    [
      { label: 'Dex 10', value: 14851 },
      { label: 'Dex 15', value: 14620 },
      // { label: '20', value: 12432 },
    ],
    [
      { label: 'Luk 10', value: 14850 },
      { label: 'Luk 15', value: 14621 },
      // { label: '20', value: 12434 },
    ],
  ];
  aspdPotionList: DropdownModel[] = [
    { label: 'Concentration Potion', value: 645 },
    { label: 'Awakening Potion', value: 656 },
    { label: 'Berserk Potion', value: 657 },
  ];
  aspdPotionList2: DropdownModel[] = [
    { label: 'Enrich Celermine', value: 12437 },
    // { label: 'Guarana Candy', value: 12414 },
  ];

  totalPoints = 0;
  availablePoints = 0;
  groupMonsterList: MonsterSelectItemGroup[] = [];
  monsterList: DropdownModel[] = [];
  selectedMonster = Number(localStorage.getItem('monster')) || 21067;
  minBasicDamage = 0;
  maxBasicDamage = 0;
  minDamage = 0;
  maxDamage = 0;
  dps = 0;
  skillHit = 1;
  minDamagePerHit = 0;
  maxDamagePerHit = 0;
  criDamage = 0;

  isCalculating = false;
  calculator = new Calculator();
  stateCalculator = new BaseStateCalculator();

  possiblyDamages: DropdownModel[];
  itemSummary: any;
  itemSummary2: any;
  modelSummary: any;
  totalSummary: any;

  private equipItemMap = new Map<ItemTypeEnum, number>();
  private equipItemIdItemTypeMap = new Map<ItemTypeEnum, number>();
  equipItems: DropdownModel[] = [];
  itemSlotsMap: Partial<Record<ItemTypeEnum, number>> = {};
  selectedItemDesc = undefined;
  itemId = 0;
  itemBonus = {};
  itemDescription = '';
  hover = '';

  cols: { field: string; header: string; default?: boolean }[] = [];
  selectedColumns: { field: string; header: string }[] = [];
  selectedMonsterIds: number[] = this.getCachedMonsterIdsForCalc();
  calcDamages: any[] = [];

  updateItemSubs: Subscription;
  updateMonsterListSubs: Subscription;

  hiddenMap = { ammu: true, shield: true };

  constructor(
    private roService: RoService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
  ) {}

  ngOnInit() {
    this.initLoadItems();
    this.initCalcTableColumns();
    this.setPresetList();
    this.initData().subscribe(() => {
      this.loadItemSet();
    });

    const itemChanges = new Set<ItemTypeEnum>();
    this.updateItemSubs = this.updateItemEvent
      .pipe(
        tap((itemChange: ItemTypeEnum) => {
          this.isCalculating = true;
          itemChanges.add(itemChange);
        }),
        debounceTime(750),
      )
      .subscribe(() => {
        this.hiddenMap = {
          ammu: !this.calculator.isAllowAmmo(),
          shield: !this.calculator.isAllowShield(),
        };
        if (this.hiddenMap.ammu && this.model.ammo) {
          this.model.ammo = undefined;
          this.onSelectItem('ammo');
          return;
        }
        if (this.hiddenMap.shield && this.model.shield) {
          this.model.shield = undefined;
          this.onSelectItem('shield');
          this.onClearItem('shield');
          return;
        }
        if (itemChanges.has(ItemTypeEnum.weapon)) {
          this.setAmmoDropdownList();
        }
        this.calculate();
        this.saveItemSet();
        this.resetItemDescription();
        this.onSelectItemDescription();
        this.isCalculating = false;
        itemChanges.clear();
      });

    this.updateMonsterListSubs = this.updateMonsterListEvent
      .pipe(
        tap(() => (this.isCalculating = true)),
        debounceTime(1000),
      )
      .subscribe(() => {
        this.calculateToSelectedMonsters(false);
        this.setCacheMonsterIdsForCalc();
        this.isCalculating = false;
      });
  }

  ngOnDestroy(): void {
    const obs = [this.updateItemSubs, this.updateMonsterListSubs];
    for (const ob of obs) {
      ob?.unsubscribe();
    }
  }

  private initData() {
    return forkJoin([
      this.roService.getItems<Record<number, ItemModel>>(),
      this.roService.getMonsters<Record<number, MonsterModel>>(),
    ]).pipe(
      tap(([items, monsters]) => {
        this.items = items;
        this.monsterDataMap = monsters;

        this.calculator.setMasterItems(items);
        this.mapEnchant = new Map(
          Object.values(items)
            .filter((item) => item.itemTypeId === ItemTypeId.CARD)
            .map((item) => {
              return [item.aegisName, item];
            }),
        );
        this.setMonsterDropdownList();
        this.setItemList();
      }),
    );
  }

  private initLoadItems() {
    this.loadBtnItems = [
      {
        label: 'Load',
        // icon: 'pi pi-refresh',
        command: () => {
          this.loadPreset();
        },
      },
      {
        label: 'Update',
        icon: PrimeIcons.SYNC,
        command: () => {
          this.updatePreset(this.selectedPreset);
        },
      },
      {
        label: 'Delete',
        icon: PrimeIcons.TRASH,
        command: () => {
          this.deletePreset();
        },
      },
    ];
  }

  private initCalcTableColumns() {
    this.cols = [
      { field: 'health', header: 'HP', default: true },
      { field: 'monsterClass', header: 'Class' },
      { field: 'minDamage', header: 'SkillMin', default: true },
      { field: 'maxDamage', header: 'SkillMax', default: true },
      { field: 'skillDps', header: 'DPS', default: true },
      { field: 'hitKill', header: 'Hit', default: true },
      { field: 'criRate', header: 'Cri%' },
      { field: 'hitRate', header: 'Hit%' },
      { field: 'pene', header: 'เจาะ' },
      { field: 'basicMinDamage', header: 'BasicMin' },
      { field: 'basicMaxDamage', header: 'BasicMax' },
      { field: 'criMaxDamage', header: 'CriDmg' },
      { field: 'criMaxDamage', header: 'BasicDPS' },
      { field: 'basicCriRate', header: 'BasicCri%' },
    ];
    const availableCols = new Map(this.cols.map((a) => [a.field, a]));

    const cached = this.getCachedBattleColNames()
      .map((col) => availableCols.get(col))
      .filter(Boolean);
    if (cached.length > 0) {
      this.selectedColumns = cached;
      return;
    }

    const defaultCols = [...this.cols.filter((a) => a.default).map((a) => a)];
    this.selectedColumns = defaultCols;
  }

  private calculate() {
    const { activeSkills, passiveSkills, selectedAtkSkill } = this.model;
    const { equipAtks, masteryAtks, skillNames, learnedSkillMap } = this.selectedCharacter.getSkillBonusAndName({
      activeIds: activeSkills,
      passiveIds: passiveSkills,
    });

    const { consumables, consumables2, aspdPotion, aspdPotions } = this.model;
    const usedSupBattlePill = consumables.includes(12792);
    const consumeData = [...consumables, ...consumables2, ...aspdPotions]
      .filter(Boolean)
      .filter((id) => !usedSupBattlePill || (usedSupBattlePill && id !== 12791))
      .map((id) => this.items[id].script);

    const buffs = {};
    const addBuffBonus = (buffKey: string) => {
      if (!this.model[buffKey]) return;

      const { bonus } = this.skillBuffs[buffKey].dropdown.find((a) => a.value === this.model[buffKey]);
      if (!bonus) return;

      buffs[this.skillBuffs[buffKey].name] = bonus;
    };
    Object.keys(this.skillBuffs).forEach(addBuffBonus);

    const calc = this.calculator
      .setModel(this.model)
      .setClass(this.selectedCharacter)
      .setSkillIds({ activeSkillIds: activeSkills, passiveSkillIds: passiveSkills })
      .setEquipAtkSkillAtk(equipAtks)
      .setBuffBonus(buffs)
      .setMasterySkillAtk(masteryAtks)
      .setConsumables(consumeData)
      .setAspdPotion(aspdPotion)
      .setExtraOptions(this.getOptionScripts())
      .setUsedSkillNames(skillNames)
      .setLearnedSkills(learnedSkillMap)
      .prepareAllItemBonus()
      .setMonster(this.monsterDataMap[this.selectedMonster])
      .calcAspd()
      .calcHitRate()
      .calcCriRate();
    const calculated = calc.calculateAllDamages(selectedAtkSkill);
    const { minDamage, maxDamage, basicMaxDamage, basicMinDamage, criMaxDamage, skillHit, skillDps } = calculated;
    this.minBasicDamage = basicMinDamage;
    this.maxBasicDamage = basicMaxDamage;
    this.minDamage = minDamage;
    this.maxDamage = maxDamage;
    this.dps = skillDps;
    this.minDamagePerHit = minDamage / skillHit;
    this.maxDamagePerHit = maxDamage / skillHit;
    this.skillHit = skillHit;
    this.criDamage = criMaxDamage;

    this.totalSummary = calc.getTotalummary();
    const modelSummary = calc.getModelSummary() as any;
    this.modelSummary = { ...modelSummary, rawOptionTxts: modelSummary.rawOptionTxts.filter(Boolean) };
    const x = calc.getItemSummary();
    const splitNumber = Object.keys(x).length / 2;
    const part1 = Object.entries(x).filter((a, index) => {
      return index < splitNumber;
    });
    const part2 = Object.entries(x).filter((a, index) => {
      return index >= splitNumber;
    });
    this.itemSummary = part1.reduce((total, [key, value]) => {
      total[key] = value;
      return total;
    }, {});
    this.itemSummary2 = part2.reduce((total, [key, value]) => {
      total[key] = value;
      return total;
    }, {});
    this.possiblyDamages = calc.getPossiblyDamages().map((a) => ({ label: `${a}`, value: a }));

    this.calculateToSelectedMonsters();
  }

  private getCachedMonsterIdsForCalc() {
    try {
      const ids = JSON.parse(localStorage.getItem('monsterIds'));

      if (!Array.isArray(ids)) return [];

      return ids.map(Number).filter((id) => Number.isInteger(id));
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  private setCacheMonsterIdsForCalc() {
    localStorage.setItem('monsterIds', JSON.stringify(this.selectedMonsterIds));
  }

  private getCachedBattleColNames() {
    try {
      const cached = JSON.parse(localStorage.getItem('battle_cols'));

      if (!Array.isArray(cached)) return [];

      return cached.filter((a) => typeof a === 'string');
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  private setCacheBattleCols() {
    localStorage.setItem('battle_cols', JSON.stringify(this.selectedColumns.map((a) => a.field)));
  }

  calculateToSelectedMonsters(needCalcAll = true) {
    const classMap = ['Normal', 'Champion', 'Boss'];
    const selectedMonsterIds = this.selectedMonsterIds || [];

    if (!needCalcAll) {
      const alreadyCalc = new Set(this.calcDamages.map((a) => a.id));
      const noCalcs = selectedMonsterIds.filter((id) => !alreadyCalc.has(id));
      if (noCalcs.length === 0) {
        this.calcDamages = this.calcDamages.filter((a) => selectedMonsterIds.includes(a.id));
        return;
      }
    }

    this.calcDamages = selectedMonsterIds.map((monsterId) => {
      const monster = this.monsterDataMap[monsterId];
      const calculated = this.calculator
        .setMonster(monster)
        .calcHitRate()
        .calculateAllDamages(this.model.selectedAtkSkill);

      const {
        id,
        name,
        stats: { elementShortName, level, raceName, scaleName, health, class: _class },
      } = monster;

      return {
        id,
        label: `${level} ${name} (${raceName} ${scaleName.at(0)})`,
        health,
        monsterClass: classMap[_class],
        elementName: elementShortName,
        ...calculated,
      };
    });
  }

  private cloneModel(baseModel: any): any {
    return Object.entries(baseModel).reduce((m, [key, val]) => {
      m[key] = Array.isArray(val) ? [] : val;

      return m;
    }, {});
  }

  private resetModel() {
    const { class: _class, level, jobLevel } = this.model;
    this.model = { ...this.cloneModel(this.emptyModel), class: _class, level, jobLevel };
  }

  private getPresetList(): DropdownModel[] {
    const presets = JSON.parse(localStorage.getItem('presets') || '[]') || [];

    return Array.isArray(presets) ? presets : [];
  }

  private savePresetList(presets?: DropdownModel[]): void {
    localStorage.setItem('presets', JSON.stringify(presets || this.preSets));
  }

  private setPresetList() {
    this.preSets = this.getPresetList();
  }

  private isMainItem(itemType: string) {
    return MainItemTypeSet.has(itemType as any);
  }

  updatePreset(name: string) {
    const currentPresets = this.getPresetList();
    const currentPreset = currentPresets.find((a) => a.value === name);
    if (currentPreset) {
      this.confirmationService.confirm({
        message: `Update "${name}" ?`,
        header: 'Confirmation',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          this.isInProcessingPreset = true;
          waitRxjs(0.1)
            .pipe(
              mergeMap(() => {
                currentPreset['model'] = this.model;
                this.savePresetList(currentPresets);
                this.setPresetList();
                return waitRxjs(0.5);
              }),
              take(1),
              finalize(() => {
                this.messageService.add({
                  severity: 'info',
                  summary: 'Confirmed',
                  detail: `"${name}" was updated.`,
                });
                this.isInProcessingPreset = false;
              }),
            )
            .subscribe();
        },
        reject: (type) => {
          // switch (type as ConfirmEventType) {
          //   case ConfirmEventType.REJECT:
          //     this.messageService.add({
          //       severity: 'error',
          //       summary: 'Rejected',
          //       detail: 'You have rejected',
          //     });
          //     break;
          //   default:
          //     this.messageService.add({
          //       severity: 'warn',
          //       summary: 'Cancelled',
          //       detail: 'You have cancelled',
          //     });
          //     break;
          // }
          this.isInProcessingPreset = false;
        },
      });
    } else {
      this.isInProcessingPreset = true;
      wait(0.5)
        .then(() => {
          currentPresets.push({
            label: name,
            value: name,
            model: this.model,
          });
          this.savePresetList(currentPresets);
          this.setPresetList();

          this.messageService.add({
            severity: 'success',
            summary: 'Confirmed',
            detail: `"${name}" was added.`,
          });
        })
        .finally(() => (this.isInProcessingPreset = false));
    }
  }

  loadPreset() {
    const selected = this.getPresetList().find((a) => a.value === this.selectedPreset);
    if (selected?.['model']) {
      this.confirmationService.confirm({
        message: `Load "${this.selectedPreset}" ?`,
        header: 'Confirmation',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          this.isInProcessingPreset = true;
          waitRxjs()
            .pipe(
              mergeMap(() => {
                this.setModelByJSONString(selected['model']);
                return waitRxjs();
              }),
              mergeMap(() => {
                this.loadItemSet(true);
                return waitRxjs(1);
              }),
              take(1),
              finalize(() => {
                this.messageService.add({
                  severity: 'info',
                  summary: 'Confirmed',
                  detail: `"${this.selectedPreset}" was loaded.`,
                });
                this.isInProcessingPreset = false;
              }),
            )
            .subscribe();
        },
        reject: (type) => {
          this.isInProcessingPreset = false;
        },
      });
    }
  }

  deletePreset() {
    this.confirmationService.confirm({
      message: `Delete "${this.selectedPreset}" ?`,
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.isInProcessingPreset = true;

        waitRxjs(0.2)
          .pipe(
            tap(() => {
              const preSets = this.getPresetList();
              const removedSets = preSets.filter((a) => a.value !== this.selectedPreset);
              this.savePresetList(removedSets);
            }),
            delay(200),
            tap(() => this.setPresetList()),
            finalize(() => {
              this.messageService.add({
                severity: 'error',
                summary: `"${this.selectedPreset}" was deleted`,
              });
              this.selectedPreset = '';
              this.isInProcessingPreset = false;
            }),
          )
          .subscribe();

        this.isInProcessingPreset = false;
      },
      reject: (type) => {
        this.isInProcessingPreset = false;
      },
    });
  }

  private setModelByJSONString(savedModel: string | any) {
    const savedData = typeof savedModel === 'string' ? JSON.parse(savedModel || '{}') : savedModel;
    const model = this.cloneModel(this.emptyModel);
    if (!savedData) {
      this.model = model;
      return;
    }

    for (const [key, initialValue] of Object.entries(this.emptyModel)) {
      const isAttrArray = Array.isArray(initialValue);

      const savedValue = savedData[key];
      const validValue = isAttrArray ? (Array.isArray(savedValue) ? savedValue : []) : savedValue ?? initialValue;
      model[key] = validValue;
    }
    this.model = model;
    // console.log('model', { ...model });
  }

  loadItemSet(fromCurrentModel = false) {
    this.isInProcessingPreset = true;

    let str = '';
    if (!fromCurrentModel) {
      str = localStorage.getItem('ro-set');
      this.setModelByJSONString(str);
    }
    this.model.selectedAtkSkill = this.model.selectedAtkSkill || this.atkSkills[0]?.value;

    this.setClassInstant();
    this.setSkillModelArray();
    this.setJobBonus();

    return waitRxjs()
      .pipe(
        take(1),
        mergeMap(() => {
          this.setClassSkill();
          this.setDefaultSkill();
          this.setItemDropdownList();
          return waitRxjs();
        }),
        mergeMap(() => {
          try {
            if (str || fromCurrentModel) {
              for (const itemType of Object.keys(mapRelatedItem) as ItemTypeEnum[]) {
                const refine = this.model[`${itemType}Refine`];
                const itemId = this.model[itemType];
                this.onSelectItem(itemType, itemId, refine);
                // console.log('Set Main Item', { itemType, itemId, refine });
                for (const relatedItemType of mapRelatedItem[itemType] ?? []) {
                  this.onSelectItem(relatedItemType, this.model[relatedItemType], refine);
                }
              }
              this.onBaseStatusChange();
            }
          } catch (error) {
            console.error(error);
          }

          return waitRxjs(1);
        }),
        finalize(() => {
          this.isInProcessingPreset = false;
          if (fromCurrentModel) {
            this.messageService.add({
              severity: 'success',
              summary: 'Loaded',
            });
          }
        }),
      )
      .subscribe();
  }

  saveItemSet() {
    localStorage.setItem('ro-set', JSON.stringify(this.model));
  }

  private resetItemDescription() {
    const equipItemTypes: string[] = [];
    const map = new Map<ItemTypeEnum, number>();
    for (const [itemType, itemId] of this.equipItemMap.entries()) {
      if (itemId) {
        equipItemTypes.push(itemType);
        // map.set(`${itemType}-${itemId}`, itemType);
        map.set(itemType, itemId);
      }
    }

    this.equipItemIdItemTypeMap = map;

    if (!equipItemTypes.includes(this.selectedItemDesc)) {
      this.selectedItemDesc = undefined;
    }
    this.equipItems = [...this.equipItemIdItemTypeMap.entries()].map(([itemType, id]) => {
      return {
        label: this.items[id].name,
        value: itemType,
        id,
      };
    });
  }

  private setClassInstant() {
    const c = Characters.find((a) => a.value === this.model.class)?.['instant'] as CharacterBase;
    this.selectedCharacter = c || Characters[0]['instant'];
  }

  private setClassSkill() {
    this.activeSkills = this.selectedCharacter.activeSkills;
    this.passiveSkills = this.selectedCharacter.passiveSkills;
    this.atkSkills = this.selectedCharacter.atkSkills;
  }

  private setDefaultSkill() {
    const defaultAtkSkill = this.atkSkills[0].value;
    const selectedValidSkill = this.atkSkills.every((a) => a.value !== this.model.selectedAtkSkill);

    if (!this.model.selectedAtkSkill || selectedValidSkill) {
      this.model.selectedAtkSkill = defaultAtkSkill;
    }
  }

  private setSkillModelArray() {
    const { activeSkills, passiveSkills } = this.selectedCharacter;
    this.model.activeSkills = activeSkills.map((skill, i) => {
      const savedVal = this.model.activeSkills[i];
      const found = skill.dropdown.find((a) => a.value === savedVal);

      return found ? savedVal : 0;
    });
    this.model.passiveSkills = passiveSkills.map((skill, i) => {
      const savedVal = this.model.passiveSkills[i];
      const found = skill.dropdown.find((a) => a.value === savedVal);

      return found ? savedVal : 0;
    });
  }

  setJobBonus() {
    const { str, agi, vit, int, dex, luk } = this.selectedCharacter.getJobBonusStatus(this.model.jobLevel);
    this.model.jobStr = str;
    this.model.jobAgi = agi;
    this.model.jobVit = vit;
    this.model.jobInt = int;
    this.model.jobDex = dex;
    this.model.jobLuk = luk;
  }

  private setMonsterDropdownList() {
    const groupMap = new Map<string, MonsterSelectItemGroup>();
    const monsters: DropdownModel[] = [];

    for (const mon of Object.values(this.monsterDataMap)) {
      const { id, name, spawn, stats } = mon;
      const { level, elementShortName, raceName, scaleName } = stats;

      const spawnMap = getMonsterSpawnMap(spawn);
      const group = groupMap.get(spawnMap);
      const monster: DropdownModel = {
        label: `${level} ${name} (${raceName} ${scaleName.at(0)})`,
        value: id,
        elementName: elementShortName,
        searchVal: spawnMap,
      };

      monsters.push(monster);

      if (group) {
        group.items.push(monster);
      } else {
        groupMap.set(spawnMap, {
          label: spawnMap,
          items: [monster],
        });
      }
    }

    this.monsterList = monsters;
    this.groupMonsterList = [...groupMap.values()].sort((a, b) => {
      return a.label > b.label ? 1 : -1;
    });
  }

  private setItemList() {
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

    this.itemList.weaponList = toDropdownList(weaponList, 'name', 'id');
    this.itemList.weaponCardList = toDropdownList(weaponCardList, 'name', 'id');
    this.itemList.ammoList = toDropdownList(ammoList, 'name', 'id', 'propertyAtk');
    this.itemList.headUpperList = toDropdownList(headUpperList, 'name', 'id');
    this.itemList.headMiddleList = toDropdownList(headMiddleList, 'name', 'id');
    this.itemList.headLowerList = toDropdownList(headLowerList, 'name', 'id');
    this.itemList.headCardList = toDropdownList(headCardList, 'name', 'id');
    this.itemList.armorList = toDropdownList(armorList, 'name', 'id');
    this.itemList.armorCardList = toDropdownList(armorCardList, 'name', 'id');
    this.itemList.shieldList = toDropdownList(shieldList, 'name', 'id');
    this.itemList.shieldCardList = toDropdownList(shieldCardList, 'name', 'id');
    this.itemList.garmentList = toDropdownList(garmentList, 'name', 'id');
    this.itemList.garmentCardList = toDropdownList(garmentCardList, 'name', 'id');
    this.itemList.bootList = toDropdownList(bootList, 'name', 'id');
    this.itemList.bootCardList = toDropdownList(bootCardList, 'name', 'id');
    this.itemList.accLeftList = toDropdownList(accLeftList, 'name', 'id');
    this.itemList.accLeftCardList = toDropdownList(accLeftCardList, 'name', 'id');
    this.itemList.accRightList = toDropdownList(accRightList, 'name', 'id');
    this.itemList.accRightCardList = toDropdownList(accRightCardList, 'name', 'id');
    this.itemList.petList = petList.map((a) => ({ label: a.name, value: a.id }));

    this.itemList.costumeEnhUpperList = toDropdownList(costumeEnhUpperList, 'name', 'id');
    this.itemList.costumeEnhMiddleList = toDropdownList(costumeEnhMiddleList, 'name', 'id');
    this.itemList.costumeEnhLowerList = toDropdownList(costumeEnhLowerList, 'name', 'id');
    this.itemList.costumeEnhGarmentList = toDropdownList(costumeEnhGarmentList, 'name', 'id');

    this.itemList.shadowArmorList = toDropdownList(shadowArmorList, 'name', 'id');
    this.itemList.shadowShieldList = toDropdownList(shadowShieldList, 'name', 'id');
    this.itemList.shadowBootList = toDropdownList(shadowBootList, 'name', 'id');
    this.itemList.shadowEarningList = toDropdownList(shadowEarningList, 'name', 'id');
    this.itemList.shadowPendantList = toDropdownList(shadowPendantList, 'name', 'id');
    this.itemList.shadowWeaponList = toDropdownList(shadowWeaponList, 'name', 'id');

    this.consumableList = toDropdownList(consumableList, 'name', 'id');
  }

  private setItemDropdownList() {
    const classNameSet = this.selectedCharacter.classNameSet;
    const onlyMe = (a: DropdownModel) => {
      if (Array.isArray(a.usableClass)) {
        return a.usableClass.some((x) => classNameSet.has(x));
      }

      return true;
    };

    this.weaponList = this.itemList.weaponList.filter(onlyMe);
    this.weaponCardList = this.itemList.weaponCardList.filter(onlyMe);
    // this.ammoList = this.itemList.ammoList.filter(onlyMe);
    this.headUpperList = this.itemList.headUpperList.filter(onlyMe);
    this.headMiddleList = this.itemList.headMiddleList.filter(onlyMe);
    this.headLowerList = this.itemList.headLowerList.filter(onlyMe);
    this.headCardList = this.itemList.headCardList.filter(onlyMe);
    this.armorList = this.itemList.armorList.filter(onlyMe);
    this.armorCardList = this.itemList.armorCardList.filter(onlyMe);
    this.shieldList = this.itemList.shieldList.filter(onlyMe);
    this.shieldCardList = this.itemList.shieldCardList.filter(onlyMe);
    this.garmentList = this.itemList.garmentList.filter(onlyMe);
    this.garmentCardList = this.itemList.garmentCardList.filter(onlyMe);
    this.bootList = this.itemList.bootList.filter(onlyMe);
    this.bootCardList = this.itemList.bootCardList.filter(onlyMe);
    this.accLeftList = this.itemList.accLeftList.filter(onlyMe);
    this.accLeftCardList = this.itemList.accLeftCardList.filter(onlyMe);
    this.accRightList = this.itemList.accRightList.filter(onlyMe);
    this.accRightCardList = this.itemList.accRightCardList.filter(onlyMe);
    this.petList = this.itemList.petList.filter(onlyMe);

    this.costumeEnhUpperList = this.itemList.costumeEnhUpperList.filter(onlyMe);
    this.costumeEnhMiddleList = this.itemList.costumeEnhMiddleList.filter(onlyMe);
    this.costumeEnhLowerList = this.itemList.costumeEnhLowerList.filter(onlyMe);
    this.costumeEnhGarmentList = this.itemList.costumeEnhGarmentList.filter(onlyMe);

    this.shadowArmorList = this.itemList.shadowArmorList.filter(onlyMe);
    this.shadowShieldList = this.itemList.shadowShieldList.filter(onlyMe);
    this.shadowBootList = this.itemList.shadowBootList.filter(onlyMe);
    this.shadowEarningList = this.itemList.shadowEarningList.filter(onlyMe);
    this.shadowPendantList = this.itemList.shadowPendantList.filter(onlyMe);
    this.shadowWeaponList = this.itemList.shadowWeaponList.filter(onlyMe);
  }

  private setAmmoDropdownList() {
    const myAmmoId = this.calculator.getAmmuSubTypeId();
    const onlyMyAmmo = (a: DropdownModel) => {
      return this.items[a.value]?.itemSubTypeId === myAmmoId;
    };

    this.ammoList = this.itemList.ammoList.filter(onlyMyAmmo);
  }

  private getOptionScripts() {
    return this.model.rawOptionTxts
      .map((a) => {
        if (typeof a !== 'string' || a === '') return '';

        const [, attr, value] = a.match(/(.+):(\d+)/) ?? [];
        if (attr) {
          return { [attr]: Number(value) };
        }

        return '';
      })
      .filter(Boolean);
  }

  private setEnchantList(mainItemId: number, positionEnum?: ItemTypeEnum | string) {
    // console.log({ itemId });
    let { itemTypeId, itemSubTypeId, location, aegisName, name } = this.items[mainItemId] ?? ({} as ItemModel);
    const enchants = getEnchants(aegisName) ?? getEnchants(name);

    const [_, e2, e3, e4] = Array.isArray(enchants) ? enchants : [];
    // console.log({ itemId, e2, e3, e4 });
    const clearModel = (prefix) => {
      for (const idx of [1, 2, 3]) {
        const enchantList = this[`${prefix}Enchant${idx}List`] as DropdownModel[];
        const itemType = `${prefix}Enchant${idx}` as ItemTypeEnum;
        const itemId = this.model[itemType];
        if (itemId && !enchantList.find((a) => a.value === itemId)) {
          this.model[itemType] = undefined;
          this.calculator.setItem(itemType, null);
          this.equipItemMap.set(itemType, null);
        }
      }
    };

    if (itemTypeId === ItemTypeId.WEAPON) {
      this.weaponEnchant1List = (e2 ?? [])
        .map((a: any) => this.mapEnchant.get(a))
        .map((a: any) => ({ label: a.name, value: a.id }));
      this.weaponEnchant2List = (e3 ?? [])
        .map((a: any) => this.mapEnchant.get(a))
        .map((a: any) => ({ label: a.name, value: a.id }));
      this.weaponEnchant3List = (e4 ?? [])
        .map((a: any) => this.mapEnchant.get(a))
        .map((a: any) => ({ label: a.name, value: a.id }));
      clearModel('weapon');

      return;
    }

    if (itemSubTypeId === ItemSubTypeId.Acc && positionEnum) {
      if (positionEnum === ItemTypeEnum.accLeft) {
        itemSubTypeId = ItemSubTypeId.Acc_L;
      } else if (positionEnum === ItemTypeEnum.accRight) {
        itemSubTypeId = ItemSubTypeId.Acc_R;
      }
    }

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

  private updateAvailablePoints() {
    const { str, agi, vit, int, dex, luk } = this.model;
    const mainStatuses = [str, agi, vit, int, dex, luk];
    const { availablePoint } = this.stateCalculator
      .setLevel(this.model.level)
      .setClass(this.selectedCharacter)
      .setMainStatusLevels(mainStatuses)
      .calculate().summary;
    this.availablePoints = availablePoint;
  }

  private clearCard(itemType: string) {
    const slots = this.itemSlotsMap[itemType];
    const cardTypeName = `${itemType}Card` as ItemTypeEnum;
    const seletedCard = this.model[cardTypeName];

    if ((!slots || slots < 1) && seletedCard) {
      this.model[cardTypeName] = undefined;
      this.equipItemMap.set(cardTypeName, undefined);
    }
  }

  onSelectItem(itemType: string, itemId = 0, refine = 0) {
    this.equipItemMap.set(itemType as ItemTypeEnum, itemId);

    if (this.isMainItem(itemType)) {
      this.itemSlotsMap[itemType] = this.items[itemId]?.slots || 0;
      this.setEnchantList(itemId, itemType);
      this.clearCard(itemType);
    }

    // console.log({ itemType, itemId, refine });
    if (itemType === ItemTypeEnum.weapon) {
      this.calculator.setWeapon(itemId, refine);
    } else {
      this.calculator.setItem(itemType as ItemTypeEnum, itemId, refine);
    }

    this.updateItemEvent.next(itemType);
  }

  onClearItem(itemType: string) {
    if (this.model[`${itemType}Refine`] > 0) {
      this.model[`${itemType}Refine`] = 0;
    }

    if (itemType === ItemTypeEnum.weapon) {
      this.model.propertyAtk = undefined;
      this.model.ammo = undefined;
      this.model.rawOptionTxts[0] = undefined;
      this.model.rawOptionTxts[1] = undefined;
    }

    const relatedItems = mapRelatedItem[itemType as ItemTypeEnum] || [];
    for (const _itemType of relatedItems) {
      if (this.model[_itemType]) {
        this.model[_itemType] = undefined;
        this.onSelectItem(_itemType);
      }
    }

    this.updateItemEvent.next(itemType);
  }

  onJobLevelChange() {
    this.setJobBonus();
    this.updateItemEvent.next(1);
  }

  onBaseStatusChange() {
    this.updateAvailablePoints();
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
    localStorage.setItem('monster', this.selectedMonster.toString());
    this.updateItemEvent.next(1);
  }

  onSelectItemDescription() {
    const selectedType = this.selectedItemDesc;
    const itemId = this.equipItemIdItemTypeMap.get(selectedType);
    // const script = this.items[selectedId]?.script ?? {};
    const bonus = this.itemSummary?.[selectedType] || this.itemSummary2?.[selectedType] || {};

    this.itemId = itemId; //{ script, bonus };
    this.itemBonus = bonus; //{ script, bonus };
    this.itemDescription = this.items[itemId]?.description
      .replaceAll('\n', '<br>')
      .replace(/\^(.{6})/g, '<font color="#$1">');
  }

  onLog() {
    this.updateItemEvent.next(1);
  }

  onOptionChange() {
    this.updateItemEvent.next(1);
  }

  onClassChange(isChangeByInput = true) {
    if (isChangeByInput) {
      this.isInProcessingPreset = true;

      waitRxjs()
        .pipe(
          mergeMap(() => {
            this.resetModel();
            return waitRxjs();
          }),
          mergeMap(() => {
            this.setClassInstant();
            this.calculator = new Calculator();
            this.calculator.setMasterItems(this.items);

            this.updateAvailablePoints();
            this.equipItemMap.clear();
            this.resetItemDescription();

            this.setJobBonus();
            return waitRxjs();
          }),
          mergeMap(() => {
            this.setClassSkill();
            this.setDefaultSkill();
            return waitRxjs();
          }),
          mergeMap(() => {
            this.setSkillModelArray();
            return waitRxjs();
          }),
          mergeMap(() => {
            this.setItemDropdownList();
            this.setAmmoDropdownList();
            return waitRxjs(0.5);
          }),
          take(1),
          finalize(() => (this.isInProcessingPreset = false)),
        )
        .subscribe(() => this.updateItemEvent.next(1));
    }
  }

  onAtkSkillChange() {
    this.updateItemEvent.next(1);
  }

  onPropertyAtkChange() {
    this.updateItemEvent.next(1);
  }

  onMonsterListChange() {
    this.updateMonsterListEvent.next(1);
  }

  onSelectedColChange() {
    this.setCacheBattleCols();
  }
}
