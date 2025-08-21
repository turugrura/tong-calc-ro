import { ElementType } from '../constants/element-type.const';
import { BeastBaneFn, DemonBane, DoubleAttackFn, FaithFn, HiltBindingFn, ImproveDodgeFn, IncreaseSPRecoveryFn, SnatcherFn } from '../constants/share-passive-skills';
import { InfoForClass } from '../models/info-for-class.model';
import { floor } from '../utils';
import { ActiveSkillModel, AtkSkillFormulaInput, AtkSkillModel, CharacterBase, PassiveSkillModel } from './_character-base.abstract';
import { ClassName } from './_class-name';

const jobBonusTable: Record<number, [number, number, number, number, number, number]> = {
  1: [1, 0, 0, 0, 0, 0],
  2: [1, 1, 0, 0, 0, 0],
  3: [1, 1, 0, 0, 0, 0],
  4: [1, 1, 1, 0, 0, 0],
  5: [1, 1, 1, 0, 0, 0],
  6: [1, 1, 1, 1, 0, 0],
  7: [1, 1, 1, 1, 1, 0],
  8: [1, 1, 1, 1, 1, 0],
  9: [1, 1, 1, 1, 1, 1],
  10: [1, 1, 1, 1, 1, 1],
  11: [2, 1, 1, 1, 1, 1],
  12: [2, 2, 1, 1, 1, 1],
  13: [2, 2, 1, 1, 1, 1],
  14: [2, 2, 2, 1, 1, 1],
  15: [2, 2, 2, 1, 1, 1],
  16: [2, 2, 2, 2, 1, 1],
  17: [2, 2, 2, 2, 2, 1],
  18: [2, 2, 2, 2, 2, 1],
  19: [2, 2, 2, 2, 2, 2],
  20: [2, 2, 2, 2, 2, 2],
  21: [3, 2, 2, 2, 2, 2],
  22: [3, 3, 2, 2, 2, 2],
  23: [3, 3, 2, 2, 2, 2],
  24: [3, 3, 3, 2, 2, 2],
  25: [3, 3, 3, 2, 2, 2],
  26: [3, 3, 3, 3, 2, 2],
  27: [3, 3, 3, 3, 3, 2],
  28: [3, 3, 3, 3, 3, 2],
  29: [3, 3, 3, 3, 3, 3],
  30: [3, 3, 3, 3, 3, 3],
  31: [4, 3, 3, 3, 3, 3],
  32: [4, 4, 3, 3, 3, 3],
  33: [4, 4, 3, 3, 3, 3],
  34: [4, 4, 4, 3, 3, 3],
  35: [4, 4, 4, 3, 3, 3],
  36: [4, 4, 4, 4, 3, 3],
  37: [4, 4, 4, 4, 4, 3],
  38: [4, 4, 4, 4, 4, 3],
  39: [4, 4, 4, 4, 4, 4],
  40: [4, 4, 4, 4, 4, 4],
  41: [5, 4, 4, 4, 4, 4],
  42: [5, 5, 4, 4, 4, 4],
  43: [5, 5, 4, 4, 4, 4],
  44: [5, 5, 5, 4, 4, 4],
  45: [5, 5, 5, 4, 4, 4],
  46: [5, 5, 5, 5, 4, 4],
  47: [5, 5, 5, 5, 5, 4],
  48: [5, 5, 5, 5, 5, 4],
  49: [5, 5, 5, 5, 5, 5],
  50: [5, 5, 5, 5, 5, 5],
  51: [6, 5, 5, 5, 5, 5],
  52: [6, 6, 5, 5, 5, 5],
  53: [6, 6, 5, 5, 5, 5],
  54: [6, 6, 6, 5, 5, 5],
  55: [6, 6, 6, 5, 5, 5],
  56: [6, 6, 6, 6, 5, 5],
  57: [6, 6, 6, 6, 6, 5],
  58: [6, 6, 6, 6, 6, 5],
  59: [6, 6, 6, 6, 6, 6],
  60: [6, 6, 6, 6, 6, 6],
  61: [7, 6, 6, 6, 6, 6],
  62: [7, 7, 6, 6, 6, 6],
  63: [7, 7, 6, 6, 6, 6],
  64: [7, 7, 6, 6, 6, 6],
  65: [7, 7, 6, 7, 7, 6],
  66: [7, 7, 6, 7, 7, 6],
  67: [7, 7, 6, 7, 7, 6],
  68: [7, 7, 6, 7, 7, 6],
  69: [7, 7, 6, 7, 7, 6],
  70: [8, 8, 6, 8, 8, 6],
};

export class SuperNovice extends CharacterBase {
  protected override CLASS_NAME = ClassName.SuperNovice;
  protected override JobBonusTable = jobBonusTable;
  protected override initialStatusPoint = 48;

  protected readonly classNames = [ClassName.Novice, ClassName.SuperNovice];
  protected readonly _atkSkillList: AtkSkillModel[] = [
    {
      name: 'Fire Bolt',
      label: 'Fire Bolt Lv10',
      value: 'Fire Bolt==10',
      acd: 2.8,
      fct: 1.2,
      vct: 3.2,
      cd: 0,
      totalHit: 10,
      isMatk: true,
      element: ElementType.Fire,
      formula: (): number => {
        return 100;
      },
    },
    {
      name: 'Cold Bolt',
      label: 'Cold Bolt Lv10',
      value: 'Cold Bolt==10',
      acd: 2.8,
      fct: 1.2,
      vct: 3.2,
      cd: 0,
      totalHit: 10,
      isMatk: true,
      element: ElementType.Water,
      formula: (): number => {
        return 100;
      },
    },
    {
      name: 'Lightening Bolt',
      label: 'Lightening Bolt Lv10',
      value: 'Lightening Bolt==10',
      acd: 2.8,
      fct: 1.2,
      vct: 3.2,
      cd: 0,
      totalHit: 10,
      isMatk: true,
      element: ElementType.Wind,
      formula: (): number => {
        return 100;
      },
    },
    {
      label: "Heaven's Drive Lv5",
      name: "Heaven's Drive",
      value: "Heaven's Drive==5",
      fct: 0.8,
      vct: 1.9,
      acd: 0.5,
      cd: 0,
      isMatk: true,
      element: ElementType.Earth,
      totalHit: 5,
      formula: (): number => {
        return 125;
      },
    },
    {
      name: 'Lord of Vermilion',
      label: 'Lord of Vermilion Lv10',
      value: 'Lord of Vermilion==10',
      acd: 5,
      fct: 1.68,
      vct: 6.72,
      cd: 5,
      isMatk: true,
      hit: 20,
      element: ElementType.Wind,
      formula: (input: AtkSkillFormulaInput): number => {
        const { skillLevel } = input;

        return 400 + skillLevel * 100;
      },
    },
    {
      name: 'Gravitational Field',
      label: 'Gravitational Field Lv5',
      value: 'Gravitational Field==5',
      acd: 1,
      fct: 1,
      vct: 5,
      cd: 5,
      isMatk: true,
      element: ElementType.Neutral,
      formula: (input: AtkSkillFormulaInput): number => {
        const { model, skillLevel } = input;
        const baseLevel = model.level;

        return skillLevel * 100 * (baseLevel / 100);
      },
      finalDmgFormula(input) {
        const totalHit = input.skillLevel * 2;

        return input.damage * totalHit;
      },
    },
    {
      name: 'Fatal Manace',
      label: 'Fatal Manace',
      value: 'Fatal Manace==10',
      values: ['Fatal Manace Lv7', '[Improved] Fatal Manace==7', '[Improved] Fatal Manace==10'],
      acd: 0.5,
      fct: 0,
      vct: 0,
      cd: 0,
      isMelee: true,
      levelList: [
        { label: 'Fatal Manace Lv7', value: 'Fatal Manace==7' },
        { label: 'Fatal Manace Lv10', value: 'Fatal Manace==10' },
      ],
      formula: (input: AtkSkillFormulaInput): number => {
        const { model, skillLevel, status } = input;
        const baseLevel = model.level;
        const totalAgi = status.totalAgi;

        return (skillLevel * 120 + totalAgi * 2) * (baseLevel / 100);
      },
    },
    {
      name: 'Psychic Wave',
      label: 'Psychic Wave',
      value: 'Psychic Wave==5',
      fct: (lv) => 1.1 - lv * 0.1,
      vct: (lv) => 7 + lv,
      cd: 5,
      acd: 1,
      totalHit: ({ skillLevel: lv }) => 2 + lv,
      isMatk: true,
      levelList: [
        { label: 'Psychic Wave Lv1', value: 'Psychic Wave==1' },
        { label: 'Psychic Wave Lv2', value: 'Psychic Wave==2' },
        { label: 'Psychic Wave Lv3', value: 'Psychic Wave==3' },
        { label: 'Psychic Wave Lv4', value: 'Psychic Wave==4' },
        { label: 'Psychic Wave Lv5', value: 'Psychic Wave==5' },
      ],
      formula: (input: AtkSkillFormulaInput): number => {
        const { model, skillLevel, status } = input;
        const baseLevel = model.level;
        const totalInt = status.totalInt;

        return (70 * skillLevel + 3 * totalInt) * (baseLevel / 100);
      },
      finalDmgFormula(input) {
        const weaponType = input.weapon.data?.typeName;
        if (weaponType === 'book' || weaponType === 'rod' || weaponType === 'twohandRod') {
          return input.damage * 2;
        }

        return input.damage;
      },
    },
    {
      name: 'Shield Chain',
      label: 'Shield Chain Lv5',
      value: 'Shield Chain==5',
      fct: 0.2,
      vct: 0.8,
      cd: 0,
      acd: 1,
      verifyItemFn: ({ model }) => !model.shield ? 'Shield' : '',
      formula: (input: AtkSkillFormulaInput): number => {
        const { model, skillLevel, equipmentBonus } = input;
        const baseLevel = model.level;
        const { shield } = equipmentBonus;
        if (!shield) return 0;

        return (300 + skillLevel * 200 + (shield.refine || 0) * 4 + (shield.weight || 0)) * (baseLevel / 100);
      },
    },
    {
      name: 'Bowling Bash',
      label: 'Bowling Bash Lv10',
      value: 'Bowling Bash==10',
      fct: 0.35,
      vct: 0,
      cd: 1,
      acd: 0,
      isMelee: true,
      formula: (input: AtkSkillFormulaInput): number => {
        const { skillLevel } = input;

        return 100 + skillLevel * 40;
      },
    },
    {
      name: 'Ignition Break',
      label: 'Ignition Break Lv5',
      value: 'Ignition Break==5',
      acd: 0,
      fct: 0,
      vct: 1,
      cd: 2,
      isMelee: true,
      canCri: true,
      criDmgPercentage: 0.5,
      formula: (input: AtkSkillFormulaInput): number => {
        const { model, skillLevel } = input;
        const baseLevel = model.level;

        return skillLevel * 450 * (baseLevel / 100);
      },
    },
    {
      name: 'Tiger Cannon',
      label: 'Tiger Cannon Lv10',
      value: 'Tiger Cannon==10',
      fct: 0,
      vct: 2,
      acd: 1,
      cd: 3,
      isMelee: true,
      formula: (input: AtkSkillFormulaInput): number => {
        const { model, skillLevel, maxHp, maxSp, monster } = input;
        if (monster.isElement(ElementType.Ghost)) return 0;

        const baseLevel = model.level;
        const baseDamage = (maxHp * (10 + skillLevel * 2) * 0.01 + maxSp * (5 + skillLevel) * 0.01) / 4;

        return floor(baseDamage * (baseLevel / 100));
      },
      finalDmgFormula: ({ damage, skillLevel, monster, model }): number => {
        if (!model.propertyAtk || model.propertyAtk === ElementType.Neutral) {
          if (monster.isElement(ElementType.Ghost)) return 0;
        }

        const bonusDamge = skillLevel * 240 + monster.level * 40;

        return damage + bonusDamge;
      },
    },
  ];
  protected readonly _activeSkillList: ActiveSkillModel[] = [
    {
      name: 'Improve Concentration',
      label: 'Improve Con',
      inputType: 'dropdown',
      isEquipAtk: true,
      dropdown: [
        { label: '-', value: 0, isUse: false },
        { label: 'Lv 1', value: 1, isUse: true, bonus: { agiBoost: 3, dexBoost: 3 } },
        { label: 'Lv 2', value: 2, isUse: true, bonus: { agiBoost: 4, dexBoost: 4 } },
        { label: 'Lv 3', value: 3, isUse: true, bonus: { agiBoost: 5, dexBoost: 5 } },
        { label: 'Lv 4', value: 4, isUse: true, bonus: { agiBoost: 6, dexBoost: 6 } },
        { label: 'Lv 5', value: 5, isUse: true, bonus: { agiBoost: 7, dexBoost: 7 } },
        { label: 'Lv 6', value: 6, isUse: true, bonus: { agiBoost: 8, dexBoost: 8 } },
        { label: 'Lv 7', value: 7, isUse: true, bonus: { agiBoost: 9, dexBoost: 9 } },
        { label: 'Lv 8', value: 8, isUse: true, bonus: { agiBoost: 10, dexBoost: 10 } },
        { label: 'Lv 9', value: 9, isUse: true, bonus: { agiBoost: 11, dexBoost: 11 } },
        { label: 'Lv 10', value: 10, isUse: true, bonus: { agiBoost: 12, dexBoost: 12 } },
      ],
    },
    {
      name: 'Cart Boost',
      label: 'Cart Boost',
      inputType: 'selectButton',
      isMasteryAtk: true,
      dropdown: [
        { label: 'Yes', value: 1, isUse: true },
        { label: 'No', value: 0, isUse: false },
      ],
    },
    {
      inputType: 'selectButton',
      label: 'EDP',
      name: 'Enchant Deadly Poison',
      dropdown: [
        { label: 'Yes', value: 1, isUse: true, bonus: { edp: 1 } },
        { label: 'No', value: 0, isUse: false },
      ],
    },
  ];

  protected readonly _passiveSkillList: PassiveSkillModel[] = [
    {
      label: 'Break Through',
      name: 'Break Through',
      inputType: 'dropdown',
      isMasteryAtk: true,
      dropdown: [
        { label: '-', value: 0, isUse: false },
        { label: 'Lv 1', value: 1, isUse: true, bonus: { atk: 15, hp: 350, sp: 30 } },
        { label: 'Lv 2', value: 2, isUse: true, bonus: { atk: 30, hp: 700, sp: 60 } },
        { label: 'Lv 3', value: 3, isUse: true, bonus: { atk: 45, hp: 1050, sp: 90 } },
        { label: 'Lv 4', value: 4, isUse: true, bonus: { atk: 60, hp: 1400, sp: 120 } },
        { label: 'Lv 5', value: 5, isUse: true, bonus: { atk: 100, hp: 2000, sp: 200 } },
      ],
    },
    {
      label: 'Transcendence',
      name: 'Transcendence',
      inputType: 'dropdown',
      isEquipAtk: true,
      dropdown: [
        { label: '-', value: 0, isUse: false },
        { label: 'Lv 1', value: 1, isUse: true, bonus: { matk: 15, hp: 350, sp: 30 } },
        { label: 'Lv 2', value: 2, isUse: true, bonus: { matk: 30, hp: 700, sp: 60 } },
        { label: 'Lv 3', value: 3, isUse: true, bonus: { matk: 45, hp: 1050, sp: 90 } },
        { label: 'Lv 4', value: 4, isUse: true, bonus: { matk: 60, hp: 1400, sp: 120 } },
        { label: 'Lv 5', value: 5, isUse: true, bonus: { matk: 100, hp: 2000, sp: 200 } },
      ],
    },
    ImproveDodgeFn(),
    SnatcherFn(),
    {
      label: 'Sword Mastery',
      name: 'Sword Mastery',
      inputType: 'dropdown',
      isMasteryAtk: true,
      dropdown: [
        { label: '-', value: 0, isUse: false },
        { label: 'Lv 1', value: 1, isUse: true, bonus: { x_dagger_atk: 1 * 4, x_sword_atk: 1 * 4 } },
        { label: 'Lv 2', value: 2, isUse: true, bonus: { x_dagger_atk: 2 * 4, x_sword_atk: 2 * 4 } },
        { label: 'Lv 3', value: 3, isUse: true, bonus: { x_dagger_atk: 3 * 4, x_sword_atk: 3 * 4 } },
        { label: 'Lv 4', value: 4, isUse: true, bonus: { x_dagger_atk: 4 * 4, x_sword_atk: 4 * 4 } },
        { label: 'Lv 5', value: 5, isUse: true, bonus: { x_dagger_atk: 5 * 4, x_sword_atk: 5 * 4 } },
        { label: 'Lv 6', value: 6, isUse: true, bonus: { x_dagger_atk: 6 * 4, x_sword_atk: 6 * 4 } },
        { label: 'Lv 7', value: 7, isUse: true, bonus: { x_dagger_atk: 7 * 4, x_sword_atk: 7 * 4 } },
        { label: 'Lv 8', value: 8, isUse: true, bonus: { x_dagger_atk: 8 * 4, x_sword_atk: 8 * 4 } },
        { label: 'Lv 9', value: 9, isUse: true, bonus: { x_dagger_atk: 9 * 4, x_sword_atk: 9 * 4 } },
        { label: 'Lv 10', value: 10, isUse: true, bonus: { x_dagger_atk: 10 * 4, x_sword_atk: 10 * 4 } },
      ],
    },
    DemonBane,
    {
      name: "Owl's Eye",
      label: "Owl's Eye",
      inputType: 'dropdown',
      isEquipAtk: true,
      dropdown: [
        { label: '-', value: 0, isUse: false },
        { label: 'Lv 1', value: 1, isUse: true, bonus: { dex: 1 } },
        { label: 'Lv 2', value: 2, isUse: true, bonus: { dex: 2 } },
        { label: 'Lv 3', value: 3, isUse: true, bonus: { dex: 3 } },
        { label: 'Lv 4', value: 4, isUse: true, bonus: { dex: 4 } },
        { label: 'Lv 5', value: 5, isUse: true, bonus: { dex: 5 } },
        { label: 'Lv 6', value: 6, isUse: true, bonus: { dex: 6 } },
        { label: 'Lv 7', value: 7, isUse: true, bonus: { dex: 7 } },
        { label: 'Lv 8', value: 8, isUse: true, bonus: { dex: 8 } },
        { label: 'Lv 9', value: 9, isUse: true, bonus: { dex: 9 } },
        { label: 'Lv 10', value: 10, isUse: true, bonus: { dex: 10 } },
      ],
    },
    FaithFn(),
    BeastBaneFn(),
    {
      label: 'Axe Mastery',
      name: 'Axe Mastery',
      inputType: 'dropdown',
      isMasteryAtk: true,
      dropdown: [
        { label: '-', value: 0, isUse: false },
        { label: 'Lv 1', value: 1, isUse: true, bonus: { x_axe_atk: 1 * 3, x_sword_atk: 1 * 3 } },
        { label: 'Lv 2', value: 2, isUse: true, bonus: { x_axe_atk: 2 * 3, x_sword_atk: 2 * 3 } },
        { label: 'Lv 3', value: 3, isUse: true, bonus: { x_axe_atk: 3 * 3, x_sword_atk: 3 * 3 } },
        { label: 'Lv 4', value: 4, isUse: true, bonus: { x_axe_atk: 4 * 3, x_sword_atk: 4 * 3 } },
        { label: 'Lv 5', value: 5, isUse: true, bonus: { x_axe_atk: 5 * 3, x_sword_atk: 5 * 3 } },
        { label: 'Lv 6', value: 6, isUse: true, bonus: { x_axe_atk: 6 * 3, x_sword_atk: 6 * 3 } },
        { label: 'Lv 7', value: 7, isUse: true, bonus: { x_axe_atk: 7 * 3, x_sword_atk: 7 * 3 } },
        { label: 'Lv 8', value: 8, isUse: true, bonus: { x_axe_atk: 8 * 3, x_sword_atk: 8 * 3 } },
        { label: 'Lv 9', value: 9, isUse: true, bonus: { x_axe_atk: 9 * 3, x_sword_atk: 9 * 3 } },
        { label: 'Lv 10', value: 10, isUse: true, bonus: { x_axe_atk: 10 * 3, x_sword_atk: 10 * 3 } },
      ],
    },
    HiltBindingFn(),
    {
      label: 'Weaponry Research',
      name: 'Weaponry Research',
      inputType: 'dropdown',
      isMasteryAtk: true,
      dropdown: [
        { label: '-', value: 0, isUse: false },
        { label: 'Lv 1', value: 1, skillLv: 1, isUse: true, bonus: { x_atk: 2, hit: 2 } },
        { label: 'Lv 2', value: 2, skillLv: 2, isUse: true, bonus: { x_atk: 4, hit: 4 } },
        { label: 'Lv 3', value: 3, skillLv: 3, isUse: true, bonus: { x_atk: 6, hit: 6 } },
        { label: 'Lv 4', value: 4, skillLv: 4, isUse: true, bonus: { x_atk: 8, hit: 8 } },
        { label: 'Lv 5', value: 5, skillLv: 5, isUse: true, bonus: { x_atk: 10, hit: 10 } },
        { label: 'Lv 6', value: 6, skillLv: 6, isUse: true, bonus: { x_atk: 12, hit: 12 } },
        { label: 'Lv 7', value: 7, skillLv: 7, isUse: true, bonus: { x_atk: 14, hit: 14 } },
        { label: 'Lv 8', value: 8, skillLv: 8, isUse: true, bonus: { x_atk: 16, hit: 16 } },
        { label: 'Lv 9', value: 9, skillLv: 9, isUse: true, bonus: { x_atk: 18, hit: 18 } },
        { label: 'Lv 10', value: 10, skillLv: 10, isUse: true, bonus: { x_atk: 20, hit: 20 } },
      ],
    },
    IncreaseSPRecoveryFn(),
    DoubleAttackFn(),
    {
      label: 'Gravitational',
      name: 'Gravitational Field',
      inputType: 'dropdown',
      dropdown: [
        { label: '-', value: 0, isUse: false },
        { label: 'Lv 1', value: 1, isUse: true },
        { label: 'Lv 2', value: 2, isUse: true },
        { label: 'Lv 3', value: 3, isUse: true },
        { label: 'Lv 4', value: 4, isUse: true },
        { label: 'Lv 5', value: 5, isUse: true },
      ],
    },
  ];

  override getMasteryAtk(info: InfoForClass): number {
    const { weapon } = info;
    const weaponType = weapon?.data?.typeName;
    const bonuses = this.bonuses?.masteryAtks || {};

    const a = this.calcHiddenMasteryAtk(info);
    const b = this.getMasteryAtkByMonsterRace(info.monster.race);
    const c = this.getMasteryAtkByMonsterElement(info.monster.element);

    let sum = a.totalAtk + b.totalAtk + c.totalAtk;
    const spearMasteryLv = this.learnLv('Spear Mastery');
    if ((weaponType === 'spear' || weaponType === 'twohandSpear') && spearMasteryLv > 0) {
      sum += spearMasteryLv * 4;
    }

    for (const [, bonus] of Object.entries(bonuses)) {
      sum += bonus[`x_${weaponType}_atk`] || 0; // x_spear_atk
    }

    return sum;
  }

  override calcSkillDmgByTotalHit(params: { finalDamage: number; skill: AtkSkillModel; info: InfoForClass; }) {
    const { finalDamage, skill, info } = params;
    const isDagger = info.weapon.data?.typeName === 'dagger';
    if (skill.name === 'Fatal Manace' && isDagger) {
      return finalDamage * 2;
    }

    return super.calcSkillDmgByTotalHit(params);
  }
}
