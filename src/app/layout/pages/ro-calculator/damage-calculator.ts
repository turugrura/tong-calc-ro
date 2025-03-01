import { ElementMapper, ElementType, ItemTypeEnum, SizePenaltyMapper } from 'src/app/constants';
import { SKILL_NAME } from 'src/app/constants/skill-name';
import { Monster, Weapon } from 'src/app/domain';
import { AtkSkillFormulaInput, AtkSkillModel, CharacterBase } from '../../../jobs/_character-base.abstract';
import { BasicDamageSummaryModel, DamageSummaryModel, MiscModel, SkillDamageSummaryModel, SkillType } from '../../../models/damage-summary.model';
import { EquipmentSummaryModel } from '../../../models/equipment-summary.model';
import { InfoForClass } from '../../../models/info-for-class.model';
import { MainModel } from '../../../models/main.model';
import { StatusSummary } from '../../../models/status-summary.model';
import { calcDmgDps, calcSkillAspd, floor, isSkillCanEDP, round } from '../../../utils';

interface DamageResultModel {
  minDamage: number;
  maxDamage: number;
  rawMinNoCri: number;
  rawMaxNoCri: number;
  avgNoCriDamage: number;
  avgCriDamage: number;
  propertyAtk: ElementType;
  propertyMultiplier: number;
  sizePenalty: number;
  canCri: boolean;
  criDmgToMonster: number;
}

export class DamageCalculator {
  private readonly EDP_WEAPON_MULTIPLIER = 0.25;
  private readonly MAGNUM_BREAK_WEAPON_MULTIPLIER = 0.2;
  private readonly EDP_EQUIP_MULTIPLIER = 4;
  private readonly _BASE_CRI_MULTIPLIER = 1.4;

  private skillName: SKILL_NAME = '' as any;
  private equipStatus: Record<ItemTypeEnum, EquipmentSummaryModel>;
  totalBonus: EquipmentSummaryModel;
  private _totalEquipStatus: EquipmentSummaryModel;
  private model: Partial<MainModel>;

  private equipAtkSkillBonus: Record<string, any> = {};
  private buffMasteryAtkBonus: Record<string, any> = {};
  private masteryAtkSkillBonus: Record<string, any> = {};

  private finalMultipliers = [] as number[];
  private finalPhyMultipliers = [] as number[];
  private finalMagicMultipliers = [] as number[];

  private _class: CharacterBase;
  private monster: Monster;

  private weaponData: Weapon;
  private leftWeaponData: Weapon;
  private aspdPotion: number;
  private ammoPropertyAtk: ElementType;

  private zeroSkillDmg: SkillDamageSummaryModel = {
    skillDamageLabel: '',
    skillNoStackDamageLabel: '',
    baseSkillDamage: 0,
    dmgType: SkillType.RANGE,
    isAutoSpell: false,
    skillSizePenalty: 0,
    skillCanCri: false,
    skillPropertyAtk: ElementType.Neutral,
    skillPropertyMultiplier: 0,
    skillTotalPene: 0,
    skillTotalPeneLabel: '',
    skillTotalPeneRes: 0,
    skillTotalPeneResLabel: '',
    skillMinDamage: 1,
    skillMaxDamage: 1,
    skillMaxDamageNoCri: 1,
    skillMinDamageNoCri: 1,
    skillTotalHit: 0,
    skillHit: 0,
    skillAccuracy: 0,
    skillDps: 0,
    skillHitKill: 0,
    skillCriRateToMonster: 0,
    skillCriDmgToMonster: 0,
    skillPart2Label: '',
    skillMinDamage2: 0,
    skillMaxDamage2: 0,
    skillBonusFromEquipment: 0,
    isUsedCurrentHP: false,
    isUsedCurrentSP: false,
    currentHp: 0,
    currentSp: 0,

    maxStack: 0,
    noStackMinDamage: 0,
    noStackMaxDamage: 0,
    noStackMinCriDamage: 0,
    noStackMaxCriDamage: 0,
  };

  setArgs(params: {
    equipStatus: Record<ItemTypeEnum, EquipmentSummaryModel>;
    totalEquipStatus: EquipmentSummaryModel;
    model: Partial<MainModel>;
    equipAtkSkillBonus: Record<string, any>;
    buffMasteryAtkBonus: Record<string, any>;
    masteryAtkSkillBonus: Record<string, any>;
    finalMultipliers: number[];
    finalPhyMultipliers: number[];
    finalMagicMultipliers: number[];
    _class: CharacterBase;
    monster: Monster;
    weaponData: Weapon;
    leftWeaponData: Weapon;
    aspdPotion: number;
  }) {
    const {
      equipStatus,
      totalEquipStatus,
      model,
      equipAtkSkillBonus,
      buffMasteryAtkBonus,
      masteryAtkSkillBonus,
      finalMultipliers,
      finalPhyMultipliers,
      finalMagicMultipliers,
      _class,
      monster,
      weaponData,
      leftWeaponData,
      aspdPotion,
    } = params;
    this.equipStatus = equipStatus;
    this._totalEquipStatus = totalEquipStatus;
    this.totalBonus = { ...totalEquipStatus };
    this.model = model;
    this.equipAtkSkillBonus = equipAtkSkillBonus;
    this.buffMasteryAtkBonus = buffMasteryAtkBonus;
    this.masteryAtkSkillBonus = masteryAtkSkillBonus;
    this.finalMultipliers = finalMultipliers;
    this.finalPhyMultipliers = finalPhyMultipliers;
    this.finalMagicMultipliers = finalMagicMultipliers;
    this._class = _class;
    this.monster = monster;
    this.weaponData = weaponData;
    this.leftWeaponData = leftWeaponData;
    this.aspdPotion = aspdPotion;

    return this;
  }

  setExtraBonus(extraBonus: Record<keyof EquipmentSummaryModel, number>[]) {
    const totalBonus = { ...this._totalEquipStatus };
    for (const bonus of extraBonus) {
      for (const [attr, val] of Object.entries(bonus)) {
        if (totalBonus[attr]) {
          totalBonus[attr] += val;
        } else {
          totalBonus[attr] = val;
        }
      }
    }

    this.totalBonus = totalBonus;

    return this;
  }

  setAmmoPropertyAtk(p: ElementType) {
    this.ammoPropertyAtk = p;

    return this;
  }

  get status(): StatusSummary {
    const { str, jobStr, int, jobInt, luk, jobLuk, vit, jobVit, dex, jobDex, agi, jobAgi } = this.model;
    const { pow, sta, wis, spl, con, crt, jobPow, jobSta, jobWis, jobSpl, jobCon, jobCrt } = this.model;

    return {
      baseStr: str,
      equipStr: this.totalBonus.str ?? 0,
      totalStr: str + (jobStr ?? 0) + (this.totalBonus.str ?? 0),

      baseInt: int,
      equipInt: this.totalBonus.int ?? 0,
      totalInt: int + (jobInt ?? 0) + (this.totalBonus.int ?? 0),

      baseLuk: luk,
      equipLuk: this.totalBonus.luk ?? 0,
      totalLuk: luk + (jobLuk ?? 0) + (this.totalBonus.luk ?? 0),

      baseVit: vit,
      equipVit: this.totalBonus.vit ?? 0,
      totalVit: vit + (jobVit ?? 0) + (this.totalBonus.vit ?? 0),

      baseDex: dex,
      equipDex: this.totalBonus.dex ?? 0,
      totalDex: dex + (jobDex ?? 0) + (this.totalBonus.dex ?? 0),

      baseAgi: agi,
      equipAgi: this.totalBonus.agi ?? 0,
      totalAgi: agi + (jobAgi ?? 0) + (this.totalBonus.agi ?? 0),

      basePow: pow,
      equipPow: this.totalBonus.pow,
      totalPow: pow + (jobPow ?? 0) + (this.totalBonus.pow ?? 0),

      baseSta: sta,
      equipSta: this.totalBonus.sta,
      totalSta: sta + (jobSta ?? 0) + (this.totalBonus.sta ?? 0),

      baseWis: wis,
      equipWis: this.totalBonus.wis,
      totalWis: wis + (jobWis ?? 0) + (this.totalBonus.wis ?? 0),

      baseSpl: spl,
      equipSpl: this.totalBonus.spl,
      totalSpl: spl + (jobSpl ?? 0) + (this.totalBonus.spl ?? 0),

      baseCon: con,
      equipCon: this.totalBonus.con,
      totalCon: con + (jobCon ?? 0) + (this.totalBonus.con ?? 0),

      baseCrt: crt,
      equipCrt: this.totalBonus.crt,
      totalCrt: crt + (jobCrt ?? 0) + (this.totalBonus.crt ?? 0),
    };
  }

  get traitBonus(): { pAtk: number; sMatk: number; cRate: number; } {
    const { totalPow, totalSpl, totalCon, totalCrt } = this.status;
    const { pAtkOrSMatk } = this.weaponData?.data || { pAtkOrSMatk: 0 };

    return {
      pAtk: floor(totalPow / 3) + floor(totalCon / 5) + this.totalBonus.pAtk + pAtkOrSMatk,
      sMatk: floor(totalSpl / 3) + floor(totalCon / 5) + this.totalBonus.sMatk + pAtkOrSMatk,
      cRate: floor(totalCrt / 3) + this.totalBonus.cRate,
    };
  }

  get criMultiplier() {
    return this._BASE_CRI_MULTIPLIER + this.traitBonus.cRate * 0.01;
  }

  get infoForClass(): InfoForClass {
    return {
      model: this.model,
      monster: this.monster,
      totalBonus: this.totalBonus,
      weapon: this.weaponData,
      status: this.status,
      equipmentBonus: this.equipStatus,
      skillName: this.skillName,
      ammoElement: this.ammoPropertyAtk,
      cometMultiplier: this.getCometMultiplier(),
    };
  }

  private get isActiveInfilltration() {
    return this.totalBonus.p_infiltration >= 1;
  }

  private get isActiveMildwind() {
    return this.totalBonus.mildwind >= 1;
  }

  private get isForceSkillCri() {
    return this.totalBonus.forceCri >= 1;
  }

  private toPercent(n: number) {
    return round(n * 0.01, 4);
  }

  private toPreventNegativeDmg(n: number) {
    return n < 0 ? 1 : n;
  }

  private isRangeAtk() {
    return this.weaponData?.data?.rangeType === 'range';
  }

  private isActiveEDP(skillName: string) {
    const can = isSkillCanEDP(skillName);
    if (!can) return false;

    return this.totalBonus['edp'] > 0;
  }

  private getCometMultiplier() {
    return this.toPercent(100 + (this.totalBonus['comet'] || 0));
  }

  /**
   *
   * @returns Final damage multiplier
   */
  private _getDarkClawBonus(atkType: SkillType): number {
    if (atkType !== SkillType.MELEE) return 0;

    const bonus = this.totalBonus['darkClaw'] || 0;
    if (!bonus) return 0;

    if (this.monster.isBoss) {
      return 100 + bonus / 2;
    }

    return 100 + bonus;
  }

  private _getQuakeBonus(atkType: SkillType): number {
    if (atkType === SkillType.MAGICAL) return 0;

    const bonus = this.totalBonus['quake'] || 0;
    if (!bonus) return 0;

    return 100 + bonus;
  }

  private _getSporeExplosionBonus(atkType: SkillType): number {
    if (atkType !== SkillType.RANGE) return 0;

    const bonus = this.totalBonus['sporeExplosion'] || 0;
    if (!bonus) return 0;

    if (this.monster.isBoss) {
      return 100 + bonus / 2;
    }

    return 100 + bonus;
  }

  private _getOleumSanctumBonus(atkType: SkillType): number {
    if (atkType !== SkillType.RANGE) return 0;

    const bonus = this.totalBonus['oleumSanctum'] || 0;
    if (!bonus) return 0;

    return 100 + bonus;
  }

  private _getRaidMultiplier() {
    if (!this.totalBonus['raid']) return 0;

    return this.monster.isBoss ? 115 : 130;
  }

  private getDebuffMultiplier(atkType: SkillType) {
    let totalBonus = 0;

    totalBonus += this._getRaidMultiplier();
    totalBonus += this._getQuakeBonus(atkType);

    switch (atkType) {
      case SkillType.MELEE: {
        totalBonus += this._getDarkClawBonus(atkType);
        break;
      }
      case SkillType.RANGE:
        totalBonus += this._getSporeExplosionBonus(atkType);
        totalBonus += this._getOleumSanctumBonus(atkType);
        break;
    }

    return this.toPercent(totalBonus || 100);
  }

  private getAdvanceKatar() {
    if (this.weaponData.data.typeName !== 'katar') return 0;

    return this.totalBonus['advKatar'] || 0;
  }

  private getStrikingAtk() {
    const endowLearnedLv = this.totalBonus['strikingEndowSkillLv'];
    if (!endowLearnedLv) return 0;

    const weaponLvl = this.weaponData.data?.baseWeaponLevel || 0;

    return weaponLvl * 18 + endowLearnedLv * 5;
  }

  private getVIAmp(propertyAtk: ElementType) {
    if (propertyAtk !== ElementType.Poison) return 1;

    return this.toPercent((this.totalBonus['vi'] || 0) + 100);
  }

  private isIncludingOverUpgrade() {
    const weaType = this.weaponData?.data?.typeName;

    return weaType !== 'bow' && weaType !== 'gun';
  }

  private get isMaximizeWeapon() {
    return this.totalBonus['weapon_maximize'] > 0;
  }

  private get isMaximizeSpell() {
    return this.totalBonus['spell_maximize'] > 0;
  }

  private get myticalAmp() {
    const mysticAmp = 1 + this.toPercent(this.totalBonus['mysticAmp'] || 0);

    return mysticAmp;
  }

  private getBaseCriRate(isActual = false) {
    const { cri } = this.totalBonus;
    const { totalLuk } = this.status;

    const criFromLuk = isActual ? floor(totalLuk * 0.3) : floor(totalLuk / 3);
    const base = 1 + cri + criFromLuk;

    return this.weaponData.data?.typeName === 'katar' ? base * 2 : base;
  }

  private getBasicAspd() {
    const { totalAgi, totalDex } = this.status;

    const totalAspd = this._class.calcAspd({
      potionAspds: [this.aspdPotion, ...(this.model.aspdPotions || [])],
      potionAspdPercent: 0,
      skillAspd: this.totalBonus.skillAspd || 0,
      skillAspdPercent: this.totalBonus.skillAspdPercent || 0,
      totalAgi,
      totalDex,
      weapon: this.weaponData,
      weapon2: this.leftWeaponData,
      isEquipShield: this.model.shield > 0,
      aspd: this.totalBonus.aspd,
      aspdPercent: this.totalBonus.aspdPercent,
      decreaseSkillAspdPercent: this.totalBonus.decreaseSkillAspdPercent,
    });

    const hitsPerSec = floor(50 / (200 - totalAspd));

    return { totalAspd, hitsPerSec: Math.max(hitsPerSec, 1) };
  }

  private getMiscData(): MiscModel {
    const { totalLuk, totalDex, totalAgi, totalCon } = this.status;
    const { hit, perfectHit, flee, perfectDodge } = this.totalBonus;
    const baseLvl = this.model.level;
    const formula = () => {
      return 175 + baseLvl + totalDex + floor(totalLuk / 3) + hit + totalCon * 2;
    };

    const totalHit = formula();
    const totalPerfectHit = floor(totalLuk / 10) + perfectHit;

    const { hitRequireFor100 } = this.monster.data;

    let accuracy = Math.max(5, floor(100 + totalHit - hitRequireFor100));
    accuracy = Math.min(100, Math.max(accuracy, totalPerfectHit));

    const totalFlee = 100 + 0 + floor(baseLvl + totalAgi + totalLuk / 5 + flee) * 1 + totalCon * 2;
    const totalPerfectDodge = floor(1 + totalLuk * 0.1 + perfectDodge);

    return {
      totalHit,
      totalPerfectHit,
      accuracy,
      totalFlee,
      totalPerfectDodge,
    };
  }

  private getExtraCriRateToMonster() {
    const { race, element, size } = this.monster;
    const toRace = this.totalBonus[`cri_race_${race}`] || 0;
    const toElement = this.totalBonus[`cri_element_${element}`] || 0;
    const toSize = this.totalBonus[`cri_size_${size}`] || 0;

    return toRace + toElement + toSize;
  }

  private getSizePenalty() {
    if (this.totalBonus.ignore_size_penalty > 0) {
      return 1;
    }

    const size = this.monster.size;
    const fixedSize = this.totalBonus[`sizePenalty_${size}`];
    if (fixedSize > 0) {
      return this.toPercent(fixedSize);
    }

    const penalty = SizePenaltyMapper[this.weaponData?.data?.typeName]?.[size];

    return this.toPercent(penalty || 100);
  }

  private getPeneResMres() {
    const { race, type } = this.monster;
    const { pene_res = 0, pene_mres = 0 } = this.totalBonus;
    const resByMonster = (this.totalBonus[`pene_res_race_${race}`] || 0) + (this.totalBonus[`pene_res_class_${type}`] || 0);
    const mresByMonster = (this.totalBonus[`pene_mres_race_${race}`] || 0) + (this.totalBonus[`pene_mres_class_${type}`] || 0);
    const totalPeneRes = pene_res + resByMonster;
    const totalPeneMres = pene_mres + mresByMonster;

    return {
      totalPeneRes,
      totalPeneMres,
      effected_pene_res: Math.min(totalPeneRes, 50),
      effected_pene_mres: Math.min(totalPeneMres, 50),
    };
  }

  private getTotalPhysicalPene() {
    const { race, type } = this.monster;
    const { p_pene_race_all, p_pene_class_all } = this.totalBonus;
    const rawP_Pene = p_pene_race_all + (p_pene_class_all || 0);
    const pByMonster = (this.totalBonus[`p_pene_race_${race}`] || 0) + (this.totalBonus[`p_pene_class_${type}`] || 0);
    const totalP_Pene = rawP_Pene + pByMonster;

    return Math.min(100, totalP_Pene);
  }

  private getTotalMagicalPene() {
    const { race, type } = this.monster;
    const { m_pene_race_all, m_pene_class_all } = this.totalBonus;
    const rawM_Pene = m_pene_race_all + (m_pene_class_all || 0);
    const mByMonster = (this.totalBonus[`m_pene_race_${race}`] || 0) + (this.totalBonus[`m_pene_class_${type}`] || 0);
    const totalM_Pene = rawM_Pene + mByMonster;

    return Math.min(100, totalM_Pene);
  }

  private getPhisicalDefData() {
    const { def, softDef, res } = this.monster.data;
    const p_pene = this.getTotalPhysicalPene();

    const reducedHardDef = def * ((100 - p_pene) / 100);
    const dmgReductionByHardDef = (4000 + def * ((100 - p_pene) / 100)) / (4000 + def * ((100 - p_pene) / 100) * 10);

    const isActiveInfilltration = this.isActiveInfilltration;
    const finalDmgReduction = isActiveInfilltration ? 1 : dmgReductionByHardDef;
    const finalSoftDef = isActiveInfilltration ? 0 : softDef;

    const { monster_res } = this.totalBonus;
    const { effected_pene_res } = this.getPeneResMres();
    const restRes = Math.max(res + monster_res, 0) * ((100 - effected_pene_res) / 100);
    const resReduction = (2000 + restRes) / (2000 + restRes * 5);

    return { reducedHardDef, dmgReductionByHardDef, finalDmgReduction, finalSoftDef, resReduction };
  }

  private getMagicalDefData() {
    const { mdef, mres } = this.monster.data;
    const m_pene = this.getTotalMagicalPene();
    const mDefBypassed = round(mdef - mdef * this.toPercent(m_pene), 4);
    const dmgReductionByMHardDef = (1000 + mDefBypassed) / (1000 + mDefBypassed * 10);

    const { monster_mres } = this.totalBonus;
    const { effected_pene_mres } = this.getPeneResMres();
    const restMres = Math.max(mres + monster_mres, 0) * ((100 - effected_pene_mres) / 100);
    const mresReduction = (2000 + restMres) / (2000 + restMres * 5);

    return { dmgReductionByMHardDef, mresReduction };
  }

  private getSkillBonus(skillName: string) {
    return this.totalBonus[skillName] || 0;
  }

  private getAtkGroupA(params: { totalAtk: number; }) {
    const { totalAtk } = params;
    const atkPercent = this.toPercent(this.totalBonus.atkPercent);

    let total = totalAtk;
    total = floor(total * atkPercent); // tested

    return total;
  }

  private getAtkGroupB(params: { totalAtk: number; }) {
    const { totalAtk } = params;
    const race = this.toPercent(this.getRaceMultiplier('p'));
    const size = this.toPercent(this.getSizeMultiplier('p'));
    const element = this.toPercent(this.getElementMultiplier('p'));
    const monsterType = this.toPercent(this.getMonsterTypeMultiplier('p'));
    const comet = this.getCometMultiplier();
    // console.log({ race, size, element, monsterType, comet, monster: this.monster.name });

    let total = floor(totalAtk * race);
    total = floor(total * size);
    total = floor(total * element); // tested
    total = floor(total * monsterType); // tested
    total = floor(total * comet);
    total = this.applyFinalMultiplier(total, 'phy');

    return total;
  }

  private getStatusAtk() {
    const { totalStr, totalDex, totalLuk, totalPow } = this.status;
    const baseLvl = this.model.level;
    const [primaryStatus, secondStatus] = this.isRangeAtk() ? [totalDex, totalStr] : [totalStr, totalDex];

    const rawStatusAtk = floor(baseLvl / 4 + secondStatus / 5 + primaryStatus + totalLuk / 3) + totalPow * 5;

    return rawStatusAtk;
  }

  private getRaceMultiplier(atkType: 'p' | 'm') {
    const prefix = `${atkType}_race`;
    const base = this.totalBonus[`${prefix}_all`] || 0;

    const total = 100 + base + (this.totalBonus[`${prefix}_${this.monster.race}`] ?? 0);

    return round(total, 3);
  }

  private getSizeMultiplier(atkType: 'p' | 'm') {
    const prefix = `${atkType}_size`;
    const base = this.totalBonus[`${prefix}_all`] || 0;

    const total = 100 + base + (this.totalBonus[`${prefix}_${this.monster.size}`] ?? 0);

    return round(total, 3);
  }

  private getElementMultiplier(atkType: 'p' | 'm') {
    const prefix = `${atkType}_element`;
    const base = this.totalBonus[`${prefix}_all`] || 0;

    const total = 100 + base + (this.totalBonus[`${prefix}_${this.monster.element}`] ?? 0);

    return round(total, 3);
  }

  private getMonsterTypeMultiplier(atkType: 'p' | 'm') {
    const base = this.totalBonus[`${atkType}_class_all`] || 0;

    const total = 100 + base + (this.totalBonus[`${atkType}_class_${this.monster.type}`] ?? 0);

    return round(total, 3);
  }

  /**
   * Ex. Power Thrust
   * @returns number
   */
  private getFlatDmg(skillName?: string) {
    const base = this.totalBonus['flatDmg'] || 0;
    if (skillName === 'basicAtk') {
      const flatBasicAtk = this.totalBonus['flatBasicDmg'] || 0;
      return base + flatBasicAtk;
    }

    if (skillName) {
      const flatSkill = this.totalBonus[`flat_${skillName}`] || 0;
      return base + flatSkill;
    }

    return base;
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

  private getEquipAtk() {
    return this.totalBonus.atk;
  }

  private getExtraAtk() {
    const { reducedHardDef } = this.getPhisicalDefData();
    const equipAtk = this.getEquipAtk();
    const ammoAtk = this.equipStatus.ammo?.atk || 0;
    const pseudoBuffATK = this.isActiveInfilltration ? reducedHardDef / 2 : 0;
    const skillAtk = this.getEquipAtkFromSkills();
    const striking = this.getStrikingAtk();

    return { total: equipAtk + skillAtk + ammoAtk + pseudoBuffATK + striking, equipAtk, skillAtk, ammoAtk, pseudoBuffATK, striking };
  }

  private getBuffMasteryAtk(atkType: 'atk' | 'matk') {
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

  private getMasteryAtk() {
    const skillAtk = Object.values(this.masteryAtkSkillBonus)
      .map((a) => Number(a.atk))
      .filter((a) => Number.isNaN(a) === false)
      .reduce((sum, m) => sum + m, 0);
    const buffAtk = this.getBuffMasteryAtk('atk');
    const uiMastery = this._class.getUiMasteryAtk(this.infoForClass);
    const hiddenMastery = this._class.getMasteryAtk(this.infoForClass);

    return { total: skillAtk + buffAtk + uiMastery + hiddenMastery, skillAtk, buffAtk, uiMastery, hiddenMastery };
  }

  private getWeaponAtk(params: { isEDP: boolean; sizePenalty: number; }) {
    const { isEDP, sizePenalty } = params;
    const { baseWeaponAtk, baseWeaponLevel, refineBonus, overUpgradeBonus, highUpgradeBonus } = this.weaponData.data;
    const variant = baseWeaponAtk * baseWeaponLevel * 0.05;

    let pseudoElementAtk = undefined;
    if (isEDP) {
      const pseudoPoison = this.getPurePropertyMultiplier(ElementType.Poison) * this.EDP_WEAPON_MULTIPLIER;
      pseudoElementAtk = pseudoPoison;
    }

    const { magnumBreakPsedoBonus, magnumBreakClearEDP } = this.totalBonus;
    if (magnumBreakPsedoBonus) {
      const pseudoFire = this.getPurePropertyMultiplier(ElementType.Fire) * this.MAGNUM_BREAK_WEAPON_MULTIPLIER;
      pseudoElementAtk = pseudoFire;
    } else if (magnumBreakClearEDP) {
      pseudoElementAtk = 0;
    }

    const { totalStr, totalDex } = this.status;
    const mainState = this.isRangeAtk() ? totalDex : totalStr;
    const statBonus = (baseWeaponAtk * mainState) / 200;

    const formula = (_variant: number, overUpg: number) => {
      const upgradeBonus = refineBonus + (this.isIncludingOverUpgrade() ? overUpg : 0);

      let total = baseWeaponAtk + highUpgradeBonus + _variant + (this.totalBonus['weaponAtk'] || 0);
      total += statBonus;
      total += upgradeBonus;
      if (pseudoElementAtk != null) {
        total = total + total * pseudoElementAtk;
      }
      total = total * sizePenalty;

      return floor(round(total, 3));
    };

    const weaPercent = (this.totalBonus['weaponAtkPercent'] || 100) / 100;

    const totalMin = formula(-variant, 0) * weaPercent;
    const totalMax = formula(variant, 0) * weaPercent;
    const totalMaxOver = formula(variant, overUpgradeBonus) * weaPercent;

    return { totalMin, totalMax, totalMaxOver };
  }

  private getPropertyMultiplier(propertyAtk: ElementType) {
    // Neutral 1
    let pMultiplier = ElementMapper[this.monster.elementName][propertyAtk];
    pMultiplier = pMultiplier * this.getVIAmp(propertyAtk);

    return round(this.toPercent(pMultiplier), 2);
  }

  private getPurePropertyMultiplier(propertyAtk: ElementType) {
    const pMultiplier = ElementMapper[this.monster.elementName][propertyAtk];

    return this.toPercent(pMultiplier);
  }

  private calcTotalAtk(params: { propertyAtk: ElementType; isEDP: boolean; sizePenalty: number; isExcludeCannanball: boolean; }) {
    const { propertyAtk, isEDP, sizePenalty, isExcludeCannanball } = params;
    const propertyMultiplier = this.getPropertyMultiplier(propertyAtk);

    const extraAtk = this.getExtraAtk().total;
    const cannonBallAtk = isExcludeCannanball ? 0 : this.totalBonus.cannonballAtk || 0;
    const masteryAtk = this.getMasteryAtk().total + cannonBallAtk;

    const mildwindMultiplier = this.isActiveMildwind ? propertyMultiplier : this.getPropertyMultiplier(ElementType.Neutral);
    const statusAtk = this.getStatusAtk() * 2 * mildwindMultiplier;

    const { totalMin: _weaMin, totalMax: weaMax, totalMaxOver: weaMaxOver } = this.getWeaponAtk({ sizePenalty, isEDP });
    const weaMin = this.isMaximizeWeapon ? weaMax : _weaMin;

    const aMin = this.getAtkGroupA({ totalAtk: weaMin + extraAtk });
    const aMax = this.getAtkGroupA({ totalAtk: weaMax + extraAtk });
    const aMaxOver = this.getAtkGroupA({ totalAtk: weaMaxOver + extraAtk });

    // const equipAtk = this.getEquipAtk();
    // const equipAtkFromEDP = isEDP ? equipAtk * (this.EDP_EQUIP_MULTIPLIER - 1) : 0;
    let bMin = this.getAtkGroupB({ totalAtk: weaMin + extraAtk });
    let bMax = this.getAtkGroupB({ totalAtk: weaMax + extraAtk });
    let bMaxOver = this.getAtkGroupB({ totalAtk: weaMaxOver + extraAtk });
    if (isEDP) {
      bMin = bMin * this.EDP_EQUIP_MULTIPLIER;
      bMax = bMax * this.EDP_EQUIP_MULTIPLIER;
      bMaxOver = bMaxOver * this.EDP_EQUIP_MULTIPLIER;
    }

    const pAtkMultiplier = 1 + this.traitBonus.pAtk / 100;

    const totalMin = (statusAtk + floor((aMin + bMin) * propertyMultiplier)) * pAtkMultiplier + masteryAtk;
    const totalMax = (statusAtk + floor((aMax + bMax) * propertyMultiplier)) * pAtkMultiplier + masteryAtk;
    const totalMaxOver = (statusAtk + floor((aMaxOver + bMaxOver) * propertyMultiplier)) * pAtkMultiplier + masteryAtk;

    return { totalMin, totalMax, totalMaxOver, propertyMultiplier };
  }

  private applyFinalMultiplier(rawDamage: number, atkType: 'phy' | 'magic') {
    const allFinalApplied = this.finalMultipliers.reduce((dmg, finalMultiplier) => {
      return floor(dmg * this.toPercent(finalMultiplier + 100));
    }, rawDamage);

    const finals = atkType === 'phy' ? this.finalPhyMultipliers : this.finalMagicMultipliers;

    return finals.reduce((dmg, finalMultiplier) => {
      return floor(dmg * this.toPercent(finalMultiplier + 100));
    }, allFinalApplied);
  }

  private calcPhysicalSkillDamage(params: {
    skillData: AtkSkillModel;
    baseSkillDamage: number;
    weaponPropertyAtk: ElementType;
    sizePenalty: number;
    formulaParams?: AtkSkillFormulaInput;
  }): DamageResultModel {
    const { skillData, baseSkillDamage, weaponPropertyAtk, sizePenalty, formulaParams } = params;
    const {
      name: skillName,
      element,
      canCri: canCriFn,
      isMelee: _isMelee,
      isHDefToSDef = false,
      isIgnoreDef = false,
      isIgnoreSDef = false,
      isIgnoreRes = false,
      isExcludeCannanball = false,
      finalDmgFormula,
      forceCri = false,
    } = skillData;
    this.skillName = skillName;
    const { criDmgPercentage = 1 } = skillData;
    const _canCri = typeof canCriFn === 'function' ? canCriFn(formulaParams) : canCriFn;
    const canCri = this.isForceSkillCri || _canCri || forceCri;
    const { reducedHardDef, finalDmgReduction, finalSoftDef, resReduction } = this.getPhisicalDefData();
    const hardDef = isIgnoreDef || isHDefToSDef ? 1 : finalDmgReduction;
    const softDef = isIgnoreSDef ? 0 : finalSoftDef + (isHDefToSDef ? reducedHardDef : 0);

    const { range, melee, criDmg } = this.totalBonus;
    const isMelee = _isMelee != null && typeof _isMelee === 'function' ? _isMelee(this.weaponData.data.typeName) : !!_isMelee;
    const ranged = isMelee ? melee : range;
    const rangedMultiplier = this.toPercent(ranged + 100);
    const baseSkillMultiplier = this.toPercent(baseSkillDamage);
    const equipSkillMultiplier = this.toPercent(100 + this.getSkillBonus(skillName));
    const criDmgToMonster = floor(criDmg * criDmgPercentage || 0);
    const criMultiplier = canCri ? this.toPercent(criDmgToMonster + 100) : 1;

    const dmgType = isMelee ? SkillType.MELEE : SkillType.RANGE;
    const advKatar = 100 + this.getAdvanceKatar();
    const debuffMultiplier = this.getDebuffMultiplier(dmgType);
    const finalDmgMultipliers = [advKatar].map((b) => this.toPercent(b));
    const infoForClass = this.infoForClass;

    const skillFormula = (_totalAtk: number, _calcCri: boolean) => {
      let total = this._class.modifyFinalAtk(_totalAtk, infoForClass);
      if (_calcCri) total = floor(total * criMultiplier); // tested
      total = floor(total * rangedMultiplier); // tested
      total = floor(total * baseSkillMultiplier); // tested
      total = floor(total * equipSkillMultiplier);
      if (!isHDefToSDef || isIgnoreRes) total = floor(total * resReduction);
      total = floor(total * hardDef);
      total = total - softDef; // tested
      if (_calcCri) total = floor(total * this.criMultiplier);

      for (const final of finalDmgMultipliers) {
        total = floor(total * final);
      }

      total = floor(total * debuffMultiplier);

      total = this.toPreventNegativeDmg(total);

      if (!!finalDmgFormula && typeof finalDmgFormula === 'function') {
        return finalDmgFormula({ damage: total, ...formulaParams });
      }

      return total;
    };

    const propertyAtk = element || weaponPropertyAtk;
    const { totalMin, totalMax, totalMaxOver, propertyMultiplier } = this.calcTotalAtk({
      propertyAtk,
      sizePenalty,
      isEDP: this.isActiveEDP(skillName),
      isExcludeCannanball,
    });

    const extraDmg = this._class.getAdditionalDmg(infoForClass);
    const extraDmgCri = canCri ? floor(extraDmg * criMultiplier) : extraDmg;

    const rawMaxDamage = skillFormula(totalMaxOver, canCri) + extraDmgCri;
    const maxDamage = this._class.calcSkillDmgByTotalHit({
      info: this.infoForClass,
      finalDamage: rawMaxDamage,
      skill: skillData,
    });

    const rawMinDamage = canCri ? skillFormula(totalMax, canCri) : skillFormula(totalMin, canCri);
    const minDamage = this._class.calcSkillDmgByTotalHit({
      info: this.infoForClass,
      finalDamage: rawMinDamage + extraDmgCri,
      skill: skillData,
    });

    const rawMinNoCri = canCri ? skillFormula(totalMin, false) + extraDmgCri : 0;
    const rawMaxNoCri = canCri ? skillFormula(totalMaxOver, false) + extraDmgCri : 0;

    return {
      minDamage,
      maxDamage,
      avgNoCriDamage: round((rawMinNoCri + rawMaxNoCri) / 2, 0),
      rawMinNoCri,
      rawMaxNoCri,
      avgCriDamage: round((minDamage + maxDamage) / 2, 0),
      propertyAtk,
      propertyMultiplier,
      sizePenalty,
      canCri,
      criDmgToMonster,
    };
  }

  private getStatusMatk() {
    const { totalDex, totalLuk, totalInt, totalSpl } = this.status;
    const baseLvl = this.model.level;
    const priStat = floor(totalInt / 2) + floor(totalDex / 5) + floor(totalLuk / 3);

    return floor(floor(baseLvl / 4) + totalInt + priStat) + totalSpl * 5;
  }

  private getExtraMatk() {
    const equipAtk = this.totalBonus.matk;

    return equipAtk + this._class.getMasteryMatk(this.infoForClass);
  }

  private getWeaponMatk() {
    const { baseWeaponMatk, baseWeaponLevel, refineBonus, overUpgradeBonus, highUpgradeBonus } = this.weaponData.data;
    const rawWeaponMATK = baseWeaponMatk + refineBonus + highUpgradeBonus;
    const variance = round(0.1 * baseWeaponLevel * rawWeaponMATK, 2);
    const isMax = this.isMaximizeSpell;

    let weaponMinMatk = rawWeaponMATK - (isMax ? -variance : variance);
    const weaponMaxMatk = rawWeaponMATK + variance + overUpgradeBonus;

    if (overUpgradeBonus > 0) {
      weaponMinMatk += 1;
    }

    return { weaponMinMatk, weaponMaxMatk };
  }

  private calcMagicalSkillDamage(params: { skillData: AtkSkillModel; baseSkillDamage: number; weaponPropertyAtk: ElementType; formulaParams?: any; }): DamageResultModel {
    const { skillData, baseSkillDamage, weaponPropertyAtk, formulaParams } = params;
    const { name: skillName, element, isIgnoreDef = false, finalDmgFormula } = skillData;
    const { softMDef } = this.monster.data;

    const skillPropertyAtk = element || weaponPropertyAtk;
    const { dmgReductionByMHardDef, mresReduction } = this.getMagicalDefData();
    const hardDef = isIgnoreDef ? 1 : dmgReductionByMHardDef;

    const baseSkillMultiplier = this.toPercent(baseSkillDamage);
    const equipSkillMultiplier = this.toPercent(100 + this.getSkillBonus(skillName));
    const finalDmg = this.totalBonus[`final_${skillPropertyAtk?.toLowerCase()}`] || 0;
    const finalDmgMultiplier = this.toPercent(finalDmg + 100);
    const propertyMultiplier = this.getPropertyMultiplier(skillPropertyAtk);

    const elementBonus = (this.totalBonus.m_my_element_all || 0) + (this.totalBonus[`m_my_element_${skillPropertyAtk.toLowerCase()}`] || 0);
    const myElementMultiplier = this.toPercent(100 + elementBonus);
    const matkPercentMultiplier = this.toPercent(100 + this.totalBonus.matkPercent);

    const sMatkMultiplier = 1 + this.traitBonus.sMatk * 0.01;
    const cometMultiplier = this.getCometMultiplier();
    const raceMultiplier = this.toPercent(this.getRaceMultiplier('m'));
    const sizeMultiplier = this.toPercent(this.getSizeMultiplier('m'));
    const elementMultiplier = this.toPercent(this.getElementMultiplier('m'));
    const monsterTypeMultiplier = this.toPercent(this.getMonsterTypeMultiplier('m'));
    const debuffMultiplier = this.getDebuffMultiplier(SkillType.MAGICAL);

    const skillFormula = (totalMatk: number) => {
      let total = totalMatk;

      total = floor(total * sMatkMultiplier);
      total = floor(total * raceMultiplier);
      total = floor(total * sizeMultiplier);
      total = floor(total * elementMultiplier); //tested
      total = floor(total * monsterTypeMultiplier);
      total = floor(total * matkPercentMultiplier); //tested
      total = floor(total * cometMultiplier);

      total = floor(total * baseSkillMultiplier); //tested

      total = floor(total * myElementMultiplier); //tested
      total = floor(total * mresReduction);
      total = floor(total * round(hardDef, 4)); //tested
      total = total - softMDef; //tested
      total = floor(total * equipSkillMultiplier);
      total = floor(total * propertyMultiplier); //tested
      total = floor(total * finalDmgMultiplier);
      total = this.applyFinalMultiplier(total, 'magic');
      total = floor(total * debuffMultiplier);

      if (!!finalDmgFormula && typeof finalDmgFormula === 'function') {
        return finalDmgFormula({ damage: total, ...formulaParams });
      }

      return this.toPreventNegativeDmg(total);
    };

    const totalStatusMatk = this.getStatusMatk();
    const extraMatk = this.getExtraMatk();
    const { weaponMinMatk, weaponMaxMatk } = this.getWeaponMatk();

    const rawMatk = extraMatk + totalStatusMatk * this.myticalAmp;
    const weaponMinDmg = skillFormula(weaponMinMatk * this.myticalAmp + rawMatk);
    const weaponMaxDmg = skillFormula(weaponMaxMatk * this.myticalAmp + rawMatk);

    const rawMaxDamage = weaponMaxDmg;
    const maxDamage = this._class.calcSkillDmgByTotalHit({
      info: this.infoForClass,
      finalDamage: rawMaxDamage,
      skill: skillData,
    });

    const rawMinDamage = weaponMinDmg;
    const minDamage = this._class.calcSkillDmgByTotalHit({
      info: this.infoForClass,
      finalDamage: rawMinDamage,
      skill: skillData,
    });

    // console.log({
    //   skillPropertyAtk,
    //   myElementMultiplier,
    //   elementBonus,
    //   totalStatusMatk,
    //   extraMatk,
    //   equipSkillMultiplier,
    //   weaponMinMatk,
    //   weaponMaxMatk,
    //   weaponMinDmg,
    //   weaponMaxDmg,
    // });

    return {
      propertyAtk: skillPropertyAtk,
      propertyMultiplier,
      minDamage,
      maxDamage,
      rawMinNoCri: minDamage,
      rawMaxNoCri: maxDamage,
      avgNoCriDamage: 0,
      avgCriDamage: 0,
      sizePenalty: 1,
      canCri: false,
      criDmgToMonster: 0,
    };
  }

  private calcBasicDamage(params: { totalMin: number; totalMax: number; }) {
    const { totalMax, totalMin } = params;
    const { range, melee, dmg } = this.totalBonus;
    const isRangeType = this.isRangeAtk();
    const dmgType = isRangeType ? SkillType.RANGE : SkillType.MELEE;
    const rangedDmg = isRangeType ? range : melee;
    const rangedMultiplier = this.toPercent(rangedDmg + 100);
    const advKatarMultiplier = (100 + this.getAdvanceKatar()) / 100;
    const debuffMultiplier = this.getDebuffMultiplier(dmgType);
    const dmgMultiplier = this.toPercent(dmg + this.getFlatDmg('basicAtk') + 100);
    const extraDmg = this._class.getAdditionalDmg(this.infoForClass);
    const extraBasicDmg = this._class.getAdditionalBasicDmg(this.infoForClass);

    const { finalDmgReduction, finalSoftDef, resReduction } = this.getPhisicalDefData();
    const hardDef = finalDmgReduction;
    const softDef = finalSoftDef;

    const formula = (totalAtk: number, isCalcDef = true) => {
      let total = floor(totalAtk * rangedMultiplier);
      total = floor(total * dmgMultiplier);
      total = floor(total * resReduction);
      if (isCalcDef) total = floor(total * hardDef);
      if (isCalcDef) total = total - softDef;
      total = floor(total * advKatarMultiplier);
      total = floor(total * debuffMultiplier);

      return this.toPreventNegativeDmg(total);
    };

    const basicMinDamage = formula(totalMin + extraDmg + extraBasicDmg);
    const basicMaxDamage = formula(totalMax + extraDmg + extraBasicDmg);

    return { basicMinDamage, basicMaxDamage };
  }

  private calcBasicCriDamage(params: { totalMaxAtk: number; totalMaxAtkOver: number; }) {
    const { totalMaxAtk, totalMaxAtkOver } = params;
    const { range, melee, criDmg, dmg } = this.totalBonus;

    const bonusCriDmgMultiplier = this.toPercent((criDmg || 0) + 100);
    const isRangeType = this.isRangeAtk();
    const dmgType = isRangeType ? SkillType.RANGE : SkillType.MELEE;
    const rangedDmg = isRangeType ? range : melee;
    const advKatarMultiplier = (100 + this.getAdvanceKatar()) / 100;
    const debuffMultiplier = this.getDebuffMultiplier(dmgType);
    const rangedMultiplier = this.toPercent(rangedDmg + 100);
    const dmgMultiplier = this.toPercent(dmg + this.getFlatDmg('basicAtk') + 100);
    const extraDmg = this._class.getAdditionalDmg(this.infoForClass) * this.criMultiplier;
    const extraBasic = this._class.getAdditionalBasicDmg(this.infoForClass);

    const { finalDmgReduction, finalSoftDef, resReduction } = this.getPhisicalDefData();
    const hardDef = finalDmgReduction;
    const softDef = finalSoftDef;

    const formula = (totalAtk: number, isCalcDef = true) => {
      let total = floor(totalAtk * bonusCriDmgMultiplier);
      total = floor(total * rangedMultiplier);
      if (isCalcDef) total = total * dmgMultiplier;
      total = floor(total * resReduction);
      total = floor(total * hardDef);
      total = floor(total * advKatarMultiplier);
      if (isCalcDef) total = total - softDef;
      total = floor(total * this.criMultiplier);
      total = floor(total * debuffMultiplier);

      return this.toPreventNegativeDmg(total);
    };

    const criMinDamage = formula(totalMaxAtk) + extraDmg + formula(extraBasic, false);
    const criMaxDamage = formula(totalMaxAtkOver) + extraDmg + formula(extraBasic, false);

    return { criMinDamage, criMaxDamage, sizePenalty: 100 };
  }

  calculateAllDamages(args: { skillValue: string; propertyAtk: ElementType; maxHp: number; maxSp: number; }): DamageSummaryModel {
    const { skillValue, propertyAtk, maxHp, maxSp } = args;
    const sizePenalty = this.getSizePenalty();
    const { totalMin, totalMax, totalMaxOver, propertyMultiplier } = this.calcTotalAtk({
      propertyAtk,
      sizePenalty,
      isEDP: this.isActiveEDP(''),
      isExcludeCannanball: true,
    });

    const { basicMinDamage, basicMaxDamage } = this.calcBasicDamage({ totalMin: totalMin, totalMax: totalMaxOver });
    const { criMinDamage, criMaxDamage } = this.calcBasicCriDamage({
      totalMaxAtk: totalMax,
      totalMaxAtkOver: totalMaxOver,
    });

    const criShield = this.monster.data.criShield;
    const misc = this.getMiscData();
    const actualBasicCriRate = this.getBaseCriRate(true);
    const basicAspd = this.getBasicAspd();
    const criRateToMonster = Math.max(0, actualBasicCriRate + this.getExtraCriRateToMonster() - criShield);
    const basicDps = calcDmgDps({
      accRate: misc.accuracy,
      cri: criRateToMonster,
      criDmg: floor((criMinDamage + criMaxDamage) / 2),
      hitsPerSec: basicAspd.hitsPerSec,
      max: basicMaxDamage,
      min: basicMinDamage,
    });

    const { pAtk, sMatk, cRate } = this.traitBonus;
    const basicDmg: BasicDamageSummaryModel = {
      basicMinDamage,
      basicMaxDamage,
      criMinDamage,
      criMaxDamage,
      sizePenalty: floor(sizePenalty * 100, 0),
      propertyAtk,
      propertyMultiplier,
      basicCriRate: this.getBaseCriRate(),
      criRateToMonster,
      totalPene: this.isActiveInfilltration ? 100 : this.getTotalPhysicalPene(),
      accuracy: misc.accuracy,
      basicDps,
      pAtk,
      sMatk,
      cRate,
    };

    const [, _skillName, skillLevelStr] = skillValue?.match(/(.+)==(\d+)/) ?? [];
    const skillData = this._class.atkSkills.find((a) => a.value === skillValue || a.levelList?.findIndex((b) => b.value === skillValue) >= 0);
    const isValidSkill = !!_skillName && !!skillLevelStr && typeof skillData?.formula === 'function';

    if (!isValidSkill) return { basicDmg, misc, basicAspd };

    const skillLevel = Number(skillLevelStr);
    const {
      formula,
      part2,
      baseCri: baseSkillCri = 0,
      isMatk,
      isMelee: _isMelee,
      autoSpellChance = 1,
      isHit100,
      isIgnoreDef = false,
      totalHit: _totalHit = 1,
      name: skillName,
      baseCriPercentage = 1,
      customFormula,
      getElement,
      currentHpFn,
      currentSpFn,
      maxStack = 0,
      forceCri = false,
      verifyItemFn,
    } = skillData;

    const currentHp = typeof currentHpFn === 'function' ? currentHpFn(maxHp) : 0;
    const currentSp = typeof currentSpFn === 'function' ? currentSpFn(maxSp) : 0;
    const formulaParams: AtkSkillFormulaInput = {
      ...this.infoForClass,
      skillLevel,
      maxHp,
      maxSp,
      currentHp,
      currentSp,
      stack: maxStack,
    };


    const invalidMsg = verifyItemFn && typeof verifyItemFn === 'function' ? verifyItemFn(formulaParams) : '';
    if (invalidMsg) {
      basicDmg.requireTxt = invalidMsg;
      return { basicDmg, misc, basicAspd, skillDmg: { ...this.zeroSkillDmg } };
    }

    const _baseSkillDamage = formula(formulaParams) + this.getFlatDmg(skillName);
    let baseSkillDamage = floor(_baseSkillDamage);

    const _NoStackbaseSkillDamage = formula({ ...formulaParams, stack: 0 }) + this.getFlatDmg(skillName);
    const noStackNaseSkillDamage = floor(_NoStackbaseSkillDamage);

    const params = {
      baseSkillDamage,
      skillData,
      weaponPropertyAtk: typeof getElement === 'function' && !!getElement ? getElement(skillValue) : propertyAtk,
      sizePenalty,
      formulaParams,
    };

    let calculated: DamageResultModel;
    let noStackMaxCriDamage = 0;
    let noStackMaxDamage = 0;
    let noStackMinCriDamage = 0;
    let noStackMinDamage = 0;

    if (skillName === 'Fist Spell' && typeof skillData.treatedAsSkillNameFn === 'function') {
      const newSkillValue = skillData.treatedAsSkillNameFn(skillValue);
      const newSkillData = this._class.atkSkills.find((a) => a.value === newSkillValue || a.levelList?.findIndex((b) => b.value === newSkillValue) >= 0);
      if (newSkillData) {
        calculated = this.calcMagicalSkillDamage({
          ...params,
          skillData: {
            ...params.skillData,
            formula: newSkillData.formula,
            name: newSkillData.name,
          },
        });
      }
    } else if (customFormula && typeof customFormula === 'function') {
      const skillPropertyAtk = typeof getElement === 'function' ? getElement(skillValue) : skillData.element || propertyAtk;
      const propertyMultiplier = this.getPropertyMultiplier(skillPropertyAtk);

      const d = customFormula({
        ...formulaParams,
        baseSkillDamage,
        sizePenalty,
        propertyMultiplier,
        ...this.getPhisicalDefData(),
      });
      calculated = {
        canCri: false,
        minDamage: d,
        maxDamage: d,
        rawMinNoCri: d,
        rawMaxNoCri: d,
        propertyAtk: skillPropertyAtk,
        propertyMultiplier: propertyMultiplier,
        avgCriDamage: d,
        avgNoCriDamage: d,
        criDmgToMonster: d,
        sizePenalty,
      };
    } else {
      calculated = isMatk ? this.calcMagicalSkillDamage(params) : this.calcPhysicalSkillDamage(params);

      if (maxStack > 0) {
        const noStackParam = { ...params, baseSkillDamage: noStackNaseSkillDamage };
        const noStackCalculated = isMatk ? this.calcMagicalSkillDamage(noStackParam) : this.calcPhysicalSkillDamage(noStackParam);
        noStackMinDamage = noStackCalculated.rawMinNoCri;
        noStackMaxDamage = noStackCalculated.rawMaxNoCri;
        noStackMaxCriDamage = noStackCalculated.minDamage;
        noStackMinCriDamage = noStackCalculated.maxDamage;
      }
    }

    let { minDamage, maxDamage } = calculated;
    let skillPart2Label = '';
    let skillMinDamage2 = 0;
    let skillMaxDamage2 = 0;
    if (typeof part2?.formula === 'function') {
      const { formula: formula2, isMatk: isPart2Matk, isIncludeMain, label } = part2;
      const _baseSkillDamage2 =
        formula2({
          ...this.infoForClass,
          skillLevel,
          maxHp,
          maxSp,
        }) + this.getFlatDmg(skillName);
      const baseSkillDamage2 = floor(_baseSkillDamage2);
      baseSkillDamage += baseSkillDamage2;

      const params2 = {
        baseSkillDamage: baseSkillDamage2,
        skillData: { ...skillData, ...part2 },
        weaponPropertyAtk: propertyAtk,
        sizePenalty,
        skillLevel,
      };

      const calcPart2 = isPart2Matk ? this.calcMagicalSkillDamage(params2) : this.calcPhysicalSkillDamage(params2);

      if (isIncludeMain) {
        minDamage += calcPart2.minDamage;
        maxDamage += calcPart2.maxDamage;
      } else {
        skillPart2Label = label;
        skillMinDamage2 = calcPart2.minDamage;
        skillMaxDamage2 = calcPart2.maxDamage;
      }
    }

    const skillAspd = calcSkillAspd({ skillData, status: this.status, totalEquipStatus: this.totalBonus, skillLevel });

    const isKatar = this.weaponData.data?.typeName === 'katar';
    let actualCri = calculated.canCri
      ? isKatar
        ? Math.max(0, floor(actualBasicCriRate + baseSkillCri - criShield) * baseCriPercentage)
        : Math.max(0, floor((actualBasicCriRate + baseSkillCri) * baseCriPercentage) - criShield)
      : 0;
    if (this.isForceSkillCri || forceCri) {
      actualCri = 100;
    }
    actualCri = floor(actualCri);

    const skillAccRate = isHit100 || isMatk ? 100 : basicDmg.accuracy;
    const { avgCriDamage, avgNoCriDamage } = calculated;

    const totalHit = typeof _totalHit === 'function' ? _totalHit(formulaParams) : _totalHit;
    const isAutoSpell = autoSpellChance != 1;
    const skillHitsPerSec = Math.min(skillAspd.totalHitPerSec || basicAspd.hitsPerSec, basicAspd.hitsPerSec);
    const oneHitDps = isAutoSpell
      ? 0
      : calcDmgDps({
        min: avgNoCriDamage || minDamage + skillMinDamage2,
        max: avgNoCriDamage || maxDamage + skillMaxDamage2,
        cri: actualCri,
        criDmg: avgCriDamage || maxDamage + skillMaxDamage2,
        hitsPerSec: skillHitsPerSec,
        accRate: skillAccRate,
      });
    const skillDps = floor(totalHit * oneHitDps * autoSpellChance);
    const hitKill = Math.ceil(this.monster.data.hp / minDamage);

    const totalPene = isMatk ? this.getTotalMagicalPene() : basicDmg.totalPene;
    const isMelee = _isMelee != null && typeof _isMelee === 'function' ? _isMelee(this.weaponData.data.typeName) : !!_isMelee;

    const label = calculated.canCri ? 'SkillCri' : 'Skill';
    const { totalPeneRes, totalPeneMres } = this.getPeneResMres();

    const skillDmg: SkillDamageSummaryModel = {
      skillDamageLabel: `${label}` + (maxStack > 0 ? ` ${maxStack} stacks` : ''),
      skillNoStackDamageLabel: `${label} 0 stack`,
      baseSkillDamage,
      dmgType: isMatk ? SkillType.MAGICAL : isMelee ? SkillType.MELEE : SkillType.RANGE,
      skillSizePenalty: round(calculated.sizePenalty * 100, 0),
      skillTotalHit: totalHit,
      skillPropertyAtk: calculated.propertyAtk,
      skillPropertyMultiplier: calculated.propertyMultiplier,
      skillCanCri: calculated.canCri,
      skillTotalPene: isIgnoreDef ? 100 : totalPene,
      skillTotalPeneLabel: isMatk ? 'เจาะเวท' : 'เจาะกาย',
      skillTotalPeneRes: isMatk ? totalPeneMres : totalPeneRes,
      skillTotalPeneResLabel: isMatk ? 'เจาะ MRes' : 'เจาะ Res',
      skillMinDamage: minDamage,
      skillMaxDamage: maxDamage,
      skillMinDamageNoCri: calculated.rawMinNoCri,
      skillMaxDamageNoCri: calculated.rawMaxNoCri,
      skillHit: skillData?.hit || 1,
      skillAccuracy: skillAccRate,
      skillDps,
      skillHitKill: hitKill,
      skillCriRateToMonster: actualCri,
      skillCriDmgToMonster: calculated.criDmgToMonster,
      skillPart2Label,
      skillMinDamage2,
      skillMaxDamage2,
      maxStack,
      noStackMaxCriDamage,
      noStackMaxDamage,
      noStackMinCriDamage,
      noStackMinDamage,
      isAutoSpell,
      isUsedCurrentHP: typeof currentHpFn === 'function',
      isUsedCurrentSP: typeof currentSpFn === 'function',
      currentHp,
      currentSp,
      skillBonusFromEquipment: this.getSkillBonus(skillName),
    };

    return { basicDmg, misc, skillDmg, skillAspd, basicAspd };
  }

  get atkSummaryForUI() {
    const { skillAtk: skillAtkMastery, hiddenMastery, buffAtk, uiMastery } = this.getMasteryAtk();
    const { equipAtk, skillAtk, striking } = this.getExtraAtk();

    return {
      totalStatusAtk: this.getStatusAtk(),
      totalEquipAtk: equipAtk + skillAtk + striking,
      totalMasteryAtk: skillAtkMastery + buffAtk + uiMastery,
      totalHideMasteryAtk: hiddenMastery,
      totalBuffAtk: buffAtk,
      totalStatusMatk: this.getStatusMatk(),
    };
  }
}
