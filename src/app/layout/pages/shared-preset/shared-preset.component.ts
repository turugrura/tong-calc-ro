import { Component, OnDestroy, OnInit } from '@angular/core';
import { PresetService, PublishPresetModel, PublishPresetsReponse } from 'src/app/api-services';
import { availableTags } from '../ro-calculator/constants/available-tags';
import { DropdownModel } from '../ro-calculator/models/dropdown.model';
import { RoService } from 'src/app/demo/service/ro.service';
import {
  Observable,
  Subject,
  Subscription,
  catchError,
  debounceTime,
  forkJoin,
  of,
  switchMap,
  tap,
  throwError,
} from 'rxjs';
import { ItemModel } from '../ro-calculator/models/item.model';
import { MonsterModel } from '../ro-calculator/models/monster.model';
import { PaginatorState } from 'primeng/paginator';
import { Unauthorized } from 'src/app/app-errors';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ActiveSkillModel, AtkSkillModel, CharacterBase } from '../ro-calculator/jobs/_character-base.abstract';
import { Calculator } from '../ro-calculator/calculator';
import { JobBuffs } from '../ro-calculator/constants/job-buffs';
import { MainModel } from '../ro-calculator/models/main.model';
import { HpSpTable } from '../ro-calculator/models/hp-sp-table.model';
import { getMonsterSpawnMap } from '../ro-calculator/constants/monster-spawn-mapper';
import { getClassDropdownList } from '../ro-calculator/jobs/_class-list';
import { toRawOptionTxtList, waitRxjs } from '../ro-calculator/utils';

const Characters = getClassDropdownList();

@Component({
  selector: 'app-shared-preset',
  templateUrl: './shared-preset.component.html',
  styleUrls: ['./shared-preset.component.css'],
  providers: [MessageService, ConfirmationService],
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
  items: (PublishPresetModel & { summary: any } & any)[] = [];
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

  searchSource = new Subject<boolean>();
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
    private readonly confirmationService: ConfirmationService,
  ) {}

  ngOnInit() {
    this.subscribeSearch();
    this.subscribeLike();
    this.initData().subscribe(() => {
      // this.searchSource.next(1);
    });
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
        tap((isChangeClass) => {
          this.viewDetail = {};
          if (isChangeClass) {
            this.isCalculated = {};
          }
        }),
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
        this.items = searchRes.items.map((a) => {
          const mapPhamacy = {
            2: 100232,
            3: 100233,
          };
          const p = mapPhamacy[a.model?.skillBuffMap['Special Pharmacy']];
          if (Boolean(p) && Array.isArray(a.model.consumables)) {
            if (!a.model.consumables.includes(p)) {
              a.model.consumables.push(p);
            }
          }

          const c = this.prepare(a.model as any);
          const s = c.getTotalSummary() as any;

          return {
            ...a,
            str: (a.model.jobStr || 0) + (s.str || 0),
            agi: (a.model.jobAgi || 0) + (s.agi || 0),
            vit: (a.model.jobVit || 0) + (s.vit || 0),
            int: (a.model.jobInt || 0) + (s.int || 0),
            dex: (a.model.jobDex || 0) + (s.dex || 0),
            luk: (a.model.jobLuk || 0) + (s.luk || 0),
            summary: s,
          };
        });
        this.totalRecord = searchRes.totalItem;
        this.isLoading = false;
      });

    this.subscriptions.push(s);
  }

  search(isChangeClass: boolean) {
    this.searchSource.next(isChangeClass);
  }

  onSelectClassChange() {
    this.firstRecord = 0;
    this.searchSource.next(true);

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

  copyPreset(presetTag: PublishPresetModel) {
    console.log(presetTag.publishName);
    this.waitConfirm(`Copy "${presetTag.publishName}" ?`).then((isConfirm) => {
      if (!isConfirm) return;

      this.isLoading = false;
      this.presetService
        .createPreset({
          label: `copied ${presetTag.publishName}`,
          model: presetTag.model,
        })
        .pipe(
          tap(() => {
            this.messageService.add({
              severity: 'success',
              summary: 'Copy preset success',
            });
          }),
          catchError((err) => {
            this.messageService.add({
              severity: 'error',
              summary: err?.error || err?.message,
            });

            return of(true);
          }),
        )
        .subscribe(() => {
          this.isLoading = false;
        });
    });
  }

  pageChange(event: PaginatorState) {
    this.firstRecord = event.first;
    this.pageLimit = event.rows;
    this.search(false);
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
      const buffVal = (model.skillBuffs || [])[i];
      const buff = skillBuff.dropdown.find((a) => a.value === buffVal);
      if (buff?.isUse && !activeSkillNames.has(skillBuff.name)) {
        if (skillBuff.isMasteryAtk) {
          buffMasterys[skillBuff.name] = buff.bonus;
        } else {
          buffEquips[skillBuff.name] = buff.bonus;
        }
      }
    });

    model.rawOptionTxts = toRawOptionTxtList(model, this.itemMap);

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
        .setExtraOptions(this.getOptionScripts(model.rawOptionTxts))
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
