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
  private weaponData = new Weapon();
  private monsterData = {
    name: '',
    race: '',
    size: '',
    element: '',
    elementLevel: '',
    type: '',
    softDef: 1,
    hardDef: 0.5,
  };
  private sizePenalty = 1;
  private propertyMultiplier = 1;

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

  get status() {
    const {
      str,
      jobStr,
      int,
      jobInt,
      luk,
      jobLuk,
      vit,
      jobVit,
      dex,
      jobDex,
      agi,
      jobAgi,
    } = this.model;

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

  get baseSkillDamage() {
    return 100;
  }

  constructor(private _model: any, private monster: MonsterModel) {
    this.model = this._model;
    this.setMonster(monster);
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

  setMonster(monster: MonsterModel) {
    const {
      name,
      stats: {
        defense,
        vit,
        level,
        elementName,
        raceName,
        class: monsterTypeId,
        scaleName,
      },
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
      hardDef: (4000 + defense) / (4000 + defense * 10),
      softDef: Math.floor((level + vit) / 2),
    };

    return this;
  }

  setModel(model: any) {
    this.model = model;

    return this;
  }

  setWeapon(itemId: number, refine: number) {
    const itemData = this.getItem(itemId);
    this.equipItem.set(ItemTypeEnum.weapon, itemData);
    if (itemData) {
      this.equipItemName.set(
        ItemTypeEnum.weapon,
        this.removeItemSlotName(itemData.name)
      );
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

  private isIncludingOverUpgrade() {
    return false;
  }

  private calcStatusBonus() {
    const { totalStr, totalDex } = this.status;
    const mainState = this.isRangeAtk() ? totalDex : totalStr;
    this.statusBonus = (this.weaponData.data.baseWeaponAtk * mainState) / 200; // base on weapon type
  }

  private calcWeaponAtk() {
    const { baseWeaponAtk, baseWeaponLevel, refineBonus, overUpgradeBonus } =
      this.weaponData.data;
    const variant = baseWeaponAtk * baseWeaponLevel * 0.05;

    const formular = (weaponAtk: number) => {
      const total = weaponAtk + this.statusBonus + refineBonus;
      const total2 = this.isIncludingOverUpgrade()
        ? total + overUpgradeBonus
        : total;
      return Math.floor(total2 * this.sizePenalty);
    };
    const totalMin = formular(baseWeaponAtk - variant);
    const totalMax = formular(baseWeaponAtk + variant);
    // console.log({ totalStr, totalDex });

    this.totalWeaponAtkMin = totalMin;
    this.totalWeaponAtkMax = totalMax;
  }

  private calcEquipAtk() {
    const extraAtk = this.totalEquipStatus.atk;

    this.totalEquipAtk = extraAtk;
  }

  private calcAtkGroupA() {
    const atkPercent = this.toPercent(this.totalEquipStatus.atkPercent);
    const formular = (totalAtk: number) => {
      return Math.floor(
        (totalAtk + this.totalEquipAtk) * atkPercent * this.propertyMultiplier
      );
    };
    const totalAMin = formular(this.totalWeaponAtkMin);
    const totalAMax = formular(this.totalWeaponAtkMax);
    // console.log({ equipAtk, atkPercent, atk: this.totalWeaponAtkMin });

    this.totalAMin = totalAMin;
    this.totalAMax = totalAMax;
  }

  private calcRaceMultiplier() {
    const base = this.totalEquipStatus.p_race_all;

    return (
      100 +
      base +
      (this.totalEquipStatus[`p_race_${this.monsterData.race}`] ?? 0)
    );
  }

  private calcSizeMultiplier() {
    const base = this.totalEquipStatus.p_size_all;

    return (
      100 +
      base +
      (this.totalEquipStatus[`p_size_${this.monsterData.size}`] ?? 0)
    );
  }

  private calcElementMultiplier() {
    const base = this.totalEquipStatus.p_element_all;

    return (
      100 +
      base +
      (this.totalEquipStatus[`p_element_${this.monsterData.element}`] ?? 0)
    );
  }

  private calcMonterTypeMultiplier() {
    const base = this.totalEquipStatus.p_class_all;

    return (
      100 +
      base +
      (this.totalEquipStatus[`p_class_${this.monsterData.type}`] ?? 0)
    );
  }

  private calcAtkGroupB() {
    const race = this.toPercent(this.calcRaceMultiplier());
    const size = this.toPercent(this.calcSizeMultiplier());
    const element = this.toPercent(this.calcElementMultiplier());
    const monsterType = this.toPercent(this.calcMonterTypeMultiplier());
    const formular = (atk: number) => {
      return Math.floor(
        Math.floor(
          Math.floor(Math.floor(Math.floor(atk * race) * size) * element) *
            monsterType
        ) * this.propertyMultiplier
      );
    };
    const totalBMin = formular(this.totalWeaponAtkMin + this.totalEquipAtk);
    const totalBMax = formular(this.totalWeaponAtkMax + this.totalEquipAtk);

    this.totalBMin = totalBMin;
    this.totalBMax = totalBMax;
  }

  private calcStatusAtk() {
    const { totalStr, totalDex, totalLuk } = this.status;
    const baseLvl = this.model.level;
    const mainStatus = this.isRangeAtk() ? totalDex : totalStr;
    const secondStatus = this.isRangeAtk() ? totalStr : totalDex;

    this.totalStatusAtk = Math.floor(
      baseLvl / 4 + secondStatus / 5 + mainStatus + totalLuk / 3
    );
  }

  private calcMasteryAtk() {
    const skillAtk = Object.values(this.masteryAtkSkillBonus).reduce(
      (sum, m) => sum + m.atk ?? 0,
      0
    );

    this.totalMasteryAtk = skillAtk;
  }

  private calcBuffAtk() {
    // ex. camoflage
    this.totalBuffAtk = 0;
  }

  private calcTotalAtk() {
    const statusAtk =
      this.totalStatusAtk * 2 + this.totalMasteryAtk + this.totalBuffAtk;
    const statusAtkPenaltied = statusAtk * this.propertyMultiplier;
    const totalMinAtk = this.totalAMin + this.totalBMin + statusAtkPenaltied;
    const totalMaxAtk = this.totalAMax + this.totalBMax + statusAtkPenaltied;

    this.totalMinAtk = totalMinAtk;
    this.totalMaxAtk = totalMaxAtk;
  }

  private calcTotalPene() {
    const { size, race, element } = this.monsterData;
    const { p_pene_race_all, p_element_neutral, p_pene_size_all } =
      this.totalEquipStatus;
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
    console.log({
      def,
      pene,
      up: 4000 + def * ((100 - pene) / 100),
      down: 4000 + def * ((100 - pene) / 100) * 10,
    });

    this.dmgReductionByHardDef =
      (4000 + def * ((100 - pene) / 100)) /
      (4000 + def * ((100 - pene) / 100) * 10);
  }

  calcBasicRangeDamage() {
    const range = this.totalEquipStatus.range;
    const basicRangeMinDamage = Math.floor(this.totalMinAtk * range);
    const basicRangeMaxDamage = Math.floor(this.totalMaxAtk * range);

    return { basicRangeMinDamage, basicRangeMaxDamage };
  }

  calcRangeSkillDamage(skillName: string, baseSkillDamage?: number) {
    this.calcEquipAtk();
    this.calcMasteryAtk();
    this.calcBuffAtk();
    this.calcStatusAtk();
    this.calcStatusBonus();
    this.calcWeaponAtk();
    this.calcAtkGroupA();
    this.calcAtkGroupB();
    this.calcTotalAtk();

    this.calcTotalPene();
    this.calcMonsterHardDef();

    const { softDef } = this.monsterData;
    const damageMultiplier = this.isRangeAtk()
      ? this.totalEquipStatus.range
      : this.totalEquipStatus.melee;
    const skillBaseMultiplier = this.toPercent(
      baseSkillDamage || this.baseSkillDamage
    );
    const skillItemMultiplier = this.toPercent(
      100 + (this.totalEquipStatus[skillName] || 0)
    );
    const hardDef = this.dmgReductionByHardDef;

    const formular = (totalAtk: number) => {
      const rawDamage = Math.floor(
        totalAtk * this.toPercent(damageMultiplier + 100)
      );
      const baseSkillDamage =
        Math.floor(rawDamage * skillBaseMultiplier) - softDef;
      const extraSkillDamage = Math.floor(
        baseSkillDamage * skillItemMultiplier
      );
      const damageToMonster = Math.floor(extraSkillDamage * hardDef);

      return damageToMonster;
    };

    const minDamage = formular(this.totalMinAtk);
    const maxDamage = formular(this.totalMaxAtk);

    return { minDamage, maxDamage };
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

  private calcStepBonus(itemRefine: number, miniScript: string) {
    const [condition, bonus] = miniScript.split('---');
    const conditionNum = Number(condition);
    const bonusNum = Number(bonus);
    const calc = (actual: number, cond: number) =>
      Math.floor(actual / cond) * bonusNum;
    if (conditionNum && bonusNum) {
      return Math.floor(itemRefine / conditionNum) * bonusNum;
    }

    // [weapon]1---2 (ex. temporal headgear)
    if (condition.startsWith('[weapon]')) {
      const conditionLv = Number(condition.replace('[weapon]', ''));
      const refineLv = this.mapRefine.get(ItemTypeEnum.weapon);

      return calc(refineLv, Number(conditionLv));
    }

    // LEARN_SKILL[Snake Eyes]:1---2
    const [, skillName, skillLv] =
      condition.match(/^LEARN_SKILL\[(.+?)]:(\d+)/) ?? [];
    if (skillName) {
      const learned = this.learnedSkillMap.get(skillName) || 0;
      return calc(learned, Number(skillLv));
    }

    // dex:10---1
    const [, status, statusCond] =
      condition.match(/(str|int|dex|agi|vit|luk):(\d+)/) ?? [];
    if (status) {
      const myStatus = this.model[status];
      return calc(myStatus, Number(statusCond));
    }

    return 0;
  }

  private validateCondition(script: string): {
    isValid: boolean;
    restCondition: string;
  } {
    let restCondition = script;
    const mainStatusRegex = /(str|int|dex|agi|vit|luk):(\d+)&&(\d+===.+)/;
    const [, status, statusCondition, raw] =
      script.match(mainStatusRegex) ?? [];
    if (status) {
      const isPass = this.model[status] >= Number(statusCondition);

      return { isValid: isPass, restCondition: raw };
    }

    const [_, weaponType] = script.match(/^\[weaponType=(.+?)\]/) ?? [];
    if (weaponType) {
      const weapon = this.equipItem.get(ItemTypeEnum.weapon);
      if (weaponType !== weapon?.unidName)
        return { isValid: false, restCondition };
      restCondition = restCondition.replace(`[weaponType=${weaponType}]`, '');

      return { isValid: true, restCondition };
    }

    // EQUIP[Bear's Power]===50
    const [setCondition, itemSet] = script.match(/^EQUIP\[(.+?)]/) ?? [];
    if (itemSet) {
      const itemSets = itemSet.split('&&').filter(Boolean);
      // console.log({ itemSet, itemSets });
      const valid = itemSets.every((item) => {
        const res = this.isEquipItem(item);
        // console.log({ item, res });
        return res;
      });
      if (!valid) return { isValid: false, restCondition };

      restCondition = restCondition.replace(setCondition, '');
      if (restCondition.startsWith('===')) {
        restCondition = restCondition.replace('===', '');
      }

      return { isValid: true, restCondition };
    }

    return {
      isValid: true,
      restCondition: restCondition.replace(setCondition, ''),
    };
  }

  private calcItemStatus(itemRefine: number, script: Record<string, string[]>) {
    const total: Record<string, number> = {};

    // console.log({ itemRefine, script });
    for (const [attr, attrScripts] of Object.entries(script)) {
      total[attr] = attrScripts.reduce((sum, miniScript) => {
        const { isValid, restCondition } = this.validateCondition(miniScript);
        // console.log({ miniScript, restCondition, isValid });
        if (!isValid) return sum;

        if (restCondition.includes('===')) {
          return sum + this.calcConstantBonus(itemRefine, restCondition);
        }
        if (restCondition.includes('---')) {
          return sum + this.calcStepBonus(itemRefine, restCondition);
        }

        if (Number.isNaN(Number(restCondition))) {
          console.log('cannot turn to number', { restCondition });

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

  private calcAllEquipItems() {
    this.totalEquipStatus = { ...this.allStatus };

    for (const [skillName, scripts] of Object.entries(
      this.equipAtkSkillBonus
    )) {
      for (const [attr, value] of Object.entries(scripts)) {
        this.equipStatus[skillName] = { ...this.allStatus, [attr]: value };

        if (this.totalEquipStatus[attr]) {
          this.totalEquipStatus[attr] += value;
        } else {
          this.totalEquipStatus[attr] = value;
        }
      }
    }

    for (const [itemType, itemData] of this.equipItem) {
      this.equipStatus[itemType] = { ...this.allStatus };
      if (!itemData) {
        continue;
      }

      if (itemType !== ItemTypeEnum.weapon) {
        if (itemData.attack) {
          this.equipStatus[itemType].atk = itemData.attack;
          if (this.totalEquipStatus['atk']) {
            this.totalEquipStatus['atk'] += itemData.attack;
          } else {
            this.totalEquipStatus['atk'] = itemData.attack;
          }
        } else if (itemData.matk) {
          this.equipStatus[itemType].matk = itemData.matk;
          if (this.totalEquipStatus['matk']) {
            this.totalEquipStatus['matk'] += itemData.matk;
          } else {
            this.totalEquipStatus['matk'] = itemData.matk;
          }
        }
      }

      // if (itemData.defense) {
      //   this.equipStatus[itemType].def = itemData.attack;
      // }

      // console.log({ itemType, itemData });
      const refine = this.getRefineLevelByItemType(itemType);
      const calculatedItem = this.calcItemStatus(refine, itemData.script);
      for (const [attr, value] of Object.entries(calculatedItem)) {
        this.equipStatus[itemType][attr] = value;

        if (this.totalEquipStatus[attr]) {
          this.totalEquipStatus[attr] += value;
        } else {
          this.totalEquipStatus[attr] = value;
        }
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
  }

  calculateSkillDamage(
    skillName: string,
    skillLevel: number,
    formular: (x: { baseLevel: number; skillLevel: number }) => number
  ) {
    this.calcAllEquipItems();
    const baseSkillDamage = formular({
      baseLevel: this.model.level,
      skillLevel,
    });
    // console.log({ baseSkillDamage });
    const { minDamage, maxDamage } = this.calcRangeSkillDamage(
      skillName,
      baseSkillDamage
    );

    return { minDamage, maxDamage };
  }

  calculateDamage() {
    this.calcAllEquipItems();
    const { minDamage, maxDamage } = this.calcRangeSkillDamage('Round Trip');

    return { minDamage, maxDamage };
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
      weapon: this.weaponData.data,
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
      consumableBonuses: this.consumableBonuses,
    };
  }

  getModelSummary() {
    return this.getObjSummary(this.model);
  }
}
