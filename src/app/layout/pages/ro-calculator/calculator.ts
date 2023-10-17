import { AtkSkillModel, CharacterBase } from './jobs/char-class.abstract';
import { ElementMapper } from './element-mapper';
import { ElementType } from './element-type.const';
import { ItemTypeEnum, MainItemTypeSet, MainItemWithRelations } from './item-type.enum';
import { ItemModel } from './item.model';
import { MonsterModel } from './monster.model';
import { Weapon } from './weapon';
import { PoisionPsoEleTable } from './poison-psdo-ele-table';
import { AllowShieldTable } from './allow-shield-table';

// const getItem = (id: number) => items[id] as ItemModel;
const refinableItemTypes = [
  ItemTypeEnum.weapon,
  ItemTypeEnum.headUpper,
  ItemTypeEnum.shield,
  ItemTypeEnum.armor,
  ItemTypeEnum.garment,
  ItemTypeEnum.boot,

  ItemTypeEnum.shadowWeapon,
  ItemTypeEnum.shadowArmor,
  ItemTypeEnum.shadowBoot,
  ItemTypeEnum.shadowEaring,
  ItemTypeEnum.shadowPendant,
  ItemTypeEnum.shadowShield,
];
const mainStatuses = ['str', 'dex', 'int', 'agi', 'luk', 'vit'];

const weaponSizePenalty: Record<string, { s: number; m: number; l: number }> = {
  dagger: { s: 100, m: 75, l: 50 },
  rod: { s: 100, m: 100, l: 100 },
  bow: { s: 100, m: 100, l: 75 },
  katar: { s: 75, m: 100, l: 75 },
  book: { s: 100, m: 100, l: 50 },
  instrument: { s: 75, m: 100, l: 75 },
  whip: { s: 75, m: 100, l: 50 },
  gun: { s: 100, m: 100, l: 100 },
};

const isNumber = (n: unknown): n is number => !Number.isNaN(n);

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
  private mapItemNameRefine = new Map<string, number>();
  private usedSkillNames = new Set<string>();
  private learnedSkillMap = new Map<string, number>();
  private equipAtkSkillBonus: Record<string, any> = {};
  private buffBonus: Record<string, any> = {};
  private masteryAtkSkillBonus: Record<string, any> = {};
  private consumableBonuses: any[] = [];
  private activeSkillIds: number[] = [];
  private passiveSkillIds: number[] = [];
  private aspdPotion: number = undefined;

  private allStatus = {
    exp: 0,
    drop: 0,
    hp: 0,
    hpPercent: 0,
    sp: 0,
    spPercent: 0,
    def: 0,
    defPercent: 0,
    softDef: 0,
    softDefPercent: 0,
    mdef: 0,
    mdefPercent: 0,
    softMdef: 0,
    softMdefPercent: 0,
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
    vct_inc: 0,
    acd: 0,
    fct: 0,
    fctPercent: 0,
    cri: 0,
    criDmg: 0,
    perfectHit: 0,
    hit: 0,
    flee: 0,
    perfectDodge: 0,
    dmg: 0,
    ignore_size_penalty: 0,
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
    m_my_element_all: 0,
    m_my_element_neutral: 0,
    m_my_element_water: 0,
    m_my_element_earth: 0,
    m_my_element_fire: 0,
    m_my_element_wind: 0,
    m_my_element_poison: 0,
    m_my_element_holy: 0,
    m_my_element_dark: 0,
    m_my_element_ghost: 0,
    m_my_element_undead: 0,
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
    m_race_demihuman: 0,
    m_race_angel: 0,
    m_race_dragon: 0,
    m_class_normal: 0,
    m_class_boss: 0,
    m_class_champion: 0,
    p_pene_race_all: 0,
    p_pene_size_all: 0,
    p_pene_element_all: 0,
    m_pene_race_all: 0,
    m_pene_size_all: 0,
    m_pene_element_all: 0,
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
  private extraOptions: any[] = [];
  private weaponData = new Weapon();
  private monsterData = {
    name: '',
    race: '',
    raceUpper: '',
    size: '',
    sizeUpper: '',
    sizeFullUpper: '',
    element: '',
    elementUpper: '',
    elementLevel: '',
    elementLevelUpper: '',
    type: '',
    isMvp: false,
    typeUpper: '',
    softDef: 1,
    softMDef: 1,
    hitRequireFor100: 1,
    criShield: 1,
    def: 0,
    mdef: 0,
    hp: 0,
  };
  private monster: MonsterModel;

  private _class: CharacterBase;
  private propertyAtk = ElementType.Neutral;
  private sizePenalty = 1;
  private propertyMultiplier = 1;
  private skillPropertyMultiplier = 1;
  private baseEquipmentStat: Record<string, number> = {};
  private finalMultipliers = [] as number[];

  private buff: any[] = [];

  private dmgReductionByHardDef = 0;
  private dmgReductionByMHardDef = 0;
  private totalPhysicalPene = 0;
  private totalMagicalPene = 0;

  private def = 0;
  private softDef = 0;
  private mdef = 0;
  private softMdef = 0;

  private totalAspd = 0;
  private hitPerSecs = 0;
  private totalHit = 0;
  private totalPerfectHit = 0;
  private hitRate = 0;
  private totalCri = 0;
  private totalFlee = 0;
  private totalPerfectDodge = 0;
  private criRateSkillToMonster = 0;
  private criRateToMonster = 0;
  private basicDps = 0;
  private skillDps = 0;
  private damageSummary = {};

  private weaponStatusAtk = 0;
  private totalMasteryAtk = 0;
  private totalBuffAtk = 0;
  private totalStatusAtk = 0;
  private totalWeaponAtkMin = 0;
  private totalWeaponAtkMax = 0;
  private totalWeaponAtkMaxOver = 0;
  private totalEquipAtk = 0;
  private totalEquipMatk = 0;
  private totalAMin = 0;
  private totalAMax = 0;
  private totalAMaxOver = 0;
  private totalBMin = 0;
  private totalBMax = 0;
  private totalBMaxOver = 0;
  private totalMinAtk = 0;
  private totalMaxAtk = 0;
  private totalMaxAtkOver = 0;
  private baseSkillDamage = 0;
  private isMagicalSkill = false;
  private readonly BASE_CRI_DMG = 1.4;

  private totalStatusMatk = 0;
  private totalMasteryMatk = 0;
  private weaponMinMatk = 0;
  private weaponMaxMatk = 0;
  private totalMinMatk = 0;
  private totalMaxMatk = 0;

  private skillFrequency = {
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
  } as any;

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

  private getExtraCriRate() {
    const { race, element, size } = this.monsterData;
    const toRace = this.model[`cri_race_${race}`] || 0;
    const toElement = this.model[`cri_element_${element}`] || 0;
    const toSize = this.model[`cri_size_${size}`] || 0;

    return toRace + toElement + toSize;
  }

  private isRangeAtk() {
    const w = this.weaponData.data.typeName;
    return w === 'bow' || w === 'gun';
  }

  private isUsedSkill(skillName: string) {
    return this.usedSkillNames.has(skillName);
  }

  private isUsedEDP() {
    return this.isUsedSkill('Enchant Deadly Poison');
  }

  private isEquipItem(itemName: string) {
    return this.equipItemNameSet.has(itemName);
  }

  private isEquipHawkeye() {
    return this.equipItemNameSet.has('Hawkeye'); //.equipItemNameSet.has('')
  }

  isAllowAmmo() {
    const allowMap = {
      bow: true,
      gun: true,
    };

    return allowMap[this.weaponData.data?.typeName] || false;
  }

  isAllowShield() {
    return AllowShieldTable[this.weaponData.data?.typeName] || false;
  }

  getAmmuSubTypeId() {
    const map = {
      bow: 1024,
      gun: 1025,
    };

    return map[this.weaponData.data?.typeName];
  }

  private toPercent(n: number) {
    return n * 0.01;
  }

  private toPreventNegativeDmg(n: number) {
    return n < 0 ? 1 : n;
  }

  private floor(n: number, digit = 0) {
    if (digit > 0) {
      const pow = Math.pow(10, digit);
      return this.floor(n * pow) / pow;
    }

    return Math.floor(n);
  }

  setClass(c: CharacterBase) {
    this._class = c;

    return this;
  }

  setMonster(monster: MonsterModel) {
    const {
      name,
      stats: {
        int,
        vit,
        agi,
        luk,
        level,
        elementName,
        health,
        defense,
        magicDefense,
        raceName,
        class: monsterTypeId,
        scaleName,
        mvp,
      },
    } = monster;
    const [pureElement] = elementName.split(' ');

    const _class = monsterTypeId === 0 ? 'normal' : 'boss';
    const elementLevel = elementName.toLowerCase();
    const upperFirst = (s: string) => {
      return s.at(0).toUpperCase() + s.substring(1);
    };

    this.monster = monster;
    this.monsterData = {
      name,
      element: pureElement.toLowerCase(),
      elementUpper: upperFirst(pureElement),
      elementLevel,
      elementLevelUpper: upperFirst(elementLevel),
      race: raceName.toLowerCase(),
      raceUpper: raceName,
      size: scaleName.at(0).toLowerCase(),
      sizeUpper: scaleName.at(0),
      sizeFullUpper: scaleName,
      type: _class,
      isMvp: mvp === 1,
      typeUpper: upperFirst(_class),
      hp: health,
      def: defense,
      softDef: this.floor((level + vit) / 2),
      mdef: magicDefense,
      softMDef: this.floor((level + int) / 4),
      criShield: this.floor(luk / 5),
      hitRequireFor100: 200 + level + agi,
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

    this.mapItemNameRefine = new Map();
    for (const [itemType, itemName] of this.equipItemName) {
      this.mapItemNameRefine.set(itemName, this.mapRefine.get(itemType));
    }

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

  setBuffBonus(buffBonus: Record<string, any>) {
    this.buffBonus = { ...buffBonus };

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

  setSkillIds({ activeSkillIds, passiveSkillIds }: { activeSkillIds: number[]; passiveSkillIds: number[] }) {
    this.activeSkillIds = [...activeSkillIds];
    this.passiveSkillIds = [...passiveSkillIds];

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

  loadItemFromModel(model: any) {
    this.model = model;

    const items = Object.entries(MainItemWithRelations) as [ItemTypeEnum, ItemTypeEnum[]][];

    for (const [mainItemType, itemRelations] of items) {
      const itemId = model[mainItemType];
      if (!isNumber(itemId)) continue;

      const refine = model[`${mainItemType}Refine`];
      // console.log({itemId, refine, itemRelations})
      if (mainItemType === ItemTypeEnum.weapon) {
        this.setWeapon(itemId, refine);
      } else {
        this.setItem(mainItemType, itemId, refine);
      }

      for (const itemRelation of itemRelations) {
        const itemId2 = model[itemRelation];
        if (!isNumber(itemId2)) continue;

        this.setItem(itemRelation, itemId2);
      }
    }

    return this;
  }

  private isIncludingOverUpgrade() {
    return this.isRangeAtk();
  }

  private calcWeaponStatusAtk() {
    const { totalStr, totalDex } = this.status;
    const mainState = this.isRangeAtk() ? totalDex : totalStr;

    this.weaponStatusAtk = (this.weaponData.data.baseWeaponAtk * mainState) / 200;

    return this;
  }

  private calcSizePenalty() {
    if (this.totalEquipStatus.ignore_size_penalty > 0) {
      this.sizePenalty = 1;
      return this;
    }

    const penalty = weaponSizePenalty[this.weaponData?.data?.typeName]?.[this.monsterData.size];
    this.sizePenalty = this.toPercent(penalty || 100);

    return this;
  }

  private calcPropertyMultiplier(propertyAtk?: ElementType) {
    if (propertyAtk) {
      const x = ElementMapper[this.monster.stats.elementName][propertyAtk];
      this.skillPropertyMultiplier = this.toPercent(x);

      return this;
    }

    const ammo = this.equipItem.get(ItemTypeEnum.ammo);
    this.propertyAtk = this.model.propertyAtk ?? ammo?.propertyAtk ?? ElementType.Neutral;

    const pMultiplier = ElementMapper[this.monster.stats.elementName][this.propertyAtk];
    const viApplied = this.toPercent((this.totalEquipStatus['vi'] || 0) + 100) * pMultiplier;
    this.propertyMultiplier = this.toPercent(viApplied);

    return this;
  }

  private calcWeaponAtk() {
    const { baseWeaponAtk, baseWeaponLevel, refineBonus, overUpgradeBonus } = this.weaponData.data;
    const [element, eleLvl] = this.monsterData.elementLevelUpper.split(' ');
    const weaponSizePenalty = baseWeaponAtk * this.sizePenalty;
    const variant = weaponSizePenalty * baseWeaponLevel * 0.05;
    const poisonPsuMulti = 1 + PoisionPsoEleTable[eleLvl][element] * 0.25;

    const formular = (weaponAtk: number, overUpg: number) => {
      const total =
        weaponAtk + this.floor(this.weaponStatusAtk * this.sizePenalty) + this.floor(refineBonus * this.sizePenalty);
      const totalOverUpg = this.isIncludingOverUpgrade() ? total : total + overUpg;
      const edpApplied = this.isUsedEDP() ? 4 * (totalOverUpg * poisonPsuMulti) : totalOverUpg;

      return this.floor(edpApplied);
    };
    const totalMin = formular(weaponSizePenalty - variant, 0);
    const totalMax = formular(weaponSizePenalty + variant, 0);
    const totalMaxOver = formular(weaponSizePenalty + variant, overUpgradeBonus);

    this.totalWeaponAtkMin = totalMin;
    this.totalWeaponAtkMax = totalMax;
    this.totalWeaponAtkMaxOver = totalMaxOver;

    return this;
  }

  private getEquipAtkFromSkills(atkType: 'atk' | 'matk' = 'atk') {
    let atk = 0;
    for (const [skillName, scripts] of Object.entries(this.equipAtkSkillBonus)) {
      for (const [attr, value] of Object.entries(scripts)) {
        const val = Number(value);
        if (attr === atkType) {
          atk += val;
        }
      }
    }

    return atk;
  }

  private getMasteryAtkFromSkills(atkType: 'atk' | 'matk' = 'atk') {
    let atk = 0;
    for (const [skillName, scripts] of Object.entries(this.masteryAtkSkillBonus)) {
      for (const [attr, value] of Object.entries(scripts)) {
        const val = Number(value);
        if (attr === atkType) {
          atk += val;
        }
      }
    }

    return atk;
  }

  private getBuffAtk(atkType: 'atk' | 'matk' = 'atk') {
    let atk = 0;
    for (const [skillName, scripts] of Object.entries(this.buffBonus)) {
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
    const equipaAtk = this.totalEquipStatus.atk;
    const skillAtk = this.getEquipAtkFromSkills();

    this.totalEquipAtk = skillAtk + (this.isUsedEDP() ? equipaAtk * 4 : equipaAtk);

    return this;
  }

  private calcAtkGroupA(totalWeaponAtk?: number) {
    const atkPercent = this.toPercent(this.totalEquipStatus.atkPercent);
    const formular = (totalAtk: number) => {
      const a = this.floor((totalAtk + this.totalEquipAtk) * atkPercent);

      return this.floor(a * this.propertyMultiplier);
    };

    if (totalWeaponAtk) return formular(totalWeaponAtk);

    const totalAMin = formular(this.totalWeaponAtkMin);
    const totalAMax = formular(this.totalWeaponAtkMax);
    const totalAMaxOver = formular(this.totalWeaponAtkMaxOver);

    this.totalAMin = totalAMin;
    this.totalAMax = totalAMax;
    this.totalAMaxOver = totalAMaxOver;

    return this;
  }

  private calcRaceMultiplier(atkType: 'p' | 'm' = 'p') {
    const prefix = `${atkType}_race`;
    const base = this.totalEquipStatus[`${prefix}_all`] || 0;

    return 100 + base + (this.totalEquipStatus[`${prefix}_${this.monsterData.race}`] ?? 0);
  }

  private calcSizeMultiplier(atkType: 'p' | 'm' = 'p') {
    const prefix = `${atkType}_size`;
    const base = this.totalEquipStatus[`${prefix}_all`] || 0;

    return 100 + base + (this.totalEquipStatus[`${prefix}_${this.monsterData.size}`] ?? 0);
  }

  private calcElementMultiplier(atkType: 'p' | 'm' = 'p') {
    const prefix = `${atkType}_element`;
    const base = this.totalEquipStatus[`${prefix}_all`] || 0;

    return 100 + base + (this.totalEquipStatus[`${prefix}_${this.monsterData.element}`] ?? 0);
  }

  private calcMonterTypeMultiplier(atkType: 'p' | 'm' = 'p') {
    const base = this.totalEquipStatus[`${atkType}_class_all`] || 0;

    return 100 + base + (this.totalEquipStatus[`${atkType}_class_${this.monsterData.type}`] ?? 0);
  }

  private calcAtkGroupB(totalWeaponAtk?: number) {
    const race = this.toPercent(this.calcRaceMultiplier());
    const size = this.toPercent(this.calcSizeMultiplier());
    const element = this.toPercent(this.calcElementMultiplier());
    const monsterType = this.toPercent(this.calcMonterTypeMultiplier());
    const formular = (atk: number) => {
      return this.floor(
        this.floor(this.floor(this.floor(this.floor(atk * race) * size) * element) * monsterType) *
          this.propertyMultiplier,
      );
    };
    // console.log({ name: this.monster.name, race, size, element, _class: monsterType });

    if (totalWeaponAtk) return formular(totalWeaponAtk + this.totalEquipAtk);

    const totalBMin = formular(this.totalWeaponAtkMin + this.totalEquipAtk);
    const totalBMax = formular(this.totalWeaponAtkMax + this.totalEquipAtk);
    const totalBMaxOver = formular(this.totalWeaponAtkMaxOver + this.totalEquipAtk);

    this.totalBMin = totalBMin;
    this.totalBMax = totalBMax;
    this.totalBMaxOver = totalBMaxOver;

    return this;
  }

  private calcStatusAtk() {
    const { totalStr, totalDex, totalLuk, totalInt } = this.status;
    const baseLvl = this.model.level;
    const [mainStatus, secondStatus] = this.isRangeAtk() ? [totalDex, totalStr] : [totalStr, totalDex];

    this.totalStatusAtk = this.floor(baseLvl / 4 + secondStatus / 5 + mainStatus + totalLuk / 3);

    const priStat = this.floor(totalInt / 2) + this.floor(totalDex / 5) + this.floor(totalLuk / 3);
    this.totalStatusMatk = this.floor(this.floor(baseLvl / 4) + totalInt + priStat);
  }

  private calcMasteryAtk() {
    const { race, element, size } = this.monsterData;
    const skillAtk = Object.values(this.masteryAtkSkillBonus)
      .map((a) => Number(a.atk || a[`atk_race_${race}`] || a[`atk_element_${element}`] || a[`atk_size_${size}`]))
      .filter((a) => Number.isNaN(a) === false)
      .reduce((sum, m) => sum + m, 0);

    this.totalMasteryAtk = skillAtk;
  }

  private calcMasteryMatk() {
    const { race, element, size } = this.monsterData;
    const skillAtk = Object.values(this.masteryAtkSkillBonus)
      .map((a) => Number(a.matk || a[`matk_race_${race}`] || a[`matk_element_${element}`] || a[`matk_size_${size}`]))
      .filter((a) => Number.isNaN(a) === false)
      .reduce((sum, m) => sum + m, 0);

    this.totalMasteryMatk = skillAtk;
  }

  private calcBuffAtk() {
    // ex. camoflage
    this.totalBuffAtk = 0;
  }

  private calcTotalAtk(aAtk?: number, bAtk?: number) {
    // const calcPropMulti = (atk: number) => this.floor(atk * 1);
    // const extraAtk = calcPropMulti(this.totalStatusAtk * 2);
    // const totalMinAtk = calcPropMulti(this.totalAMin) + calcPropMulti(this.totalBMin) + extraAtk;
    // const totalMaxAtk = calcPropMulti(this.totalAMax) + calcPropMulti(this.totalBMax) + extraAtk;
    // const additionalAtk = this.totalMasteryAtk + this.totalBuffAtk;
    // if (aAtk && bAtk) return calcPropMulti(aAtk) + calcPropMulti(bAtk) + extraAtk + additionalAtk;

    const { element, race } = this.monsterData;
    const masteryPassiveSkill = this._class.getMasteryAtk({
      weaponData: this.weaponData,
      passiveSkillIds: this.passiveSkillIds,
      element,
      race,
      level: this.model.level,
    });
    const statusAtk = this.totalStatusAtk * 2 + this.totalMasteryAtk + masteryPassiveSkill + this.totalBuffAtk;
    const totalMinAtk = this.totalAMin + this.totalBMin + statusAtk;
    const totalMaxAtk = this.totalAMax + this.totalBMax + statusAtk;
    const totalMaxAtkOver = this.totalAMaxOver + this.totalBMaxOver + statusAtk;

    if (aAtk && bAtk) return aAtk + bAtk + statusAtk;

    this.totalMinAtk = totalMinAtk;
    this.totalMaxAtk = totalMaxAtk;
    this.totalMaxAtkOver = totalMaxAtkOver;

    return this;
  }

  private calcTotalPene() {
    const { size, race, element } = this.monsterData;
    const { p_pene_race_all, p_element_neutral, p_pene_size_all } = this.totalEquipStatus;
    const rawP_Pene = p_pene_race_all + p_element_neutral + p_pene_size_all;
    const pByMonster =
      (this.totalEquipStatus[`p_pene_size_${size}`] ?? 0) +
      (this.totalEquipStatus[`p_pene_element_${element}`] ?? 0) +
      (this.totalEquipStatus[`p_pene_race_${race}`] ?? 0);
    const totalP_Pene = rawP_Pene + pByMonster;

    this.totalPhysicalPene = totalP_Pene >= 100 ? 100 : totalP_Pene;

    const { m_pene_race_all, m_element_neutral, m_pene_size_all } = this.totalEquipStatus;
    const rawM_Pene = m_pene_race_all + m_element_neutral + m_pene_size_all;
    const mByMonster =
      (this.totalEquipStatus[`m_pene_size_${size}`] ?? 0) +
      (this.totalEquipStatus[`m_pene_element_${element}`] ?? 0) +
      (this.totalEquipStatus[`m_pene_race_${race}`] ?? 0);
    const totalM_Pene = rawM_Pene + mByMonster;
    this.totalMagicalPene = totalM_Pene >= 100 ? 100 : totalM_Pene;
  }

  private calcMonsterHardDef() {
    const def = this.monster.stats.defense;
    const mdef = this.monster.stats.magicDefense;
    const p_pene = this.totalPhysicalPene;

    this.dmgReductionByHardDef = (4000 + def * ((100 - p_pene) / 100)) / (4000 + def * ((100 - p_pene) / 100) * 10);

    const m_pene = this.totalMagicalPene;
    const mDefBypassed = this.floor(mdef - mdef * this.toPercent(m_pene));
    this.dmgReductionByMHardDef = (1000 + mDefBypassed) / (1000 + mDefBypassed * 10);
  }

  private applyFinalMultiplier(rawDamage: number) {
    return this.finalMultipliers.reduce((dmg, finalMultiplier) => {
      return this.floor(dmg * this.toPercent(finalMultiplier + 100));
    }, rawDamage);
  }

  private calcBasicDamage() {
    const { softDef } = this.monsterData;
    const hardDef = this.dmgReductionByHardDef;
    const { range, melee, dmg } = this.totalEquipStatus;
    const rangedMultiplier = this.isRangeAtk() ? range : melee;
    const dmgMultiplier = dmg;

    const formula = (totalAtk: number) => {
      const rangedApplied = this.floor(totalAtk * this.toPercent(rangedMultiplier + 100));
      const dmgMultiApplied = this.floor(rangedApplied * this.toPercent(dmgMultiplier + 100));
      const dmgHdef = this.floor(dmgMultiApplied * hardDef);
      const dmgSdef = dmgHdef - softDef;
      const finalApplied = this.applyFinalMultiplier(dmgSdef);

      return this.toPreventNegativeDmg(finalApplied);
    };

    const basicMinDamage = formula(this.totalMinAtk);
    const basicMaxDamage = formula(this.totalMaxAtkOver);

    return { basicMinDamage, basicMaxDamage };
  }

  private calcCriDamage() {
    const { softDef } = this.monsterData;
    const hardDef = this.dmgReductionByHardDef;
    const { range, melee, criDmg, dmg } = this.totalEquipStatus;
    const rangedMultiplier = this.isRangeAtk() ? range : melee;
    const dmgMultiplier = dmg;

    const formula = (totalAtk: number) => {
      const criApplied = this.floor(totalAtk * this.toPercent((criDmg || 0) + 100));
      const rangedApplied = this.floor(criApplied * this.toPercent(rangedMultiplier + 100));
      const dmgMultiApplied = rangedApplied * this.toPercent(dmgMultiplier + 100);
      const dmgHdef = hardDef ? this.floor(dmgMultiApplied * hardDef) : dmgMultiApplied;
      const dmgSdef = dmgHdef - softDef;
      const baseCriApplied = this.floor(dmgSdef * this.BASE_CRI_DMG);
      const finalApplied = this.applyFinalMultiplier(baseCriApplied);

      return this.toPreventNegativeDmg(finalApplied);
    };

    const criMinDamage = formula(this.totalMaxAtk);
    const criMaxDamage = formula(this.totalMaxAtkOver);

    return { criMinDamage, criMaxDamage };
  }

  private calcSkillDamage(skillData: AtkSkillModel) {
    const { name: skillName, canCri, isMelee } = skillData;
    const { softDef } = this.monsterData;
    const hardDef = this.dmgReductionByHardDef;

    const { range, melee, criDmg } = this.totalEquipStatus;
    const rangedMultiplier = isMelee ? melee : range;
    const baseSkillMultiplier = this.toPercent(this.baseSkillDamage);
    const equipSkillMultiplier = this.toPercent(100 + (this.totalEquipStatus[skillName] || 0));
    const criMultiplier = canCri ? this.toPercent((criDmg || 0) + 100) : 1;
    const dmgMultiplier = 0;

    const skillFormula = (totalAtk: number) => {
      if (canCri) {
        const criApplied = this.floor(totalAtk * criMultiplier) - softDef;
        const baseSkillApplied = this.floor(criApplied * baseSkillMultiplier);
        const equipSkillApplied = this.floor(baseSkillApplied * equipSkillMultiplier);
        const dmgMultiApplied = this.floor(equipSkillApplied * this.toPercent(dmgMultiplier + 100));
        const rangedApplied = this.floor(dmgMultiApplied * this.toPercent(rangedMultiplier + 100));
        const hDefApplied = this.floor(rangedApplied * hardDef);
        const baseCriApplied = canCri ? this.floor(hDefApplied * this.BASE_CRI_DMG) : hDefApplied;
        const finalApplied = this.applyFinalMultiplier(baseCriApplied);

        return this.toPreventNegativeDmg(finalApplied);
      }

      const criApplied = this.floor(totalAtk * criMultiplier);
      const rangedApplied = this.floor(criApplied * this.toPercent(rangedMultiplier + 100));
      const dmgMultiApplied = this.floor(rangedApplied * this.toPercent(dmgMultiplier + 100));
      const baseSkillApplied = this.floor(dmgMultiApplied * baseSkillMultiplier);
      const equipSkillApplied = this.floor(baseSkillApplied * equipSkillMultiplier);
      const hDefApplied = this.floor(equipSkillApplied * hardDef) - softDef;
      const baseCriApplied = canCri ? this.floor(hDefApplied * this.BASE_CRI_DMG) : hDefApplied;
      const finalApplied = this.applyFinalMultiplier(baseCriApplied);

      return this.toPreventNegativeDmg(finalApplied);
    };

    const skillHit = skillData.hit || 1;
    // this.possiblyDamages = canCri
    //   ? []
    //   : Array.from({ length: this.totalWeaponAtkMax - this.totalWeaponAtkMin - 1 }).map((_, i) => {
    //       const atk = this.totalWeaponAtkMin + i + 1;
    //       const aAtk = this.calcAtkGroupA(atk) as number;
    //       const bAtk = this.calcAtkGroupB(atk) as number;
    //       const totalAtk = this.calcTotalAtk(aAtk, bAtk) as number;
    //       const dmg = this._class.calcSkillDmgByTotalHit(skillFormula(totalAtk), skillData);

    //       if (skillHit > 1) {
    //         return `From:${atk} => ${dmg} (${dmg / skillHit} x ${skillHit})`;
    //       }

    //       return `From:${atk} => ${dmg}`;
    //     });

    const rawMaxDamage = skillFormula(this.totalMaxAtkOver);
    const maxDamage = this._class.calcSkillDmgByTotalHit(rawMaxDamage, skillData);

    const rawMinDamage = canCri ? skillFormula(this.totalMaxAtk) : skillFormula(this.totalMinAtk);
    const minDamage = this._class.calcSkillDmgByTotalHit(rawMinDamage, skillData);

    return { minDamage, maxDamage };
  }

  private calcMatkSkillDamage(skillData: AtkSkillModel) {
    const { name: skillName, element } = skillData;
    const { softMDef } = this.monsterData;
    const hardDef = this.dmgReductionByMHardDef;

    const skillElement = this.model.propertyAtk || element || ElementType.Neutral;
    this.calcPropertyMultiplier(skillElement);

    const elementBonus =
      (this.totalEquipStatus.m_my_element_all || 0) +
      (this.totalEquipStatus[`m_my_element_${skillElement.toLowerCase()}`] || 0);
    const elementMultiplier = this.toPercent(100 + elementBonus);
    const baseSkillMultiplier = this.toPercent(this.baseSkillDamage);
    const equipSkillMultiplier = this.toPercent(100 + (this.totalEquipStatus[skillName] || 0));
    const dmgMultiplier = 0;
    const finalDmgMultiplier = this.totalEquipStatus[`final_${element?.toLowerCase()}`] || 0;

    const skillFormula = (totalAtk: number) => {
      const dmgMultiApplied = this.floor(totalAtk * this.toPercent(dmgMultiplier + 100));
      const baseSkillApplied = this.floor(dmgMultiApplied * baseSkillMultiplier);
      const equipSkillApplied = this.floor(baseSkillApplied * equipSkillMultiplier);
      const elementSkillApplied = this.floor(equipSkillApplied * elementMultiplier);
      const sMdefApplied = elementSkillApplied - softMDef;
      const propertyApplied = this.floor(sMdefApplied * this.skillPropertyMultiplier);
      const hDefApplied = this.floor(propertyApplied * hardDef);
      const finalApplied = this.floor(hDefApplied * this.toPercent(finalDmgMultiplier + 100));

      return this.toPreventNegativeDmg(finalApplied);
    };

    // const skillHit = skillData.hit || 1;
    // this.possiblyDamages = Array.from({ length: this.weaponMaxMatk - this.weaponMinMatk - 1 }).map((_, i) => {
    //   const wMatk = this.weaponMinMatk + i + 1;
    //   const totalMatk = this.calcTotalMatk(wMatk);
    //   const dmg = this._class.calcSkillDmgByTotalHit(skillFormula(totalMatk), skillData);

    //   if (skillHit > 1) {
    //     return `From:${wMatk} => ${dmg} (${dmg / skillHit} x ${skillHit})`;
    //   }

    //   return `From:${wMatk} => ${dmg}`;
    // });

    const rawMaxDamage = skillFormula(this.totalMaxMatk);
    const maxDamage = this._class.calcSkillDmgByTotalHit(rawMaxDamage, skillData);

    const rawMinDamage = skillFormula(this.totalMinMatk);
    const minDamage = this._class.calcSkillDmgByTotalHit(rawMinDamage, skillData);

    return { minDamage, maxDamage };
  }

  private calcAllAtk() {
    this.calcPropertyMultiplier();
    this.calcSizePenalty();
    this.calcTotalPene();
    this.calcMonsterHardDef();

    this.calcExtraAtk();
    this.calcExtraMatk();
    this.calcMasteryAtk();
    this.calcMasteryMatk();
    this.calcBuffAtk();
    this.calcStatusAtk();
    this.calcWeaponStatusAtk();
    this.calcWeaponAtk();
    this.calcWeaponMatk();

    this.calcAtkGroupA();
    this.calcAtkGroupB();
    this.calcTotalAtk();
    this.calcTotalMatk();

    return this;
  }

  private calcExtraMatk() {
    const equipAtk = this.totalEquipStatus.matk;

    this.totalEquipMatk = equipAtk;

    return this;
  }

  private calcWeaponMatk() {
    const { baseWeaponMatk, baseWeaponLevel, refineBonus, overUpgradeBonus } = this.weaponData.data;
    const rawWeaponMATK = baseWeaponMatk + refineBonus;
    const variance = 0.1 * baseWeaponLevel * rawWeaponMATK;

    this.weaponMinMatk = rawWeaponMATK - variance;
    this.weaponMaxMatk = rawWeaponMATK + variance + overUpgradeBonus;
  }

  private calcTotalMatk(weaponMatk?: number) {
    const race = this.toPercent(this.calcRaceMultiplier('m'));
    const size = this.toPercent(this.calcSizeMultiplier('m'));
    const element = this.toPercent(this.calcElementMultiplier('m'));
    const monsterType = this.toPercent(this.calcMonterTypeMultiplier('m'));
    const mysticAmp = 1 + this.toPercent(this.totalEquipStatus['mysticAmp'] || 0);
    const { matkPercent } = this.totalEquipStatus;
    const comet = this.toPercent(100 + (this.totalEquipStatus['comet'] || 0));

    const formula = (atk: number) => {
      const mysticAmpApplied = this.floor(atk * mysticAmp + this.totalEquipMatk);
      const raceApplied = this.floor(mysticAmpApplied * race);
      const sizeApplied = this.floor(raceApplied * size);
      const elementApplied = this.floor(sizeApplied * element);
      const monsterTypeApplied = this.floor(elementApplied * monsterType);
      const matkPercentApplied = this.floor(monsterTypeApplied * this.toPercent(100 + matkPercent));
      const cometApplied = this.floor(matkPercentApplied * comet);

      return cometApplied;
    };

    if (weaponMatk) return formula(this.totalStatusMatk + weaponMatk);

    this.totalMinMatk = formula(this.totalStatusMatk + this.weaponMinMatk + 1);
    this.totalMaxMatk = formula(this.totalStatusMatk + this.weaponMaxMatk);

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
    const calc = (actual: number, cond: number) => this.floor(actual / cond) * bonusNum;
    // console.log({ lineScript, conditionNum, bonusNum });
    if (conditionNum && bonusNum) {
      return this.floor(itemRefine / conditionNum) * bonusNum;
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
    const [, status, statusCond] = condition.match(/(level|str|int|dex|agi|vit|luk):(-*\d+)/) ?? [];
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

    //WEAPON_LEVEL
    const [toRemoveA, wLevel] = restCondition.match(/WEAPON_LEVEL\[(\d+)]/) ?? [];
    if (wLevel) {
      const wLv = Number(wLevel);
      const isValid = this.weaponData.data.baseWeaponLevel === wLv;
      if (!isValid) return { isValid, restCondition };

      restCondition = restCondition.replace(toRemoveA, '');
      if (restCondition.startsWith('===')) return { isValid, restCondition: restCondition.replace('===', '') };
    }

    // WEAPON_TYPE[bow]5
    const [toRemoveB, wType] = restCondition.match(/WEAPON_TYPE\[(\D+)]/) ?? [];
    if (wType) {
      const isValid = this.weaponData.data.typeName === wType;
      if (!isValid) return { isValid, restCondition };

      restCondition = restCondition.replace(toRemoveB, '');
      if (restCondition.startsWith('===')) return { isValid, restCondition: restCondition.replace('===', '') };
    }

    // [weaponType=Pistol]20
    const [_, wSubTypeName] = script.match(/^\[weaponType=(.+?)\]/) ?? [];
    if (wSubTypeName) {
      const subTypeName = this.weaponData?.data?.subTypeName;
      if (wSubTypeName !== subTypeName) return { isValid: false, restCondition };
      restCondition = restCondition.replace(`[weaponType=${wSubTypeName}]`, '');

      return { isValid: true, restCondition };
    }

    // USED[Mechanic]20
    const [toRemove, usedByClass] = script.match(/USED\[(.+?)\]/) ?? [];
    if (usedByClass) {
      const isUsed = usedByClass
        .split('||')
        .some((className) => className === this._class.className || this._class.classNameSet.has(className));
      if (!isUsed) return { isValid: false, restCondition };

      restCondition = restCondition.replace(toRemove, '');
    }

    // LEVEL[130]2---1
    // LEVEL[1-129]2---1
    const [toRemove2, lvCond] = script.match(/LEVEL\[(.+?)\]/) ?? [];
    if (lvCond) {
      const [minLv, maxLv = 999] = lvCond.split('-').map(Number);
      const isPass = minLv <= this.model.level && this.model.level <= maxLv;
      if (!isPass) return { isValid: true, restCondition };

      restCondition = restCondition.replace(toRemove2, '');
    }

    // EQUIP[Bear's Power]===50
    const [setCondition, itemSet] = script.match(/^EQUIP\[(.+?)]/) ?? [];
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
        if (restCondition.includes('---')) {
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

    // REFINE[11]
    const [, unused, refineCond] = restCondition.match(/^(REFINE\[(\d+)?])[^-]/) ?? [];
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

  private updateBaseEquipStat(attr: string, lineScript: string | number) {
    const n = Number(lineScript);
    if (Number.isSafeInteger(n)) {
      this.baseEquipmentStat[attr] = n + (this.baseEquipmentStat[attr] || 0);
    }
  }

  private calcItemStatus(itemType: ItemTypeEnum, itemRefine: number, script: Record<string, string[]>) {
    const total: Record<string, number> = {};

    // console.log({ itemRefine, script });
    for (const [attr, attrScripts] of Object.entries(script)) {
      if (MainItemTypeSet.has(itemType)) {
        this.updateBaseEquipStat(attr, attrScripts[0]);
      }

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

    return this.floor(base * (Number(boostPercent) / 100));
  }

  prepareAllItemBonus() {
    const baseMatk = Number(this.equipItem.get(ItemTypeEnum.weapon)?.script?.['matk']?.[0]) || 0;

    this.totalEquipStatus = { ...this.allStatus, matk: 0 - baseMatk };
    this.equipStatus = {} as any;

    const updateTotalStatus = (attr, value) => {
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

        updateTotalStatus(attr, value);
      }
    }

    this.baseEquipmentStat = {};
    this.finalMultipliers = [];
    for (const [itemType, itemData] of this.equipItem) {
      this.equipStatus[itemType] = { ...this.allStatus };
      if (!itemData) {
        continue;
      }

      if (itemType !== ItemTypeEnum.weapon && itemData.attack) {
        this.equipStatus[itemType].atk = itemData.attack;
        updateTotalStatus('atk', itemData.attack);
      }

      if (itemData.defense) {
        this.equipStatus[itemType].baseDef = itemData.defense;
        this.totalEquipStatus.def = (this.totalEquipStatus.def || 0) + itemData.defense;
      }

      // console.log({ itemType, itemData });
      const refine = this.getRefineLevelByItemType(itemType);
      const calculatedItem = this.calcItemStatus(itemType, refine, itemData.script);
      for (const [attr, value] of Object.entries(calculatedItem)) {
        this.equipStatus[itemType][attr] = value;

        updateTotalStatus(attr, value);
      }
    }

    for (const [skillName, scripts] of Object.entries(this.equipAtkSkillBonus)) {
      for (const [attr, value] of Object.entries(scripts)) {
        let val = Number(value);
        if (attr === 'atk') val = 0;
        if (attr === 'final') {
          this.finalMultipliers.push(val);
          continue;
        }

        this.equipStatus[skillName] = { ...this.allStatus, [attr]: val };

        updateTotalStatus(attr, value);

        this.updateBaseEquipStat(attr, val);
      }
    }

    for (const [buffName, scripts] of Object.entries(this.buffBonus)) {
      for (const [attr, value] of Object.entries(scripts)) {
        const val = Number(value);
        // if (attr === 'atk' || attr === 'matk') val = 0;

        this.equipStatus[buffName] = { ...this.allStatus, [attr]: val };

        updateTotalStatus(attr, value);
      }
    }

    const consumableBonus: Record<string, number> = {};
    for (const cons of this.consumableBonuses) {
      for (const [attr, value] of Object.entries(cons)) {
        const valNum = Number(value);
        if (mainStatuses.includes(attr) && consumableBonus[attr]) {
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
      if (mainStatuses.includes(attr)) {
        newVal = Math.max(value - consumAllStat, 0);
      }

      updateTotalStatus(attr, newVal);
    }

    const allStatus = this.totalEquipStatus.allStatus ?? 0;
    for (const status of mainStatuses) {
      updateTotalStatus(status, allStatus);
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

    return this;
  }

  private calcSkillFrequency(skillValue: AtkSkillModel) {
    const { name, acd: skillAcd, cd: skillCd, fct: skillFct, vct: skillVct } = skillValue;

    const reduceSkillCd = this.totalEquipStatus[`cd__${name}`] || 0;
    const reduceSkillVct = this.totalEquipStatus[`vct__${name}`] || 0;
    const reduceSkillVctFix = this.totalEquipStatus[`fix_vct__${name}`] || 0;
    const reduceSkillFct = this.totalEquipStatus[`fct__${name}`] || 0;
    const reduceSkillAcd = this.totalEquipStatus[`acd__${name}`] || 0;

    const { acd, vct, vct_inc = 0, fct, fctPercent } = this.totalEquipStatus;
    const { totalDex, totalInt } = this.status;

    const vctByStat = Math.max(0, 1 - Math.sqrt(this.floor((totalDex * 2 + totalInt) / 530, 3)));
    const vctGlobal = Math.max(0, 1 - (vct - vct_inc) / 100);
    const vctSkill = Math.max(0, 1 - reduceSkillVct / 100);
    const reducedVct = this.floor((skillVct - reduceSkillVctFix) * vctByStat * vctGlobal * vctSkill, 2);

    this.skillFrequency = {
      cd: skillCd,
      reducedCd: this.floor(skillCd - reduceSkillCd, 2),
      vct: skillVct,
      sumDex2Int1: totalDex * 2 + totalInt,
      vctByStat,
      vctSkill,
      reducedVct,
      fct: skillFct,
      reducedFct: this.floor((skillFct - reduceSkillFct - fct) * (1 - fctPercent * 0.01), 2),
      acd: skillAcd,
      reducedAcd: this.floor((skillAcd - reduceSkillAcd) * (1 - acd * 0.01), 2),
    };
    if (this.skillFrequency.reducedCd < 0) this.skillFrequency.reducedCd = 0;
    if (this.skillFrequency.reducedVct < 0) this.skillFrequency.reducedVct = 0;
    if (this.skillFrequency.reducedFct < 0) this.skillFrequency.reducedFct = 0;
    if (this.skillFrequency.reducedAcd < 0) this.skillFrequency.reducedAcd = 0;

    const { reducedCd, reducedFct, reducedAcd } = this.skillFrequency;

    const blockPeriod = Math.max(reducedCd, reducedAcd);
    const castPeriod = this.floor(reducedVct + reducedFct, 3);
    this.skillFrequency.castPeriod = castPeriod;
    this.skillFrequency.hitPeriod = this.floor(blockPeriod + castPeriod, 3);
    this.skillFrequency.totalHitPerSec = this.floor(1 / this.skillFrequency.hitPeriod, 2);

    return this;
  }

  private calcDps(params: { min: number; max: number; cri: number; criDmg: number; hitPerSecs: number }) {
    const { min, max, cri, criDmg, hitPerSecs } = params;
    const avgBasicDamage = this.floor((min + max) / 2);
    const limitedCri = Math.min(cri, 100);
    const avgBasicDamage2 = this.floor(((100 - limitedCri) * avgBasicDamage + limitedCri * criDmg) / 100);

    return this.floor(hitPerSecs * avgBasicDamage2);
  }

  calculateAllDamages(skillValue: string) {
    this.calcAllAtk();

    this.baseSkillDamage = 0;
    this.skillFrequency = {};

    const { basicMinDamage, basicMaxDamage } = this.calcBasicDamage();
    const { criMinDamage, criMaxDamage } = this.calcCriDamage();

    const [, skillName, skillLevel] = skillValue?.match(/(.+)==(\d+)/) ?? [];
    const skillData = this._class.atkSkills.find((a) => a.value === skillValue);
    const isValidSkill = !!skillName && !!skillLevel && typeof skillData?.formular === 'function';
    const criShield = this.monsterData.criShield;

    this.criRateToMonster = Math.max(0, this.totalCri + this.getExtraCriRate() - criShield);
    this.basicDps = this.calcDps({
      min: basicMinDamage,
      max: basicMaxDamage,
      cri: this.criRateToMonster,
      criDmg: criMaxDamage,
      hitPerSecs: this.hitPerSecs,
    });

    this.damageSummary = {
      basicMinDamage: basicMinDamage,
      basicMaxDamage: basicMaxDamage,
      criMinDamage,
      criMaxDamage,
      basicCriRate: this.criRateToMonster,
      pene: this.totalPhysicalPene,
    };

    if (isValidSkill) {
      const { formular, cri, canCri, isMatk } = skillData;
      const baseSkillDamage = formular({
        baseLevel: this.model.level,
        skillLevel: Number(skillLevel),
        usedSkillSet: this.usedSkillNames,
        extra: { ...this.status },
      });
      this.baseSkillDamage = baseSkillDamage;
      this.isMagicalSkill = isMatk;

      // HawkEye
      let minDamageHE = 0;
      let maxDamageHE = 0;
      if (this.isEquipHawkeye()) {
        this.totalEquipStatus.dex = (this.totalEquipStatus.dex || 0) + 200;
        this.calcAllAtk();
        const calculated = isMatk ? this.calcMatkSkillDamage(skillData) : this.calcSkillDamage(skillData);
        this.totalEquipStatus.dex = (this.totalEquipStatus.dex || 0) - 200;
        this.calcAllAtk();
        minDamageHE = calculated.minDamage;
        maxDamageHE = calculated.maxDamage;
      }

      const { minDamage, maxDamage } = isMatk ? this.calcMatkSkillDamage(skillData) : this.calcSkillDamage(skillData);
      this.calcSkillFrequency(skillData);

      const { totalHitPerSec: skillHitPersecs } = this.skillFrequency;
      const hitPerSecs = Math.min(skillHitPersecs, this.hitPerSecs);
      this.criRateSkillToMonster = canCri ? Math.max(0, this.totalCri + (cri || 0) - criShield) : 0;

      this.skillDps = this.calcDps({
        min: minDamage,
        max: maxDamage,
        cri: this.criRateSkillToMonster,
        criDmg: maxDamage,
        hitPerSecs,
      });
      const hitKill = Math.ceil(this.monster.stats.health / minDamage);
      this.damageSummary = {
        ...this.damageSummary,
        basicDps: this.basicDps,
        pene: isMatk ? this.totalMagicalPene : this.totalPhysicalPene,
        minDamage: minDamage,
        maxDamage: maxDamage,
        minDamageHE,
        maxDamageHE,
        skillHit: skillData?.hit || 1,
        skillDps: this.skillDps,
        hitKill,
        criRate: this.criRateSkillToMonster,
        hitRate: this.hitRate,
      };
    }

    return this;
  }

  calcAspd() {
    this.totalAspd = this._class.calcAspd({
      potionAspd: this.aspdPotion,
      potionAspdPercent: 0,
      skillAspd: 0,
      skillAspdPercent: 0,
      totalAgi: this.model.agi + this.model.jobAgi + this.totalEquipStatus.agi,
      totalDex: this.model.dex + this.model.jobDex + this.totalEquipStatus.dex,
      weapon: this.weaponData,
      aspd: this.totalEquipStatus.aspd,
      aspdPercent: this.totalEquipStatus.aspdPercent,
    });
    this.hitPerSecs = this.floor(50 / (200 - this.totalAspd));

    return this;
  }

  calcHitRate() {
    const { totalLuk, totalDex, totalAgi } = this.status;
    const { hit, perfectHit, flee, perfectDodge } = this.totalEquipStatus;
    const baseLvl = this.model.level;
    const formula = () => {
      return 175 + baseLvl + totalDex + this.floor(totalLuk / 3) + hit;
    };

    this.totalHit = formula();
    this.totalPerfectHit = this.floor(totalLuk / 10) + perfectHit;

    const { hitRequireFor100 } = this.monsterData;

    const hitRate = this.floor(100 + this.totalHit - hitRequireFor100);
    if (hitRate < 5) {
      this.hitRate = 5;
    } else {
      this.hitRate = Math.min(hitRate, 100);
    }

    this.totalFlee = 100 + 0 + this.floor(baseLvl + totalAgi + totalLuk / 5 + flee) * 1;
    this.totalPerfectDodge = this.floor(1 + totalLuk * 0.1 + perfectDodge);

    return this;
  }

  calcCriRate() {
    const { cri } = this.totalEquipStatus;
    const { totalLuk } = this.status;
    this.totalCri = 1 + cri + this.floor(totalLuk / 3);

    return this;
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

  calcAllDefs() {
    const { level } = this.model;
    const { def = 0, defPercent = 0, softDef = 0, softDefPercent = 0 } = this.totalEquipStatus;
    const { totalVit, totalAgi } = this.status;

    const rawSoftDef = this.floor(totalVit / 2 + totalAgi / 5 + level / 2);
    this.softDef = this.floor((rawSoftDef + softDef) * this.toPercent(100 + softDefPercent));

    const bonus = [1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5];
    const calcDefByRefine = (refine: number) => {
      return bonus.filter((_, i) => i + 1 <= refine).reduce((sum, val) => sum + val, 0);
    };
    const { headUpperRefine, armorRefine, shieldRefine, garmentRefine, bootRefine } = this.model;
    const refines = [headUpperRefine, armorRefine, shieldRefine, garmentRefine, bootRefine].filter(
      (a) => Number(a) > 0,
    );
    const bonusDefByRefine = refines.reduce((sum, refine) => sum + calcDefByRefine(refine), 0);
    this.def = this.floor((def + bonusDefByRefine) * this.toPercent(100 + defPercent));

    const { totalDex, totalInt } = this.status;
    const { mdef = 0, mdefPercent = 0, softMdef = 0, softMdefPercent = 0 } = this.totalEquipStatus;
    const rawSoftMdef = this.floor(totalInt + totalVit / 5 + totalDex / 5 + level / 4);
    this.softMdef = this.floor((rawSoftMdef + softMdef) * this.toPercent(100 + softMdefPercent));
    this.mdef = this.floor(mdef * this.toPercent(100 + mdefPercent));

    return this;
  }

  getTotalummary() {
    return {
      ...this.getObjSummary(this.totalEquipStatus),
      monster: { ...this.monsterData },
      propertyAtk: this.propertyAtk,
      propertyMultiplier: this.propertyMultiplier,
      weapon: this.weaponData.data,
      calcSkill: {
        baseSkillDamage: this.baseSkillDamage,
        dps: this.skillDps,
        ...this.skillFrequency,
      },
      calc: {
        def: this.def,
        softDef: this.softDef,
        mdef: this.mdef,
        softMdef: this.softMdef,
        totalAspd: this.totalAspd,
        hitPerSecs: this.hitPerSecs,
        totalCri: this.totalCri,
        totalHit: this.totalHit,
        totalPerfectHit: this.totalPerfectHit,
        totalFlee: this.totalFlee,
        totalPerfectDodge: this.totalPerfectDodge,
        hitRate: this.hitRate,
        dps: this.basicDps,
        dmgReductionByHardDef: this.dmgReductionByHardDef,
        sizePenalty: this.sizePenalty,
        statusBonus: this.weaponStatusAtk,
        isMagicalSkill: this.isMagicalSkill,
        totalPhysicalPene: this.totalPhysicalPene,
        totalMagicalPene: this.totalMagicalPene,
        totalPene: this.isMagicalSkill ? this.totalMagicalPene : this.totalPhysicalPene,
        totalEquipAtk: this.totalEquipStatus.atk - (this.equipStatus.ammo?.atk || 0),
        ammuAtk: this.equipStatus.ammo?.atk || 0,
        totalMasteryAtk: this.totalMasteryAtk,
        totalBuffAtk: this.totalBuffAtk,
        totalStatusAtk: this.totalStatusAtk,
        totalWeaponAtkMin: this.totalWeaponAtkMin,
        totalWeaponAtkMax: this.totalWeaponAtkMax,
        totalWeaponAtkMaxOver: this.totalWeaponAtkMaxOver,
        totalAMin: this.totalAMin,
        totalAMax: this.totalAMax,
        totalBMin: this.totalBMin,
        totalBMax: this.totalBMax,
        totalMinAtk: this.totalMinAtk,
        totalMaxAtk: this.totalMaxAtk,
        totalStatusMatk: this.totalStatusMatk,
        totalMasteryMatk: this.totalMasteryMatk,
        weaponMinMatk: this.weaponMinMatk,
        weaponMaxMatk: this.weaponMaxMatk,
        totalMinMatk: this.totalMinMatk,
        totalMaxMatk: this.totalMaxMatk,
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

      obj[itemType] = this.getObjSummary(this.equipStatus[itemType]);
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
    return this.getObjSummary(this.model);
  }

  getPossiblyDamages() {
    return this.possiblyDamages;
  }
}
