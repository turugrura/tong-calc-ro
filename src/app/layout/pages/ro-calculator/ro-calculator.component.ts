import { Component, OnDestroy, OnInit } from '@angular/core';
import { ConfirmationService, MenuItem, MessageService, PrimeIcons, SelectItemGroup } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Observable, Subject, Subscription, catchError, debounceTime, filter, finalize, forkJoin, mergeMap, of, switchMap, take, tap, throwError } from 'rxjs';
import { AuthService, PresetModel, PresetService } from 'src/app/api-services';
import { RoService } from 'src/app/api-services/ro.service';
import { AllowedCompareItemTypes } from 'src/app/app-config';
import { ToErrorDetail } from 'src/app/app-errors';
import {
  AllowLeftWeaponMapper,
  AspdPotionList,
  AspdPotionList2,
  CardPosition,
  ElementConverterList,
  ElementType,
  EnchantTable,
  ExtraOptionTable,
  FoodStatList,
  HeadGearLocation,
  ItemOptionNumber,
  ItemOptionTable,
  ItemSubTypeId,
  ItemTypeEnum,
  ItemTypeId,
  JobBuffs,
  MAX_OPTION_NUMBER,
  MainItemWithRelations,
  RaceType,
  WeaponTypeName,
  WeaponTypeNameMapBySubTypeId,
  getMonsterSpawnMap,
} from 'src/app/constants';
import { ActiveSkillModel, AtkSkillModel, CharacterBase, ClassID, ClassIcon, ClassName, JobPromotionMapper, PassiveSkillModel } from 'src/app/jobs';
import {
  createBaseHPSPOptionList,
  createExtraOptionList,
  createMainModel,
  createMainStatOptionList,
  createNumberDropdownList,
  isNumber,
  prettyItemDesc,
  sortObj,
  toDropdownList,
  toRawOptionTxtList,
  toUpsertPresetModel,
  verifySyncPreset,
  waitRxjs,
} from 'src/app/utils';
import { environment } from 'src/environments/environment';
import { getClassDropdownList } from '../../../jobs/_class-list';
import { ChanceModel } from '../../../models/chance-model';
import { BasicDamageSummaryModel, SkillDamageSummaryModel } from '../../../models/damage-summary.model';
import { DropdownModel, ItemDropdownModel } from '../../../models/dropdown.model';
import { HpSpTable } from '../../../models/hp-sp-table.model';
import { ItemListModel } from '../../../models/item-list.model';
import { ItemModel } from '../../../models/item.model';
import { MonsterModel } from '../../../models/monster.model';
import { BaseStateCalculator } from './base-state-calculator';
import { Calculator } from './calculator';
import { MonsterDataViewComponent } from './monster-data-view/monster-data-view.component';
import { PresetTableComponent } from './preset-table/preset-table.component';

interface MonsterSelectItemGroup extends SelectItemGroup {
  items: any[];
}

const Characters = getClassDropdownList();

interface ClassModel extends Partial<Record<ItemTypeEnum, number>> {
  rawOptionTxts: string[];
  weaponGrade?: any;
  leftWeaponGrade?: any;
  shieldGrade?: any;
  headUpperGrade?: any;
  headMiddleGrade?: any;
  headLowerGrade?: any;
  armorGrade?: any;
  garmentGrade?: any;
  bootGrade?: any;
  accLeftGrade?: any;
  accRightGrade?: any;
}

interface ElementDataModel {
  name: string;
  physicalElementToMonster: number;
  magicalElementToMonster: number;
  myElement: number;
}
interface RaceDataModel {
  name: string;
  physical: number;
  magical: number;
}
interface SkillMultiplierModel {
  name: string;
  value: number;
  cd: string;
}

const elements = Object.values(ElementType).map((a) => [a, a.toLowerCase()]);
const races = Object.values(RaceType).map((a) => [a, a.toLowerCase()]);
const sizes = [
  ['Small', 's'],
  ['Medium', 'm'],
  ['Large', 'l'],
];
const monsterTypes = [
  ['Boss', 'boss'],
  ['Normal', 'normal'],
];

const HideHpSp = {
  [ClassName.SpiritHandler]: environment.production,
  [ClassName.HyperNovice]: environment.production,
  [ClassName.NightWatch]: environment.production,
  [ClassName.Shinkiro]: environment.production,
  [ClassName.Shiranui]: environment.production,
  [ClassName.SoulAscetic]: environment.production,
  [ClassName.SkyEmperor]: environment.production,
};

@Component({
  selector: 'app-ro-calculator',
  templateUrl: './ro-calculator.component.html',
  styleUrls: ['./ro-calculator.component.css'],
  providers: [ConfirmationService, MessageService, DialogService],
  standalone: false
})
export class RoCalculatorComponent implements OnInit, OnDestroy {
  updateItemEvent = new Subject();
  updateMonsterListEvent = new Subject();
  updateCompareEvent = new Subject();
  updateChanceEvent = new Subject();
  isCalculatingEvent = new Subject();

  loadBtnItems: MenuItem[];
  monsterDataMap: Record<number, MonsterModel> = {};
  hpSpTable: HpSpTable;
  items!: Record<number, ItemModel>;
  mapEnchant!: Map<string, ItemModel>;
  enchants: DropdownModel[] = [];
  skillBuffs = JobBuffs;
  canPromote = false;

  preSets: (DropdownModel & { icon: string; })[] = [];
  selectedPreset = undefined;
  isInProcessingPreset = false;

  env = environment;
  model = createMainModel();
  private emptyModel = createMainModel();
  model2: ClassModel = { rawOptionTxts: [] };

  basicOptions = createMainStatOptionList();
  baseHpOptions = createBaseHPSPOptionList('BaseHP') as any;
  baseSpOptions = createBaseHPSPOptionList('BaseSP') as any;
  refineList = createNumberDropdownList({ from: 0, to: 18 });
  shadowRefineList = createNumberDropdownList({ from: 0, to: 10 });
  mainStatusList = createNumberDropdownList({ from: 1, to: 130 });
  traitStatusList = createNumberDropdownList({ from: 0, to: 110 });
  levelList = [];
  jobList = [];
  propertyAtkList = ElementConverterList;

  optionList: any[] = createExtraOptionList();
  itemList: ItemListModel = {} as any;

  weaponList: DropdownModel[] = [];
  leftWeaponList: DropdownModel[] = [];
  weaponCardList: DropdownModel[] = [];
  weaponEnchant0List: DropdownModel[] = [];
  weaponEnchant1List: DropdownModel[] = [];
  weaponEnchant2List: DropdownModel[] = [];
  weaponEnchant3List: DropdownModel[] = [];
  leftWeaponEnchant0List: DropdownModel[] = [];
  leftWeaponEnchant1List: DropdownModel[] = [];
  leftWeaponEnchant2List: DropdownModel[] = [];
  leftWeaponEnchant3List: DropdownModel[] = [];
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
  accList: DropdownModel[] = [];
  accCardList: DropdownModel[] = [];
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

  costumeUpperList: DropdownModel[] = [];
  costumeMiddleList: DropdownModel[] = [];
  costumeLowerList: DropdownModel[] = [];
  costumeGarmentList: DropdownModel[] = [];

  costumeEnhUpperList: DropdownModel[] = [];
  costumeEnhMiddleList: DropdownModel[] = [];
  costumeEnhLowerList: DropdownModel[] = [];
  costumeEnhGarmentList: DropdownModel[] = [];
  costumeEnhGarment2List: DropdownModel[] = [];
  costumeEnhGarment4List: DropdownModel[] = [];

  shadowWeaponList: DropdownModel[] = [];
  shadowArmorList: DropdownModel[] = [];
  shadowShieldList: DropdownModel[] = [];
  shadowBootList: DropdownModel[] = [];
  shadowEarringList: DropdownModel[] = [];
  shadowPendantList: DropdownModel[] = [];

  characterList = Characters;
  selectedCharacter: CharacterBase;
  isShowSelectableSkillLevel = true;
  atkSkills: AtkSkillModel[] = [];
  atkSkillCascades: any[] = [];
  passiveSkills: PassiveSkillModel[] = [];
  activeSkills: ActiveSkillModel[] = [];
  consumableList: DropdownModel[] = [];
  consumableList2: DropdownModel[][] = FoodStatList;
  aspdPotionList: DropdownModel[] = [];
  aspdPotionList2: DropdownModel[] = AspdPotionList2;

  totalPoints = 0;
  availablePoints = 0;
  appropriateLevel = 0;

  isAllowTraitStat = false;
  totalTraitPoints = 0;
  availableTraitPoints = 0;
  appropriateLevelForTrait = 0;

  groupMonsterList: MonsterSelectItemGroup[] = [];
  monsterList: DropdownModel[] = [];
  selectedMonsterName = '';
  selectedMonster = Number(localStorage.getItem('monster')) || 21067;
  isShowMonsterEle = false;
  allSelectedMonsterIds: number[];

  chanceList = [] as ChanceModel[];
  selectedChances = [] as string[];

  isCalculating = false;
  private calculator = new Calculator();
  private calculator2 = new Calculator();
  private stateCalculator = new BaseStateCalculator();

  possiblyDamages: DropdownModel[];
  itemSummary: any;
  itemSummary2: any;
  modelSummary: any;
  totalSummary: any;

  elementTable: ElementDataModel[];
  raceTable: RaceDataModel[];
  peneRaceTable: RaceDataModel[];
  sizeTable: RaceDataModel[];
  classTable: RaceDataModel[];
  atkTypeTable: any[];
  peneClassTable: RaceDataModel[];
  skillMultiplierTable: SkillMultiplierModel[];

  /**
   * Model 2
   */
  totalSummary2: any;
  compareItemSummaryModel: any;
  selectedCompareItemDesc: ItemTypeEnum;
  private equipCompareItemIdItemTypeMap = new Map<ItemTypeEnum, number>();
  equipCompareItems: DropdownModel[] = [];

  private equipItemMap = new Map<ItemTypeEnum, number>();
  private equipItemIdItemTypeMap = new Map<ItemTypeEnum, number>();
  equipItems: DropdownModel[] = [];
  itemSlotsMap: Partial<Record<ItemTypeEnum, number>> = {};
  selectedItemDesc: ItemTypeEnum;
  itemId = 0;
  itemBonus = {};
  itemDescription = '';

  itemOptionNumber = ItemOptionNumber;

  cols: {
    field: keyof BasicDamageSummaryModel | keyof SkillDamageSummaryModel | 'health' | 'monsterClass';
    header: string;
    default?: boolean;
  }[] = [];
  selectedColumns: { field: string; header: string; }[] = [];
  selectedMonsterIds: number[] = this.getCachedMonsterIdsForCalc();
  calcDamages: any[] = [];

  private allSubs: Subscription[] = [];

  hiddenMap = { ammu: true, shield: true };
  isAllowLeftWeaponByClass = false;
  showLeftWeapon = false;
  isWeaponCanGrade = false;

  isEnableCompare = false;
  showCompareItemMap = {} as any;
  compareItemNames = [] as ItemTypeEnum[];
  compareItemList: (keyof typeof ItemTypeEnum)[] = [...AllowedCompareItemTypes];

  ref: DynamicDialogRef | undefined;
  monsterRef: DynamicDialogRef | undefined;
  // hideBasicAtk = this.layoutService.config.hideBasicAtk;
  hideBasicAtk = false;
  readonly hideHpSp = HideHpSp;

  equipableItems: (DropdownModel & { id: number; position: string; })[] = [];
  offensiveSkills: DropdownModel[] = [];

  onClassChangedSubject = new Subject<boolean>();
  onClassChanged$ = this.onClassChangedSubject.asObservable();

  isLoggedIn = false;

  constructor(
    private roService: RoService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private dialogService: DialogService,
    // private readonly layoutService: LayoutService,
    private readonly authService: AuthService,
    private readonly presetService: PresetService,
  ) { }

  ngOnInit() {
    this.initLoadItemsBtn();
    this.initCalcTableColumns();
    this.initData()
      .pipe(
        switchMap(() => this.loadItemSet(localStorage.getItem('ro-set'))),
        tap(() => {
          const ob = this.authService.loggedInEvent$.subscribe((isLoggedIn) => {
            this.isLoggedIn = isLoggedIn;
            console.log({ isLoggedIn });
            if (isLoggedIn) {
              this.confirmSync();
              this.setPresetList();
            } else {
              this.setPresetList();
              this.selectedPreset = undefined;
            }
          });
          this.allSubs.push(ob);
        }),
      )
      .subscribe(() => {
        //
      });

    // const laySub = this.layoutService.configUpdate$.pipe(debounceTime(300)).subscribe((c) => {
    //   this.hideBasicAtk = c.hideBasicAtk;
    // });
    // this.allSubs.push(laySub);

    const isCalcSubs = this.isCalculatingEvent.pipe(debounceTime(100)).subscribe(() => (this.isCalculating = false));
    this.allSubs.push(isCalcSubs);

    const itemChanges = new Set<ItemTypeEnum>();
    // let n = 0;
    const updateItemSubs = this.updateItemEvent
      .pipe(
        tap((itemChange: ItemTypeEnum) => {
          this.isCalculating = true;
          // console.log('updateItemSubs ', ++n);
          itemChanges.add(itemChange);
        }),
        debounceTime(250),
      )
      .subscribe(() => {
        this.hiddenMap = {
          ammu: !this.calculator.isAllowAmmo(),
          shield: !this.calculator.isAllowShield(),
        };
        if (this.hiddenMap.ammu && this.model.ammo) {
          this.model.ammo = undefined;
          this.onSelectItem(ItemTypeEnum.ammo);
          return;
        }
        if (this.hiddenMap.shield && this.model.shield) {
          this.model.shield = undefined;
          this.onSelectItem(ItemTypeEnum.shield);
          this.onClearItem(ItemTypeEnum.shield);
          return;
        }

        this.showLeftWeapon = this.isAllowLeftWeaponByClass && !this.hiddenMap.shield;
        if (this.model.leftWeapon && !this.showLeftWeapon) {
          this.model.leftWeapon = undefined;
          this.onSelectItem(ItemTypeEnum.leftWeapon);
          this.onClearItem(ItemTypeEnum.leftWeapon);
          return;
        }

        if (itemChanges.has(ItemTypeEnum.weapon)) {
          this.setAmmoDropdownList();
        }
        this.calculate();
        this.calcCompare();
        this.saveCurrentStateItemset();
        this.resetItemDescription();
        this.onSelectItemDescription(Boolean(this.selectedCompareItemDesc));
        this.setRaceTable();
        this.setElementTable();
        this.setSizeTable();
        this.setMonsterTypeTable();
        this.setAtkTypeTable();
        this.setSkillTable();

        this.chanceList = this.calculator.chanceList;
        const fixedSelectedChances = this.chanceList
          .filter(({ name }) => {
            return this.selectedChances.includes(name);
          })
          .map(({ name }) => name);
        this.selectedChances = fixedSelectedChances;

        this.isCalculatingEvent.next(false);
        itemChanges.clear();
      });
    this.allSubs.push(updateItemSubs);

    const updateMonsterListSubs = this.updateMonsterListEvent
      .pipe(
        tap(() => (this.isCalculating = true)),
        debounceTime(250),
      )
      .subscribe(() => {
        this.calculateToSelectedMonsters(false);
        this.setCacheMonsterIdsForCalc();
        this.isCalculatingEvent.next(false);
      });
    this.allSubs.push(updateMonsterListSubs);

    const x = this.updateCompareEvent
      .pipe(
        tap(() => (this.isCalculating = true)),
        debounceTime(250),
      )
      .subscribe(() => {
        const model2 = { rawOptionTxts: this.model2?.rawOptionTxts || [] } as ClassModel;

        const equipItemIdItemTypeMap2 = new Map<ItemTypeEnum, number>();

        this.showCompareItemMap = (this.compareItemNames || [])
          .sort((a: any, b: any) => {
            return this.compareItemList.indexOf(a) > this.compareItemList.indexOf(b) ? 1 : -1;
          })
          .reduce((agg, itemTypeName) => {
            agg[itemTypeName] = true;

            model2[itemTypeName] = this.model2[itemTypeName] || null;

            const hasMainItem = model2[itemTypeName] != null;
            if (hasMainItem) {
              equipItemIdItemTypeMap2.set(itemTypeName, model2[itemTypeName]);
            }

            const relatedItems = MainItemWithRelations[itemTypeName];
            for (const relatedItemType of relatedItems) {
              model2[relatedItemType] = hasMainItem ? this.model2[relatedItemType] || null : null;
              const relatedVal = model2[relatedItemType];
              if (relatedVal) {
                equipItemIdItemTypeMap2.set(relatedItemType, relatedVal);
              }
            }

            if (!hasMainItem) {
              model2[`${itemTypeName}Refine`] = null;
              model2[`${itemTypeName}Grade`] = null;
              return agg;
            }

            model2[`${itemTypeName}Refine`] = this.model2[`${itemTypeName}Refine`] || 0;
            model2[`${itemTypeName}Grade`] = this.model2[`${itemTypeName}Grade`] || null;

            return agg;
          }, {});

        this.equipCompareItemIdItemTypeMap = equipItemIdItemTypeMap2;
        this.equipCompareItems = this.buildEquipItemList(this.equipCompareItemIdItemTypeMap, model2);
        // console.log('model2', { ...model2 })
        if (this.isEnableCompare) {
          this.model2 = model2;
          this.calcCompare();
        } else {
          this.resetModel2();
        }
        this.onSelectItemDescription(this.isEnableCompare && Boolean(this.selectedCompareItemDesc));

        this.isCalculatingEvent.next(false);
      });
    this.allSubs.push(x);

    const cObs = this.updateChanceEvent
      .pipe(
        tap(() => (this.isCalculating = true)),
        debounceTime(300),
        filter(() => {
          const needCalc = this.selectedChances?.length > 0;
          if (!needCalc) {
            this.isCalculatingEvent.next(false);
            this.calculator.setSelectedChances([]);
            this.calculateToSelectedMonsters();
          }

          return needCalc;
        }),
        tap(() => {
          this.calculator.setSelectedChances(this.selectedChances).recalcExtraBonus(this.model.selectedAtkSkill);
          this.totalSummary = this.calculator.getTotalSummary();
          this.calculateToSelectedMonsters();
        }),
        debounceTime(100),
      )
      .subscribe(() => {
        this.isCalculatingEvent.next(false);
      });
    this.allSubs.push(cObs);
  }

  ngOnDestroy(): void {
    for (const ob of this.allSubs) {
      ob?.unsubscribe();
    }
    if (this.ref) {
      this.ref.close();
    }
  }

  private initData() {
    return forkJoin([
      this.roService.getItems<Record<number, ItemModel>>(),
      this.roService.getMonsters<Record<number, MonsterModel>>(),
      this.roService.getHpSpTable<HpSpTable>(),
    ]).pipe(
      tap(([items, monsters, hpSpTable]) => {
        this.items = items;
        this.monsterDataMap = monsters;
        this.hpSpTable = hpSpTable;

        this.selectedMonsterName = this.monsterDataMap[this.selectedMonster]?.name;

        this.calculator.setMasterItems(items).setHpSpTable(hpSpTable);
        this.calculator2.setMasterItems(items).setHpSpTable(hpSpTable);

        const ens = [] as DropdownModel[];
        this.mapEnchant = new Map(
          Object.values(items)
            .filter((item) => item.itemTypeId === ItemTypeId.ENCHANT)
            .map((item) => {
              ens.push({
                label: item.name,
                value: item.id,
              });

              return [item.aegisName, item];
            }),
        );
        this.enchants = ens;

        if (!this.env.production) {
          const enchants = EnchantTable.flatMap((a) => a.enchants)
            .filter(Boolean)
            .flat();
          const allEnchantSet = new Set(enchants);
          // console.log({ allEnchantSet });
          for (const enchtName of allEnchantSet.values()) {
            if (!this.mapEnchant.has(enchtName)) {
              console.log('not found in data.json', { enchtName });
            }
          }
        }

        this.setMonsterDropdownList();
        this.setItemList();
      }),
    );
  }

  private initLoadItemsBtn() {
    this.loadBtnItems = [
      // {
      //   label: 'Load',
      //   icon: PrimeIcons.DOWNLOAD,
      //   command: () => {
      //     this.loadPreset();
      //   },
      // },
      {
        label: 'Update',
        icon: PrimeIcons.SYNC,
        command: () => {
          if (this.isLoggedIn) {
            this.updateCloudPreset();
          } else {
            this.updatePreset(this.selectedPreset);
          }
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
      { field: 'skillMinDamage', header: 'SkillMin', default: true },
      { field: 'skillMaxDamage', header: 'SkillMax', default: true },
      { field: 'skillDps', header: 'DPS', default: true },
      { field: 'skillHitKill', header: 'HitKill', default: true },
      { field: 'skillCriRateToMonster', header: 'Cri%' },
      { field: 'skillAccuracy', header: 'แม่น' },
      { field: 'skillTotalPene', header: 'เจาะ' },
      // { field: 'hitRate', header: 'แม่น' },
      { field: 'accuracy', header: 'Basicแม่น' },
      { field: 'totalPene', header: 'Basicเจาะ' },
      { field: 'basicMinDamage', header: 'BasicMin' },
      { field: 'basicMaxDamage', header: 'BasicMax' },
      { field: 'criMaxDamage', header: 'BasicCriDmg' },
      { field: 'criMaxDamage', header: 'BasicDPS' },
      { field: 'basicCriRate', header: 'BasicCri%' },
    ];
    const availableCols = new Map(this.cols.map((a) => [a.field, a]));

    const cached = this.getCachedBattleColNames()
      .map((col) => availableCols.get(col as any))
      .filter(Boolean);
    if (cached.length > 0) {
      this.selectedColumns = cached;
      return;
    }

    const defaultCols = [...this.cols.filter((a) => a.default).map((a) => a)];
    this.selectedColumns = defaultCols;
  }

  private prepare(calculator: Calculator, compareModel?: any) {
    const { activeSkills, passiveSkills, selectedAtkSkill } = this.model;
    const { equipAtks, masteryAtks, activeSkillNames, learnedSkillMap } = this.selectedCharacter
      .setLearnSkills({
        activeSkillIds: activeSkills,
        passiveSkillIds: passiveSkills,
      })
      .getSkillBonusAndName();

    const { consumables, consumables2, aspdPotion, aspdPotions } = this.model;
    const usedSupBattlePill = consumables.includes(12792);
    const usedHpL = consumables.includes(12424);
    const consumeData = [...consumables, ...consumables2, ...aspdPotions]
      .filter(Boolean)
      .filter((id) => !usedSupBattlePill || (usedSupBattlePill && id !== 12791))
      .map((id) => this.items[id].script);

    const buffEquips = {};
    const buffMasterys = {};
    this.skillBuffs.forEach((skillBuff, i) => {
      const buffVal = this.model.skillBuffs[i];
      const buff = skillBuff.dropdown.find((a) => a.value === buffVal);
      if (buff?.isUse && !activeSkillNames.has(skillBuff.name)) {
        if (skillBuff.isMasteryAtk) {
          buffMasterys[skillBuff.name] = buff.bonus;
        } else {
          buffEquips[skillBuff.name] = buff.bonus;
        }
      }
    });

    const calc = calculator.setClass(this.selectedCharacter);
    const rawOptionTxts = [...this.model.rawOptionTxts];
    const isShadowOption = {
      [ItemTypeEnum.shadowWeapon]: true,
      [ItemTypeEnum.shadowArmor]: true,
      [ItemTypeEnum.shadowShield]: true,
      [ItemTypeEnum.shadowBoot]: true,
      [ItemTypeEnum.shadowEarring]: true,
      [ItemTypeEnum.shadowPendant]: true,
    };
    if (compareModel) {
      const model2 = { ...this.model, ...compareModel };
      calc.loadItemFromModel(model2);

      // if compare the item, should get options from its.
      if (this.compareItemNames?.includes(ItemTypeEnum.weapon)) {
        const itemId = this.model2[ItemTypeEnum.weapon];
        for (let slot = ItemOptionNumber.W_Left_1; slot <= ItemOptionNumber.W_Left_3; slot++) {
          if (!itemId) {
            this.model2.rawOptionTxts[slot] = null;
          }
          rawOptionTxts[slot] = this.model2.rawOptionTxts[slot];
        }

        const isAllowShield = calc.isAllowShield();
        for (let slot = ItemOptionNumber.W_Right_1; slot <= ItemOptionNumber.W_Right_3; slot++) {
          if (!itemId || !isAllowShield) {
            this.model2.rawOptionTxts[slot] = null;
            rawOptionTxts[slot] = this.model2.rawOptionTxts[slot];
          }
        }

        if (!isAllowShield) {
          const clearList = [ItemTypeEnum.shield, ItemTypeEnum.leftWeapon];
          for (const itemT of clearList) {
            calc.setItem({ itemId: undefined, itemType: itemT });
            for (const relatedItemType of MainItemWithRelations[itemT]) {
              calc.setItem({ itemId: undefined, itemType: relatedItemType });
            }
          }

          const [_, slots] = ItemOptionTable.find(([itemType]) => itemType === ItemTypeEnum.shield) || ['', []];
          for (const slot of slots) {
            rawOptionTxts[slot] = null;
            this.model2.rawOptionTxts[slot] = null;
          }
        }
      }

      for (const [_itemType, slotNumbers] of ItemOptionTable) {
        if (this.compareItemNames?.includes(_itemType)) {
          const itemId = this.model2[_itemType];

          if (isShadowOption[_itemType]) {
            // force have only 1 option
            if (!itemId) {
              this.model2.rawOptionTxts[slotNumbers[0]] = null;
            }
            rawOptionTxts[slotNumbers[0]] = this.model2.rawOptionTxts[slotNumbers[0]];
            continue;
          }

          for (const slot of slotNumbers) {
            rawOptionTxts[slot] = this.model2.rawOptionTxts[slot];
          }

          let totalItemOptionSlot = 0;
          if (itemId) {
            const aegisName = this.items[itemId]?.aegisName;
            totalItemOptionSlot = ExtraOptionTable[aegisName] || 0;
          }

          for (const [index, slot] of slotNumbers.entries()) {
            if (totalItemOptionSlot <= index) {
              rawOptionTxts[slot] = null;
              this.model2.rawOptionTxts[slot] = null;
            }
          }
        }
      }
    } else {
      // clean if the itemType not allow to have options
      this.model.rawOptionTxts = toRawOptionTxtList(this.model, this.items);

      calc.loadItemFromModel(this.model);
    }

    calc
      .setMonster(this.monsterDataMap[this.selectedMonster])
      .setEquipAtkSkillAtk(equipAtks)
      .setBuffBonus({ masteryAtk: buffMasterys, equipAtk: buffEquips })
      .setMasterySkillAtk(masteryAtks)
      .setConsumables(consumeData)
      .setAspdPotion(aspdPotion)
      .setExtraOptions(this.getOptionScripts(!compareModel ? this.model.rawOptionTxts : rawOptionTxts))
      .setUsedSkillNames(activeSkillNames)
      .setLearnedSkills(learnedSkillMap)
      .setOffensiveSkill(selectedAtkSkill)
      .prepareAllItemBonus()
      .calcAllAtk()
      .setSelectedChances(this.selectedChances)
      .calcAllDefs()
      .calculateHpSp({ isUseHpL: usedHpL })
      .calculateAllDamages(selectedAtkSkill);

    return calc;
  }

  private calculate() {
    const calc = this.prepare(this.calculator);

    this.totalSummary = calc.getTotalSummary();
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
    // this.possiblyDamages = calc.getPossiblyDamages().map((a) => ({ label: `${a}`, value: a }));

    this.calculateToSelectedMonsters();
  }

  private calcCompare() {
    if (this.compareItemNames?.length > 0) {
      const m2 = JSON.parse(JSON.stringify(this.model2));
      const calc2 = this.prepare(this.calculator2, m2);
      this.totalSummary2 = calc2.getTotalSummary();
      this.compareItemSummaryModel = calc2.getItemSummary();
    }
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

  private setElementTable(): void {
    const d: ElementDataModel[] = [];

    const p_element_all = this.totalSummary.p_element_all || 0;
    const m_element_all = this.totalSummary.m_element_all || 0;
    const m_my_element_all = this.totalSummary.m_my_element_all || 0;

    for (const [eleShow, ele] of elements) {
      d.push({
        name: eleShow,
        physicalElementToMonster: p_element_all + (this.totalSummary[`p_element_${ele}`] || 0),
        magicalElementToMonster: m_element_all + (this.totalSummary[`m_element_${ele}`] || 0),
        myElement: m_my_element_all + (this.totalSummary[`m_my_element_${ele}`] || 0),
      });
    }

    this.elementTable = d;
  }

  private setRaceTable(): void {
    const d: RaceDataModel[] = [];

    const p_race_all = this.totalSummary.p_race_all || 0;
    const m_race_all = this.totalSummary.m_race_all || 0;

    for (const [raceShow, race] of races) {
      d.push({
        name: raceShow,
        physical: p_race_all + (this.totalSummary[`p_race_${race}`] || 0),
        magical: m_race_all + (this.totalSummary[`m_race_${race}`] || 0),
      });
    }
    this.raceTable = d;

    const p_pene_race_all = this.totalSummary.p_pene_race_all || 0;
    const m_pene_race_all = this.totalSummary.m_pene_race_all || 0;
    this.peneRaceTable = races.map(([classShow, race]) => {
      return {
        name: classShow,
        physical: p_pene_race_all + (this.totalSummary[`p_pene_race_${race}`] || 0),
        magical: m_pene_race_all + (this.totalSummary[`m_pene_race_${race}`] || 0),
      };
    });
  }

  private setSizeTable(): void {
    const d: RaceDataModel[] = [];

    const p_size_all = this.totalSummary.p_size_all || 0;
    const m_size_all = this.totalSummary.m_size_all || 0;

    for (const [sizeShow, size] of sizes) {
      d.push({
        name: sizeShow,
        physical: p_size_all + (this.totalSummary[`p_size_${size}`] || 0),
        magical: m_size_all + (this.totalSummary[`m_size_${size}`] || 0),
      });
    }

    this.sizeTable = d;
  }

  private setMonsterTypeTable(): void {
    const d: RaceDataModel[] = [];

    const p_class_all = this.totalSummary.p_class_all || 0;
    const m_class_all = this.totalSummary.m_class_all || 0;

    for (const [classShow, _class] of monsterTypes) {
      d.push({
        name: classShow,
        physical: p_class_all + (this.totalSummary[`p_class_${_class}`] || 0),
        magical: m_class_all + (this.totalSummary[`m_class_${_class}`] || 0),
      });
    }
    this.classTable = d;

    const p_pene_class_all = this.totalSummary.p_pene_class_all || 0;
    const m_pene_class_all = this.totalSummary.m_pene_class_all || 0;
    this.peneClassTable = monsterTypes.map(([classShow, _class]) => {
      return {
        name: classShow,
        physical: p_pene_class_all + (this.totalSummary[`p_pene_class_${_class}`] || 0),
        magical: m_pene_class_all + (this.totalSummary[`m_pene_class_${_class}`] || 0),
      };
    });
  }

  private setAtkTypeTable(): void {
    this.atkTypeTable = [
      { name: 'Melee', value: this.totalSummary.melee || 0 },
      { name: 'Range', value: this.totalSummary.range || 0 },
      { name: 'MATK', value: this.totalSummary.matkPercent || 0 },
    ];
  }

  private setSkillTable(): void {
    const dMap = new Map<string, any>();
    const addValue = (key: string, val: Partial<SkillMultiplierModel>) => {
      if (dMap.has(key)) {
        dMap.set(key, { ...dMap.get(key), ...val });
      } else {
        dMap.set(key, val);
      }
    };

    for (const [attr, value] of Object.entries(this.totalSummary)) {
      if (!isNumber(value)) continue;

      const firstCap = attr.charAt(0);
      if (firstCap === firstCap.toUpperCase()) {
        addValue(attr, {
          name: attr,
          value,
        });
        continue;
      }

      if (attr.startsWith('cd__')) {
        const actualAttr = attr.replace('cd__', '');
        addValue(actualAttr, {
          name: actualAttr,
          cd: value < 0 ? `+${value * -1}` : `-${value}`,
        });
      }
    }

    this.skillMultiplierTable = [...dMap.values()];
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

    const isUseHpL = this.model.consumables.includes(12424);
    this.calcDamages = selectedMonsterIds.map((monsterId) => {
      const monster = this.monsterDataMap[monsterId];
      const calculated = this.calculator.setMonster(monster).prepareAllItemBonus().calcDmgWithExtraBonus({ skillValue: this.model.selectedAtkSkill, isUseHpL });

      const {
        id,
        name,
        stats: { elementShortName, level, elementName, raceName, scaleName, health, class: _class },
      } = monster;

      return {
        id,
        label: `${level} ${name} (${raceName}, ${scaleName.at(0)}, ${elementName})`,
        health,
        monsterClass: classMap[_class],
        elementName: elementShortName,
        ...calculated,
      };
    });

    // reset to main selected monster
    this.calculator.setMonster(this.monsterDataMap[this.selectedMonster]).prepareAllItemBonus().calcAllAtk();
  }

  private resetModel() {
    const { class: _class, level, jobLevel } = this.model;
    this.model = { ...createMainModel(), class: _class, level, jobLevel };
    this.resetModel2();
  }

  private resetModel2() {
    this.model2 = { rawOptionTxts: [] };
  }

  private deleteLocalPresets() {
    localStorage.removeItem('presets');
  }

  private getPresetList(): DropdownModel[] {
    const presets = JSON.parse(localStorage.getItem('presets') || '[]') || [];

    return Array.isArray(presets) ? presets : [];
  }

  private savePresetList(presets?: DropdownModel[]): void {
    localStorage.setItem('presets', JSON.stringify(presets || this.preSets));
  }

  private setPresetList() {
    if (this.isLoggedIn) {
      const ob = this.presetService.getMyPresets().pipe(
        tap((presets) => {
          if (presets) {
            this.preSets = presets.map((p) => {
              return {
                label: p.label,
                value: p.id,
                icon: ClassIcon[p.classId],
              };
            });
          }
        }),
      );

      this.calAPIWithLoading(ob);
    } else {
      this.preSets = this.getPresetList().map((a) => {
        return {
          ...a,
          icon: ClassIcon[(a as any)?.model?.class],
        };
      });
    }
  }

  private waitConfirm(message: string, icon?: string) {
    return new Promise((res) => {
      this.confirmationService.confirm({
        message: message,
        header: 'Confirmation',
        icon: icon || 'pi pi-exclamation-triangle',
        accept: () => {
          res(true);
        },
        reject: () => {
          console.log('reject confirm');
          res(false);
        },
      });
    });
  }

  private calAPIWithLoading<T>(fn: Observable<T>) {
    this.isInProcessingPreset = true;

    return fn
      .pipe(
        catchError((err) => {
          return this.handleAPIError(err);
        }),
        finalize(() => {
          this.isInProcessingPreset = false;
        }),
      )
      .subscribe();
  }

  createPreset(name: string) {
    this.isInProcessingPreset = true;
    const currentPresets = this.getPresetList();

    waitRxjs(0.5)
      .pipe(finalize(() => (this.isInProcessingPreset = false)))
      .subscribe(() => {
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
      });
  }

  createCloudPreset(label: string) {
    const classId = this.model.class;

    const obs = this.presetService
      .createPreset({
        label,
        model: toUpsertPresetModel(this.model, this.selectedCharacter) as any,
      })
      .pipe(
        switchMap((preset) => {
          return this.loadItemSet(preset.model).pipe(switchMap(() => waitRxjs(0.1, preset)));
        }),
        // switchMap((preset) => {
        //   return this.presetService.getMyPresets().pipe(
        //     switchMap((presets) => {
        //       this.preSets = presets.map((a) => {
        //         return {
        //           label: a.label,
        //           value: a.id,
        //           icon: ClassIcon[a.classId],
        //         };
        //       });
        //       return of(preset);
        //     }),
        //   );
        // }),
        tap((preset) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Created',
            detail: `"${preset.label}" was created.`,
          });
          this.preSets = [{
            label: preset.label,
            value: preset.id,
            icon: ClassIcon[classId],
          }, ...this.preSets];
          return waitRxjs();
        }),
        catchError((err) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Failed to create.',
            detail: `${err}`,
          });

          return of(null);
        }),
      );

    this.waitConfirm(`Create "${label}" ?`).then((isConfirm) => {
      if (isConfirm) this.calAPIWithLoading(obs);
    });
  }

  updateCloudPreset() {
    const id = this.selectedPreset;
    if (!id) return;

    const label = this.preSets.find((a) => a.value === id)?.label;
    const obs = this.presetService
      .updatePreset(id, {
        label,
        model: toUpsertPresetModel(this.model, this.selectedCharacter) as any,
      })
      .pipe(
        tap((preset) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Updated',
            detail: `"${preset.label}" was updated.`,
          });
          return waitRxjs();
        }),
      );

    this.waitConfirm(`Update "${label}" ?`).then((isConfirm) => {
      if (isConfirm) this.calAPIWithLoading(obs);
    });
  }

  /**
   * update or create (for local DB will update if preset name already exist or create new one)
   * @param name
   * @returns
   */
  updatePreset(name: string) {
    if (this.isLoggedIn) {
      this.createCloudPreset(name);
      return;
    }

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
        reject: () => {
          this.isInProcessingPreset = false;
        },
      });
    } else {
      this.createPreset(name);
    }
  }

  deletePreset() {
    if (!this.isLoggedIn) {
      // this.deleteLocalPresets(name);
      return;
    }

    const id = this.selectedPreset;
    if (!id || typeof id !== 'string') return;

    const label = this.preSets.find((a) => a.value === id)?.label;
    if (!label) return;

    const obs = this.presetService
      .deletePreset(id)
      .pipe(
        tap(() => {
          this.messageService.add({
            severity: 'success',
            summary: 'Deleted',
            detail: `"${label}" was deleted.`,
          });
          this.preSets = this.preSets.filter(a => a.value !== id);
          this.selectedPreset = undefined;

          return waitRxjs();
        }),
      );

    this.waitConfirm(`Delete "${label}" ?`).then((isConfirm) => {
      if (isConfirm) this.calAPIWithLoading(obs);
    });
  }

  loadPreset(presetName?: string) {
    if (this.isLoggedIn) {
      const presetId = presetName || this.selectedPreset;
      const pName = this.preSets.find((a) => a.value === presetId)?.label;

      const obs = this.presetService.getPreset(presetId).pipe(
        switchMap((preset) => {
          this.resetModel2();
          return this.loadItemSet(preset.model).pipe(switchMap(() => waitRxjs(0.1, preset)));
        }),
        tap((preset) => {
          this.updateCompareEvent.next(1);
          if (presetName) this.selectedPreset = presetName;
          this.messageService.add({
            severity: 'success',
            summary: 'Loaded',
            detail: `"${preset.label}" was loaded.`,
          });

          return waitRxjs(0.1);
        }),
        catchError((err) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Failed to create.',
            detail: `${err}`,
          });

          return of(null);
        }),
      );

      this.waitConfirm(`Load "${pName}" ?`).then((isConfirm) => {
        if (isConfirm) this.calAPIWithLoading(obs);
      });

      return;
    }

    const targePreset = presetName || this.selectedPreset;
    const selected = this.getPresetList().find((a) => a.value === targePreset);
    if (selected?.['model']) {
      this.confirmationService.confirm({
        message: `Load "${targePreset}" ?`,
        header: 'Confirmation',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          this.isInProcessingPreset = true;
          waitRxjs()
            .pipe(
              mergeMap(() => {
                return this.loadItemSet(selected['model']).pipe(switchMap(() => waitRxjs(1)));
              }),
              take(1),
              finalize(() => {
                this.messageService.add({
                  severity: 'success',
                  summary: 'Successed',
                  detail: `"${targePreset}" was loaded.`,
                });
                if (presetName) this.selectedPreset = presetName;
                this.isInProcessingPreset = false;
              }),
            )
            .subscribe();
        },
        reject: () => {
          this.isInProcessingPreset = false;
        },
      });
    }
  }

  removePresetFromList(presetId: string) {
    this.preSets = this.preSets.filter((a) => a.value !== presetId);
  }

  openPresetManagement() {
    this.ref = this.dialogService.open(PresetTableComponent, {
      width: '80vw',
      height: '90vh',
      contentStyle: { overflow: 'auto' },
      header: 'Preset Management',
      baseZIndex: 10000,
      showHeader: true,
      data: {
        items: this.items,
        presets: this.getPresetList(),
        getPresetFn: this.getPresetList.bind(this),
        savePresetListFn: this.savePresetList.bind(this),
        setPresetListFn: this.setPresetList.bind(this),
        loadPresetFn: this.loadPreset.bind(this),
        removePresetFromListFn: this.removePresetFromList.bind(this),
      },
    });
    // this.ref.onClose.subscribe((product: any) => {
    //   console.log({ onClose: product });
    //   if (product) {
    //     this.messageService.add({ severity: 'info', summary: 'Product Selected', detail: product });
    //   }
    // });
  }

  private setModelByJSONString(savedModel: string | any) {
    const savedData = typeof savedModel === 'string' ? JSON.parse(savedModel || '{}') : savedModel;
    const rawModel = createMainModel();
    if (!savedData) {
      this.model = rawModel;
      return;
    }

    for (const [key, initialValue] of Object.entries(this.emptyModel)) {
      const isAttrArray = Array.isArray(initialValue);

      const savedValue = savedData[key];
      const validValue = isAttrArray ? (Array.isArray(savedValue) ? savedValue : []) : savedValue ?? initialValue;
      rawModel[key] = validValue;
    }

    const rawOptionTxts = [] as string[];
    // migrate
    for (let i = 0; i <= MAX_OPTION_NUMBER; i++) {
      if (rawModel.rawOptionTxts[i]) {
        rawOptionTxts[i] = rawModel.rawOptionTxts[i];
      }
    }
    for (let i = 51; i <= 56; i++) {
      if (rawModel.rawOptionTxts[i]) {
        rawOptionTxts[i - 31] = rawModel.rawOptionTxts[i];
      }
    }

    rawModel.rawOptionTxts = rawOptionTxts;

    const mapPhamacy = {
      2: 100232,
      3: 100233,
    };
    const p = mapPhamacy[rawModel?.skillBuffMap['Special Pharmacy']];
    if (Boolean(p) && Array.isArray(rawModel.consumables)) {
      if (!rawModel.consumables.includes(p)) {
        rawModel.consumables.push(p);
      }
    }

    this.model = rawModel;
  }

  loadItemSet(presetStrOrModel: string | PresetModel, isSetMinLevel = false) {
    this.isInProcessingPreset = true;

    this.setModelByJSONString(presetStrOrModel);

    this.model.selectedAtkSkill = this.model.selectedAtkSkill || this.atkSkills[0]?.value;
    const selectedAtkSkill = this.model.selectedAtkSkill;

    const { level, jobLevel, ...bkModel } = this.model;

    this.setClassInstant();
    this.setSkillModelArray();
    this.setClassSkill();
    this.setClassMinMaxLvl();

    return waitRxjs().pipe(
      take(1),
      mergeMap(() => {
        this.setClassLvl({ currentLvl: level, currentJob: jobLevel, isSetMinLevel });
        this.setJobBonus();
        return waitRxjs();
      }),
      mergeMap(() => {
        this.setAspdPotionList();
        this.setDefaultSkill(selectedAtkSkill);
        this.setItemDropdownList();
        return waitRxjs();
      }),
      mergeMap(() => {
        try {
          this.model.shield = bkModel.shield;
          this.model.shieldCard = bkModel.shieldCard;
          this.model.shieldGrade = bkModel.shieldGrade;
          this.model.shieldRefine = bkModel.shieldRefine;
          this.model.shieldEnchant1 = bkModel.shieldEnchant1;
          this.model.shieldEnchant2 = bkModel.shieldEnchant2;
          this.model.shieldEnchant3 = bkModel.shieldEnchant3;

          for (const itemType of Object.keys(MainItemWithRelations) as ItemTypeEnum[]) {
            const refine = this.model[`${itemType}Refine`];
            const itemId = this.model[itemType];
            this.onSelectItem(itemType, itemId, refine);
            // console.log('Set Main Item', { itemType, itemId, refine });
            for (const relatedItemType of MainItemWithRelations[itemType] ?? []) {
              this.onSelectItem(relatedItemType, this.model[relatedItemType], refine);
            }
          }
          this.onBaseStatusChange();
        } catch (error) {
          console.error(error);
        }

        return waitRxjs(1);
      }),
      finalize(() => {
        this.isInProcessingPreset = false;
      }),
    );
  }

  private saveCurrentStateItemset() {
    localStorage.setItem('ro-set', JSON.stringify(toUpsertPresetModel(this.model, this.selectedCharacter)));
  }

  private resetItemDescription() {
    const equipItemTypes: string[] = [];
    const map = new Map<ItemTypeEnum, number>();
    const mapRefine = new Map<string, number>();

    for (const [itemType, relations] of Object.entries(MainItemWithRelations)) {
      const itemId = this.equipItemMap.get(itemType as any);
      if (itemId) {
        equipItemTypes.push(itemType);
        map.set(itemType as any, itemId);

        mapRefine.set(itemType, this.model[`${itemType}Refine`]);
      }

      for (const itemType2 of relations) {
        const itemId = this.equipItemMap.get(itemType2 as any);
        if (itemId) {
          equipItemTypes.push(itemType2);
          map.set(itemType2 as any, itemId);
        }
      }
    }

    this.equipItemIdItemTypeMap = map;

    if (!equipItemTypes.includes(this.selectedItemDesc)) {
      this.selectedItemDesc = undefined;
    }
    this.equipItems = this.buildEquipItemList(this.equipItemIdItemTypeMap, this.model);
  }

  private buildEquipItemList(itemMap: Map<ItemTypeEnum, number>, model: typeof this.model | typeof this.model2) {
    return [...itemMap.entries()]
      .filter(([_itemType, id]) => this.items[id])
      .map(([itemType, id]) => {
        const grade = model[`${itemType}Grade`];
        const prefixGrade = grade && typeof grade === 'string' ? ` [${grade}] ` : '';

        const refine = model[`${itemType}Refine`];
        const prefixRefine = refine && refine > 0 ? ` +${refine} ` : '';

        return {
          label: `${prefixRefine}${prefixGrade}${this.items[id]?.name}`,
          value: itemType,
          id,
        };
      });
  }

  private setClassInstant() {
    const c = Characters.find((a) => a.value === this.model.class)?.['instant'] as CharacterBase;
    this.selectedCharacter = c || Characters[0]['instant'];
    this.calculator.setClass(this.selectedCharacter);
    this.isAllowTraitStat = this.selectedCharacter.isAllowTraitStat();
    this.canPromote = !!JobPromotionMapper[this.model.class];
    this.isAllowLeftWeaponByClass = AllowLeftWeaponMapper[this.selectedCharacter.className] || false;
  }

  private setClassSkill() {
    this.activeSkills = this.selectedCharacter.activeSkills;
    this.passiveSkills = this.selectedCharacter.passiveSkills;
    this.atkSkills = this.selectedCharacter.atkSkills;
    this.offensiveSkills = [...new Set(this.atkSkills.map((a) => a.name)).values()].map((name) => {
      return {
        label: name,
        value: name,
      };
    });
    this.atkSkillCascades = this.selectedCharacter.atkSkills;
    this.isShowSelectableSkillLevel = this.selectedCharacter.atkSkills.some((a) => a.levelList?.length > 0);
  }

  private setClassMinMaxLvl() {
    const {
      minMaxLevel: [min, max],
      maxJob,
    } = this.selectedCharacter.minMaxLevelCap;

    this.levelList = createNumberDropdownList({ from: min, to: max });
    this.jobList = createNumberDropdownList({ from: 1, to: maxJob, excludingNumbers: [66, 67, 68, 69] });
  }

  private setClassLvl(params: { currentLvl: number; currentJob: number; isSetMinLevel?: boolean; }) {
    const { currentJob, currentLvl, isSetMinLevel = false } = params;
    const {
      minMaxLevel: [min, max],
      maxJob,
    } = this.selectedCharacter.minMaxLevelCap;

    this.model.level = isSetMinLevel ? min : currentLvl;
    this.model.jobLevel = isSetMinLevel ? 1 : currentJob;

    const { level, jobLevel } = this.model;

    if (level < min || level > max) {
      this.model.level = 200;
    }

    if (!jobLevel || jobLevel > maxJob) {
      this.model.jobLevel = 1;
    }
  }

  private setDefaultSkill(selectedSkill?: string) {
    const defaultAtkSkill = this.atkSkills[0].value;
    const selectedAtkSkill = this.model.selectedAtkSkill || selectedSkill;
    if (!selectedAtkSkill) {
      this.model.selectedAtkSkill = defaultAtkSkill;
      return;
    }

    const selectedValidSkill = this.atkSkills.find((a) => a.value === selectedAtkSkill || (Array.isArray(a.values) && a.values?.includes(selectedAtkSkill)));
    const selectedValidSkill2 = this.atkSkills.find(
      (a) => Array.isArray(a.levelList) && a.levelList.length > 0 && a.levelList.find((lv) => lv.value === selectedAtkSkill),
    );
    if (selectedValidSkill?.value) {
      this.model.selectedAtkSkill = selectedValidSkill.value;
    } else if (selectedValidSkill2?.value) {
      this.model.selectedAtkSkill = selectedAtkSkill;
    } else {
      this.model.selectedAtkSkill = defaultAtkSkill;
    }
  }

  private setAspdPotionList() {
    this.aspdPotionList = AspdPotionList.filter(({ value }) => {
      switch (value) {
        case 645:
          return true;
        case 656:
          return true;
        case 657: {
          const usable = [
            ClassName.RuneKnight,
            ClassName.DragonKnight,
            ClassName.RoyalGuard,
            ClassName.ImperialGuard,
            ClassName.Genetic,
            ClassName.Biolo,
            ClassName.Mechanic,
            ClassName.Meister,
            ClassName.ShadowChaser,
            ClassName.AbyssChaser,
            ClassName.Warlock,
            ClassName.ArchMage,
            ClassName.Rebellion,
            ClassName.NightWatch,
            ClassName.SoulReaper,
            ClassName.SoulAscetic,
            ClassName.StarEmperor,
            ClassName.SkyEmperor,
          ];

          return usable.includes(this.selectedCharacter.className);
        }
      }

      return true;
    });
  }

  private setSkillModelArray() {
    const { activeSkills, passiveSkills } = this.selectedCharacter;
    let { skillBuffMap, activeSkillMap, passiveSkillMap } = this.model;
    if (!skillBuffMap || typeof skillBuffMap !== 'object') skillBuffMap = {};
    if (!activeSkillMap || typeof activeSkillMap !== 'object') activeSkillMap = {};
    if (!passiveSkillMap || typeof passiveSkillMap !== 'object') passiveSkillMap = {};

    const isEqualBuffLenght = passiveSkills?.length === this.model.passiveSkills?.length;
    this.model.skillBuffs = this.skillBuffs.map((skill, i) => {
      const savedVal = skillBuffMap[skill.name] ?? (isEqualBuffLenght ? this.model.skillBuffs[i] : 0);
      const found = skill.dropdown.find((a) => a.value === savedVal);

      return found ? savedVal : 0;
    });

    const isEqualActiveLenght = activeSkills?.length === this.model.activeSkills?.length;
    this.model.activeSkills = activeSkills.map((skill, i) => {
      const savedVal = activeSkillMap[skill.name] ?? (isEqualActiveLenght ? this.model.activeSkills[i] : 0);
      const found = skill.dropdown.find((a) => a.value === savedVal);

      return found ? savedVal : 0;
    });

    const isEqualPassiveLenght = passiveSkills?.length === this.model.passiveSkills?.length;
    this.model.passiveSkills = passiveSkills.map((skill, i) => {
      const savedVal = passiveSkillMap[skill.name] ?? (isEqualPassiveLenght ? this.model.passiveSkills[i] : 0);
      const found = skill.dropdown.find((a) => a.value === savedVal);

      return found ? savedVal : 0;
    });
  }

  private setJobBonus() {
    const { str, agi, vit, int, dex, luk, pow, sta, wis, spl, con, crt } = this.selectedCharacter.getJobBonusStatus(this.model.jobLevel);
    this.model.jobStr = str;
    this.model.jobAgi = agi;
    this.model.jobVit = vit;
    this.model.jobInt = int;
    this.model.jobDex = dex;
    this.model.jobLuk = luk;

    this.model.jobPow = pow;
    this.model.jobSta = sta;
    this.model.jobWis = wis;
    this.model.jobSpl = spl;
    this.model.jobCon = con;
    this.model.jobCrt = crt;
  }

  private setMonsterDropdownList() {
    const groupMap = new Map<string, MonsterSelectItemGroup>();
    const monsters: DropdownModel[] = [];
    const rawMonsters = Object.values(this.monsterDataMap).sort((a, b) => (a.stats.level > b.stats.level ? 1 : -1));
    const classMap = {
      0: 'Normal',
      1: 'Boss',
    };

    for (const mon of rawMonsters) {
      const { id, name, spawn, stats } = mon;
      const { level, health, mvp, class: _class, elementShortName, raceName, scaleName } = stats;

      const spawnMap = mvp === 1 ? ' Boss' : getMonsterSpawnMap(spawn) || (_class === 1 ? ' Boss' : 'Etc');
      const group = groupMap.get(spawnMap);
      const monster: DropdownModel = {
        label: `${level} ${name} (${raceName} ${scaleName.at(0)})`,
        name,
        value: id,
        level,
        elementName: elementShortName,
        raceName,
        className: classMap[_class],
        mvp,
        scaleName: scaleName.at(0),
        health,
        groups: spawnMap.trim().split(','),
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
    const weaponList: ItemModel[] = [];
    const leftWeaponList: ItemModel[] = [];
    const weaponCardList: ItemModel[] = [];
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
    const accList = [];
    const accCardList = [];
    const accLeftList = [];
    const accLeftCardList = [];
    const accRightList = [];
    const accRightCardList = [];
    const petList = [];

    const costumeUpperList = [];
    const costumeMiddleList = [];
    const costumeLowerList = [];
    const costumeGarmentList = [];
    const costumeEnhUpperList = [];
    const costumeEnhMiddleList = [];
    const costumeEnhLowerList = [];
    const costumeEnhGarmentList = [];
    const costumeEnhGarment2List = [];
    const costumeEnhGarment4List = [];

    const shadowArmorList = [];
    const shadowShieldList = [];
    const shadowBootList = [];
    const shadowEarringList = [];
    const shadowPendantList = [];
    const shadowWeaponList = [];

    const consumableList: ItemModel[] = [];

    const sortedItems = Object.values(this.items).sort(sortObj('name'));
    for (const item of sortedItems) {
      const { itemTypeId, itemSubTypeId, compositionPos, location } = item;

      switch (itemTypeId) {
        case ItemTypeId.WEAPON:
          // if (!item.name.startsWith('Furious')) continue;
          weaponList.push(item);
          if (itemSubTypeId === 256 || itemSubTypeId === 257) {
            leftWeaponList.push(item);
          }
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
          if (location === HeadGearLocation.Middle) {
            headMiddleList.push(item);
          } else if (location === HeadGearLocation.Lower) {
            headLowerList.push(item);
          } else {
            // if (!item.name.startsWith('Furious')) continue;
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
          accList.push(item);
          continue;
        case ItemSubTypeId.Acc_R:
          accRightList.push(item);
          accList.push(item);
          continue;
        case ItemSubTypeId.Acc:
          accRightList.push(item);
          accLeftList.push(item);
          accList.push(item);
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
        case ItemSubTypeId.ShadowEarring:
          shadowEarringList.push(item);
          continue;
        case ItemSubTypeId.ShadowPendant:
          shadowPendantList.push(item);
          continue;
        case ItemSubTypeId.ShadowWeapon:
          shadowWeaponList.push(item);
          continue;
        case ItemSubTypeId.CostumeUpper:
          costumeUpperList.push(item);
          continue;
        case ItemSubTypeId.CostumeMiddle:
          costumeMiddleList.push(item);
          continue;
        case ItemSubTypeId.CostumeLower:
          costumeLowerList.push(item);
          continue;
        case ItemSubTypeId.CostumeGarment:
          costumeGarmentList.push(item);
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
        case ItemSubTypeId.CostumeEnhGarment2:
          costumeEnhGarment2List.push(item);
          continue;
        case ItemSubTypeId.CostumeEnhGarment4:
          costumeEnhGarment4List.push(item);
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
            accLeftCardList.push({
              ...item,
              name: '[Left] ' + item.name,
              isHilight: true,
            });
            accCardList.push(item);
            continue;
          case CardPosition.AccR:
            accRightCardList.push({
              ...item,
              name: '[Right] ' + item.name,
              isHilight: true,
            });
            accCardList.push(item);
            continue;
          case CardPosition.Acc:
            accLeftCardList.push(item);
            accRightCardList.push(item);
            accCardList.push(item);
            continue;
        }
      }
    }

    this.itemList.weaponList = toDropdownList(weaponList, 'name', 'id');
    this.itemList.leftWeaponList = toDropdownList(leftWeaponList, 'name', 'id');
    this.itemList.weaponCardList = toDropdownList(weaponCardList, 'name', 'id', undefined, ['cardPrefix']);
    this.itemList.ammoList = toDropdownList(ammoList, 'name', 'id', 'propertyAtk');
    this.itemList.headUpperList = toDropdownList(headUpperList, 'name', 'id');
    this.itemList.headMiddleList = toDropdownList(headMiddleList, 'name', 'id');
    this.itemList.headLowerList = toDropdownList(headLowerList, 'name', 'id');
    this.itemList.headCardList = toDropdownList(headCardList, 'name', 'id', undefined, ['cardPrefix']);
    this.itemList.armorList = toDropdownList(armorList, 'name', 'id');
    this.itemList.armorCardList = toDropdownList(armorCardList, 'name', 'id', undefined, ['cardPrefix']);
    this.itemList.shieldList = toDropdownList(shieldList, 'name', 'id');
    this.itemList.shieldCardList = toDropdownList(shieldCardList, 'name', 'id', undefined, ['cardPrefix']);
    this.itemList.garmentList = toDropdownList(garmentList, 'name', 'id');
    this.itemList.garmentCardList = toDropdownList(garmentCardList, 'name', 'id', undefined, ['cardPrefix']);
    this.itemList.bootList = toDropdownList(bootList, 'name', 'id');
    this.itemList.bootCardList = toDropdownList(bootCardList, 'name', 'id', undefined, ['cardPrefix']);
    this.itemList.accList = toDropdownList(accList, 'name', 'id');
    this.itemList.accCardList = toDropdownList(accCardList, 'name', 'id');
    this.itemList.accLeftList = toDropdownList(accLeftList, 'name', 'id');
    this.itemList.accLeftCardList = toDropdownList(accLeftCardList, 'name', 'id', undefined, ['cardPrefix', 'isHilight']);
    this.itemList.accRightList = toDropdownList(accRightList, 'name', 'id');
    this.itemList.accRightCardList = toDropdownList(accRightCardList, 'name', 'id', undefined, ['cardPrefix', 'isHilight']);
    this.itemList.petList = petList.map((a) => ({ label: a.name, value: a.id }));

    this.itemList.costumeUpperList = toDropdownList(costumeUpperList, 'name', 'id');
    this.itemList.costumeMiddleList = toDropdownList(costumeMiddleList, 'name', 'id');
    this.itemList.costumeLowerList = toDropdownList(costumeLowerList, 'name', 'id');
    this.itemList.costumeGarmentList = toDropdownList(costumeGarmentList, 'name', 'id');

    this.itemList.costumeEnhUpperList = toDropdownList(costumeEnhUpperList, 'name', 'id');
    this.itemList.costumeEnhMiddleList = toDropdownList(costumeEnhMiddleList, 'name', 'id');
    this.itemList.costumeEnhLowerList = toDropdownList(costumeEnhLowerList, 'name', 'id');
    this.itemList.costumeEnhGarmentList = toDropdownList(costumeEnhGarmentList, 'name', 'id');
    this.itemList.costumeEnhGarment2List = toDropdownList(costumeEnhGarment2List, 'name', 'id');
    this.itemList.costumeEnhGarment4List = toDropdownList(costumeEnhGarment4List, 'name', 'id');

    this.itemList.shadowArmorList = toDropdownList(shadowArmorList, 'name', 'id');
    this.itemList.shadowShieldList = toDropdownList(shadowShieldList, 'name', 'id');
    this.itemList.shadowBootList = toDropdownList(shadowBootList, 'name', 'id');
    this.itemList.shadowEarringList = toDropdownList(shadowEarringList, 'name', 'id');
    this.itemList.shadowPendantList = toDropdownList(shadowPendantList, 'name', 'id');
    this.itemList.shadowWeaponList = toDropdownList(shadowWeaponList, 'name', 'id');

    this.consumableList = toDropdownList(consumableList.sort(sortObj('id')), 'name', 'id');

    if (!this.env.production) {
      for (const wea of weaponList) {
        if (!wea.itemLevel) {
          console.log('invalid weapon, ID' + wea.id);
        }
      }
    }
  }

  private setItemDropdownList() {
    const classNameSet = this.selectedCharacter.classNameSet;
    const onlyMe = (a: ItemDropdownModel) => {
      // if (a.label.startsWith('Heroic Token')) return true

      if (Array.isArray(a.unusableClass) && a.unusableClass.length > 0) {
        const cannot = a.unusableClass.some((x) => classNameSet.has(x));
        if (cannot) return false;
      }
      if (Array.isArray(a.usableClass)) {
        return a.usableClass.some((x) => classNameSet.has(x));
      }

      return true;
    };
    const onlySuperNoviceWeapon = (a: ItemDropdownModel) => {
      // if (this.items[+a.value]?.aegisName?.startsWith('Ep172_')) return true
      // if (a.label.includes('-AD')) return true

      // supper novice allow to equip weapon lv4
      if (this.selectedCharacter.className === ClassName.SuperNovice) {
        const { itemLevel, itemSubTypeId } = this.items[a.value as number] ?? {};
        const isLv4 = itemLevel === 4;
        const wTypeNames = new Set<WeaponTypeName>(['dagger', 'sword', 'axe', 'mace', 'rod', 'twohandRod']);
        const isSup = wTypeNames.has(WeaponTypeNameMapBySubTypeId[itemSubTypeId]);

        if (isLv4 && isSup) return true;
      }

      // return a.label.startsWith('Glacier')
      // return this.items[+a.value]?.aegisName?.startsWith('Fourth');

      return onlyMe(a);
    };
    const onlySuperNoviceHeadGear = (a: ItemDropdownModel) => {
      if (this.selectedCharacter.className === ClassName.SuperNovice) {
        return true;
      }

      // return a.label.startsWith('Temporal Circlet')

      return onlyMe(a);
    };

    this.weaponList = this.itemList.weaponList.filter(onlySuperNoviceWeapon);
    this.leftWeaponList = this.itemList.leftWeaponList.filter(onlySuperNoviceWeapon);
    this.weaponCardList = this.itemList.weaponCardList.map((a) => a);
    // this.ammoList = this.itemList.ammoList.filter(onlyMe);
    this.headUpperList = this.itemList.headUpperList.filter(onlySuperNoviceHeadGear);
    this.headMiddleList = this.itemList.headMiddleList.filter(onlySuperNoviceHeadGear);
    this.headLowerList = this.itemList.headLowerList.filter(onlySuperNoviceHeadGear);
    this.headCardList = this.itemList.headCardList.map((a) => a);
    this.armorList = this.itemList.armorList.filter(onlyMe);
    this.armorCardList = this.itemList.armorCardList.map((a) => a);
    this.shieldList = this.itemList.shieldList.filter(onlyMe);
    this.shieldCardList = this.itemList.shieldCardList.map((a) => a);
    this.garmentList = this.itemList.garmentList.filter(onlyMe);
    this.garmentCardList = this.itemList.garmentCardList.map((a) => a);
    this.bootList = this.itemList.bootList.filter(onlyMe);
    this.bootCardList = this.itemList.bootCardList.map((a) => a);
    this.accList = this.itemList.accList.filter(onlyMe);
    this.accCardList = this.itemList.accCardList.map((a) => a);
    this.accLeftList = this.itemList.accLeftList.filter(onlyMe);
    this.accLeftCardList = this.itemList.accLeftCardList.map((a) => a);
    this.accRightList = this.itemList.accRightList.filter(onlyMe);
    this.accRightCardList = this.itemList.accRightCardList.map((a) => a);
    this.petList = this.itemList.petList.map((a) => a);

    this.costumeUpperList = this.itemList.costumeUpperList.filter(onlyMe);
    this.costumeMiddleList = this.itemList.costumeMiddleList.filter(onlyMe);
    this.costumeLowerList = this.itemList.costumeLowerList.filter(onlyMe);
    this.costumeGarmentList = this.itemList.costumeGarmentList.filter(onlyMe);

    this.costumeEnhUpperList = this.itemList.costumeEnhUpperList.map((a) => a);
    this.costumeEnhMiddleList = this.itemList.costumeEnhMiddleList.map((a) => a);
    this.costumeEnhLowerList = this.itemList.costumeEnhLowerList.map((a) => a);
    this.costumeEnhGarmentList = this.itemList.costumeEnhGarmentList.map((a) => a);
    this.costumeEnhGarment2List = this.itemList.costumeEnhGarment2List.map((a) => a);
    this.costumeEnhGarment4List = this.itemList.costumeEnhGarment4List.map((a) => a);

    this.shadowArmorList = this.itemList.shadowArmorList.filter(onlyMe);
    this.shadowShieldList = this.itemList.shadowShieldList.filter(onlyMe);
    this.shadowBootList = this.itemList.shadowBootList.filter(onlyMe);
    this.shadowEarringList = this.itemList.shadowEarringList.filter(onlyMe);
    this.shadowPendantList = this.itemList.shadowPendantList.filter(onlyMe);
    this.shadowWeaponList = this.itemList.shadowWeaponList.filter(onlyMe);

    this.setEquipableItems();
    this.onClassChangedSubject.next(true);
  }

  private setEquipableItems() {
    const items = [
      { position: 'weaponList', values: this.weaponList },
      { position: 'weaponCardList', values: this.weaponCardList },
      { position: 'headUpperList', values: this.headUpperList },
      { position: 'headMiddleList', values: this.headMiddleList },
      { position: 'headLowerList', values: this.headLowerList },
      { position: 'headCardList', values: this.headCardList },
      { position: 'armorList', values: this.armorList },
      { position: 'armorCardList', values: this.armorCardList },
      { position: 'shieldList', values: this.shieldList },
      { position: 'shieldCardList', values: this.shieldCardList },
      { position: 'garmentList', values: this.garmentList },
      { position: 'garmentCardList', values: this.garmentCardList },
      { position: 'bootList', values: this.bootList },
      { position: 'bootCardList', values: this.bootCardList },
      { position: 'accList', values: this.accList },
      { position: 'accCardList', values: this.accCardList },

      { position: 'enchants', values: this.enchants },
      // { position: 'accLeftCardList', values: this.accLeftCardList },
      // { position: 'accRightList', values: this.accRightList },
      // { position: 'accRightCardList', values: this.accRightCardList },
      { position: 'petList', values: this.petList },
      { position: 'costumeList', values: this.costumeUpperList },
      { position: 'costumeList', values: this.costumeMiddleList },
      { position: 'costumeList', values: this.costumeLowerList },
      { position: 'costumeList', values: this.costumeGarmentList },
      { position: 'costumeList', values: this.costumeEnhUpperList },
      { position: 'costumeList', values: this.costumeEnhMiddleList },
      { position: 'costumeList', values: this.costumeEnhLowerList },
      { position: 'costumeList', values: this.costumeEnhGarmentList },
      { position: 'costumeList', values: this.costumeEnhGarment2List },
      { position: 'costumeList', values: this.costumeEnhGarment4List },
      { position: 'shadowArmorList', values: this.shadowArmorList },
      { position: 'shadowShieldList', values: this.shadowShieldList },
      { position: 'shadowBootList', values: this.shadowBootList },
      { position: 'shadowEarringList', values: this.shadowEarringList },
      { position: 'shadowPendantList', values: this.shadowPendantList },
      { position: 'shadowWeaponList', values: this.shadowWeaponList },
    ];

    this.equipableItems = items.flatMap((a) => {
      return a.values.map((value) => {
        return {
          label: value.label,
          id: value.value as number,
          value: value.value,
          position: a.position,
        };
      });
    });
  }

  private setAmmoDropdownList() {
    const myAmmoId = this.calculator.getAmmoSubTypeId();
    // const isMC = this.selectedCharacter.className === ClassName.Mechanic;
    const onlyMyAmmo = (a: DropdownModel) => {
      const ammo = this.items[a.value];
      if (!ammo) return false;

      // const onlyMC = ammo.aegisName?.includes('Cannon_Ball');

      // if (isMC && onlyMC) {
      //   return true;
      // }

      return ammo.itemSubTypeId === myAmmoId;
    };

    this.ammoList = this.itemList.ammoList.filter(onlyMyAmmo);
  }

  private getOptionScripts(rawOptionTxts: string[]) {
    return (rawOptionTxts || [])
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


  private updateAvailablePoints() {
    const { str, agi, vit, int, dex, luk } = this.model;
    const mainStatuses = [str, agi, vit, int, dex, luk];

    const { pow, sta, wis, spl, con, crt } = this.model;
    const traitStatus = [pow, sta, wis, spl, con, crt];

    const { availablePoint, appropriateLevel, availableTraitPoint, appropriateLevelForTrait } = this.stateCalculator
      .setLevel(this.model.level)
      .setClass(this.selectedCharacter)
      .setMainStatusLevels(mainStatuses)
      .setTraitStatusLevels(traitStatus)
      .calculate().summary;

    this.availablePoints = availablePoint;
    this.appropriateLevel = appropriateLevel;

    if (this.isAllowTraitStat) {
      this.availableTraitPoints = availableTraitPoint;
      this.appropriateLevelForTrait = appropriateLevelForTrait;
    } else {
      this.availableTraitPoints = 0;
      this.appropriateLevelForTrait = 0;
    }
  }

  onSelectItem(itemType: string, itemId = 0, refine = 0) {
    // console.log({ itemType, itemId, refine })
    this.equipItemMap.set(itemType as ItemTypeEnum, itemId);

    // if (!itemType.startsWith('weapon')) {
    //   this.updateItemEvent.next(itemType);
    //   return;
    // }

    // if (this.isMainItem(itemType)) {
    //   this.itemSlotsMap[itemType] = this.items[itemId]?.slots || 0;
    //   this.setEnchantList(itemId, itemType);
    //   this.clearCard(itemType);
    // }
    // if (this.isOptionableItem(itemType)) {
    //   const itemAegisName = this.items[itemId]?.aegisName;
    //   this.itemTotalOptionMap[itemType] = ExtraOptionTable[itemAegisName] || 0;
    // }

    // in order to check is the weapon allow to hold shield or left weapon or not
    if (itemType === ItemTypeEnum.weapon) {
      this.calculator.setWeapon({ itemId, refine });
      this.isWeaponCanGrade = this.items[itemId]?.canGrade || false;
    }

    this.updateItemEvent.next(itemType);
  }

  onSelectGrade(itemType: string, _itemId: number, _grade: string) {
    this.updateItemEvent.next(itemType);
  }

  onClearItem(itemType: string) {
    if (this.model[`${itemType}Refine`] > 0) {
      this.model[`${itemType}Refine`] = 0;
    }
    if (this.model[`${itemType}Grade`]) {
      this.model[`${itemType}Grade`] = '';
    }

    if (itemType === ItemTypeEnum.weapon) {
      this.model.propertyAtk = undefined;
      this.model.ammo = undefined;
      for (let i = 0; i <= 5; i++) {
        this.model.rawOptionTxts[i] = undefined;
      }

      this.onClearItem(ItemTypeEnum.leftWeapon);
    } else if (itemType === ItemTypeEnum.leftWeapon) {
      for (let i = 3; i <= 5; i++) {
        this.model.rawOptionTxts[i] = undefined;
      }
    }

    const relatedItems = MainItemWithRelations[itemType as ItemTypeEnum] || [];
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
    this.selectedMonsterName = this.monsterDataMap?.[this.selectedMonster]?.name;
    this.updateItemEvent.next(1);
  }

  onSelectItemDescription(isCompareItem = false) {
    let selectedType: ItemTypeEnum;
    let bonus: any;
    let itemId: number;

    // console.log({ isCompareItem, selectedType: this.selectedCompareItemDesc });

    if (isCompareItem) {
      selectedType = this.selectedCompareItemDesc;
      bonus = this.compareItemSummaryModel?.[selectedType] || {};
      itemId = this.equipCompareItemIdItemTypeMap.get(selectedType);

      this.selectedItemDesc = undefined;
    } else {
      selectedType = this.selectedItemDesc;
      bonus = this.itemSummary?.[selectedType] || this.itemSummary2?.[selectedType] || {};
      itemId = this.equipItemIdItemTypeMap.get(selectedType);

      this.selectedCompareItemDesc = undefined;
    }

    this.itemId = itemId;
    this.itemBonus = bonus; //{ script, bonus };
    this.itemDescription = prettyItemDesc(this.items[itemId]?.description);
  }

  onLog(inputs) {
    console.log({ inputs, model2: this.model2 });
  }

  onOptionChange() {
    this.updateItemEvent.next(1);
  }

  onClassChange(isChangeByInput = true) {
    if (isChangeByInput) {
      this.isInProcessingPreset = true;

      const { level, jobLevel } = this.model;

      waitRxjs()
        .pipe(
          mergeMap(() => {
            this.resetModel();
            return waitRxjs();
          }),
          mergeMap(() => {
            this.calculator = new Calculator();
            this.calculator.setMasterItems(this.items).setHpSpTable(this.hpSpTable);

            this.setClassInstant();
            this.setSkillModelArray();
            this.setClassSkill();
            this.setClassMinMaxLvl();
            return waitRxjs();
          }),
          mergeMap(() => {
            this.setClassLvl({ currentLvl: level, currentJob: jobLevel });
            this.onListItemComparingChange(true);

            this.updateAvailablePoints();
            this.equipItemMap.clear();
            this.resetItemDescription();

            this.setJobBonus();
            return waitRxjs();
          }),
          mergeMap(() => {
            this.setAspdPotionList();
            this.setDefaultSkill();
            this.setItemDropdownList();
            this.setAmmoDropdownList();
            return waitRxjs(0.5);
          }),
          take(1),
          finalize(() => (this.isInProcessingPreset = false)),
        )
        .subscribe(() => {
          this.updateItemEvent.next(1);
          this.updateCompareEvent.next(1);
        });
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

  onListItemComparingChange(isClear = false) {
    if (isClear) {
      this.compareItemNames = [];
    }

    this.isEnableCompare = this.compareItemNames.length > 0;

    this.updateCompareEvent.next(1);
  }

  onCompareItemChange() {
    this.updateCompareEvent.next(1);
  }

  onClickMonster() {
    this.monsterRef = this.dialogService.open(MonsterDataViewComponent, {
      header: 'Select a Product',
      width: '75%',
      height: '90%',
      showHeader: false,
      dismissableMask: true,
      contentStyle: { overflow: 'auto' },
      baseZIndex: 10000,
      data: {
        monsters: this.monsterList,
      },
    });
    this.monsterRef.onClose.subscribe((monsterId: any) => {
      if (monsterId) {
        this.selectedMonster = monsterId;
        this.onMonsterChange();
      }
    });
  }

  onSelecteChance(_a: any) {
    this.updateChanceEvent.next(1);
  }

  onJobPromotionClick() {
    const nextJobId = JobPromotionMapper[this.model?.class];
    if (!nextJobId) return;

    this.waitConfirm(`Change to "${ClassID[nextJobId]}" with current equipment ?`).then((isConfirm) => {
      if (!isConfirm) return;

      this.saveCurrentStateItemset();

      const j = JSON.parse(localStorage.getItem('ro-set')) || {};
      j.class = nextJobId;

      this.loadItemSet(j, true)
        .pipe(
          tap(() => {
            this.messageService.add({
              severity: 'success',
              summary: 'Job Changed',
            });
            return waitRxjs();
          }),
          catchError((err) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Failed',
              detail: `${err}`,
            });

            return of(null);
          }),
        ).subscribe();
    });

  }

  confirmSync() {
    const total = this.getPresetList().length;
    if (total > 0) {
      // this.confirmationService.confirm({
      //   message: `Sync ${total} presets to cloud ?`,
      //   header: 'Confirmation',
      //   icon: 'pi pi-exclamation-triangle',
      //   accept: () => {
      //     this.syncLocalPresetToCloud();
      //   },
      // });
      this.syncLocalPresetToCloud();
    }
  }

  private syncLocalPresetToCloud() {
    if (!this.isLoggedIn) return;

    const localPresets = this.getPresetList() as unknown as { value: string; model: any; }[];
    if (localPresets.length === 0) return;

    this.isInProcessingPreset = true;

    const mapFix = new Map([
      ['Fire-Charm', 10],
      ['Earth-Charm', 20],
      ['Ice-Charm', 30],
      ['Wind-Charm', 40],
      ['Trap Research==1', 1],
      ['Trap Research==2', 2],
      ['Trap Research==3', 3],
      ['Trap Research==4', 4],
      ['Trap Research==5', 5],
      ['Trap Research==6', 6],
      ['Trap Research==7', 7],
      ['Trap Research==8', 8],
      ['Trap Research==9', 9],
      ['Trap Research==10', 10],
      ['No Limits==1', 1],
      ['No Limits==2', 2],
      ['No Limits==3', 3],
      ['No Limits==4', 4],
      ['No Limits==5', 5],
      ['Wind Walk==5', 5],
      ['Improve Concentration==10', 10],
      ['Falcon Eyes==10', 10],
      ["Owl's Eye==10", 10],
      ["Vulture's Eye==10", 10],
    ]);
    const mapClass = new Map(Characters.map((a) => [a.value as number, (a as any).instant as CharacterBase]));

    const fixPresets = localPresets.map((a) => {
      const activeSkills = a.model.activeSkills.map((val) => mapFix.get(val) ?? val);
      const passiveSkills = a.model.passiveSkills.map((val) => mapFix.get(val) ?? val);
      const c = mapClass.get(a.model.class);

      const skillBuffMap = {};
      const passiveSkillMap = {};
      const activeSkillMap = {};

      if (c) {
        try {
          for (let i = 0; i < this.skillBuffs.length; i++) {
            skillBuffMap[this.skillBuffs[i].name] = a.model?.skillBuffs?.[i];
          }
          for (let i = 0; i < c.passiveSkills.length; i++) {
            passiveSkillMap[c.passiveSkills[i].name] = passiveSkills[i];
          }
          for (let i = 0; i < c.activeSkills.length; i++) {
            activeSkillMap[c.activeSkills[i].name] = activeSkills[i];
          }
        } catch (error) {
          console.log({ error });
        }
      }

      return {
        ...a,
        model: {
          ...a.model,
          activeSkills,
          passiveSkills,
          skillBuffMap,
          activeSkillMap,
          passiveSkillMap,
        },
      };
    });

    this.presetService
      .bulkCreatePresets({ bulkData: fixPresets })
      .pipe(
        tap((c) => {
          verifySyncPreset(localPresets, c);

          this.deleteLocalPresets();
          this.messageService.add({
            severity: 'info',
            summary: 'Confirmed',
            detail: `Sync successed.`,
          });

          this.isInProcessingPreset = false;
        }),
        catchError((err) => {
          return this.handleAPIError(err);
        }),
      )
      .subscribe((createdPresets) => {
        this.preSets = createdPresets.map((a) => {
          return {
            label: a.label,
            value: a.id,
            icon: ClassIcon[a.classId],
          };
        });
        console.log('preset sycned');
      });
  }

  private handleAPIError(err: any) {
    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: ToErrorDetail(err),
    });

    return throwError(() => err);
  }

  onShowElementalTableClick() {
    this.allSelectedMonsterIds = [this.selectedMonster, ...(this.selectedMonsterIds || [])];
    this.isShowMonsterEle = true;
  }
}
