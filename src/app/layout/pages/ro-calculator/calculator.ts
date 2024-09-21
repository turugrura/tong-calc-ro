import { ItemModel } from '../../../models/item.model';
import { MonsterModel } from '../../../models/monster.model';
import { StatusSummary } from '../../../models/status-summary.model';
import { EquipmentSummaryModel } from '../../../models/equipment-summary.model';
import { MainModel } from '../../../models/main.model';
import { InfoForClass } from '../../../models/info-for-class.model';
import { HpSpCalculator } from './hp-sp-calculator';
import { HpSpTable } from '../../../models/hp-sp-table.model';
import { environment } from 'src/environments/environment';
import { DamageCalculator } from './damage-calculator';
import { BasicAspdModel, BasicDamageSummaryModel, MiscModel, SkillAspdModel, SkillDamageSummaryModel } from '../../../models/damage-summary.model';
import { ChanceModel } from '../../../models/chance-model';
import {
  AllowAmmoMapper,
  AllowShieldTable,
  ClassAmmoMapper,
  ElementType,
  ItemSubTypeId,
  ItemTypeEnum,
  MainItemTypeSet,
  MainItemWithRelations,
  SizePenaltyMapper,
  WeaponAmmoMapper,
} from 'src/app/constants';
import { CharacterBase, ClassName } from 'src/app/jobs';
import { createRawTotalBonus, floor, isNumber, round } from 'src/app/utils';
import { Monster, Weapon } from 'src/app/domain';
import { SKILL_NAME } from 'src/app/constants/skill-name';

// const getItem = (id: number) => items[id] as ItemModel;
const refinableItemTypes = [
  ItemTypeEnum.weapon,
  ItemTypeEnum.leftWeapon,
  ItemTypeEnum.headUpper,
  ItemTypeEnum.shield,
  ItemTypeEnum.armor,
  ItemTypeEnum.garment,
  ItemTypeEnum.boot,

  ItemTypeEnum.shadowWeapon,
  ItemTypeEnum.shadowArmor,
  ItemTypeEnum.shadowBoot,
  ItemTypeEnum.shadowEarring,
  ItemTypeEnum.shadowPendant,
  ItemTypeEnum.shadowShield,
];
const mainStatuses: (keyof EquipmentSummaryModel)[] = ['str', 'dex', 'int', 'agi', 'luk', 'vit'];
const traitStatuses: (keyof EquipmentSummaryModel)[] = ['pow', 'sta', 'wis', 'spl', 'con', 'crt'];

export class Calculator {
  private readonly DEFAULT_PERFECT_HIT = 5;

  private items!: Record<number, ItemModel>;

  private model: Partial<MainModel> = {
    class: undefined,
    level: 1,
    jobLevel: 1,
    str: 1,
    jobStr: undefined,
    agi: 1,
    jobAgi: undefined,
    vit: 1,
    jobVit: undefined,
    int: 1,
    jobInt: undefined,
    dex: 1,
    jobDex: undefined,
    luk: 1,
    jobLuk: undefined,
    propertyAtk: undefined,
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
  };
  private equipItem = new Map<ItemTypeEnum, ItemModel>();
  private equipItemName = new Map<ItemTypeEnum, string>();
  private equipItemNameSet = new Set<string>();
  private mapRefine = new Map<ItemTypeEnum, number>();
  private mapGrade = new Map<ItemTypeEnum, string>();
  private mapItemNameRefine = new Map<string, number>();
  private usedSkillNames = new Set<string>();
  private learnedSkillMap = new Map<string, number>();
  private equipAtkSkillBonus: Record<string, Record<string, any>> = {};
  private buffMasteryAtkBonus: Record<string, Record<string, any>> = {};
  private buffEquipAtkBonus: Record<string, Record<string, any>> = {};
  private masteryAtkSkillBonus: Record<string, any> = {};
  private consumableBonuses: any[] = [];
  private aspdPotion: number = undefined;

  private skillName: SKILL_NAME = '' as any;
  private allStatus = createRawTotalBonus();
  private totalEquipStatus = createRawTotalBonus();
  private equipStatus: Partial<Record<ItemTypeEnum, EquipmentSummaryModel>> = {
    weapon: { ...this.allStatus },
    weaponCard1: { ...this.allStatus },
    weaponCard2: { ...this.allStatus },
    weaponCard3: { ...this.allStatus },
    weaponCard4: { ...this.allStatus },
    weaponEnchant1: { ...this.allStatus },
    weaponEnchant2: { ...this.allStatus },
    weaponEnchant3: { ...this.allStatus },
    ammo: { ...this.allStatus },
    headUpper: { ...this.allStatus },
    headUpperRefine: { ...this.allStatus },
    headUpperCard: { ...this.allStatus },
    headUpperEnchant1: { ...this.allStatus },
    headUpperEnchant2: { ...this.allStatus },
    headUpperEnchant3: { ...this.allStatus },
    headMiddle: { ...this.allStatus },
    headMiddleCard: { ...this.allStatus },
    headMiddleEnchant1: { ...this.allStatus },
    headMiddleEnchant2: { ...this.allStatus },
    headMiddleEnchant3: { ...this.allStatus },
    headLower: { ...this.allStatus },
    headLowerEnchant1: { ...this.allStatus },
    headLowerEnchant2: { ...this.allStatus },
    headLowerEnchant3: { ...this.allStatus },
    armor: { ...this.allStatus },
    armorRefine: { ...this.allStatus },
    armorCard: { ...this.allStatus },
    armorEnchant1: { ...this.allStatus },
    armorEnchant2: { ...this.allStatus },
    armorEnchant3: { ...this.allStatus },
    shield: { ...this.allStatus },
    shieldRefine: { ...this.allStatus },
    shieldCard: { ...this.allStatus },
    shieldEnchant1: { ...this.allStatus },
    shieldEnchant2: { ...this.allStatus },
    shieldEnchant3: { ...this.allStatus },
    garment: { ...this.allStatus },
    garmentRefine: { ...this.allStatus },
    garmentCard: { ...this.allStatus },
    garmentEnchant1: { ...this.allStatus },
    garmentEnchant2: { ...this.allStatus },
    garmentEnchant3: { ...this.allStatus },
    boot: { ...this.allStatus },
    bootRefine: { ...this.allStatus },
    bootCard: { ...this.allStatus },
    bootEnchant1: { ...this.allStatus },
    bootEnchant2: { ...this.allStatus },
    bootEnchant3: { ...this.allStatus },
    accLeft: { ...this.allStatus },
    accLeftCard: { ...this.allStatus },
    accLeftEnchant1: { ...this.allStatus },
    accLeftEnchant2: { ...this.allStatus },
    accLeftEnchant3: { ...this.allStatus },
    accRight: { ...this.allStatus },
    accRightCard: { ...this.allStatus },
    accRightEnchant1: { ...this.allStatus },
    accRightEnchant2: { ...this.allStatus },
    accRightEnchant3: { ...this.allStatus },
  };
  private extraOptions: Record<string, number>[] = [];
  private weaponData = new Weapon();
  private leftWeaponData = new Weapon();
  private monster = new Monster();

  private hpSpCalculator = new HpSpCalculator();

  private _class: CharacterBase;
  private dmgCalculator = new DamageCalculator();
  private propertyBasicAtk = ElementType.Neutral;
  private propertyWindmind: ElementType;
  private sizePenalty = 1;
  private propertyMultiplier = 1;
  private baseEquipmentStat: Record<string, number> = {};
  private finalMultipliers = [] as number[];
  private finalPhyMultipliers = [] as number[];
  private finalMagicMultipliers = [] as number[];

  private reducedHardDef = 0;
  private dmgReductionByHardDef = 0;
  private totalPhysicalPene = 0;
  private totalMagicalPene = 0;

  private maxHp = 0;
  private maxSp = 0;

  private def = 0;
  private softDef = 0;
  private mdef = 0;
  private softMdef = 0;

  private res = 0;
  private mres = 0;

  private damageSummary = {} as BasicDamageSummaryModel & Partial<SkillDamageSummaryModel>;
  private miscSummary = {} as MiscModel;
  private basicAspd = { hitsPerSec: 0, totalAspd: 0 } as BasicAspdModel;

  private totalMasteryAtk = 0;
  private totalHideMasteryAtk = 0;
  private totalBuffAtk = 0;
  private totalStatusAtk = 0;
  private totalEquipAtk = 0;
  private isMagicalSkill = false;

  private totalStatusMatk = 0;
  private totalMasteryMatk = 0;

  private selectedChanceList = [] as string[];
  private _chanceList = [] as ChanceModel[];
  private equipCombo = new Set<string>();

  private skillFrequency: SkillAspdModel = {
    cd: 0,
    reducedCd: 0,
    vct: 0,
    reducedVct: 0,
    fct: 0,
    reducedFct: 0,
    acd: 0,
    reducedAcd: 0,
    castPeriod: 0,
    hitPeriod: 0,
    totalHitPerSec: 0,
    sumDex2Int1: 0,
    vctByStat: 0,
    vctSkill: 0,
  };

  private possiblyDamages: any[] = [];

  private get status(): StatusSummary {
    const { str, jobStr, int, jobInt, luk, jobLuk, vit, jobVit, dex, jobDex, agi, jobAgi } = this.model;
    const { pow, sta, wis, spl, con, crt, jobPow, jobSta, jobWis, jobSpl, jobCon, jobCrt } = this.model;

    return {
      baseStr: str,
      equipStr: this.totalEquipStatus.str ?? 0,
      totalStr: str + (jobStr ?? 0) + (this.totalEquipStatus.str ?? 0),

      baseInt: int,
      equipInt: this.totalEquipStatus.int ?? 0,
      totalInt: int + (jobInt ?? 0) + (this.totalEquipStatus.int ?? 0),

      baseLuk: luk,
      equipLuk: this.totalEquipStatus.luk ?? 0,
      totalLuk: luk + (jobLuk ?? 0) + (this.totalEquipStatus.luk ?? 0),

      baseVit: vit,
      equipVit: this.totalEquipStatus.vit ?? 0,
      totalVit: vit + (jobVit ?? 0) + (this.totalEquipStatus.vit ?? 0),

      baseDex: dex,
      equipDex: this.totalEquipStatus.dex ?? 0,
      totalDex: dex + (jobDex ?? 0) + (this.totalEquipStatus.dex ?? 0),

      baseAgi: agi,
      equipAgi: this.totalEquipStatus.agi ?? 0,
      totalAgi: agi + (jobAgi ?? 0) + (this.totalEquipStatus.agi ?? 0),

      basePow: pow,
      equipPow: this.totalEquipStatus.pow,
      totalPow: pow + (jobPow ?? 0) + (this.totalEquipStatus.pow ?? 0),

      baseSta: sta,
      equipSta: this.totalEquipStatus.sta,
      totalSta: sta + (jobSta ?? 0) + (this.totalEquipStatus.sta ?? 0),

      baseWis: wis,
      equipWis: this.totalEquipStatus.wis,
      totalWis: wis + (jobWis ?? 0) + (this.totalEquipStatus.wis ?? 0),

      baseSpl: spl,
      equipSpl: this.totalEquipStatus.spl,
      totalSpl: spl + (jobSpl ?? 0) + (this.totalEquipStatus.spl ?? 0),

      baseCon: con,
      equipCon: this.totalEquipStatus.con,
      totalCon: con + (jobCon ?? 0) + (this.totalEquipStatus.con ?? 0),

      baseCrt: crt,
      equipCrt: this.totalEquipStatus.crt,
      totalCrt: crt + (jobCrt ?? 0) + (this.totalEquipStatus.crt ?? 0),
    };
  }

  get chanceList() {
    return this._chanceList;
  }

  setMasterItems(items: any) {
    this.items = items;

    return this;
  }

  private getItem(id: number) {
    return this.items[id];
  }

  private isRangeAtk() {
    return this.weaponData?.data?.rangeType === 'range';
  }

  private isUsedSkill(skillName: string) {
    return this.usedSkillNames.has(skillName);
  }

  private get infoForClass(): InfoForClass {
    return {
      model: this.model,
      monster: this.monster,
      totalBonus: this.totalEquipStatus,
      weapon: this.weaponData,
      status: this.status,
      equipmentBonus: this.equipStatus,
      skillName: this.skillName,
      ammoElement: this.equipItem.get(ItemTypeEnum.ammo)?.propertyAtk,
    };
  }

  private isEquipItem(itemName: string) {
    return this.equipItemNameSet.has(itemName);
  }

  isAllowAmmo() {
    const cName = this._class.className;

    return AllowAmmoMapper[this.weaponData.data?.typeName] || ClassAmmoMapper[cName] != null;
  }

  isAllowShield() {
    if (!this.weaponData.data?.typeName && !environment.production) {
      switch (this._class.className) {
        case ClassName.Warlock:
          return true;
      }

      return false;
    }

    return AllowShieldTable[this.weaponData.data?.typeName] || false;
  }

  getAmmoSubTypeId() {
    const cName = this._class.className;

    return WeaponAmmoMapper[this.weaponData.data?.typeName] || ClassAmmoMapper[cName];
  }

  private getChanceBonus() {
    return this._chanceList.filter((c) => this.selectedChanceList.includes(c.name)).map((c) => c.bonus);
  }

  private toPercent(n: number) {
    return n * 0.01;
  }

  setClass(c: CharacterBase) {
    this._class = c;

    return this;
  }

  setMonster(monster: MonsterModel) {
    this.monster.setData(monster);

    return this;
  }

  setModel(model: any) {
    this.model = { ...model };

    return this;
  }

  setWeapon(params: { itemId: number; refine: number; grade?: string }) {
    const { itemId, refine, grade } = params;

    const itemData = this.getItem(itemId);
    this.equipItem.set(ItemTypeEnum.weapon, itemData);
    if (itemData) {
      this.equipItemName.set(ItemTypeEnum.weapon, this.removeItemSlotName(itemData.name));
    } else {
      this.equipItemName.delete(ItemTypeEnum.weapon);
    }

    this.mapRefine.set(ItemTypeEnum.weapon, refine);
    this.mapGrade.set(ItemTypeEnum.weapon, grade);
    this.weaponData.set({ itemData, refineLevel: refine, grade });

    return this;
  }

  setItem(params: { itemType: ItemTypeEnum; itemId: number; refine?: number; grade?: string }) {
    const { itemId, itemType, refine, grade } = params;
    const itemData = this.getItem(itemId);
    this.equipItem.set(itemType, itemData);
    if (itemData) {
      this.equipItemName.set(itemType, this.removeItemSlotName(itemData.name));
    } else {
      this.equipItemName.delete(itemType);
    }

    if (refine != null) {
      this.mapRefine.set(itemType, refine);
    }

    if (grade != null) {
      this.mapGrade.set(itemType, grade);
    }

    return this;
  }

  setUsedSkillNames(usedSkillNames: Set<string>) {
    this.usedSkillNames = usedSkillNames;

    return this;
  }

  setLearnedSkills(learnedSkillMap: Map<string, number>) {
    this.learnedSkillMap = learnedSkillMap;

    return this;
  }

  setOffensiveSkill(skillValue: string) {
    const [, _skillName] = skillValue?.match(/(.+)==(\d+)/) ?? [];
    this.skillName = _skillName as SKILL_NAME;

    return this;
  }

  setEquipAtkSkillAtk(equipSkillBonus: Record<string, any>) {
    this.equipAtkSkillBonus = { ...equipSkillBonus };

    return this;
  }

  setBuffBonus(params: { masteryAtk: Record<string, any>; equipAtk: Record<string, any> }) {
    const { masteryAtk, equipAtk } = params;
    this.buffEquipAtkBonus = { ...equipAtk };
    this.buffMasteryAtkBonus = { ...masteryAtk };

    return this;
  }

  setMasterySkillAtk(masterySkillBonus: Record<string, any>) {
    this.masteryAtkSkillBonus = { ...masterySkillBonus };

    return this;
  }

  setConsumables(consumableBonuses: any[]) {
    this.consumableBonuses = [...consumableBonuses];

    return this;
  }

  setAspdPotion(aspdPotion: number) {
    this.aspdPotion = aspdPotion;

    return this;
  }

  setExtraOptions(extraOptions: any[]) {
    this.extraOptions = extraOptions;

    return this;
  }

  setSelectedChances(selectedChances: string[]) {
    this.selectedChanceList = [...selectedChances.filter((name) => this._chanceList.some((c) => c.name === name))];

    return this;
  }

  loadItemFromModel(model: any) {
    this.model = { ...model };
    this.weaponData.set({ itemData: {} as any, refineLevel: 0, grade: '' });
    this.leftWeaponData.set({ itemData: {} as any, refineLevel: 0, grade: '' });
    this.equipItem.clear();
    this.equipItemName.clear();
    this.mapGrade.clear();

    this.mapRefine.clear();
    this.mapItemNameRefine.clear();

    const items = Object.entries(MainItemWithRelations) as [ItemTypeEnum, ItemTypeEnum[]][];

    for (const [mainItemType, itemRelations] of items) {
      const itemId = model[mainItemType];
      if (!isNumber(itemId)) continue;

      const refine = model[`${mainItemType}Refine`];
      const grade = model[`${mainItemType}Grade`];
      // console.log({itemId, refine, itemRelations})
      if (mainItemType === ItemTypeEnum.weapon) {
        this.setWeapon({ itemId, refine, grade });
      } else {
        // console.log({ mainItemType, refine });
        this.setItem({ itemType: mainItemType, itemId, refine, grade });
      }

      if (mainItemType === ItemTypeEnum.leftWeapon && itemId) {
        this.leftWeaponData.set({ itemData: this.items[itemId], refineLevel: refine, grade });
      }

      for (const itemRelation of itemRelations) {
        const itemId2 = model[itemRelation];
        if (!isNumber(itemId2)) continue;

        this.setItem({ itemType: itemRelation, itemId: itemId2 });
      }
    }

    this.equipItemNameSet = new Set(this.equipItemName.values());
    for (const [itemType, itemName] of this.equipItemName) {
      this.mapItemNameRefine.set(itemName, this.mapRefine.get(itemType));
    }

    return this;
  }

  get isMaximizeWeapon() {
    return this.totalEquipStatus['weapon_maximize'] > 0;
  }

  private calcSizePenalty() {
    if (this.totalEquipStatus.ignore_size_penalty > 0) {
      this.sizePenalty = 1;
      return this;
    }

    const penalty = SizePenaltyMapper[this.weaponData?.data?.typeName]?.[this.monster.size];
    this.sizePenalty = this.toPercent(penalty || 100);

    return this;
  }

  private calcPropertyAtkType() {
    const weaponEle = this.weaponData?.data?.propertyAtk;
    const buff = this.model.propertyAtk;
    const windmind = this.propertyWindmind;
    const ammo = this.equipItem.get(ItemTypeEnum.ammo)?.propertyAtk;

    this.propertyBasicAtk = windmind ?? buff ?? ammo ?? weaponEle ?? ElementType.Neutral;
  }

  private getEquipAtkFromSkills(atkType: 'atk' | 'matk' = 'atk') {
    let atk = 0;
    for (const [, scripts] of Object.entries(this.equipAtkSkillBonus)) {
      for (const [attr, value] of Object.entries(scripts)) {
        const val = Number(value);
        if (attr === atkType) {
          atk += val;
        }
      }
    }

    return atk;
  }

  private calcBuffMasteryAtk(atkType: 'atk' | 'matk') {
    let atk = 0;
    for (const [, scripts] of Object.entries(this.buffMasteryAtkBonus)) {
      for (const [attr, value] of Object.entries(scripts)) {
        const val = Number(value);
        if (attr === atkType) {
          atk += val;
        }
      }
    }

    return atk;
  }

  private calcExtraAtk() {
    const equipAtk = this.totalEquipStatus.atk;
    const skillAtk = this.getEquipAtkFromSkills();

    this.totalEquipAtk = skillAtk + equipAtk + this.getStrikingAtk();

    return this;
  }

  private getStrikingAtk() {
    const endowLearnedLv = this.totalEquipStatus['strikingEndowSkillLv'];
    if (!endowLearnedLv) return 0;

    const weaponLvl = this.weaponData.data?.baseWeaponLevel || 0;

    return weaponLvl * 18 + endowLearnedLv * 5;
  }

  private calcStatusAtk() {
    const { totalStr, totalDex, totalLuk, totalInt } = this.status;
    const baseLvl = this.model.level;
    const [mainStatus, secondStatus] = this.isRangeAtk() ? [totalDex, totalStr] : [totalStr, totalDex];

    this.totalStatusAtk = floor(baseLvl / 4 + secondStatus / 5 + mainStatus + totalLuk / 3);

    const priStat = floor(totalInt / 2) + floor(totalDex / 5) + floor(totalLuk / 3);
    this.totalStatusMatk = floor(floor(baseLvl / 4) + totalInt + priStat);
  }

  private calcMasteryAtk() {
    const skillAtk = Object.values(this.masteryAtkSkillBonus)
      .map((a) => Number(a.atk))
      .filter((a) => Number.isNaN(a) === false)
      .reduce((sum, m) => sum + m, 0);

    const buffAtk = this.calcBuffMasteryAtk('atk');
    const uiMastery = this._class.getUiMasteryAtk(this.infoForClass);
    const hiddenMastery = this._class.getMasteryAtk(this.infoForClass);

    this.totalMasteryAtk = skillAtk + buffAtk + uiMastery;
    this.totalHideMasteryAtk = hiddenMastery;
  }

  private calcMasteryMatk() {
    const skillAtk = Object.values(this.masteryAtkSkillBonus)
      .map((a) => Number(a.matk))
      .filter((a) => Number.isNaN(a) === false)
      .reduce((sum, m) => sum + m, 0);

    this.totalMasteryMatk = skillAtk;
  }

  private calcBuffAtk() {
    // ex. camoflage
    this.totalBuffAtk = 0;
  }

  calcAllAtk() {
    this.calcPropertyAtkType();

    this.calcSizePenalty();

    this.calcExtraAtk();
    this.calcMasteryAtk();
    this.calcMasteryMatk();
    this.calcBuffAtk();
    this.calcStatusAtk();

    this.dmgCalculator
      .setArgs({
        equipStatus: this.equipStatus as any,
        totalEquipStatus: this.totalEquipStatus,
        model: this.model,
        equipAtkSkillBonus: this.equipAtkSkillBonus,
        buffMasteryAtkBonus: this.buffMasteryAtkBonus,
        masteryAtkSkillBonus: this.masteryAtkSkillBonus,
        finalMultipliers: this.finalMultipliers,
        finalPhyMultipliers: this.finalPhyMultipliers,
        finalMagicMultipliers: this.finalMagicMultipliers,
        _class: this._class,
        monster: this.monster,
        weaponData: this.weaponData,
        aspdPotion: this.aspdPotion,
        leftWeaponData: this.leftWeaponData,
      })
      .setAmmoPropertyAtk(this.equipItem.get(ItemTypeEnum.ammo)?.propertyAtk);

    return this;
  }

  private calcConstantBonus(itemRefine: number, miniScript: string) {
    const [condition, bonus] = miniScript.split('===');
    const conditionNum = Number(condition);
    if (conditionNum && itemRefine < conditionNum) return 0;

    const bonusNum = Number(bonus);
    if (conditionNum && bonusNum) {
      return bonusNum;
    }

    const [statusCondition, value] = condition.split(':');
    if (statusCondition && value) {
      const passCondition = this.model[statusCondition] >= Number(value);
      if (passCondition) return Number(bonus);

      return 0;
    }

    // 50(90 วินาที)
    const actualBonus = this.getActualBonus(bonus);
    if (isNumber(actualBonus)) return actualBonus;

    return 0;
  }

  private getActualBonus(bonusScript: string) {
    if (bonusScript.includes('(')) {
      const end = bonusScript.indexOf('(');

      return Number(bonusScript.substring(0, end));
    }

    return Number(bonusScript);
  }

  private calcStepBonus(itemRefine: number, lineScript: string) {
    const [condition, bonus] = lineScript.split('---');
    const conditionNum = Number(condition);
    const bonusNum = Number(bonus);
    const calc = (actual: number, cond: number) => floor(actual / cond) * bonusNum;
    // console.log({ lineScript, conditionNum, bonusNum });
    if (conditionNum && bonusNum) {
      return floor(itemRefine / conditionNum) * bonusNum;
    }

    // LEARN_SKILL[Snake Eyes==]1---2
    const [, skillName, skillLv] = condition.match(/LEARN_SKILL\[(.+?)==(\d+)]/) ?? [];
    if (skillName) {
      const learned = this.learnedSkillMap.get(skillName) || 0;
      return calc(learned, Number(skillLv));
    }

    // level:1(125)---1
    // level:1(1-125)---1
    const [, everyBaseLv, range] = condition.match(/level:(-*\d+)\((.+)\)/) ?? [];
    if (everyBaseLv && range) {
      // console.log({ baseLv, range });
      const [min, max = 999] = range.split('-').map(Number);
      const everyNum = Number(everyBaseLv);
      const cap = Math.min(max, this.model.level);

      return calc(cap - min + 1, everyNum);
    }

    // dex:10---1
    const [, status, statusCond] = condition.match(/(level|jobLevel|str|int|dex|agi|vit|luk):(-*\d+)/) ?? [];
    // console.log({ status, statusCond });
    if (status) {
      const myStatus = this.model[status];
      return calc(myStatus, Number(statusCond));
    }

    // SUM[str,luk==80]---6
    const [, sumOf, sumCond] = condition.match(/SUM\[(\D+)==(\d+)]/) ?? [];
    if (sumOf) {
      const sum = sumOf.split(',').reduce((total, stat) => total + (this.model[stat] || 0), 0);
      return calc(sum, Number(sumCond));
    }

    // REFINE[boot==1]---2
    const [, refineCombo, refineCond] = condition.match(/^REFINE\[(\D*?)=*=*(\d+)]/) ?? [];
    // console.log({ condition, refineCombo, refineCond });
    if (refineCombo) {
      const totalRefine = refineCombo
        .split(',')
        .map((itemType) => this.mapRefine.get(itemType as ItemTypeEnum))
        .reduce((sum, cur) => sum + (cur || 0), 0);

      return calc(totalRefine, Number(refineCond));
    }

    // REFINE_NAME[Judgment Slasher,Repent Slasher==3]---5
    const [, itemNames, refineCond2] = condition.match(/^REFINE_NAME\[(\D+)==(\d+)?]/) ?? [];
    if (refineCond2) {
      const totalRefine = itemNames
        .split(',')
        .map((itemName) => this.mapItemNameRefine.get(itemName))
        .reduce((sum, cur) => sum + (cur || 0), 0);

      return calc(totalRefine, Number(refineCond2));
    }

    return 0;
  }

  private isValidGrade(itemGrade: string, targetGrade: string): boolean {
    if (!itemGrade || !targetGrade) return false;

    const x = {
      a: 1,
      A: 1,
      b: 2,
      B: 2,
      c: 3,
      C: 3,
      d: 4,
      D: 4,
    };

    return x[itemGrade] <= x[targetGrade];
  }

  private validateCondition(params: { itemType: ItemTypeEnum; itemRefine: number; script: string }): {
    isValid: boolean;
    restCondition: string;
  } {
    const { itemRefine, itemType, script } = params;
    let restCondition = script;
    const mainStatusRegex = /^(str|int|dex|agi|vit|luk|level):(\d+)&&(\d+===.+)/;
    const [, status, statusCondition, raw] = restCondition.match(mainStatusRegex) ?? [];
    if (status) {
      const isPass = this.model[status] >= Number(statusCondition);

      return { isValid: isPass, restCondition: raw };
    }

    // WEAPON_LEVEL
    const [toRemoveA, wLevel] = restCondition.match(/WEAPON_LEVEL\[(\d+)]/) ?? [];
    if (wLevel) {
      const wLv = Number(wLevel);
      const weaponLvl = (itemType || '').toLowerCase().startsWith('left') ? this.leftWeaponData?.data?.baseWeaponLevel : this.weaponData.data.baseWeaponLevel;
      const isValid = weaponLvl === wLv;
      if (!isValid) return { isValid, restCondition };

      restCondition = restCondition.replace(toRemoveA, '');
      if (restCondition.startsWith('===')) return { isValid, restCondition: restCondition.replace('===', '') };
    }

    // WEAPON_TYPE[bow]5
    const [toRemoveB, wType] = restCondition.match(/WEAPON_TYPE\[(\D+)]/) ?? [];
    if (wType) {
      const isValid = wType.split('||').includes(this.weaponData.data.typeName);
      if (!isValid) return { isValid, restCondition };

      restCondition = restCondition.replace(toRemoveB, '');
      if (restCondition.startsWith('===')) return { isValid, restCondition: restCondition.replace('===', '') };
    }

    // GRADE[armor==A]===5
    const [toRemoveGrade, conditionGrade] = restCondition.match(/GRADE\[(\D+)]/) ?? [];
    if (conditionGrade) {
      const [rawitemType, targetGrade] = conditionGrade.split('==') ?? [];
      const tarGetitemType = rawitemType === 'me' ? itemType.replace(/Enchant\d/, '') : rawitemType;
      // console.log({ itemType, tarGetitemType, rawitemType })
      const itemGrade = this.mapGrade.get(tarGetitemType as ItemTypeEnum);
      const isValid = this.isValidGrade(itemGrade, targetGrade);
      if (!isValid) return { isValid, restCondition };

      restCondition = restCondition.replace(toRemoveGrade, '');
      if (restCondition.startsWith('===')) return { isValid, restCondition: restCondition.replace('===', '') };
    }

    // [weaponType=Pistol]20
    const [_, wSubTypeName] = restCondition.match(/^\[weaponType=(.+?)\]/) ?? [];
    if (wSubTypeName) {
      const subTypeName = this.weaponData?.data?.subTypeName;
      if (wSubTypeName !== subTypeName) return { isValid: false, restCondition };
      restCondition = restCondition.replace(`[weaponType=${wSubTypeName}]`, '');

      return { isValid: true, restCondition };
    }

    // SUM[str,luk==80]---6
    const [, toRemove3, statStr, sumCond] = restCondition.match(/(SUM\[(\D+)==(\d+)])[^-]/) ?? [];
    if (statStr && sumCond) {
      const totalStat = statStr.split(',').reduce((total, stat) => total + (this.model[stat] || 0), 0);
      const cond = Number(sumCond);
      if (totalStat < cond) return { isValid: false, restCondition };

      restCondition = restCondition.replace(toRemove3, '');
    }

    // USED[Mechanic]20
    const [toRemove, usedByClass] = restCondition.match(/USED\[(.+?)\]/) ?? [];
    if (usedByClass) {
      const cName = this._class.className.replace(' ', '');
      const isUsed = usedByClass.split('||').some((className) => className === cName || className === this._class.className || this._class.classNameSet.has(className));
      if (!isUsed) return { isValid: false, restCondition };

      restCondition = restCondition.replace(toRemove, '');
    }

    // LEARN_SKILL[Meow Meow==5]2
    const [_raw, toRemove_, learnCond] = restCondition.match(/(LEARN_SKILL\[(.+?)\]=?=?=?)-?\d+/) ?? [];
    if (learnCond) {
      const [skillName, skillLv] = learnCond.split('==');
      const isPass = this.learnedSkillMap.get(skillName) >= Number(skillLv);
      if (!isPass) return { isValid: false, restCondition };

      restCondition = restCondition.replace(toRemove_, '');
    }

    // LEARN_SKILL2[Illusion - Shadow==5]SUM[level==4]---2
    const [_raw2, toRemove2_, learnCond2] = restCondition.match(/(LEARN_SKILL2\[(.+?)\]=?=?=?)/) ?? [];
    if (learnCond2) {
      const [skillName, skillLv] = learnCond2.split('==');
      const isPass = this.learnedSkillMap.get(skillName) >= Number(skillLv);
      if (!isPass) return { isValid: false, restCondition };

      restCondition = restCondition.replace(toRemove2_, '');
    }

    // LEVEL[130]2---1
    // LEVEL[1-129]2---1
    const [toRemove2, lvCond] = restCondition.match(/LEVEL\[(.+?)\]/) ?? [];
    if (lvCond) {
      const [minLv, maxLv = 999] = lvCond.split('-').map(Number);
      const isPass = minLv <= this.model.level && this.model.level <= maxLv;
      if (!isPass) return { isValid: false, restCondition };

      restCondition = restCondition.replace(toRemove2, '');
    }

    // ACTIVE_SKILL[Platinum Altar]9===50(90 วินาที)
    const [unused2, actSkillName] = restCondition.match(/ACTIVE_SKILL\[(.+)]/) ?? [];
    if (actSkillName) {
      // console.log({ script, unused2, actSkillName });
      const isUsed = this.isUsedSkill(actSkillName);

      if (!isUsed) return { isValid: false, restCondition };

      restCondition = restCondition.replace(unused2, '');
    }

    for (let i = 1; i <= 3; i++) {
      const [unused, itemType, refineCond] = restCondition.match(/XREFINEX\[(\D*?)=*=*(\d+)]/) ?? [];
      if (itemType) {
        const refine = this.mapRefine.get(itemType as ItemTypeEnum);
        if (refine >= Number(refineCond)) {
          restCondition = restCondition.replace(unused, '');
          continue;
        }

        return { isValid: false, restCondition };
      }

      break;
    }

    // EQUIP[Bear's Power]===50
    const [setCondition, itemSet] = restCondition.match(/^EQUIP\[(.+?)]/) ?? [];
    if (itemSet) {
      const itemSets = itemSet.split('&&').filter(Boolean);
      // console.log({ itemRefine, itemSet, itemSets });
      const valid = itemSets.every((item) => {
        const res = item.split('||').some((_item) => this.isEquipItem(_item));

        return res;
      });
      if (!valid) return { isValid: false, restCondition };

      restCondition = restCondition.replace(setCondition, '');

      // REFINE[garment,armor==20]===10
      // REFINE[9]===25
      const [unused, refineCombo, refineCond] = restCondition.match(/^REFINE\[(\D*?)=*=*(\d+)]/) ?? [];
      if (refineCombo) {
        // console.log({ unused, refineCombo, restCondition });
        if (restCondition.includes(`${unused}---`)) {
          return { isValid: true, restCondition };
        }

        const totalRefine = refineCombo
          .split(',')
          .map((itemType) => this.mapRefine.get(itemType as ItemTypeEnum))
          .reduce((sum, cur) => sum + (cur || 0), 0);
        // console.log({ totalRefine, refineCond });
        if (totalRefine >= Number(refineCond)) {
          restCondition = restCondition.replace(unused, '');
          if (!restCondition.startsWith('===')) {
            return this.validateCondition({ itemType, itemRefine, script: restCondition });
          }
        } else {
          return { isValid: false, restCondition };
        }
      } else if (refineCond) {
        if (itemRefine >= Number(refineCond)) {
          restCondition = restCondition.replace(unused, '');
        } else {
          return {
            isValid: false,
            restCondition,
          };
        }
      }

      if (restCondition.startsWith('===')) {
        const replaced = restCondition.replace('===', '');
        if (Number.isNaN(Number(replaced))) {
          restCondition = restCondition.replace('0===', '');
        } else {
          restCondition = replaced;
        }
      }

      return { isValid: true, restCondition };
    }

    // REFINE[11]
    const [, unused, refineCond] = restCondition.match(/(REFINE\[(\d+)?])[^-]/) ?? [];
    if (refineCond && itemRefine >= Number(refineCond)) {
      restCondition = restCondition.replace(unused, '');
      if (restCondition.startsWith('===')) {
        restCondition = restCondition.replace('===', '');
      }

      return {
        isValid: true,
        restCondition,
      };
    } else if (refineCond) {
      return { isValid: false, restCondition };
    }

    // POS[accRight]50
    const [unusedPos, position] = restCondition.match(/POS\[(\D+)]/) ?? [];
    if (position) {
      if (position === itemType) {
        return {
          isValid: true,
          restCondition: restCondition.replace(unusedPos, ''),
        };
      }

      return { isValid: false, restCondition };
    }

    // SPAWN[tur_d03_i||tur_d04_i]
    const [unusedSp, rawSpawn] = restCondition.match(/SPAWN\[(.+)]/) ?? [];
    if (rawSpawn) {
      const spawns = rawSpawn.split('||');
      const monSpawns = this.monster.spawn.split(',');
      const isPass = spawns.some((sp) => monSpawns.includes(sp));
      // console.log({ rawSpawn, monSpawns, spawns });
      if (!isPass) return { isValid: false, restCondition };

      restCondition = restCondition.replace(unusedSp, '');
    }

    return {
      isValid: true,
      restCondition: restCondition,
    };
  }

  private updateBaseEquipStat(attr: string, lineScript: string | number) {
    const n = Number(lineScript);
    if (Number.isSafeInteger(n)) {
      this.baseEquipmentStat[attr] = n + (this.baseEquipmentStat[attr] || 0);
    }
  }

  private isAreadyCalcCombo(params: { item: ItemModel; attr: string; lineScript: string }) {
    const { item, attr, lineScript } = params;
    if (lineScript.startsWith('EQUIP[')) {
      const comboFix = `${item.id}-${attr}-${lineScript}`;
      if (this.equipCombo.has(comboFix)) {
        return true;
      }

      this.equipCombo.add(comboFix);
    }

    return false;
  }

  private calcItemStatus(params: { itemType: ItemTypeEnum; itemRefine: number; item: ItemModel }) {
    const { item, itemRefine, itemType } = params;
    const total: Record<string, number> = {};
    const chance = {};
    const addChance = (attr: string, val: number) => {
      if (chance[attr]) {
        chance[attr] += val;
      } else {
        chance[attr] = val;
      }
    };

    // console.log({ itemRefine, script });
    for (const [attr, attrScripts] of Object.entries(item.script)) {
      if (MainItemTypeSet.has(itemType)) {
        this.updateBaseEquipStat(attr, attrScripts[0]);
      }

      total[attr] = attrScripts.reduce((sum, lineScript) => {
        if (this.isAreadyCalcCombo({ item, attr, lineScript })) {
          return sum;
        }

        const { isValid, restCondition } = this.validateCondition({ itemType, itemRefine, script: lineScript });
        // console.log({ lineScript, restCondition, isValid });
        if (!isValid) return sum;

        if (restCondition.includes('===')) {
          return sum + this.calcConstantBonus(itemRefine, restCondition);
        }
        if (restCondition.includes('---')) {
          return sum + this.calcStepBonus(itemRefine, restCondition);
        }

        if (Number.isNaN(Number(restCondition))) {
          console.log('cannot turn to number', { lineScript, restCondition });

          return sum;
        }

        return sum + Number(restCondition);
      }, 0);

      if (attr.startsWith('chance__') && isNumber(total[attr]) && total[attr] !== 0) {
        const actualAttr = attr.replace('chance__', '');
        addChance(actualAttr, total[attr]);
      }
    }

    const chances = Object.keys(chance);
    if (Object.keys(chances).length > 0) {
      this._chanceList.push({
        name: item.name,
        label: `${item.name}`,
        label2: `[ ${chances.map((c) => `${c} +${chance[c]}`).join(', ')} ]`,
        bonus: chance,
      });
    }

    return total;
  }

  private removeItemSlotName(itemName: string) {
    return itemName.replace(/\[\d]$/, '').trim();
  }

  /**
   * Sometime it should get from base item
   * like card should get refine from it's own
   * @param itemType
   * @returns refine level
   */
  private getRefineLevelByItemType(itemType: ItemTypeEnum) {
    for (const _itemType of refinableItemTypes) {
      if (itemType.startsWith(_itemType)) {
        return this.mapRefine.get(_itemType);
      }
    }

    return 0;
  }

  private calcStatBoost(boostPercent: number, stat: 'agi' | 'dex'): number {
    const { agi, jobAgi, dex, jobDex } = this.model;
    let base = 0;
    if (stat === 'agi') {
      base = agi + jobAgi + (this.baseEquipmentStat['agi'] || 0);
    } else if (stat === 'dex') {
      base = dex + jobDex + (this.baseEquipmentStat['dex'] || 0);
    }

    return floor(base * (Number(boostPercent) / 100));
  }

  prepareAllItemBonus() {
    const baseMatk = Number(this.equipItem.get(ItemTypeEnum.weapon)?.script?.['matk']?.[0]) || 0;

    this.totalEquipStatus = { ...this.allStatus, matk: 0 - baseMatk, perfectHit: this.DEFAULT_PERFECT_HIT };
    this.equipStatus = {} as any;
    this.propertyBasicAtk = ElementType.Neutral;
    this.propertyWindmind = undefined;
    this._chanceList = [];
    this.equipCombo.clear();

    const updateTotalStatus = (attr: keyof EquipmentSummaryModel, value: number) => {
      if (this.totalEquipStatus[attr]) {
        if (attr === 'fctPercent') {
          this.totalEquipStatus[attr] = Math.max(this.totalEquipStatus[attr], value);
        } else {
          this.totalEquipStatus[attr] += value;
        }
      } else {
        this.totalEquipStatus[attr] = value;
      }
    };

    this.equipStatus['extra'] = { ...this.allStatus };
    for (const scripts of this.extraOptions) {
      for (const [attr, value] of Object.entries(scripts)) {
        if (this.equipStatus['extra'][attr]) {
          this.equipStatus['extra'][attr] += value;
        } else {
          this.equipStatus['extra'][attr] = value;
        }

        updateTotalStatus(attr as any, value);
      }
    }

    this.baseEquipmentStat = {};
    this.finalMultipliers = [];
    this.finalPhyMultipliers = [];
    this.finalMagicMultipliers = [];
    for (const [itemType, itemData] of this.equipItem) {
      this.equipStatus[itemType] = { ...this.allStatus };
      if (!itemData) {
        continue;
      }

      if (itemType === ItemTypeEnum.ammo) {
        if (itemData.itemSubTypeId === ItemSubTypeId.Cannonball) {
          this.equipStatus[itemType].atk = 0;
          updateTotalStatus('cannonballAtk', itemData.attack);
          continue;
        }

        this.equipStatus[itemType].atk = itemData.attack;
      } else if (itemType === ItemTypeEnum.leftWeapon) {
        // this.equipStatus[itemType].atk = itemData.attack;
      } else if (itemType !== ItemTypeEnum.weapon && itemData.attack) {
        this.equipStatus[itemType].atk = itemData.attack;
        updateTotalStatus('atk', itemData.attack);
      }

      if (itemData.defense) {
        this.equipStatus[itemType].baseDef = itemData.defense;
        updateTotalStatus('def', itemData.defense);
      }

      // console.log({ itemType, itemData });
      const refine = this.getRefineLevelByItemType(itemType);
      if (MainItemTypeSet.has(itemType)) {
        this.equipStatus[itemType].refine = refine;
        this.equipStatus[itemType].weight = itemData.weight;
      }

      const calculatedItem = this.calcItemStatus({ itemType, itemRefine: refine, item: itemData });
      for (const [attr, value] of Object.entries(calculatedItem)) {
        if (attr === 'p_final') {
          this.finalPhyMultipliers.push(value);
        }
        if (attr === 'm_final') {
          this.finalMagicMultipliers.push(value);
        }

        this.equipStatus[itemType][attr] = value;

        updateTotalStatus(attr as any, value);
      }
    }

    for (const [skillName, scripts] of Object.entries(this.equipAtkSkillBonus)) {
      for (const [attr, value] of Object.entries(scripts)) {
        if (attr === 'propertyAtk') {
          this.propertyWindmind = value as any;
          continue;
        }

        let val = Number(value);
        if (attr === 'atk') val = 0;
        if (attr === 'final') {
          this.finalMultipliers.push(val);
          continue;
        }
        if (attr === 'p_final') {
          this.finalPhyMultipliers.push(val);
          continue;
        }

        this.equipStatus[skillName] = { ...this.allStatus, [attr]: val };

        updateTotalStatus(attr as any, val);

        this.updateBaseEquipStat(attr, val);
      }
    }
    for (const [skillName, scripts] of Object.entries(this.masteryAtkSkillBonus)) {
      for (const [attr, value] of Object.entries(scripts)) {
        if (attr === 'propertyAtk') {
          this.propertyWindmind = value as any;
          continue;
        }

        const val = Number(value);
        if (attr === 'atk') continue;
        if (attr === 'matk') continue;

        if (attr === 'p_final') {
          this.finalPhyMultipliers.push(val);
          continue;
        }

        this.equipStatus[skillName] = { ...this.allStatus, [attr]: val };

        updateTotalStatus(attr as any, val);

        this.updateBaseEquipStat(attr, val);
      }
    }

    for (const [buffName, scripts] of Object.entries(this.buffEquipAtkBonus)) {
      for (const [attr, value] of Object.entries(scripts)) {
        const val = Number(value);
        // if (attr === 'atk' || attr === 'matk') val = 0;

        this.equipStatus[buffName] = { ...this.allStatus, [attr]: val };

        updateTotalStatus(attr as any, value);
      }
    }
    for (const [buffName, scripts] of Object.entries(this.buffMasteryAtkBonus)) {
      for (const [attr, value] of Object.entries(scripts)) {
        const val = Number(value);
        if (attr === 'atk' || attr === 'matk') continue;

        this.equipStatus[buffName] = { ...this.allStatus, [attr]: val };

        updateTotalStatus(attr as any, value);
      }
    }

    const consumableBonus: Record<string, number> = {};
    for (const cons of this.consumableBonuses) {
      for (const [attr, value] of Object.entries(cons)) {
        const valNum = Number(value);
        if (mainStatuses.includes(attr as any) && consumableBonus[attr]) {
          consumableBonus[attr] = Math.max(consumableBonus[attr], valNum);
          continue;
        }

        if (consumableBonus[attr]) {
          consumableBonus[attr] += valNum;
        } else {
          consumableBonus[attr] = valNum;
        }
      }
    }
    const consumAllStat = consumableBonus['allStatus'] || 0;
    for (const [attr, value] of Object.entries(consumableBonus)) {
      let newVal = value;
      // stat +20 can stack with other
      if (mainStatuses.includes(attr as any) && newVal !== 20) {
        newVal = Math.max(value - consumAllStat, 0);
      }

      updateTotalStatus(attr as any, newVal);
    }

    const allStatus = this.totalEquipStatus.allStatus ?? 0;
    for (const status of mainStatuses) {
      updateTotalStatus(status as any, allStatus);
    }

    const allTrait = this.totalEquipStatus.allTrait ?? 0;
    for (const status of traitStatuses) {
      updateTotalStatus(status as any, allTrait);
    }

    if (this.totalEquipStatus['agiBoost'] > 0) {
      const boost = this.totalEquipStatus['agiBoost'];
      this.totalEquipStatus.agi += this.calcStatBoost(Number(boost), 'agi');
    }
    if (this.totalEquipStatus['dexBoost'] > 0) {
      const boost = this.totalEquipStatus['dexBoost'];
      this.totalEquipStatus.dex += this.calcStatBoost(Number(boost), 'dex');
    }

    if (this.weaponData.data.typeName === 'bow') {
      this.totalEquipStatus.range += this.totalEquipStatus.bowRange || 0;
    }

    this._class.setAdditionalBonus(this.infoForClass);

    // fix floating point
    for (const [attr, val] of Object.entries(this.totalEquipStatus)) {
      if (isNumber(val) && val !== 0) {
        this.totalEquipStatus[attr] = round(val, 2);
        if (val !== this.totalEquipStatus[attr]) {
          console.log({ attr, val, newVal: this.totalEquipStatus[attr] });
        }
      }
    }

    return this;
  }

  calculateAllDamages(skillValue: string) {
    this.calcAllAtk();

    const { basicDmg, misc, skillDmg, skillAspd, basicAspd } = this.dmgCalculator
      .setExtraBonus([])
      .calculateAllDamages({ skillValue, propertyAtk: this.propertyBasicAtk, maxHp: this.maxHp, maxSp: this.maxSp });

    this.damageSummary = {
      ...basicDmg,
      ...(skillDmg || {}),
    };

    this.skillFrequency = skillAspd || ({} as any);
    this.miscSummary = misc;
    this.basicAspd = basicAspd;

    if (this.selectedChanceList.length > 0) {
      this.recalcExtraBonus(skillValue);
    }

    return this;
  }

  setHpSpTable(hpSpTable: HpSpTable) {
    this.hpSpCalculator.setHpSpTable(hpSpTable);

    return this;
  }

  calculateHpSp(params: { isUseHpL: boolean }) {
    const { maxHp, maxSp } = this.hpSpCalculator
      .setClass(this._class)
      .setAllInfo({
        ...this.infoForClass,
        baseHp: this.totalEquipStatus['baseHp'],
        baseSp: this.totalEquipStatus['baseSp'],
      })
      .setBonusFlag(params)
      .calculate()
      .getTotalSummary();

    this.maxHp = maxHp;
    this.maxSp = maxSp;

    return this;
  }

  recalcExtraBonus(skillValue: string) {
    const c = this.getChanceBonus();
    if (c.length === 0) {
      this.selectedChanceList = [];
      return this;
    }

    const { basicDmg, skillDmg, basicAspd, skillAspd } = this.dmgCalculator
      .setExtraBonus(c)
      .calculateAllDamages({ skillValue, propertyAtk: this.propertyBasicAtk, maxHp: this.maxHp, maxSp: this.maxSp });
    console.log(skillDmg);

    this.damageSummary = {
      ...this.damageSummary,
      effectedBasicDamageMin: basicDmg.basicMinDamage,
      effectedBasicDamageMax: basicDmg.basicMaxDamage,
      effectedBasicCriDamageMin: basicDmg.criMinDamage,
      effectedBasicCriDamageMax: basicDmg.criMaxDamage,
      effectedBasicDps: basicDmg.basicDps,
      effectedBasicHitsPerSec: basicAspd.hitsPerSec,

      effectedSkillDamageMin: skillDmg?.skillMinDamage || 0,
      effectedSkillDamageMax: skillDmg?.skillMaxDamage || 0,
      effectedSkillDps: skillDmg?.skillDps || 0,
      effectedSkillHitsPerSec: skillAspd?.totalHitPerSec || 0,
    };

    return this;
  }

  calcDmgWithExtraBonus(params: { skillValue: string; isUseHpL: boolean }): BasicDamageSummaryModel & SkillDamageSummaryModel {
    this.calcAllAtk();

    const c = this.getChanceBonus();
    const calculator = this.dmgCalculator.setExtraBonus(c);
    const { maxHp, maxSp } = this.hpSpCalculator
      .setClass(this._class)
      .setAllInfo({
        ...calculator.infoForClass,
        baseHp: calculator.totalBonus['baseHp'],
        baseSp: calculator.totalBonus['baseSp'],
      })
      .setBonusFlag(params)
      .calculate()
      .getTotalSummary();

    const { skillValue } = params;
    const { basicDmg, skillDmg } = calculator.calculateAllDamages({
      skillValue,
      propertyAtk: this.propertyBasicAtk,
      maxHp,
      maxSp,
    });

    return {
      ...basicDmg,
      ...skillDmg,
    };
  }

  private getObjSummary(obj: EquipmentSummaryModel, isRemoveFields = false) {
    const summary = {};
    const removableFiels = new Set(['weight', 'baseDef', 'refine']);
    for (const [key, value] of Object.entries(obj)) {
      if (isRemoveFields && removableFiels.has(key)) continue;

      if (value !== 0 && value != null) {
        summary[key] = value;
      }
    }

    return summary;
  }

  calcAllDefs() {
    const { level } = this.model;
    const { def = 0, defPercent = 0, softDef = 0, softDefPercent = 0, res = 0, mres = 0 } = this.totalEquipStatus;
    const { totalVit, totalAgi, totalSta, totalWis } = this.status;

    const rawSoftDef = floor(totalVit / 2 + totalAgi / 5 + level / 2);
    this.softDef = floor((rawSoftDef + softDef) * this.toPercent(100 + softDefPercent));

    const bonus = [1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5];
    const calcDefByRefine = (refine: number) => {
      return bonus.filter((_, i) => i + 1 <= refine).reduce((sum, val) => sum + val, 0);
    };
    const { headUpperRefine, armorRefine, shieldRefine, garmentRefine, bootRefine } = this.model;

    const { headUpper, armor, shield, garment, boot } = this.model;
    const { additionalDef, bonusRes } = [
      [headUpper, headUpperRefine],
      [armor, armorRefine],
      [shield, shieldRefine],
      [garment, garmentRefine],
      [boot, bootRefine],
    ]
      .filter(([id]) => this.getItem(id)?.itemLevel === 2)
      .reduce(
        ({ additionalDef, bonusRes }, [_, refine]) => {
          return {
            additionalDef: additionalDef + round(calcDefByRefine(refine) * 0.2, 0),
            bonusRes: bonusRes + refine * 2,
          };
        },
        { additionalDef: 0, bonusRes: 0 },
      );

    const refines = [headUpperRefine, armorRefine, shieldRefine, garmentRefine, bootRefine].filter((a) => Number(a) > 0);
    const bonusDefByRefine = refines.reduce((sum, refine) => sum + calcDefByRefine(refine), 0);
    this.def = floor((def + bonusDefByRefine) * this.toPercent(100 + defPercent)) + additionalDef;

    const { totalDex, totalInt } = this.status;
    const { mdef = 0, mdefPercent = 0, softMdef = 0, softMdefPercent = 0 } = this.totalEquipStatus;
    const rawSoftMdef = floor(totalInt + totalVit / 5 + totalDex / 5 + level / 4);
    this.softMdef = floor((rawSoftMdef + softMdef) * this.toPercent(100 + softMdefPercent));
    this.mdef = floor(mdef * this.toPercent(100 + mdefPercent));

    this.res = res + totalSta + floor(totalSta / 3) * 5 + bonusRes;
    this.mres = mres + totalWis + floor(totalWis / 3) * 5 + bonusRes;

    return this;
  }

  getTotalSummary() {
    const { baseWeaponAtk = 0, refineBonus = 0 } = this.leftWeaponData?.data || {};
    const leftWeaponAtk = baseWeaponAtk + refineBonus;

    return {
      ...this.getObjSummary(this.totalEquipStatus),
      monster: { ...this.monster.data },
      propertyAtk: this.propertyBasicAtk,
      propertyMultiplier: this.propertyMultiplier,
      weapon: this.weaponData.data,
      calcSkill: {
        dmgType: this.damageSummary.dmgType,
        baseSkillDamage: this.damageSummary.baseSkillDamage,
        dps: this.damageSummary.skillDps,
        totalHits: this.damageSummary.skillTotalHit,
        propertySkill: this.damageSummary.skillPropertyAtk,
        accuracy: this.damageSummary.skillAccuracy,
        totalPene: this.damageSummary.skillTotalPene,
        ...this.skillFrequency,
      },
      calc: {
        maxHp: this.maxHp,
        maxSp: this.maxSp,
        dex2int1: this.skillFrequency.sumDex2Int1 || 0,
        to530: 530 - (this.skillFrequency.sumDex2Int1 || 0),
        def: this.def,
        softDef: this.softDef,
        mdef: this.mdef,
        softMdef: this.softMdef,
        res: this.res,
        mres: this.mres,
        totalAspd: this.basicAspd.totalAspd,
        hitPerSecs: this.basicAspd.hitsPerSec,
        totalCri: this.damageSummary.basicCriRate,
        ...this.miscSummary,
        hitRate: this.miscSummary.accuracy,
        dps: this.damageSummary.basicDps,
        dmgReductionByHardDef: this.dmgReductionByHardDef,
        sizePenalty: this.sizePenalty,
        isMagicalSkill: this.isMagicalSkill,
        totalPhysicalPene: this.totalPhysicalPene,
        totalMagicalPene: this.totalMagicalPene,
        totalPene: this.isMagicalSkill ? this.totalMagicalPene : this.totalPhysicalPene,
        leftWeaponRefineBonus: refineBonus,

        totalStatusAtk: this.totalStatusAtk,
        totalEquipAtk: this.totalEquipAtk + leftWeaponAtk,
        ammuAtk: this.equipStatus.ammo?.atk || 0,
        totalMasteryAtk: this.totalMasteryAtk,
        totalHideMasteryAtk: this.totalHideMasteryAtk,
        totalBuffAtk: this.totalBuffAtk,

        totalStatusMatk: this.totalStatusMatk,
        totalMasteryMatk: this.totalMasteryMatk,
      },
      dmg: {
        ...this.damageSummary,
      },
      equipments: [...this.equipItemNameSet.keys()],
    };
  }

  getItemSummary() {
    const obj = {};
    for (const [itemType, itemData] of this.equipItem) {
      if (!itemData || !itemType) continue;

      obj[itemType] = this.getObjSummary(this.equipStatus[itemType], true);
    }

    return {
      ...obj,
      ...this.equipAtkSkillBonus,
      ...this.masteryAtkSkillBonus,
      ...{ extra: this.getObjSummary(this.equipStatus['extra']) },
      consumableBonuses: this.consumableBonuses,
    };
  }

  getModelSummary() {
    return this.getObjSummary(this.model as any);
  }

  getPossiblyDamages() {
    return this.possiblyDamages;
  }
}
