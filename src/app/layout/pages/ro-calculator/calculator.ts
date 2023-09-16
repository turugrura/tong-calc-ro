import { AtkSkillFormulaInput, AtkSkillModel, CharacterBase } from './char-class.abstract';
import { ElementMapper } from './element-mapper';
import { ElementType } from './element-type.const';
import { ItemTypeEnum } from './item-type.enum';
import { ItemModel } from './item.model';
import { MonsterModel } from './monster.model';
import { Weapon } from './weapon';

// const getItem = (id: number) => items[id] as ItemModel;
const refinableItemTypes = [
  ItemTypeEnum.weapon,
  ItemTypeEnum.headUpper,
  ItemTypeEnum.shield,
  ItemTypeEnum.armor,
  ItemTypeEnum.garment,
  ItemTypeEnum.boot,
];
const mainStatuses = ['str', 'dex', 'int', 'agi', 'luk', 'vit'];

const weaponSizePenalty: Record<string, { s: number; m: number; l: number }> = {
  gun: { s: 100, m: 100, l: 100 },
  bow: { s: 100, m: 100, l: 75 },
};

export class Calculator {
  private items!: Record<number, ItemModel>;

  private model = {
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
  private equipItem = new Map<ItemTypeEnum, ItemModel>();
  private equipItemName = new Map<ItemTypeEnum, string>();
  private equipItemNameSet = new Set<string>();
  private mapRefine = new Map<ItemTypeEnum, number>();
  private usedSkillNames = new Set<string>();
  private learnedSkillMap = new Map<string, number>();
  private equipAtkSkillBonus: Record<string, any> = {};
  private masteryAtkSkillBonus: Record<string, any> = {};
  private consumableBonuses: any[] = [];

  private allStatus = {
    exp: 0,
    drop: 0,
    hp: 0,
    hpPercent: 0,
    sp: 0,
    spPercent: 0,
    def: 0,
    mdef: 0,
    aspd: 0,
    aspdPercent: 0,
    atk: 0,
    atkPercent: 0,
    matk: 0,
    matkPercent: 0,
    allStatus: 0,
    str: 0,
    int: 0,
    dex: 0,
    luk: 0,
    vit: 0,
    agi: 0,
    melee: 0,
    range: 0,
    bowRange: 0,
    vct: 0,
    acd: 0,
    fct: 0,
    cri: 0,
    criDmg: 0,
    perfectHit: 0,
    hit: 0,
    p_size_all: 0,
    p_size_s: 0,
    p_size_m: 0,
    p_size_l: 0,
    p_element_all: 0,
    p_element_neutral: 0,
    p_element_water: 0,
    p_element_earth: 0,
    p_element_fire: 0,
    p_element_wind: 0,
    p_element_poison: 0,
    p_element_holy: 0,
    p_element_dark: 0,
    p_element_ghost: 0,
    p_element_undead: 0,
    p_race_all: 0,
    p_race_formless: 0,
    p_race_undead: 0,
    p_race_brute: 0,
    p_race_plant: 0,
    p_race_insect: 0,
    p_race_fish: 0,
    p_race_demon: 0,
    p_race_human: 0,
    p_race_angel: 0,
    p_class_all: 0,
    p_class_normal: 0,
    p_class_boss: 0,
    p_class_champion: 0,
    m_size_all: 0,
    m_size_s: 0,
    m_size_m: 0,
    m_size_l: 0,
    my_element_all: 0,
    my_element_neutral: 0,
    my_element_water: 0,
    my_element_earth: 0,
    my_element_fire: 0,
    my_element_wind: 0,
    my_element_poison: 0,
    my_element_holy: 0,
    my_element_dark: 0,
    my_element_ghost: 0,
    my_element_undead: 0,
    m_element_all: 0,
    m_element_neutral: 0,
    m_element_water: 0,
    m_element_earth: 0,
    m_element_fire: 0,
    m_element_wind: 0,
    m_element_poison: 0,
    m_element_holy: 0,
    m_element_dark: 0,
    m_element_ghost: 0,
    m_element_undead: 0,
    m_race_all: 0,
    m_race_formless: 0,
    m_race_undead: 0,
    m_race_brute: 0,
    m_race_plant: 0,
    m_race_insect: 0,
    m_race_fish: 0,
    m_race_demon: 0,
    m_race_human: 0,
    m_race_angel: 0,
    m_race_dragon: 0,
    m_class_normal: 0,
    m_class_boss: 0,
    m_class_champion: 0,
    p_pene_race_all: 0,
    p_pene_size_all: 0,
    p_pene_element_all: 0,
  };
  private totalEquipStatus = { ...this.allStatus };
  private equipStatus = {
    weapon: { ...this.allStatus },
    weaponCard1: { ...this.allStatus },
    weaponCard2: { ...this.allStatus },
    weaponCard3: { ...this.allStatus },
    weaponEnchant1: { ...this.allStatus },
    weaponEnchant2: { ...this.allStatus },
    weaponEnchant3: { ...this.allStatus },
    weaponOptions1: { ...this.allStatus },
    weaponOptions2: { ...this.allStatus },
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
  private extraOptions: any[] = [];
  private weaponData = new Weapon();
  private monsterData = {
    name: '',
    race: '',
    size: '',
    element: '',
    elementLevel: '',
    type: '',
    softDef: 1,
  };
  private monster: MonsterModel;

  private _class: CharacterBase;
  private propertyAtk = ElementType.Neutral;
  private sizePenalty = 1;
  private propertyMultiplier = 1;
  private baseEquipmentStat: Record<string, number> = {};

  private buff: any[] = [];

  private dmgReductionByHardDef = 0;
  private totalPene = 0;

  private statusBonus = 0;
  private totalMasteryAtk = 0;
  private totalBuffAtk = 0;
  private totalStatusAtk = 0;
  private totalWeaponAtkMin = 0;
  private totalWeaponAtkMax = 0;
  private totalEquipAtk = 0;
  private totalAMin = 0;
  private totalAMax = 0;
  private totalBMin = 0;
  private totalBMax = 0;
  private totalMinAtk = 0;
  private totalMaxAtk = 0;
  private baseSkillDamage = 0;
  private readonly BASE_CRI_DMG = 1.4;

  private possiblyDamages: any[] = [];

  get status() {
    const { str, jobStr, int, jobInt, luk, jobLuk, vit, jobVit, dex, jobDex, agi, jobAgi } = this.model;

    return {
      baseStr: str,
      totalStr: str + (jobStr ?? 0) + (this.totalEquipStatus.str ?? 0),

      baseInt: int,
      totalInt: int + (jobInt ?? 0) + (this.totalEquipStatus.int ?? 0),

      baseLuk: luk,
      totalLuk: luk + (jobLuk ?? 0) + (this.totalEquipStatus.luk ?? 0),

      baseVit: vit,
      totalVit: vit + (jobVit ?? 0) + (this.totalEquipStatus.vit ?? 0),

      baseDex: dex,
      totalDex: dex + (jobDex ?? 0) + (this.totalEquipStatus.dex ?? 0),

      baseAgi: agi,
      totalAgi: agi + (jobAgi ?? 0) + (this.totalEquipStatus.agi ?? 0),
    };
  }

  setMasterItems(items: any) {
    this.items = items;
  }

  private getItem(id: number) {
    return this.items[id];
  }

  private isRangeAtk() {
    return true;
  }

  private isUsedSkill(skillName: string) {
    return this.usedSkillNames.has(skillName);
  }

  private isEquipItem(itemName: string) {
    return this.equipItemNameSet.has(itemName);
  }

  private toPercent(n: number) {
    return n * 0.01;
  }

  setClass(c: CharacterBase) {
    this._class = c;

    return this;
  }

  setMonster(monster: MonsterModel) {
    const {
      name,
      stats: { defense, vit, level, elementName, raceName, class: monsterTypeId, scaleName },
    } = monster;
    const [pureElement] = elementName.split(' ');

    this.monster = monster;
    this.monsterData = {
      name,
      element: pureElement.toLowerCase(),
      elementLevel: elementName.toLowerCase(),
      race: raceName.toLowerCase(),
      size: scaleName.at(0).toLowerCase(),
      type: monsterTypeId === 1 ? 'normal' : 'boss',
      softDef: Math.floor((level + vit) / 2),
    };

    return this;
  }

  setModel(model: any) {
    this.model = { ...model };

    return this;
  }

  setWeapon(itemId: number, refine: number) {
    const itemData = this.getItem(itemId);
    this.equipItem.set(ItemTypeEnum.weapon, itemData);
    if (itemData) {
      this.equipItemName.set(ItemTypeEnum.weapon, this.removeItemSlotName(itemData.name));
    } else {
      this.equipItemName.delete(ItemTypeEnum.weapon);
    }
    this.equipItemNameSet = new Set(this.equipItemName.values());
    this.mapRefine.set(ItemTypeEnum.weapon, refine);
    this.weaponData = new Weapon().set(itemData, refine);

    return this;
  }

  setItem(itemType: ItemTypeEnum, itemId: number, refine?: number) {
    const itemData = this.getItem(itemId);
    this.equipItem.set(itemType, itemData);
    if (itemData) {
      this.equipItemName.set(itemType, this.removeItemSlotName(itemData.name));
    } else {
      this.equipItemName.delete(itemType);
    }
    this.equipItemNameSet = new Set(this.equipItemName.values());
    if (refine != null) {
      this.mapRefine.set(itemType, refine);
    }

    return this;
  }

  setUsedSkillNames(usedSkillNames: string[]) {
    this.usedSkillNames = new Set(usedSkillNames);

    return this;
  }

  setLearnedSkills(learnedSkillMap: Map<string, number>) {
    this.learnedSkillMap = learnedSkillMap;

    return this;
  }

  setEquipAtkSkillAtk(equipSkillBonus: Record<string, any>) {
    this.equipAtkSkillBonus = { ...equipSkillBonus };

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

  setExtraOptions(extraOptions: any[]) {
    this.extraOptions = extraOptions;

    return this;
  }

  private isIncludingOverUpgrade() {
    return this.weaponData.data.subTypeName !== 'gun';
  }

  private calcStatusBonus() {
    const { totalStr, totalDex } = this.status;
    const mainState = this.isRangeAtk() ? totalDex : totalStr;
    this.statusBonus = (this.weaponData.data.baseWeaponAtk * mainState) / 200; // base on weapon type
  }

  private calcSizePenalty() {
    const penalty = weaponSizePenalty[this.weaponData?.data?.subTypeName]?.[this.monsterData.size];
    this.sizePenalty = this.toPercent(penalty || 100);
  }

  private calcPropertyMultiplier() {
    const ammo = this.equipItem.get(ItemTypeEnum.ammo);
    this.propertyAtk = ammo?.propertyAtk ?? ElementType.Neutral;

    const pMultiplier = ElementMapper[this.monster.stats.elementName][this.propertyAtk];
    this.propertyMultiplier = this.toPercent(pMultiplier);
  }

  private calcWeaponAtk() {
    const { baseWeaponAtk, baseWeaponLevel, refineBonus, overUpgradeBonus } = this.weaponData.data;
    const variant = baseWeaponAtk * baseWeaponLevel * 0.05;

    const formular = (weaponAtk: number, overUpg: number) => {
      const total = weaponAtk + this.statusBonus + refineBonus;
      const total2 = this.isIncludingOverUpgrade() ? total + overUpg : total;
      return Math.floor(total2 * this.sizePenalty);
    };
    const totalMin = formular(baseWeaponAtk - variant, 0);
    const totalMax = formular(baseWeaponAtk + variant, 0);
    // console.log({ totalStr, totalDex });

    this.totalWeaponAtkMin = totalMin;
    this.totalWeaponAtkMax = totalMax;
  }

  private calcEquipAtk() {
    const extraAtk = this.totalEquipStatus.atk;

    this.totalEquipAtk = extraAtk;
  }

  private calcAtkGroupA(totalWeaponAtk?: number) {
    const atkPercent = this.toPercent(this.totalEquipStatus.atkPercent);
    const formular = (totalAtk: number) => {
      const a = Math.floor((totalAtk + this.totalEquipAtk) * atkPercent);

      return Math.floor(a * this.propertyMultiplier);
    };

    if (totalWeaponAtk) return formular(totalWeaponAtk);

    const totalAMin = formular(this.totalWeaponAtkMin);
    const totalAMax = formular(this.totalWeaponAtkMax);

    this.totalAMin = totalAMin;
    this.totalAMax = totalAMax;

    return this;
  }

  private calcRaceMultiplier() {
    const base = this.totalEquipStatus.p_race_all;

    return 100 + base + (this.totalEquipStatus[`p_race_${this.monsterData.race}`] ?? 0);
  }

  private calcSizeMultiplier() {
    const base = this.totalEquipStatus.p_size_all;

    return 100 + base + (this.totalEquipStatus[`p_size_${this.monsterData.size}`] ?? 0);
  }

  private calcElementMultiplier() {
    const base = this.totalEquipStatus.p_element_all;

    return 100 + base + (this.totalEquipStatus[`p_element_${this.monsterData.element}`] ?? 0);
  }

  private calcMonterTypeMultiplier() {
    const base = this.totalEquipStatus.p_class_all;

    return 100 + base + (this.totalEquipStatus[`p_class_${this.monsterData.type}`] ?? 0);
  }

  private calcAtkGroupB(totalWeaponAtk?: number) {
    const race = this.toPercent(this.calcRaceMultiplier());
    const size = this.toPercent(this.calcSizeMultiplier());
    const element = this.toPercent(this.calcElementMultiplier());
    const monsterType = this.toPercent(this.calcMonterTypeMultiplier());
    const formular = (atk: number) => {
      return Math.floor(
        Math.floor(Math.floor(Math.floor(Math.floor(atk * race) * size) * element) * monsterType) *
          this.propertyMultiplier,
      );
    };

    if (totalWeaponAtk) return formular(totalWeaponAtk + this.totalEquipAtk);

    const totalBMin = formular(this.totalWeaponAtkMin + this.totalEquipAtk);
    const totalBMax = formular(this.totalWeaponAtkMax + this.totalEquipAtk);

    this.totalBMin = totalBMin;
    this.totalBMax = totalBMax;

    return this;
  }

  private calcStatusAtk() {
    const { totalStr, totalDex, totalLuk } = this.status;
    const baseLvl = this.model.level;
    const mainStatus = this.isRangeAtk() ? totalDex : totalStr;
    const secondStatus = this.isRangeAtk() ? totalStr : totalDex;

    this.totalStatusAtk = Math.floor(baseLvl / 4 + secondStatus / 5 + mainStatus + totalLuk / 3);
  }

  private calcMasteryAtk() {
    const skillAtk = Object.values(this.masteryAtkSkillBonus)
      .map((a) => Number(a.atk))
      .filter((a) => Number.isNaN(a) === false)
      .reduce((sum, m) => sum + m, 0);

    this.totalMasteryAtk = skillAtk;
  }

  private calcBuffAtk() {
    // ex. camoflage
    this.totalBuffAtk = 0;
  }

  private calcTotalAtk(aAtk?: number, bAtk?: number) {
    const statusAtk = this.totalStatusAtk * 2 + this.totalMasteryAtk + this.totalBuffAtk;
    const totalMinAtk = this.totalAMin + this.totalBMin + statusAtk;
    const totalMaxAtk = this.totalAMax + this.totalBMax + statusAtk;

    if (aAtk && bAtk) return aAtk + bAtk + statusAtk;

    this.totalMinAtk = totalMinAtk;
    this.totalMaxAtk = totalMaxAtk;

    return this;
  }

  private calcTotalPene() {
    const { size, race, element } = this.monsterData;
    const { p_pene_race_all, p_element_neutral, p_pene_size_all } = this.totalEquipStatus;
    const rawPene = p_pene_race_all + p_element_neutral + p_pene_size_all;
    const byMonster =
      (this.totalEquipStatus[`p_pene_size_${size}`] ?? 0) +
      (this.totalEquipStatus[`p_pene_element_${element}`] ?? 0) +
      (this.totalEquipStatus[`p_pene_race_${race}`] ?? 0);
    const totalPene = rawPene + byMonster;

    this.totalPene = totalPene >= 100 ? 100 : totalPene;
  }

  private calcMonsterHardDef() {
    const def = this.monster.stats.defense;
    const pene = this.totalPene;

    this.dmgReductionByHardDef = (4000 + def * ((100 - pene) / 100)) / (4000 + def * ((100 - pene) / 100) * 10);
  }

  private calcBasicDamage() {
    const { softDef } = this.monsterData;
    const hardDef = this.dmgReductionByHardDef;
    const { range, melee } = this.totalEquipStatus;
    const rangedMultiplier = this.isRangeAtk() ? range : melee;
    const dmgMultiplier = 0;
    const finalDmgMultiplier = 0;

    const formula = (totalAtk: number) => {
      const rangedApplied = Math.floor(totalAtk * this.toPercent(rangedMultiplier + 100));
      const dmgMultiApplied = Math.floor(rangedApplied * this.toPercent(dmgMultiplier + 100));
      const dmgHdef = Math.floor(dmgMultiApplied * hardDef);
      const dmgSdef = dmgHdef - softDef;
      const finalApplied = Math.floor(dmgSdef * this.toPercent(finalDmgMultiplier + 100));
      return finalApplied;
    };

    const basicMinDamage = formula(this.totalMinAtk);
    const basicMaxDamage = formula(this.totalMaxAtk);

    return { basicMinDamage, basicMaxDamage };
  }

  private calcCriDamage() {
    const { softDef } = this.monsterData;
    const hardDef = this.dmgReductionByHardDef;
    const { range, melee, criDmg } = this.totalEquipStatus;
    const rangedMultiplier = this.isRangeAtk() ? range : melee;
    const dmgMultiplier = 0;
    const finalDmgMultiplier = 0;

    const formula = (totalAtk: number) => {
      const criApplied = Math.floor(totalAtk * this.toPercent((criDmg || 0) + 100));
      const rangedApplied = Math.floor(criApplied * this.toPercent(rangedMultiplier + 100));
      const dmgMultiApplied = Math.floor(rangedApplied * this.toPercent(dmgMultiplier + 100));
      const dmgHdef = Math.floor(dmgMultiApplied * hardDef);
      const dmgSdef = dmgHdef - softDef;
      const baseCriApplied = Math.floor(dmgSdef * this.BASE_CRI_DMG);
      const finalApplied = Math.floor(baseCriApplied * this.toPercent(finalDmgMultiplier + 100));
      return finalApplied;
    };

    const criMaxDamage = formula(this.totalMaxAtk);

    return criMaxDamage;
  }

  private calcRangeSkillDamage(skillData: AtkSkillModel) {
    const { name: skillName, canCri } = skillData;
    const { softDef } = this.monsterData;
    const hardDef = this.dmgReductionByHardDef;

    const { range, melee, criDmg } = this.totalEquipStatus;
    const rangedMultiplier = this.isRangeAtk() ? range : melee;
    const baseSkillMultiplier = this.toPercent(this.baseSkillDamage);
    const equipSkillMultiplier = this.toPercent(100 + (this.totalEquipStatus[skillName] || 0));
    const criMultiplier = canCri ? this.toPercent((criDmg || 0) + 100) : 1;
    // const dmgMultiplier = 0;
    const finalDmgMultiplier = 0;

    const skillFormula = (totalAtk: number) => {
      const criApplied = Math.floor(totalAtk * criMultiplier);
      const rangedApplied = Math.floor(criApplied * this.toPercent(rangedMultiplier + 100));
      const baseSkillApplied = Math.floor(rangedApplied * baseSkillMultiplier) - softDef;
      const equipSkillApplied = Math.floor(baseSkillApplied * equipSkillMultiplier);
      const hDefApplied = Math.floor(equipSkillApplied * hardDef);
      const baseCriApplied = canCri ? Math.floor(hDefApplied * this.BASE_CRI_DMG) : hDefApplied;
      const finalApplied = Math.floor(baseCriApplied * this.toPercent(finalDmgMultiplier + 100));

      return finalApplied;
    };

    this.possiblyDamages = Array.from({ length: this.totalWeaponAtkMax - this.totalWeaponAtkMin - 1 }).map((_, i) => {
      const atk = this.totalWeaponAtkMin + i + 1;
      const aAtk = this.calcAtkGroupA(atk) as number;
      const bAtk = this.calcAtkGroupB(atk) as number;
      const totalAtk = this.calcTotalAtk(aAtk, bAtk) as number;
      const dmg = this._class.calcSkillDmgByTotalHit(skillFormula(totalAtk), skillName);
      return `From:${atk} => ${dmg} (${dmg / 3} x 3)`;
    });

    const minDamage = skillFormula(this.totalMinAtk);
    const maxDamage = skillFormula(this.totalMaxAtk);

    return { minDamage, maxDamage };
  }

  private calcAllAtk() {
    this.calcPropertyMultiplier();
    this.calcSizePenalty();
    this.calcTotalPene();
    this.calcMonsterHardDef();

    this.calcEquipAtk();
    this.calcMasteryAtk();
    this.calcBuffAtk();
    this.calcStatusAtk();
    this.calcStatusBonus();
    this.calcWeaponAtk();

    this.calcAtkGroupA();
    this.calcAtkGroupB();
    this.calcTotalAtk();

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

    // 9===SKILL[Platinum Altar]==50(90 วินาที)
    const [skillCond, extraBonus] = bonus.split('==');
    // console.log({ miniScript, skillCond, extraBonus });
    if (skillCond && extraBonus) {
      const skillName = skillCond.substring(6, skillCond.length - 1);

      if (this.isUsedSkill(skillName)) {
        this.buff.push({ [skillName]: extraBonus });

        return this.getActualBonus(extraBonus);
      }

      return 0;
    }

    // [weapon]10===10
    if (condition.startsWith('[weapon]')) {
      const conditionLv = Number(condition.replace('[weapon]', ''));
      const refineLv = this.mapRefine.get(ItemTypeEnum.weapon);
      // console.log({ refineLv, conditionLv });
      if (refineLv >= conditionLv) return bonusNum;

      return 0;
    }

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
    const calc = (actual: number, cond: number) => Math.floor(actual / cond) * bonusNum;
    // console.log({ lineScript, conditionNum, bonusNum });
    if (conditionNum && bonusNum) {
      return Math.floor(itemRefine / conditionNum) * bonusNum;
    }

    // [weapon]1---2 (ex. temporal headgear)
    if (condition.startsWith('[weapon]')) {
      const conditionLv = Number(condition.replace('[weapon]', ''));
      const refineLv = this.mapRefine.get(ItemTypeEnum.weapon);

      return calc(refineLv, Number(conditionLv));
    }

    // LEARN_SKILL[Snake Eyes==]1---2
    const [, skillName, skillLv] = condition.match(/^LEARN_SKILL\[(.+?)==(\d+)]/) ?? [];
    if (skillName) {
      const learned = this.learnedSkillMap.get(skillName) || 0;
      return calc(learned, Number(skillLv));
    }

    // dex:10---1
    const [, status, statusCond] = condition.match(/(str|int|dex|agi|vit|luk):(-*\d+)/) ?? [];
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

    return 0;
  }

  private validateCondition(
    itemType: ItemTypeEnum,
    itemRefine: number,
    script: string,
  ): {
    isValid: boolean;
    restCondition: string;
  } {
    let restCondition = script;
    const mainStatusRegex = /^(str|int|dex|agi|vit|luk|level):(\d+)&&(\d+===.+)/;
    const [, status, statusCondition, raw] = script.match(mainStatusRegex) ?? [];
    if (status) {
      const isPass = this.model[status] >= Number(statusCondition);

      return { isValid: isPass, restCondition: raw };
    }

    const [_, weaponType] = script.match(/^\[weaponType=(.+?)\]/) ?? [];
    if (weaponType) {
      const weapon = this.equipItem.get(ItemTypeEnum.weapon);
      if (weaponType !== weapon?.unidName) return { isValid: false, restCondition };
      restCondition = restCondition.replace(`[weaponType=${weaponType}]`, '');

      return { isValid: true, restCondition };
    }

    // EQUIP[Bear's Power]===50
    const [setCondition, itemSet] = script.match(/^EQUIP\[(.+?)]/) ?? [];
    if (itemSet) {
      const itemSets = itemSet.split('&&').filter(Boolean);
      // console.log({ itemRefine, itemSet, itemSets });
      const valid = itemSets.every((item) => {
        const res = item.split('||').some((_item) => this.isEquipItem(_item));
        // if (itemRefine === 9) {
        //   console.log({ item, res });
        // }
        return res;
      });
      if (!valid) return { isValid: false, restCondition };

      restCondition = restCondition.replace(setCondition, '');

      // REFINE[garment,armor==20]===10
      // REFINE[9]===25
      const [unused, refineCombo, refineCond] = restCondition.match(/^REFINE\[(\D*?)=*=*(\d+)]/) ?? [];
      if (refineCombo) {
        if (restCondition.includes('---')) {
          return { isValid: true, restCondition };
        }

        const totalRefine = refineCombo
          .split(',')
          .map((itemType) => this.mapRefine.get(itemType as ItemTypeEnum))
          .reduce((sum, cur) => sum + (cur || 0), 0);
        if (totalRefine >= Number(refineCond)) {
          restCondition = restCondition.replace(unused, '');
          if (!restCondition.startsWith('===')) {
            return this.validateCondition(itemType, itemRefine, restCondition);
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

    const [unused, refineCond] = restCondition.match(/^REFINE\[(\d+)?]/) ?? [];
    if (refineCond && itemRefine >= Number(refineCond)) {
      if (restCondition.includes('---')) {
        return { isValid: true, restCondition };
      }

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
    const [unusedPos, position] = script.match(/POS\[(\D+)]/) ?? [];
    if (position) {
      if (position === itemType) {
        return {
          isValid: true,
          restCondition: restCondition.replace(unusedPos, ''),
        };
      }

      return { isValid: false, restCondition };
    }

    return {
      isValid: true,
      restCondition: restCondition,
    };
  }

  private updateBaseEquipStat(attr: string, lineScript: string) {
    const n = Number(lineScript);
    if (Number.isSafeInteger(n)) {
      this.baseEquipmentStat[attr] = n + (this.baseEquipmentStat[attr] || 0);
    }
  }

  private calcItemStatus(itemType: ItemTypeEnum, itemRefine: number, script: Record<string, string[]>) {
    const total: Record<string, number> = {};

    // console.log({ itemRefine, script });
    for (const [attr, attrScripts] of Object.entries(script)) {
      this.updateBaseEquipStat(attr, attrScripts[0]);

      total[attr] = attrScripts.reduce((sum, lineScript) => {
        const { isValid, restCondition } = this.validateCondition(itemType, itemRefine, lineScript);
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
    }

    return total;
  }

  private removeItemSlotName(itemName: string) {
    return itemName.replace(/\[\d]$/, '').trim();
  }

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

    return Math.floor(base * (Number(boostPercent) / 100));
  }

  private calcAllEquipItems() {
    this.totalEquipStatus = { ...this.allStatus };
    this.equipStatus = {} as any;

    this.equipStatus['extra'] = { ...this.allStatus };
    for (const scripts of this.extraOptions) {
      for (const [attr, value] of Object.entries(scripts)) {
        if (this.equipStatus['extra'][attr]) {
          this.equipStatus['extra'][attr] += value;
        } else {
          this.equipStatus['extra'][attr] = value;
        }

        if (this.totalEquipStatus[attr]) {
          this.totalEquipStatus[attr] += value;
        } else {
          this.totalEquipStatus[attr] = value;
        }
      }
    }

    this.baseEquipmentStat = {};
    for (const [itemType, itemData] of this.equipItem) {
      this.equipStatus[itemType] = { ...this.allStatus };
      if (!itemData) {
        continue;
      }

      if (itemType !== ItemTypeEnum.weapon && itemData.attack) {
        this.equipStatus[itemType].atk = itemData.attack;
        if (this.totalEquipStatus['atk']) {
          this.totalEquipStatus['atk'] += itemData.attack;
        } else {
          this.totalEquipStatus['atk'] = itemData.attack;
        }
      }

      // if (itemData.defense) {
      //   this.equipStatus[itemType].def = itemData.attack;
      // }

      // console.log({ itemType, itemData });
      const refine = this.getRefineLevelByItemType(itemType);
      const calculatedItem = this.calcItemStatus(itemType, refine, itemData.script);
      for (const [attr, value] of Object.entries(calculatedItem)) {
        this.equipStatus[itemType][attr] = value;

        if (this.totalEquipStatus[attr]) {
          this.totalEquipStatus[attr] += value;
        } else {
          this.totalEquipStatus[attr] = value;
        }
      }
    }

    for (const [skillName, scripts] of Object.entries(this.equipAtkSkillBonus)) {
      for (const [attr, value] of Object.entries(scripts)) {
        let val = Number(value);
        if (attr === 'atk' || attr === 'matk') val = 0;

        this.equipStatus[skillName] = { ...this.allStatus, [attr]: val };

        if (this.totalEquipStatus[attr]) {
          this.totalEquipStatus[attr] += val;
        } else {
          this.totalEquipStatus[attr] = val;
        }

        this.baseEquipmentStat[attr] = val + (this.baseEquipmentStat[attr] || 0);
      }
    }

    for (const cons of this.consumableBonuses) {
      for (const [attr, value] of Object.entries(cons)) {
        const valNum = Number(value);
        if (this.totalEquipStatus[attr]) {
          this.totalEquipStatus[attr] += valNum;
        } else {
          this.totalEquipStatus[attr] = valNum;
        }
      }
    }

    const allStatus = this.totalEquipStatus.allStatus ?? 0;
    for (const status of mainStatuses) {
      if (this.totalEquipStatus[status]) {
        this.totalEquipStatus[status] += allStatus;
      } else {
        this.totalEquipStatus[status] = allStatus;
      }
    }

    if (this.totalEquipStatus['agiBoost'] > 0) {
      const boost = this.totalEquipStatus['agiBoost'];
      this.totalEquipStatus.agi += this.calcStatBoost(Number(boost), 'agi');
    }
    if (this.totalEquipStatus['dexBoost'] > 0) {
      const boost = this.totalEquipStatus['dexBoost'];
      this.totalEquipStatus.dex += this.calcStatBoost(Number(boost), 'dex');
    }
  }

  calculateSkillDamage(skillValue: string) {
    this.calcAllEquipItems();
    this.calcAllAtk();
    this.baseSkillDamage = 0;

    const [, skillName, skillLevel] = skillValue.match(/(.+)==(\d+)/) ?? [];
    const skillData = this._class.atkSkills.find((a) => a.value === skillValue);
    const isValidSkill = !!skillName && !!skillLevel && typeof skillData?.formular === 'function';

    let minSkillDamage = 0;
    let maxSkillDamage = 0;
    if (isValidSkill) {
      const baseSkillDamage = skillData.formular({
        baseLevel: this.model.level,
        skillLevel: Number(skillLevel),
        usedSkillSet: this.usedSkillNames,
      });
      this.baseSkillDamage = baseSkillDamage;

      let { minDamage, maxDamage } = this.calcRangeSkillDamage(skillData);
      minSkillDamage = minDamage;
      maxSkillDamage = maxDamage;
    }

    const { basicMinDamage, basicMaxDamage } = this.calcBasicDamage();
    const criDmg = this.calcCriDamage();

    return {
      rawMinDamage: basicMinDamage,
      rawMaxDamage: basicMaxDamage,
      criMinDamage: criDmg,
      criMaxDamage: criDmg,
      minDamage: this._class.calcSkillDmgByTotalHit(minSkillDamage, skillName),
      maxDamage: this._class.calcSkillDmgByTotalHit(maxSkillDamage, skillName),
    };
  }

  private calculateDamage() {
    // this.calcAllEquipItems();
    // const { minDamage, maxDamage } = this.calcRangeSkillDamage('Round Trip');
    // return { minDamage, maxDamage };
  }

  private getObjSummary(obj: Record<string, number>) {
    const summary = {};
    for (const [key, value] of Object.entries(obj)) {
      if (value !== 0 && value != null) {
        summary[key] = value;
      }
    }

    return summary;
  }

  getTotalummary() {
    return {
      ...this.getObjSummary(this.totalEquipStatus),
      monster: { ...this.monsterData },
      propertyAtk: this.propertyAtk,
      propertyMultiplier: this.propertyMultiplier,
      weapon: this.weaponData.data,
      calc: {
        dmgReductionByHardDef: this.dmgReductionByHardDef,
        statusBonus: this.statusBonus,
        totalPene: this.totalPene,
        totalEquipAtk: this.totalEquipAtk,
        totalMasteryAtk: this.totalMasteryAtk,
        totalBuffAtk: this.totalBuffAtk,
        totalStatusAtk: this.totalStatusAtk,
        totalWeaponAtkMin: this.totalWeaponAtkMin,
        totalWeaponAtkMax: this.totalWeaponAtkMax,
        totalAMin: this.totalAMin,
        totalAMax: this.totalAMax,
        totalBMin: this.totalBMin,
        totalBMax: this.totalBMax,
        totalMinAtk: this.totalMinAtk,
        totalMaxAtk: this.totalMaxAtk,
        baseSkillDamage: this.baseSkillDamage,
      },
      equipments: [...this.equipItemNameSet.keys()],
    };
  }

  getItemSummary() {
    const obj = {};
    for (const [itemType, itemData] of this.equipItem) {
      if (!itemData || !itemType) continue;

      obj[itemType] = this.getObjSummary(this.equipStatus[itemType]);
    }

    return {
      ...obj,
      ...this.equipAtkSkillBonus,
      ...this.masteryAtkSkillBonus,
      ...{ extra: this.equipStatus['extra'] },
      consumableBonuses: this.consumableBonuses,
    };
  }

  getModelSummary() {
    return this.getObjSummary(this.model);
  }

  getPossiblyDamages() {
    return this.possiblyDamages;
  }
}
