import { ClassName } from './_class-name';
import { ActiveSkillModel, AtkSkillFormulaInput, AtkSkillModel, PassiveSkillModel } from './_character-base.abstract';
import { CartBoost } from '../constants/share-active-skills';
import { Creator } from './Creator';
import { InfoForClass } from '../models/info-for-class.model';
import { ElementType } from '../constants/element-type.const';
import { isBioloWoodenFairy, isBioloWoodenWarrior } from './summons';

const jobBonusTable: Record<number, [number, number, number, number, number, number]> = {
  1: [0, 0, 0, 1, 0, 0],
  2: [0, 0, 0, 2, 0, 0],
  3: [0, 0, 0, 2, 1, 0],
  4: [0, 0, 0, 2, 1, 0],
  5: [0, 0, 0, 2, 1, 0],
  6: [0, 0, 0, 2, 2, 0],
  7: [0, 0, 0, 3, 2, 0],
  8: [0, 1, 0, 3, 2, 0],
  9: [0, 1, 0, 3, 2, 0],
  10: [0, 1, 0, 3, 2, 0],
  11: [0, 1, 0, 3, 2, 0],
  12: [0, 1, 0, 4, 2, 0],
  13: [0, 1, 0, 4, 3, 0],
  14: [0, 1, 0, 4, 3, 0],
  15: [0, 1, 1, 4, 3, 0],
  16: [0, 1, 1, 4, 3, 0],
  17: [0, 1, 1, 4, 3, 0],
  18: [0, 1, 2, 4, 3, 0],
  19: [0, 1, 2, 4, 4, 0],
  20: [0, 2, 2, 4, 4, 0],
  21: [0, 2, 2, 4, 4, 0],
  22: [0, 2, 2, 4, 4, 0],
  23: [0, 2, 2, 5, 4, 0],
  24: [0, 2, 3, 5, 4, 0],
  25: [0, 2, 4, 5, 4, 0],
  26: [0, 2, 4, 5, 4, 0],
  27: [0, 2, 4, 5, 4, 0],
  28: [0, 2, 4, 5, 5, 0],
  29: [0, 3, 4, 5, 5, 0],
  30: [0, 3, 4, 5, 5, 0],
  31: [0, 3, 4, 5, 5, 1],
  32: [0, 3, 4, 5, 5, 1],
  33: [0, 3, 4, 5, 5, 1],
  34: [1, 3, 4, 5, 5, 1],
  35: [1, 3, 4, 6, 5, 1],
  36: [1, 3, 4, 7, 5, 1],
  37: [1, 3, 4, 7, 5, 1],
  38: [1, 3, 4, 7, 5, 1],
  39: [1, 3, 4, 7, 6, 1],
  40: [1, 4, 4, 7, 6, 1],
  41: [1, 4, 4, 8, 6, 1],
  42: [1, 4, 4, 8, 6, 1],
  43: [1, 4, 4, 8, 6, 1],
  44: [1, 4, 4, 9, 6, 1],
  45: [1, 4, 4, 10, 6, 1],
  46: [1, 4, 4, 10, 6, 1],
  47: [1, 5, 4, 10, 6, 1],
  48: [1, 5, 4, 10, 6, 1],
  49: [1, 5, 4, 10, 6, 1],
  50: [1, 5, 4, 11, 6, 1],
  51: [2, 5, 4, 11, 6, 1],
  52: [2, 5, 5, 11, 6, 1],
  53: [2, 5, 5, 11, 7, 1],
  54: [2, 5, 5, 11, 7, 1],
  55: [2, 6, 5, 11, 7, 1],
  56: [3, 6, 5, 11, 7, 1],
  57: [3, 6, 6, 11, 7, 1],
  58: [3, 6, 6, 11, 7, 2],
  59: [3, 6, 6, 11, 8, 2],
  60: [3, 6, 6, 12, 8, 2],
  61: [3, 6, 6, 12, 8, 2],
  62: [4, 6, 6, 12, 8, 3],
  63: [4, 6, 6, 12, 8, 3],
  64: [4, 6, 6, 12, 8, 3],
  65: [4, 6, 7, 12, 8, 3],
  66: [4, 6, 7, 12, 8, 3],
  67: [4, 6, 7, 12, 8, 3],
  68: [4, 6, 7, 12, 8, 3],
  69: [4, 6, 7, 12, 8, 3],
  70: [5, 6, 8, 12, 8, 4],
};

export class Genetic extends Creator {
  protected override CLASS_NAME = ClassName.Genetic;
  protected override JobBonusTable = jobBonusTable;

  private readonly classNames3rd = [ClassName.Only_3rd, ClassName.Genetic];
  private readonly atkSkillList3rd: AtkSkillModel[] = [
    {
      name: 'Acid Bomb',
      label: 'Acid Bomb Lv10',
      value: 'Acid Bomb==10',
      values: ['[Improved] Acid Bomb==10'],
      acd: 1,
      fct: 1,
      vct: 0,
      cd: 0.15,
      isExcludeCannanball: true,
      formula: (input: AtkSkillFormulaInput): number => {
        const { skillLevel, model, status, monster } = input;
        const baseLevel = model.level;
        const bonusStat = status.totalInt + monster.data.vit;

        return (skillLevel * 200 + bonusStat) * (baseLevel / 100);
      },
    },
    {
      name: 'Cart Cannon',
      label: 'Cart Cannon Lv5',
      value: 'Cart Cannon==5',
      values: ['[Improved 1nd] Cart Cannon==5', '[Improved 2nd] Cart Cannon==5'],
      acd: 0.5,
      fct: 0,
      vct: 3,
      cd: 0,
      isHit100: true,
      isHDefToSDef: true,
      totalHit: () => (isBioloWoodenWarrior(this.summonLv) ? 2 : 1),
      formula: (input: AtkSkillFormulaInput): number => {
        const { skillLevel, model, status, monster, ammoElement } = input;
        const isCannonballNeutral = model.ammo > 0 && (!ammoElement || ammoElement === ElementType.Neutral);
        if (isCannonballNeutral && monster.isElement(ElementType.Ghost)) {
          return 0;
        }

        const baseLevel = model.level;
        const totalInt = status.totalInt;
        const cartModelingLv = this.learnLv('Cart Remodeling');

        return (250 * skillLevel + 20 * skillLevel * cartModelingLv + totalInt * 2) * (baseLevel / 100);
      },
    },
    {
      name: 'Cart Tornado',
      label: 'Cart Tornado Attack Lv10',
      value: 'Cart Tornado==10',
      values: ['[Improved] Cart Tornado==10'],
      acd: 1,
      fct: 0,
      vct: 0,
      cd: 2,
      hit: 3,
      isMelee: true,
      isExcludeCannanball: true,
      formula: (input: AtkSkillFormulaInput): number => {
        const { skillLevel, status } = input;
        const { baseStr } = status;

        const cartModelingLv = this.learnLv('Cart Remodeling');
        const cartWeight = this.bonuses.usedSkillMap.get('Cart Weight') || 0;

        if (isBioloWoodenWarrior(this.summonLv)) {
          return skillLevel * 400 + cartModelingLv * 50 + cartWeight / (150 - baseStr);
        }

        return skillLevel * 200 + cartModelingLv * 50 + cartWeight / (150 - baseStr);
      },
    },
    {
      name: 'Spore Explosion',
      label: 'Spore Explosion Lv10',
      value: 'Spore Explosion==10',
      values: ['[Improved 2nd] Spore Explosion==10'],
      acd: 0.5,
      fct: 0,
      vct: 1.5,
      cd: 5,
      isExcludeCannanball: true,
      formula: (input: AtkSkillFormulaInput): number => {
        const { skillLevel, model, status } = input;
        const baseLevel = model.level;
        const { totalInt } = status;

        if (isBioloWoodenFairy(this.summonLv)) {
          return (400 + 500 * skillLevel + totalInt) * (baseLevel / 100);
        }

        return (400 + 200 * skillLevel) * (baseLevel / 100);
      },
    },
  ];

  private readonly activeSkillList3rd: ActiveSkillModel[] = [
    CartBoost,
    {
      label: 'Cart Weight',
      name: 'Cart Weight',
      inputType: 'dropdown',
      dropdown: [
        { label: '-', value: 0, isUse: false },
        { label: '1000', value: 1000, isUse: true },
        { label: '2000', value: 2000, isUse: true },
        { label: '3000', value: 3000, isUse: true },
        { label: '4000', value: 4000, isUse: true },
        { label: '5000', value: 5000, isUse: true },
        { label: '6000', value: 6000, isUse: true },
        { label: '7000', value: 7000, isUse: true },
        { label: '8000', value: 8000, isUse: true },
        { label: '9000', value: 9000, isUse: true },
        { label: '10000', value: 10000, isUse: true },
        { label: '10500', value: 10500, isUse: true },
      ],
    },
    {
      label: 'Pyroclastic 10',
      name: 'Pyroclastic',
      inputType: 'dropdown',
      isEquipAtk: true,
      dropdown: [
        { label: '-', value: 0, isUse: false },
        { label: 'Lv 100', value: 100, isUse: true, bonus: { atk: 100 + 100 } },
        { label: 'Lv 110', value: 110, isUse: true, bonus: { atk: 100 + 110 } },
        { label: 'Lv 120', value: 120, isUse: true, bonus: { atk: 100 + 120 } },
        { label: 'Lv 130', value: 130, isUse: true, bonus: { atk: 100 + 130 } },
        { label: 'Lv 140', value: 140, isUse: true, bonus: { atk: 100 + 140 } },
        { label: 'Lv 150', value: 150, isUse: true, bonus: { atk: 100 + 150 } },
        { label: 'Lv 160', value: 160, isUse: true, bonus: { atk: 100 + 160 } },
        { label: 'Lv 170', value: 170, isUse: true, bonus: { atk: 100 + 170 } },
        { label: 'Lv 180', value: 180, isUse: true, bonus: { atk: 100 + 180 } },
        { label: 'Lv 190', value: 190, isUse: true, bonus: { atk: 100 + 190 } },
        { label: 'Lv 200', value: 200, isUse: true, bonus: { atk: 100 + 200 } },
      ],
    },
  ];

  private readonly passiveSkillList3rd: PassiveSkillModel[] = [
    {
      label: 'Sword Mastery',
      name: 'Sword Mastery',
      inputType: 'dropdown',
      isMasteryAtk: true,
      dropdown: [
        { label: '-', value: 0, isUse: false },
        {
          label: 'Lv 1',
          value: 1,
          isUse: true,
          bonus: { x_dagger_atk: 10, x_dagger_hit: 1 * 3, x_sword_atk: 10, x_sword_hit: 1 * 3 },
        },
        {
          label: 'Lv 2',
          value: 2,
          isUse: true,
          bonus: { x_dagger_atk: 20, x_dagger_hit: 2 * 3, x_sword_atk: 20, x_sword_hit: 2 * 3 },
        },
        {
          label: 'Lv 3',
          value: 3,
          isUse: true,
          bonus: { x_dagger_atk: 30, x_dagger_hit: 3 * 3, x_sword_atk: 30, x_sword_hit: 3 * 3 },
        },
        {
          label: 'Lv 4',
          value: 4,
          isUse: true,
          bonus: { x_dagger_atk: 40, x_dagger_hit: 4 * 3, x_sword_atk: 40, x_sword_hit: 4 * 3 },
        },
        {
          label: 'Lv 5',
          value: 5,
          isUse: true,
          bonus: { x_dagger_atk: 50, x_dagger_hit: 5 * 3, x_sword_atk: 50, x_sword_hit: 5 * 3 },
        },
      ],
    },
    {
      label: 'Cart Remodeling',
      name: 'Cart Remodeling',
      inputType: 'dropdown',
      dropdown: [
        { label: '-', value: 0, isUse: false },
        { label: 'Lv 1', value: 1, isUse: true, bonus: { weight: 1 * 500 } },
        { label: 'Lv 2', value: 2, isUse: true, bonus: { weight: 2 * 500 } },
        { label: 'Lv 3', value: 3, isUse: true, bonus: { weight: 3 * 500 } },
        { label: 'Lv 4', value: 4, isUse: true, bonus: { weight: 4 * 500 } },
        { label: 'Lv 5', value: 5, isUse: true, bonus: { weight: 5 * 500 } },
      ],
    },
    {
      label: 'Mandragora',
      name: 'Mandragora Howling',
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
    {
      label: 'Cart Cannon',
      name: 'Cart Cannon',
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

  constructor() {
    super();

    this.inheritSkills({
      activeSkillList: this.activeSkillList3rd,
      atkSkillList: this.atkSkillList3rd,
      passiveSkillList: this.passiveSkillList3rd,
      classNames: this.classNames3rd,
    });
  }

  override getMasteryAtk(info: InfoForClass): number {
    const { weapon } = info;
    const weaponType = weapon?.data?.typeName;

    let sum = 0;

    const axeMastery = this.learnLv('Axe Mastery');
    if (weaponType === 'sword' || weaponType === 'axe' || weaponType === 'twohandAxe') {
      sum += axeMastery * 3;
    }

    return sum;
  }

  protected get summonLv() {
    return this.activeSkillLv('_Biolo_Monster_List');
  }
}
