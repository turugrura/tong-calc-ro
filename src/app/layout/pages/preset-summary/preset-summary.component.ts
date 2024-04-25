import { Component, OnDestroy, OnInit } from '@angular/core';
import { getClassDropdownList } from '../ro-calculator/jobs/_class-list';
import { SummaryService } from 'src/app/demo/service/summary.service';
import { Subject, Subscription, debounceTime, forkJoin, tap } from 'rxjs';
import { ClassID } from '../ro-calculator/jobs/_class-name';
import { RoService } from 'src/app/demo/service/ro.service';
import { ItemModel } from '../ro-calculator/models/item.model';
import { prettyItemDesc } from '../ro-calculator/utils';

type JobIdMapType<T> = Record<keyof typeof ClassID, T>;

interface ItemRankingModel {
  ItemId: number | string;
  ItemName: string;
  ColorStyle: string;
  Percentage: number;
  UsingRate: number;
  TotalPreset: number;
  TotalAccount: number;
  TotalEnchant: number;
  Enchants: Record<string, number>;
  EnchantInfos: { id: number; name: string }[];
  IsEnchant: boolean;
}

enum EquipmentPosition {
  Weapon = 'Weapon',
  WeaponCard = 'WeaponCard',
  LeftWeapon = 'LeftWeapon',
  LeftWeaponCard = 'LeftWeaponCard',
  Shield = 'Shield',
  ShieldCard = 'ShieldCard',

  HeadUpper = 'HeadUpper',
  HeadUpperCard = 'HeadUpperCard',
  HeadMiddle = 'HeadMiddle',
  HeadMiddleCard = 'HeadMiddleCard',
  HeadLower = 'HeadLower',

  Armor = 'Armor',
  ArmorCard = 'ArmorCard',
  Garment = 'Garment',
  GarmentCard = 'GarmentCard',
  Boot = 'Boot',
  BootCard = 'BootCard',
  AccLeft = 'AccLeft',
  AccLeftCard = 'AccLeftCard',
  AccRight = 'AccRight',
  AccRightCard = 'AccRightCard',

  CostumeEnchantUpper = 'CostumeEnchantUpper',
  CostumeEnchantMiddle = 'CostumeEnchantMiddle',
  CostumeEnchantLower = 'CostumeEnchantLower',
  CostumeEnchantGarment = 'CostumeEnchantGarment',

  ShadowWeapon = 'ShadowWeapon',
  ShadowShield = 'ShadowShield',
  ShadowArmor = 'ShadowArmor',
  ShadowBoot = 'ShadowBoot',
  ShadowEarring = 'ShadowEarring',
  ShadowPendant = 'ShadowPendant',
}

type ItemPositionType = EquipmentPosition;

type EquipmentRankingModel = Record<ItemPositionType, ItemRankingModel[]>;

type TotalSummaryModel = JobIdMapType<Record<string, EquipmentRankingModel>>;

type JobSummary = JobIdMapType<number>;

type JobSkillSummary = JobIdMapType<Record<string, number>>;

const getEmptyRanking = () => {
  return Object.values(EquipmentPosition).reduce((pre, item) => {
    pre[item] = [];
    return pre;
  }, {}) as Record<EquipmentPosition, ItemRankingModel[]>;
};

@Component({
  selector: 'app-preset-summary',
  templateUrl: './preset-summary.component.html',
  styleUrls: ['./preset-summary.component.css'],
})
export class PresetSummaryComponent implements OnInit, OnDestroy {
  private jobChangeSource = new Subject();
  private jobChangeEvent$ = this.jobChangeSource.asObservable();

  private skillChangeSource = new Subject();
  private skillChangeEvent$ = this.skillChangeSource.asObservable();

  private itemChangeSource = new Subject();
  private itemChangeEvent$ = this.itemChangeSource.asObservable();

  private subscribtions = [] as Subscription[];

  isLoading = false;

  allItemPositions = Object.values(EquipmentPosition);
  allClasses = getClassDropdownList();
  allClasseMap = new Map(this.allClasses.map((a) => [a.value, a.label]));
  selectedJobId = this.allClasses[0].value as number;
  selectedJobName = this.allClasses[0].label;
  selectedSkillName = '';

  displaySelectedItems: { id: number; name: string; desc: string }[];
  selectedItemId: number | string;

  itemMap = {} as Record<number, ItemModel>;
  jobSkillSummary = {} as JobSkillSummary;
  jobSummary = {} as JobSummary;
  totalSummary = {} as TotalSummaryModel;
  totalPresets = 0;

  skillRankingList = [] as { value: string; label: string; total: number }[];
  rankingMap = getEmptyRanking();

  constructor(private readonly summaryService: SummaryService, private readonly roService: RoService) {}

  ngOnInit() {
    this.loadData();
    this.subscribeEvent();
  }

  ngOnDestroy(): void {
    for (const s of this.subscribtions) {
      s.unsubscribe();
    }
  }

  private loadData() {
    forkJoin([
      this.summaryService.getClassSkillSummary<JobSkillSummary>(),
      this.summaryService.getJobSummary<JobSummary>(),
      this.summaryService.getTotalSummary<TotalSummaryModel>(),
      this.roService.getItems<Record<number, ItemModel>>(),
    ]).subscribe(([jobSkillSummary, jobSummary, totalSummary, itemMap]) => {
      this.jobSkillSummary = jobSkillSummary;
      this.jobSummary = jobSummary;
      this.totalSummary = totalSummary;
      this.itemMap = itemMap;
      this.setSkillRankingBySelection();
      this.setRankingBySelection();
    });
  }

  private subscribeEvent() {
    const e1 = this.jobChangeEvent$
      .pipe(
        tap(() => (this.isLoading = true)),
        debounceTime(75),
      )
      .subscribe(() => {
        this.setSkillRankingBySelection();
        this.setRankingBySelection();
        this.selectedJobName = this.allClasseMap.get(this.selectedJobId) || '';
        this.isLoading = false;
      });
    const e2 = this.skillChangeEvent$
      .pipe(
        tap(() => (this.isLoading = true)),
        debounceTime(75),
      )
      .subscribe(() => {
        this.setRankingBySelection();
        this.isLoading = false;
      });
    const e3 = this.itemChangeEvent$.pipe(debounceTime(100)).subscribe(() => {
      const itemIds = `${this.selectedItemId}`.split('-').map(Number).filter(Boolean);
      this.displaySelectedItems = [...new Set(itemIds)].map((id) => {
        const item = this.itemMap[id] || ({} as ItemModel);

        return {
          id,
          desc: prettyItemDesc(item.description),
          name: item.name,
        };
      });
    });

    this.subscribtions.push(e1, e2, e3);
  }

  private get itemRankingList(): EquipmentRankingModel {
    if (!this.selectedJobId || !this.selectedSkillName) return getEmptyRanking();

    return this.totalSummary[this.selectedJobId][this.selectedSkillName];
  }

  get totalAccounts(): number {
    return this.jobSummary[this.selectedJobId] || 0;
  }

  private setSkillRankingBySelection(): void {
    const data = this.jobSkillSummary[this.selectedJobId] || {};
    const skillRankingList = [] as typeof this.skillRankingList;
    for (const [skillName, total] of Object.entries(data)) {
      skillRankingList.push({
        value: skillName,
        label: skillName,
        total: Number(total),
      });
    }
    this.skillRankingList = skillRankingList.sort((a, b) => b.total - a.total);
    this.selectedSkillName = skillRankingList[0]?.value;
  }

  private setRankingBySelection() {
    const totalPresets = 0;
    for (const position of this.allItemPositions) {
      const rankingMap = [] as ItemRankingModel[];

      for (const a of this.itemRankingList[position]) {
        const percentage = Math.ceil(
          (a.UsingRate * 100) / this.jobSkillSummary[this.selectedJobId][this.selectedSkillName],
        );
        rankingMap.push({
          ...a,
          Percentage: percentage,
          ItemName: this.itemMap[a.ItemId]?.name,
          ColorStyle: this.getItemBarColorStyle(position),
          IsEnchant: false,
          EnchantInfos: [],
        });

        const sortedEnchants = Object.entries(a.Enchants)
          .sort(([_, usingRate1], [__, usingRate2]) => usingRate2 - usingRate1)
          .filter(([_, usingRate], i) => i <= 4 && usingRate >= 0.5);
        for (const [key, value] of sortedEnchants) {
          const percentage = Math.floor((value * 100) / (a.TotalEnchant || 1));
          if (percentage <= 0) continue;

          const [id1, id2, id3] = key.split('-').map(Number);
          if (!!id1 || !!id2 || !!id3) {
            const ids = [id1, id2, id3].filter(Number);

            rankingMap.push({
              ItemId: key,
              Enchants: {},
              UsingRate: 0,
              ItemName: '',
              TotalAccount: 0,
              TotalEnchant: 0,
              TotalPreset: 0,
              IsEnchant: true,
              Percentage: percentage,
              ColorStyle: this.getItemBarColorStyle(position),
              EnchantInfos: ids.map((id) => {
                return {
                  id,
                  name: this.itemMap[id]?.name,
                };
              }),
            });
          }
        }
      }

      this.rankingMap[position] = rankingMap;
    }

    this.totalPresets = totalPresets;
  }

  private getItemBarColorStyle(position: EquipmentPosition) {
    switch (position) {
      case EquipmentPosition.Weapon:
      case EquipmentPosition.WeaponCard:
        return 'orange-500';
      case EquipmentPosition.LeftWeapon:
      case EquipmentPosition.LeftWeaponCard:
        return 'orange-500';
      case EquipmentPosition.Shield:
      case EquipmentPosition.ShieldCard:
        return 'pink-400';

      case EquipmentPosition.HeadUpper:
      case EquipmentPosition.HeadUpperCard:
      case EquipmentPosition.HeadMiddle:
      case EquipmentPosition.HeadMiddleCard:
      case EquipmentPosition.HeadLower:
        return 'blue-400';

      case EquipmentPosition.Armor:
      case EquipmentPosition.ArmorCard:
      case EquipmentPosition.Garment:
      case EquipmentPosition.GarmentCard:
      case EquipmentPosition.Boot:
      case EquipmentPosition.BootCard:
        return 'red-500';
      case EquipmentPosition.AccLeft:
      case EquipmentPosition.AccLeftCard:
      case EquipmentPosition.AccRight:
      case EquipmentPosition.AccRightCard:
        return 'teal-400';

      case EquipmentPosition.CostumeEnchantUpper:
      case EquipmentPosition.CostumeEnchantMiddle:
      case EquipmentPosition.CostumeEnchantLower:
      case EquipmentPosition.CostumeEnchantGarment:
        return 'yellow-500';

      case EquipmentPosition.ShadowWeapon:
      case EquipmentPosition.ShadowShield:
      case EquipmentPosition.ShadowArmor:
      case EquipmentPosition.ShadowBoot:
      case EquipmentPosition.ShadowEarring:
      case EquipmentPosition.ShadowPendant:
        return 'green-500';
      default:
        return 'orange-500';
    }
  }

  onJobChange() {
    this.jobChangeSource.next(1);
  }

  onSkillChange() {
    this.skillChangeSource.next(1);
  }

  onItemChange() {
    this.itemChangeSource.next(1);
  }
}
