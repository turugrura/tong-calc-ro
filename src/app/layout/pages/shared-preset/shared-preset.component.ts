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
  delay,
  forkJoin,
  of,
  switchMap,
  take,
  tap,
  throwError,
} from 'rxjs';
import { ItemModel } from '../ro-calculator/models/item.model';
import { MonsterModel } from '../ro-calculator/models/monster.model';
import { PaginatorState } from 'primeng/paginator';
import { Unauthorized } from 'src/app/app-errors';
import { MessageService } from 'primeng/api';
import { RoyalGuard } from '../ro-calculator/jobs/royal-guard';
import { ActiveSkillModel, AtkSkillModel, CharacterBase } from '../ro-calculator/jobs/_character-base.abstract';
import { ArchBishop } from '../ro-calculator/jobs/arch-bishop';
import { Doram } from '../ro-calculator/jobs/doram';
import { Genetic } from '../ro-calculator/jobs/genetic';
import { GitCross } from '../ro-calculator/jobs/git-cross';
import { Kagerou } from '../ro-calculator/jobs/kagerou';
import { Mechanic } from '../ro-calculator/jobs/mechanic';
import { Minstrel } from '../ro-calculator/jobs/minstrel';
import { Oboro } from '../ro-calculator/jobs/oboro';
import { Ranger } from '../ro-calculator/jobs/ranger';
import { Rebelion } from '../ro-calculator/jobs/rebellion';
import { RuneKnight } from '../ro-calculator/jobs/rune-knight';
import { ShadowChaser } from '../ro-calculator/jobs/shadow-chaser';
import { Sorcerer } from '../ro-calculator/jobs/sorcerer';
import { SoulReaper } from '../ro-calculator/jobs/soul-reaper';
import { StarEmperor } from '../ro-calculator/jobs/star-emperor';
import { SuperNovice } from '../ro-calculator/jobs/super-novice';
import { Sura } from '../ro-calculator/jobs/sura';
import { Wanderer } from '../ro-calculator/jobs/wanderer';
import { Warlock } from '../ro-calculator/jobs/warlock';
import { Calculator } from '../ro-calculator/calculator';
import { JobBuffs } from '../ro-calculator/constants/job-buffs';
import { ExtraOptionTable } from '../ro-calculator/constants/extra-option-table';
import { ItemOptionNumber } from '../ro-calculator/constants/item-option-number.enum';
import { ItemTypeEnum } from '../ro-calculator/constants/item-type.enum';
import { MainModel } from '../ro-calculator/models/main.model';
import { HpSpTable } from '../ro-calculator/models/hp-sp-table.model';
import { getMonsterSpawnMap } from '../ro-calculator/constants/monster-spawn-mapper';

const Characters: (DropdownModel & { icon: number; instant: CharacterBase })[] = [
  { label: ClassID[11], value: 11, icon: ClassIcon[11], instant: new RoyalGuard() },
  { label: ClassID[12], value: 12, icon: ClassIcon[12], instant: new RuneKnight() },
  { label: ClassID[7], value: 7, icon: ClassIcon[7], instant: new ArchBishop() },
  { label: ClassID[13], value: 13, icon: ClassIcon[13], instant: new Sura() },
  { label: ClassID[2], value: 2, icon: ClassIcon[2], instant: new Ranger() },
  { label: ClassID[21], value: 21, icon: ClassIcon[21], instant: new Minstrel() },
  { label: ClassID[22], value: 22, icon: ClassIcon[22], instant: new Wanderer() },
  { label: ClassID[5], value: 5, icon: ClassIcon[5], instant: new GitCross() },
  { label: ClassID[4], value: 4, icon: ClassIcon[4], instant: new ShadowChaser() },
  { label: ClassID[6], value: 6, icon: ClassIcon[6], instant: new Warlock() },
  { label: ClassID[8], value: 8, icon: ClassIcon[8], instant: new Sorcerer() },
  { label: ClassID[10], value: 10, icon: ClassIcon[10], instant: new Mechanic() },
  { label: ClassID[9], value: 9, icon: ClassIcon[9], instant: new Genetic() },
  { label: ClassID[30], value: 30, icon: ClassIcon[30], instant: new SuperNovice() },
  { label: ClassID[3], value: 3, icon: ClassIcon[3], instant: new SoulReaper() },
  { label: ClassID[33], value: 33, icon: ClassIcon[33], instant: new StarEmperor() },
  { label: ClassID[17], value: 17, icon: ClassIcon[17], instant: new Oboro() },
  { label: ClassID[18], value: 18, icon: ClassIcon[18], instant: new Kagerou() },
  { label: ClassID[1], value: 1, icon: ClassIcon[1], instant: new Rebelion() },
  { label: ClassID[31], value: 31, icon: ClassIcon[31], instant: new Doram() },
];

const waitRxjs = <T>(second: number = 0.1, res = null as T) => {
  return of(res).pipe(delay(1000 * second), take(1));
};

const extraOptionList: [ItemTypeEnum, [ItemOptionNumber, ItemOptionNumber]][] = [
  [ItemTypeEnum.shield, [ItemOptionNumber.Shield_1, ItemOptionNumber.Shield_2]],
  [ItemTypeEnum.headUpper, [ItemOptionNumber.H_Upper_1, ItemOptionNumber.H_Upper_2]],
  [ItemTypeEnum.headMiddle, [ItemOptionNumber.H_Mid_1, ItemOptionNumber.H_Mid_2]],
  // [ItemTypeEnum.headLower, [ExtraOption.H_Low_1, ExtraOption.H_Low_2]],
  [ItemTypeEnum.armor, [ItemOptionNumber.Armor_1, ItemOptionNumber.Armor_2]],
  [ItemTypeEnum.garment, [ItemOptionNumber.Garment_1, ItemOptionNumber.Garment_2]],
  // [ItemTypeEnum.boot, [ExtraOption.Boot_1, ExtraOption.Boot_2]],
  [ItemTypeEnum.accLeft, [ItemOptionNumber.A_Left_1, ItemOptionNumber.A_Left_2]],
  [ItemTypeEnum.accRight, [ItemOptionNumber.A_Right_1, ItemOptionNumber.A_Right_2]],
];

@Component({
  selector: 'app-shared-preset',
  templateUrl: './shared-preset.component.html',
  styleUrls: ['./shared-preset.component.css'],
  providers: [MessageService],
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
  hpSpTable: HpSpTable;

  selectedTag = 'no_tag'; //this.availableTags[0].value as string;
  selectedClassId = this.allClasses[0].value as number;

  searchSource = new Subject<number>();
  searchEvent$ = this.searchSource.asObservable();

  likeSource = new Subject<{ tagId: string; isLike: boolean }>();
  likeEvent$ = this.likeSource.asObservable();

  subscriptions = [] as Subscription[];
  viewDetail = {} as any;

  monsterCalculator = new Calculator();
  groupMonsterList: any[] = [];
  selectedMonster = 21067;
  selectedCharacter: CharacterBase;
  selectedAtkSkill = '';

  isCalculating = false;
  offensiveSkills: DropdownModel[] = [];
  skillBuffs = JobBuffs;
  atkSkills: AtkSkillModel[] = [];
  activeSkills: ActiveSkillModel[] = [];
  // consumableList: DropdownModel[] = [];
  // consumableList2: DropdownModel[][] = FoodStatList;
  // aspdPotionList: DropdownModel[] = [];
  // aspdPotionList2: DropdownModel[] = [
  //   { label: 'Enrich Celermine', value: 12437 },
  // ];
  totalSummary = {} as any;
  summaries = [] as {
    id: string;
    name: string;
    summary: Record<string, any> & { dmg: any; calcSkill: any; calc: any };
    model: any;
  }[];
  isCalculated = {} as Record<string, boolean>;

  constructor(
    private readonly presetService: PresetService,
    private readonly roService: RoService,
    private readonly messageService: MessageService,
  ) {}

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
      this.roService.getHpSpTable<HpSpTable>(),
    ]).pipe(
      tap(([items, monsters, hpSpTable]) => {
        this.itemMap = items;
        this.monsterDataMap = monsters;
        this.hpSpTable = hpSpTable;

        this.onSelectClassChange();
        this.setMonsterDropdownList();
        this.onMonsterChange();
      }),
    );
  }

  private setMonsterDropdownList() {
    const groupMap = new Map<string, any>();
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

    // this.monsterList = monsters;
    this.groupMonsterList = [...groupMap.values()].sort((a, b) => {
      return a.label > b.label ? 1 : -1;
    });
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
              catchError((err) => {
                if (err instanceof Unauthorized) {
                  this.messageService.add({
                    severity: 'error',
                    summary: 'Please login',
                  });
                }

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

  onSelectClassChange() {
    this.searchSource.next(1);

    if (this.selectedClassId) {
      this.selectedCharacter = Characters.find((a) => a.value === this.selectedClassId)?.instant;
      this.setClassSkill();
      waitRxjs().subscribe(() => {
        this.setDefaultSkill();
      });
    }

    this.summaries = [];
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

  addToCalc(presetTag: PublishPresetModel) {
    this.isCalculating = true;

    waitRxjs()
      .pipe(
        switchMap(() => {
          this.isCalculated[presetTag.tagId] = true;
          return waitRxjs();
        }),
        switchMap(() => {
          const calculator = this.prepare(presetTag.model as any);
          const summary = calculator.getTotalSummary();

          const current = this.summaries.find((a) => a.id === presetTag.tagId);
          if (current) {
            current.summary = summary;
          } else {
            this.summaries.push({
              id: presetTag.tagId,
              name: presetTag.publishName,
              model: presetTag.model,
              summary,
            });
          }

          return waitRxjs();
        }),
      )
      .subscribe(() => {
        this.isCalculating = false;
      });
  }

  removeCalculated(tagId: string) {
    this.isCalculated[tagId] = false;

    this.isCalculating = true;
    waitRxjs()
      .pipe(
        switchMap(() => {
          this.summaries = this.summaries.filter((a) => a.id !== tagId);
          return waitRxjs();
        }),
      )
      .subscribe(() => {
        this.isCalculating = false;
      });
  }

  private setClassSkill() {
    this.activeSkills = this.selectedCharacter.activeSkills;
    // this.passiveSkills = this.selectedCharacter.passiveSkills;
    this.atkSkills = this.selectedCharacter.atkSkills;
    this.offensiveSkills = [...new Set(this.atkSkills.map((a) => a.name)).values()].map((name) => {
      return {
        label: name,
        value: name,
      };
    });
  }

  private setDefaultSkill() {
    const defaultAtkSkill = this.atkSkills[0].value;
    this.selectedAtkSkill = defaultAtkSkill;
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

  private prepare(model: MainModel) {
    const { activeSkills, passiveSkills } = model;
    const { equipAtks, masteryAtks, activeSkillNames, learnedSkillMap } = this.selectedCharacter
      .setLearnSkills({
        activeSkillIds: activeSkills,
        passiveSkillIds: passiveSkills,
      })
      .getSkillBonusAndName();

    const { consumables, consumables2, aspdPotion, aspdPotions } = model;
    const usedSupBattlePill = consumables.includes(12792);
    const usedHpL = consumables.includes(12424);
    const consumeData = [...consumables, ...consumables2, ...aspdPotions]
      .filter(Boolean)
      .filter((id) => !usedSupBattlePill || (usedSupBattlePill && id !== 12791))
      .map((id) => this.itemMap[id].script);

    const buffEquips = {};
    const buffMasterys = {};
    this.skillBuffs.forEach((skillBuff, i) => {
      const buffVal = model.skillBuffs[i];
      const buff = skillBuff.dropdown.find((a) => a.value === buffVal);
      if (buff?.isUse && !activeSkillNames.has(skillBuff.name)) {
        if (skillBuff.isMasteryAtk) {
          buffMasterys[skillBuff.name] = buff.bonus;
        } else {
          buffEquips[skillBuff.name] = buff.bonus;
        }
      }
    });

    const rawOptionTxts = [...model.rawOptionTxts];

    // clean if the itemType not allow to have options
    for (const [_itemType, [min, max]] of extraOptionList) {
      const itemId = model[_itemType];

      let startClear = 0;
      if (itemId) {
        const aegisName = this.itemMap[itemId]?.aegisName;
        startClear = ExtraOptionTable[aegisName] || 0;
      }

      for (let i = min + startClear; i <= max; i++) {
        rawOptionTxts[i] = null;
      }
    }
    model.rawOptionTxts = rawOptionTxts;

    return (
      new Calculator()
        .setMasterItems(this.itemMap)
        .setClass(this.selectedCharacter)
        .setHpSpTable(this.hpSpTable)
        .loadItemFromModel(model)
        .setMonster(this.monsterDataMap[this.selectedMonster])
        .setEquipAtkSkillAtk(equipAtks)
        .setBuffBonus({ masteryAtk: buffMasterys, equipAtk: buffEquips })
        .setMasterySkillAtk(masteryAtks)
        .setConsumables(consumeData)
        .setAspdPotion(aspdPotion)
        .setExtraOptions(this.getOptionScripts(rawOptionTxts))
        .setUsedSkillNames(activeSkillNames)
        .setLearnedSkills(learnedSkillMap)
        .setOffensiveSkill(this.selectedAtkSkill)
        .prepareAllItemBonus()
        // .setSelectedChances(this.selectedChances)
        .calcAllDefs()
        .calculateHpSp({ isUseHpL: usedHpL })
        .calculateAllDamages(this.selectedAtkSkill)
    );
  }

  onAtkSkillChange() {
    this.recalcSummary();
  }

  onMonsterChange() {
    this.totalSummary = this.monsterCalculator.setMonster(this.monsterDataMap[this.selectedMonster]).getTotalSummary();
    this.recalcSummary();
  }

  recalcSummary() {
    this.isCalculating = true;

    waitRxjs()
      .pipe(
        switchMap(() => {
          this.summaries = this.summaries.map((s) => {
            const calc = this.prepare(s.model);

            return {
              ...s,
              summary: calc.getTotalSummary(),
            };
          });
          return waitRxjs();
        }),
      )
      .subscribe(() => (this.isCalculating = false));
  }
}
