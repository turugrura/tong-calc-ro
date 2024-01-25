import { ElementMapper } from './constants/element-mapper';
import { ElementType } from './constants/element-type.const';
import { ItemTypeEnum } from './constants/item-type.enum';
import { SizePenaltyMapper } from './constants/size-penalty-mapper';
import { AtkSkillModel, CharacterBase } from './jobs/_character-base.abstract';
import {
  BasicDamageSummaryModel,
  DamageSummaryModel,
  MiscModel,
  SkillDamageSummaryModel,
  SkillType,
} from './models/damage-summary.model';
import { EquipmentSummaryModel } from './models/equipment-summary.model';
import { InfoForClass } from './models/info-for-class.model';
import { MainModel } from './models/main.model';
import { MonsterModel } from './models/monster.model';
import { PreparedMonsterModel } from './models/prepared-monster.model';
import { StatusSummary } from './models/status-summary.model';
import { calcDmgDps, calcSkillAspd, floor, isSkillCanEDP, round } from './utils';
import { Weapon } from './weapon';

interface DamageResultModel {
  minDamage: number;
  maxDamage: number;
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
  private readonly BASE_CRI_MULTIPLIER = 1.4;

  private skillName = '';
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
  private monster: MonsterModel;
  private monsterData: PreparedMonsterModel;

  private weaponData: Weapon;
  private leftWeaponData: Weapon;
  private aspdPotion: number;

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
    monster: MonsterModel;
    monsterData: PreparedMonsterModel;
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
      monsterData,
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
    this.monsterData = monsterData;
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

  get status(): StatusSummary {
    const { str, jobStr, int, jobInt, luk, jobLuk, vit, jobVit, dex, jobDex, agi, jobAgi } = this.model;

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
    };
  }

  get infoForClass(): InfoForClass {
    return {
      model: this.model,
      monster: this.monsterData,
      totalBonus: this.totalBonus,
      weapon: this.weaponData,
      status: this.status,
      equipmentBonus: this.equipStatus,
      skillName: this.skillName,
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

  private getDarkClawBonus(atkType: 'melee' | 'range') {
    if (atkType === 'range') return 0;

    const bonus = this.totalBonus['darkClaw'] || 0;
    // if (this.monsterData.type === 'boss') {
    //   bonus = bonus / 2;
    // }

    return bonus;
  }

  private getAdvanceKatar() {
    if (this.weaponData.data.typeName !== 'katar') return 0;

    return this.totalBonus['advKatar'] || 0;
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

  private getBaseCriRate() {
    const { cri } = this.totalBonus;
    const { totalLuk } = this.status;

    const base = 1 + cri + floor(totalLuk / 3);

    return this.weaponData.data?.typeName === 'katar' ? base * 2 : base;
  }

  private getBasicAspd() {
    const { totalAgi, totalDex } = this.status;

    const totalAspd = this._class.calcAspd({
      potionAspd: this.aspdPotion,
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
    });

    const hitsPerSec = floor(50 / (200 - totalAspd));

    return { totalAspd, hitsPerSec };
  }

  private getMiscData(): MiscModel {
    const { totalLuk, totalDex, totalAgi } = this.status;
    const { hit, perfectHit, flee, perfectDodge } = this.totalBonus;
    const baseLvl = this.model.level;
    const formula = () => {
      return 175 + baseLvl + totalDex + floor(totalLuk / 3) + hit;
    };

    const totalHit = formula();
    const totalPerfectHit = floor(totalLuk / 10) + perfectHit;

    const { hitRequireFor100 } = this.monsterData;

    let accuracy = Math.max(5, floor(100 + totalHit - hitRequireFor100));
    accuracy = Math.min(100, Math.max(accuracy, totalPerfectHit));

    const totalFlee = 100 + 0 + floor(baseLvl + totalAgi + totalLuk / 5 + flee) * 1;
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
    const { race, element, size } = this.monsterData;
    const toRace = this.model[`cri_race_${race}`] || 0;
    const toElement = this.model[`cri_element_${element}`] || 0;
    const toSize = this.model[`cri_size_${size}`] || 0;

    return toRace + toElement + toSize;
  }

  private getSizePenalty() {
    if (this.totalBonus.ignore_size_penalty > 0) {
      return 1;
    }

    const size = this.monsterData.size;
    const fixedSize = this.totalBonus[`sizePenalty_${size}`];
    if (fixedSize > 0) {
      return this.toPercent(fixedSize);
    }

    const penalty = SizePenaltyMapper[this.weaponData?.data?.typeName]?.[size];

    return this.toPercent(penalty || 100);
  }

  private getTotalPhysicalPene() {
    const { size, race, element, type } = this.monsterData;
    const { p_pene_race_all, p_pene_size_all, p_pene_class_all } = this.totalBonus;
    const rawP_Pene = p_pene_race_all + p_pene_size_all + p_pene_class_all;
    const pByMonster =
      (this.totalBonus[`p_pene_size_${size}`] ?? 0) +
      (this.totalBonus[`p_pene_element_${element}`] ?? 0) +
      (this.totalBonus[`p_pene_race_${race}`] ?? 0) +
      (this.totalBonus[`p_pene_class_${type}`] ?? 0);
    const totalP_Pene = rawP_Pene + pByMonster;

    return Math.min(100, totalP_Pene);
  }

  private getTotalMagicalPene() {
    const { size, race, element, type } = this.monsterData;
    const { m_pene_race_all, m_pene_size_all, m_pene_class_all } = this.totalBonus;
    const rawM_Pene = m_pene_race_all + m_pene_size_all + m_pene_class_all;
    const mByMonster =
      (this.totalBonus[`m_pene_size_${size}`] ?? 0) +
      (this.totalBonus[`m_pene_element_${element}`] ?? 0) +
      (this.totalBonus[`m_pene_race_${race}`] ?? 0) +
      (this.totalBonus[`m_pene_class_${type}`] ?? 0);
    const totalM_Pene = rawM_Pene + mByMonster;

    return Math.min(100, totalM_Pene);
  }

  private getPhisicalDefData() {
    const { def, softDef } = this.monsterData;
    const p_pene = this.getTotalPhysicalPene();

    const reducedHardDef = def * ((100 - p_pene) / 100);
    const dmgReductionByHardDef = (4000 + def * ((100 - p_pene) / 100)) / (4000 + def * ((100 - p_pene) / 100) * 10);

    const isActiveInfilltration = this.isActiveInfilltration;
    const finalDmgReduction = isActiveInfilltration ? 1 : dmgReductionByHardDef;
    const finalSoftDef = isActiveInfilltration ? 0 : softDef;

    return { reducedHardDef, dmgReductionByHardDef, finalDmgReduction, finalSoftDef };
  }

  private getMagicalDefData() {
    const { mdef } = this.monsterData;
    const m_pene = this.getTotalMagicalPene();
    const mDefBypassed = round(mdef - mdef * this.toPercent(m_pene), 4);
    const dmgReductionByMHardDef = (1000 + mDefBypassed) / (1000 + mDefBypassed * 10);

    return { dmgReductionByMHardDef };
  }

  private getAtkGroupA(params: { totalAtk: number }) {
    const { totalAtk } = params;
    const atkPercent = this.toPercent(this.totalBonus.atkPercent);

    let total = totalAtk;
    total = floor(total * atkPercent); // tested

    return total;
  }

  private getAtkGroupB(params: { totalAtk: number }) {
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
    const { totalStr, totalDex, totalLuk } = this.status;
    const baseLvl = this.model.level;
    const [primaryStatus, secondStatus] = this.isRangeAtk() ? [totalDex, totalStr] : [totalStr, totalDex];

    const rawStatusAtk = floor(baseLvl / 4 + secondStatus / 5 + primaryStatus + totalLuk / 3);

    return rawStatusAtk * 2;
  }

  private getRaceMultiplier(atkType: 'p' | 'm') {
    const prefix = `${atkType}_race`;
    const base = this.totalBonus[`${prefix}_all`] || 0;

    const total = 100 + base + (this.totalBonus[`${prefix}_${this.monsterData.race}`] ?? 0);

    return round(total, 3);
  }

  private getSizeMultiplier(atkType: 'p' | 'm') {
    const prefix = `${atkType}_size`;
    const base = this.totalBonus[`${prefix}_all`] || 0;

    const total = 100 + base + (this.totalBonus[`${prefix}_${this.monsterData.size}`] ?? 0);

    return round(total, 3);
  }

  private getElementMultiplier(atkType: 'p' | 'm') {
    const prefix = `${atkType}_element`;
    const base = this.totalBonus[`${prefix}_all`] || 0;

    const total = 100 + base + (this.totalBonus[`${prefix}_${this.monsterData.element}`] ?? 0);

    return round(total, 3);
  }

  private getMonsterTypeMultiplier(atkType: 'p' | 'm') {
    const base = this.totalBonus[`${atkType}_class_all`] || 0;

    const total = 100 + base + (this.totalBonus[`${atkType}_class_${this.monsterData.type}`] ?? 0);

    return round(total, 3);
  }

  /**
   * Ex. Power Thrust
   * @returns number
   */
  private getFlatDmg(skillName?: string) {
    const base = this.totalBonus['flatDmg'] || 0;
    if (skillName) {
      const flatSkill = this.totalBonus[`flat_${skillName}`] || 0;
      return base + flatSkill;
    } else if (skillName === 'basicAtk') {
      const flatBasicAtk = this.totalBonus['flatBasicDmg'] || 0;
      return base + flatBasicAtk;
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

    return equipAtk + skillAtk + ammoAtk + pseudoBuffATK;
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

    return skillAtk + buffAtk + uiMastery + hiddenMastery;
  }

  private getWeaponAtk(params: { isEDP: boolean; sizePenalty: number }) {
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
    let pMultiplier = ElementMapper[this.monster.stats.elementName][propertyAtk];
    pMultiplier = pMultiplier * this.getVIAmp(propertyAtk);

    return round(this.toPercent(pMultiplier), 2);
  }

  private getPurePropertyMultiplier(propertyAtk: ElementType) {
    const pMultiplier = ElementMapper[this.monster.stats.elementName][propertyAtk];

    return this.toPercent(pMultiplier);
  }

  private calcTotalAtk(params: { propertyAtk: ElementType; isEDP: boolean; sizePenalty: number }) {
    const { propertyAtk, isEDP, sizePenalty } = params;
    const propertyMultiplier = this.getPropertyMultiplier(propertyAtk);

    const extraAtk = this.getExtraAtk();
    const cannonBallAtk = this.totalBonus.cannonballAtk || 0;
    const masteryAtk = this.getMasteryAtk() + cannonBallAtk;

    const mildwindMultiplier = this.isActiveMildwind
      ? propertyMultiplier
      : this.getPropertyMultiplier(ElementType.Neutral);
    const statusAtk = this.getStatusAtk() * mildwindMultiplier;

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

    let totalMin = statusAtk + masteryAtk + floor((aMin + bMin) * propertyMultiplier); // tested
    const totalMax = statusAtk + masteryAtk + floor((aMax + bMax) * propertyMultiplier);
    let totalMaxOver = statusAtk + masteryAtk + floor((aMaxOver + bMaxOver) * propertyMultiplier);
    if (totalMin > totalMax) {
      const minBk = Math.min(totalMin, totalMax, totalMaxOver, 0);
      const maxBk = Math.max(totalMin, totalMax, totalMaxOver);
      totalMin = minBk;
      totalMaxOver = maxBk;
    }

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

  private calcSkillDamage(params: {
    skillData: AtkSkillModel;
    baseSkillDamage: number;
    weaponPropertyAtk: ElementType;
    sizePenalty: number;
    formulaParams?: any;
  }): DamageResultModel {
    const { skillData, baseSkillDamage, weaponPropertyAtk, sizePenalty, formulaParams } = params;
    const {
      name: skillName,
      element,
      canCri: _canCri,
      isMelee: _isMelee,
      isHDefToSDef = false,
      isIgnoreDef = false,
      finalDmgFormula,
    } = skillData;
    this.skillName = skillName;
    const { criDmgPercentage = 1 } = skillData;
    const canCri = this.isForceSkillCri || _canCri;
    const { reducedHardDef, finalDmgReduction, finalSoftDef } = this.getPhisicalDefData();
    const hardDef = isIgnoreDef || isHDefToSDef ? 1 : finalDmgReduction;
    const softDef = finalSoftDef + (isHDefToSDef ? reducedHardDef : 0);

    const { range, melee, criDmg } = this.totalBonus;
    const isMelee =
      _isMelee != null && typeof _isMelee === 'function' ? _isMelee(this.weaponData.data.typeName) : !!_isMelee;
    const ranged = isMelee ? melee : range;
    const rangedMultiplier = this.toPercent(ranged + 100);
    const baseSkillMultiplier = this.toPercent(baseSkillDamage);
    const equipSkillMultiplier = this.toPercent(100 + (this.totalBonus[skillName] || 0));
    const criDmgToMonster = floor(criDmg * criDmgPercentage || 0);
    const criMultiplier = canCri ? this.toPercent(criDmgToMonster + 100) : 1;

    const darkClaw = this.getDarkClawBonus(isMelee ? 'melee' : 'range');
    const advKatar = this.getAdvanceKatar();
    const finalDmgMultipliers = [darkClaw, advKatar].map((b) => this.toPercent(100 + b));
    const infoForClass = this.infoForClass;

    const skillFormula = (_totalAtk: number, _calcCri: boolean) => {
      let total = this._class.modifyFinalAtk(_totalAtk, infoForClass);
      if (_calcCri) total = floor(total * criMultiplier); // tested
      total = floor(total * rangedMultiplier); // tested
      total = floor(total * baseSkillMultiplier); // tested
      total = floor(total * equipSkillMultiplier);
      total = floor(total * hardDef);
      total = total - softDef; // tested
      if (_calcCri) total = floor(total * this.BASE_CRI_MULTIPLIER);

      for (const final of finalDmgMultipliers) {
        total = floor(total * final);
      }

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
    });

    const rawMaxDamage = skillFormula(totalMaxOver, canCri);
    const maxDamage = this._class.calcSkillDmgByTotalHit({
      info: this.infoForClass,
      finalDamage: rawMaxDamage,
      skill: skillData,
    });

    const rawMinDamage = canCri ? skillFormula(totalMax, canCri) : skillFormula(totalMin, canCri);
    const minDamage = this._class.calcSkillDmgByTotalHit({
      info: this.infoForClass,
      finalDamage: rawMinDamage,
      skill: skillData,
    });

    const rawMinNoCri = canCri ? skillFormula(totalMax, false) : 0;
    const rawMaxNoCri = canCri ? skillFormula(totalMaxOver, false) : 0;

    return {
      minDamage,
      maxDamage,
      avgNoCriDamage: round((rawMinNoCri + rawMaxNoCri) / 2, 0),
      avgCriDamage: round((minDamage + maxDamage) / 2, 0),
      propertyAtk,
      propertyMultiplier,
      sizePenalty,
      canCri,
      criDmgToMonster,
    };
  }

  private getStatusMatk() {
    const { totalDex, totalLuk, totalInt } = this.status;
    const baseLvl = this.model.level;
    const priStat = floor(totalInt / 2) + floor(totalDex / 5) + floor(totalLuk / 3);

    return floor(floor(baseLvl / 4) + totalInt + priStat);
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

  private calcMatkSkillDamage(params: {
    skillData: AtkSkillModel;
    baseSkillDamage: number;
    weaponPropertyAtk: ElementType;
  }): DamageResultModel {
    const { skillData, baseSkillDamage, weaponPropertyAtk } = params;
    const { name: skillName, element, isIgnoreDef = false } = skillData;
    const { softMDef } = this.monsterData;

    const skillPropertyAtk = element || weaponPropertyAtk;
    const { dmgReductionByMHardDef } = this.getMagicalDefData();
    const hardDef = isIgnoreDef ? 1 : dmgReductionByMHardDef;

    const baseSkillMultiplier = this.toPercent(baseSkillDamage);
    const equipSkillMultiplier = this.toPercent(100 + (this.totalBonus[skillName] || 0));
    const finalDmg = this.totalBonus[`final_${skillPropertyAtk?.toLowerCase()}`] || 0;
    const finalDmgMultiplier = this.toPercent(finalDmg + 100);
    const propertyMultiplier = this.getPropertyMultiplier(skillPropertyAtk);

    const elementBonus =
      (this.totalBonus.m_my_element_all || 0) +
      (this.totalBonus[`m_my_element_${skillPropertyAtk.toLowerCase()}`] || 0);
    const myElementMultiplier = this.toPercent(100 + elementBonus);
    const matkPercentMultiplier = this.toPercent(100 + this.totalBonus.matkPercent);

    const cometMultiplier = this.getCometMultiplier();
    const raceMultiplier = this.toPercent(this.getRaceMultiplier('m'));
    const sizeMultiplier = this.toPercent(this.getSizeMultiplier('m'));
    const elementMultiplier = this.toPercent(this.getElementMultiplier('m'));
    const monsterTypeMultiplier = this.toPercent(this.getMonsterTypeMultiplier('m'));

    const skillFormula = (totalAtk: number) => {
      let total = totalAtk;

      total = floor(total * raceMultiplier);
      total = floor(total * sizeMultiplier);
      total = floor(total * elementMultiplier); //tested
      total = floor(total * monsterTypeMultiplier);
      total = floor(total * matkPercentMultiplier); //tested
      total = floor(total * cometMultiplier);

      total = floor(total * baseSkillMultiplier); //tested
      total = floor(total * equipSkillMultiplier);

      total = floor(total * myElementMultiplier); //tested
      total = floor(total * round(hardDef, 4)); //tested
      total = total - softMDef; //tested
      total = floor(total * propertyMultiplier); //tested
      total = floor(total * finalDmgMultiplier);
      total = this.applyFinalMultiplier(total, 'magic');

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
      avgNoCriDamage: 0,
      avgCriDamage: 0,
      sizePenalty: 1,
      canCri: false,
      criDmgToMonster: 0,
    };
  }

  private calcBasicDamage(params: { totalMin: number; totalMax: number }) {
    const { totalMax, totalMin } = params;
    const { range, melee, dmg } = this.totalBonus;
    const rangedDmg = this.isRangeAtk() ? range : melee;
    const rangedMultiplier = this.toPercent(rangedDmg + 100);
    const dmgMultiplier = this.toPercent(dmg + this.getFlatDmg('basicAtk') + 100);
    const { finalDmgReduction, finalSoftDef } = this.getPhisicalDefData();
    const hardDef = finalDmgReduction;
    const softDef = finalSoftDef;

    const formula = (totalAtk: number) => {
      let total = floor(totalAtk * rangedMultiplier);
      total = floor(total * dmgMultiplier);
      total = floor(total * hardDef);
      total = total - softDef;
      // total = this.applyFinalMultiplier(total, 'phy');

      return this.toPreventNegativeDmg(total);
    };

    const basicMinDamage = formula(totalMin);
    const basicMaxDamage = formula(totalMax);

    return { basicMinDamage, basicMaxDamage };
  }

  private calcBasicCriDamage(params: { totalMaxAtk: number; totalMaxAtkOver: number }) {
    const { totalMaxAtk, totalMaxAtkOver } = params;
    const { range, melee, criDmg, dmg } = this.totalBonus;

    const bonusCriDmgMultiplier = this.toPercent((criDmg || 0) + 100);
    const rangedDmg = this.isRangeAtk() ? range : melee;
    const rangedMultiplier = this.toPercent(rangedDmg + 100);
    const dmgMultiplier = this.toPercent(dmg + this.getFlatDmg('basicAtk') + 100);

    const { finalDmgReduction, finalSoftDef } = this.getPhisicalDefData();
    const hardDef = finalDmgReduction;
    const softDef = finalSoftDef;

    const formula = (totalAtk: number) => {
      let total = floor(totalAtk * bonusCriDmgMultiplier);
      total = floor(total * rangedMultiplier);
      total = total * dmgMultiplier;
      total = floor(total * hardDef);
      total = total - softDef;
      total = floor(total * this.BASE_CRI_MULTIPLIER);
      // total = this.applyFinalMultiplier(total, 'phy');

      return this.toPreventNegativeDmg(total);
    };

    const criMinDamage = formula(totalMaxAtk);
    const criMaxDamage = formula(totalMaxAtkOver);

    return { criMinDamage, criMaxDamage, sizePenalty: 100 };
  }

  calculateAllDamages(args: {
    skillValue: string;
    propertyAtk: ElementType;
    maxHp: number;
    maxSp: number;
  }): DamageSummaryModel {
    const { skillValue, propertyAtk, maxHp, maxSp } = args;
    const sizePenalty = this.getSizePenalty();
    const { totalMin, totalMax, totalMaxOver, propertyMultiplier } = this.calcTotalAtk({
      propertyAtk,
      sizePenalty,
      isEDP: this.isActiveEDP(''),
    });

    const { basicMinDamage, basicMaxDamage } = this.calcBasicDamage({ totalMin: totalMin, totalMax: totalMaxOver });
    const { criMinDamage, criMaxDamage } = this.calcBasicCriDamage({
      totalMaxAtk: totalMax,
      totalMaxAtkOver: totalMaxOver,
    });

    const criShield = this.monsterData.criShield;
    const misc = this.getMiscData();
    const basicCriRate = this.getBaseCriRate();
    const basicAspd = this.getBasicAspd();
    const criRateToMonster = Math.max(0, basicCriRate + this.getExtraCriRateToMonster() - criShield);
    const basicDps = calcDmgDps({
      accRate: misc.accuracy,
      cri: criRateToMonster,
      criDmg: floor((criMinDamage + criMaxDamage) / 2),
      hitsPerSec: basicAspd.hitsPerSec,
      max: basicMaxDamage,
      min: basicMinDamage,
    });

    const basicDmg: BasicDamageSummaryModel = {
      basicMinDamage,
      basicMaxDamage,
      criMinDamage,
      criMaxDamage,
      sizePenalty: floor(sizePenalty * 100, 0),
      propertyAtk,
      propertyMultiplier,
      basicCriRate: basicCriRate,
      criRateToMonster,
      totalPene: this.isActiveInfilltration ? 100 : this.getTotalPhysicalPene(),
      accuracy: misc.accuracy,
      basicDps,
    };

    const [, _skillName, skillLevelStr] = skillValue?.match(/(.+)==(\d+)/) ?? [];
    const skillData = this._class.atkSkills.find((a) => a.value === skillValue);
    const isValidSkill = !!_skillName && !!skillLevelStr && typeof skillData?.formula === 'function';

    if (!isValidSkill) return { basicDmg, misc, basicAspd };

    const skillLevel = Number(skillLevelStr);
    const {
      formula,
      part2,
      baseCri: baseSkillCri = 0,
      isMatk,
      isMelee: _isMelee,
      isHit100,
      isIgnoreDef = false,
      totalHit: _totalHit = 1,
      name: skillName,
      baseCriPercentage = 1,
      customFormula,
      getElement,
    } = skillData;

    const formulaParams = {
      ...this.infoForClass,
      skillLevel,
      maxHp,
      maxSp,
    };
    const _baseSkillDamage = formula(formulaParams) + this.getFlatDmg(skillName);
    let baseSkillDamage = floor(_baseSkillDamage);

    const params = {
      baseSkillDamage,
      skillData,
      weaponPropertyAtk: propertyAtk,
      sizePenalty,
      formulaParams,
    };

    let calculated: DamageResultModel;
    if (customFormula && typeof customFormula === 'function') {
      const skillPropertyAtk = typeof getElement === 'function' ? getElement() : skillData.element || propertyAtk;
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
        propertyAtk: skillPropertyAtk,
        propertyMultiplier: propertyMultiplier,
        avgCriDamage: d,
        avgNoCriDamage: d,
        criDmgToMonster: d,
        sizePenalty,
      };
    } else {
      calculated = isMatk ? this.calcMatkSkillDamage(params) : this.calcSkillDamage(params);
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

      const calcPart2 = isPart2Matk ? this.calcMatkSkillDamage(params2) : this.calcSkillDamage(params2);

      if (isIncludeMain) {
        minDamage += calcPart2.minDamage;
        maxDamage += calcPart2.maxDamage;
      } else {
        skillPart2Label = label;
        skillMinDamage2 = calcPart2.minDamage;
        skillMaxDamage2 = calcPart2.maxDamage;
      }
    }

    const skillAspd = calcSkillAspd({ skillData, status: this.status, totalEquipStatus: this.totalBonus });
    const skillHitsPerSec = Math.min(basicAspd.hitsPerSec, skillAspd.totalHitPerSec);

    let actualCri = calculated.canCri
      ? Math.max(0, (basicDmg.basicCriRate + baseSkillCri) * baseCriPercentage - criShield)
      : 0;
    if (this.isForceSkillCri) {
      actualCri = 100;
    }

    const skillAccRate = isHit100 || isMatk ? 100 : basicDmg.accuracy;
    const { avgCriDamage, avgNoCriDamage } = calculated;

    const totalHit = typeof _totalHit === 'function' ? _totalHit(this.monsterData.size) : _totalHit;
    const skillDps =
      totalHit *
      calcDmgDps({
        min: avgNoCriDamage || minDamage + skillMinDamage2,
        max: avgNoCriDamage || maxDamage + skillMaxDamage2,
        cri: actualCri,
        criDmg: avgCriDamage || maxDamage + skillMaxDamage2,
        hitsPerSec: floor(skillHitsPerSec),
        accRate: skillAccRate,
      });
    const hitKill = Math.ceil(this.monsterData.hp / minDamage);

    const totalPene = isMatk ? this.getTotalMagicalPene() : basicDmg.totalPene;
    const isMelee =
      _isMelee != null && typeof _isMelee === 'function' ? _isMelee(this.weaponData.data.typeName) : !!_isMelee;

    const skillDmg: SkillDamageSummaryModel = {
      baseSkillDamage,
      dmgType: isMatk ? SkillType.MAGICAL : isMelee ? SkillType.MELEE : SkillType.RANGE,
      skillSizePenalty: round(calculated.sizePenalty * 100, 0),
      skillTotalHit: totalHit,
      skillPropertyAtk: calculated.propertyAtk,
      skillPropertyMultiplier: calculated.propertyMultiplier,
      skillCanCri: calculated.canCri,
      skillTotalPene: isIgnoreDef ? 100 : totalPene,
      skillMinDamage: minDamage,
      skillMaxDamage: maxDamage,
      skillHit: skillData?.hit || 1,
      skillAccuracy: skillAccRate,
      skillDps,
      skillHitKill: hitKill,
      skillCriRateToMonster: actualCri,
      skillCriDmgToMonster: calculated.criDmgToMonster,
      skillPart2Label,
      skillMinDamage2,
      skillMaxDamage2,
    };

    return { basicDmg, misc, skillDmg, skillAspd, basicAspd };
  }
}
