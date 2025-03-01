import { ClassName } from './_class-name';
import { ActiveSkillModel, AtkSkillFormulaInput, AtkSkillModel, PassiveSkillModel } from './_character-base.abstract';
import { Ninja } from './Ninja';
import { ShadowWarrior } from '../constants/share-active-skills/shadow-warrior';
import { AdditionalBonusInput, InfoForClass } from '../models/info-for-class.model';
import { floor } from '../utils';
import { DistortedCrescent, S16thNight } from '../constants/share-active-skills';
import { IllusionShockFn, PureSoulFn, RighthandMasteryFn, S16thNightFn } from '../constants/share-passive-skills';

const jobBonusTable: Record<number, [number, number, number, number, number, number]> = {
  1: [0, 0, 0, 0, 1, 0],
  2: [0, 0, 0, 0, 1, 0],
  3: [0, 0, 0, 1, 1, 0],
  4: [0, 0, 0, 1, 1, 0],
  5: [0, 1, 0, 1, 1, 0],
  6: [0, 1, 1, 1, 1, 0],
  7: [0, 1, 1, 1, 1, 0],
  8: [1, 1, 1, 1, 1, 0],
  9: [1, 1, 1, 1, 1, 1],
  10: [1, 1, 1, 1, 1, 1],
  11: [1, 1, 1, 1, 2, 1],
  12: [2, 1, 1, 1, 2, 1],
  13: [2, 2, 1, 1, 2, 1],
  14: [2, 2, 1, 1, 2, 1],
  15: [2, 2, 1, 2, 2, 1],
  16: [2, 2, 1, 2, 2, 2],
  17: [2, 2, 2, 2, 2, 2],
  18: [2, 2, 2, 2, 2, 2],
  19: [3, 2, 2, 2, 2, 2],
  20: [3, 2, 2, 2, 3, 2],
  21: [3, 3, 2, 2, 3, 2],
  22: [3, 3, 2, 2, 3, 2],
  23: [3, 3, 2, 2, 3, 3],
  24: [3, 3, 3, 2, 3, 3],
  25: [3, 3, 3, 3, 3, 3],
  26: [3, 3, 3, 3, 3, 3],
  27: [3, 3, 3, 3, 4, 3],
  28: [3, 3, 3, 3, 4, 3],
  29: [3, 4, 3, 3, 4, 3],
  30: [3, 4, 3, 3, 4, 3],
  31: [4, 4, 3, 3, 4, 3],
  32: [4, 4, 3, 4, 4, 3],
  33: [4, 4, 3, 4, 4, 3],
  34: [4, 4, 3, 4, 5, 3],
  35: [4, 4, 3, 5, 5, 3],
  36: [4, 4, 3, 5, 5, 3],
  37: [4, 4, 4, 5, 5, 3],
  38: [4, 4, 4, 5, 6, 3],
  39: [5, 4, 4, 5, 6, 3],
  40: [5, 4, 4, 5, 6, 3],
  41: [5, 5, 4, 5, 6, 3],
  42: [5, 5, 4, 6, 6, 3],
  43: [6, 5, 4, 6, 6, 3],
  44: [6, 5, 4, 6, 6, 3],
  45: [6, 5, 4, 6, 7, 3],
  46: [6, 5, 4, 6, 7, 4],
  47: [6, 6, 4, 6, 7, 4],
  48: [7, 6, 4, 6, 7, 4],
  49: [7, 6, 4, 6, 7, 4],
  50: [7, 6, 4, 6, 8, 4],
  51: [7, 6, 4, 6, 8, 4],
  52: [7, 6, 4, 6, 8, 4],
  53: [7, 6, 4, 6, 8, 4],
  54: [7, 6, 4, 6, 8, 4],
  55: [7, 6, 4, 6, 8, 4],
  56: [7, 6, 4, 6, 8, 4],
  57: [7, 6, 4, 6, 8, 4],
  58: [7, 6, 4, 6, 8, 4],
  59: [7, 6, 4, 6, 8, 4],
  60: [7, 6, 4, 6, 8, 4],
  61: [7, 6, 4, 6, 8, 4],
  62: [7, 6, 4, 6, 8, 4],
  63: [7, 9, 5, 6, 8, 4],
  64: [7, 9, 5, 6, 8, 4],
  65: [7, 9, 5, 6, 8, 4],
  66: [7, 9, 5, 6, 8, 4],
  67: [7, 9, 5, 6, 8, 4],
  68: [7, 9, 5, 6, 8, 4],
  69: [7, 9, 5, 6, 8, 4],
  70: [7, 10, 6, 6, 9, 5],
};

export class Kagerou extends Ninja {
  protected override CLASS_NAME = ClassName.Kagerou;
  protected override JobBonusTable = jobBonusTable;
  protected override initialStatusPoint = 48;

  private readonly classNames2nd = [ClassName.Kagerou];
  private readonly atkSkillList2nd: AtkSkillModel[] = [
    {
      label: 'Cross Slash Lv10',
      name: 'Cross Slash',
      value: 'Cross Slash==10',
      acd: 0,
      fct: 0,
      vct: 0,
      cd: 3.1,
      hit: 2,
      formula: (input: AtkSkillFormulaInput): number => {
        const { model, skillLevel } = input;
        const baseLevel = model.level;
        const bonus = this.isSkillActive('Cross Wound') ? baseLevel * skillLevel : 0;

        return skillLevel * 200 * (baseLevel / 100) + bonus;
      },
    },
    {
      label: 'Kunai Explosion Lv5',
      name: 'Kunai Explosion',
      value: 'Kunai Explosion==5',
      acd: 1,
      fct: 0,
      vct: 2.6,
      cd: 3,
      isHit100: true,
      formula: (input: AtkSkillFormulaInput): number => {
        const {
          model,
          skillLevel,
          status: { totalDex },
        } = input;
        const { level: baseLevel, jobLevel } = model;
        const explosiveKunai = 50;
        const bonusDaggerThrow = 0.4 * this.learnLv('Dagger Throwing Practice');

        return (explosiveKunai + totalDex / 4) * skillLevel * bonusDaggerThrow * (baseLevel / 100) + jobLevel * 10;
      },
    },
    {
      label: 'Kunai Splash Lv5',
      name: 'Kunai Splash',
      value: 'Kunai Splash==5',
      acd: 0.5,
      fct: 0,
      vct: 0,
      cd: 0,
      formula: (input: AtkSkillFormulaInput): number => {
        const { model, skillLevel } = input;
        const baseLevel = model.level;
        const bonusDaggerThrow = 20 * this.learnLv('Dagger Throwing Practice');

        return (skillLevel * 50 + bonusDaggerThrow) * (baseLevel / 100);
      },
    },
    {
      label: 'Swirling Petal Lv10',
      name: 'Swirling Petal',
      value: 'Swirling Petal==10',
      acd: 0.5,
      fct: 0,
      vct: 1.5,
      cd: 3,
      hit: 5,
      formula: (input: AtkSkillFormulaInput): number => {
        const { model, skillLevel, status } = input;
        const baseLevel = model.level;
        const { totalStr } = status;
        const bonusDaggerThrow = 100 * this.learnLv('Throw Huuma Shuriken');

        return (skillLevel * 150 + totalStr * 5 + bonusDaggerThrow) * (baseLevel / 100);
      },
    },
  ];

  private readonly activeSkillList2nd: ActiveSkillModel[] = [
    ShadowWarrior,
    {
      label: '[Debuf] Cross Wound',
      name: 'Cross Wound',
      inputType: 'selectButton',
      dropdown: [
        { label: 'Yes', value: 1, isUse: true },
        { label: 'No', value: 0, isUse: false },
      ],
    },
    S16thNight,
    DistortedCrescent,
  ];

  private readonly passiveSkillList2nd: PassiveSkillModel[] = [
    {
      label: 'Soul Cutter',
      name: 'Soul Cutter',
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
      label: 'Illusion - Shadow',
      name: 'Illusion - Shadow',
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
    IllusionShockFn(),
    RighthandMasteryFn(),
    PureSoulFn(),
    S16thNightFn(),
    {
      label: 'Empty Shadow',
      name: 'Empty Shadow',
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
      activeSkillList: this.activeSkillList2nd,
      atkSkillList: this.atkSkillList2nd,
      passiveSkillList: this.passiveSkillList2nd,
      classNames: this.classNames2nd,
    });
  }

  override getMasteryAtk(info: InfoForClass): number {
    return this.calcHiddenMasteryAtk(info).totalAtk;
  }

  override getMasteryMatk(info: InfoForClass): number {
    const _16Night = this.activeSkillLv('16th Night');
    if (_16Night <= 0) return 0;

    const { model } = info;

    return floor((model.jobLevel * _16Night) / 2);
  }

  override setAdditionalBonus(params: AdditionalBonusInput) {
    const { totalBonus, model } = params;
    if (this.isSkillActive('Distorted Crescent')) {
      const bonus = floor(model.level / 3) + 100;
      totalBonus.atk += bonus;
      totalBonus.matk += bonus;
    }

    return totalBonus;
  }
}
