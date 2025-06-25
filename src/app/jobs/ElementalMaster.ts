import { JOB_4_MAX_JOB_LEVEL, JOB_4_MIN_MAX_LEVEL } from '../app-config';
import { ElementType, ElementalMasterSpirit } from '../constants';
import { SKILL_NAME } from '../constants/skill-name';
import { EquipmentSummaryModel } from '../models/equipment-summary.model';
import { AdditionalBonusInput } from '../models/info-for-class.model';
import { addBonus, genSkillList } from '../utils';
import { Sorcerer } from './Sorcerer';
import { ActiveSkillModel, AtkSkillFormulaInput, AtkSkillModel, PassiveSkillModel } from './_character-base.abstract';
import { ClassName } from './_class-name';

const jobBonusTable: Record<number, [number, number, number, number, number, number]> = {
  1: [0, 0, 0, 1, 0, 0],
  2: [0, 0, 0, 2, 1, 0],
  3: [0, 0, 1, 2, 2, 0],
  4: [1, 0, 2, 2, 2, 0],
  5: [1, 0, 2, 3, 2, 0],
  6: [1, 0, 2, 4, 2, 0],
  7: [1, 1, 2, 4, 2, 0],
  8: [1, 1, 2, 5, 2, 0],
  9: [2, 1, 2, 5, 2, 0],
  10: [2, 1, 2, 5, 3, 0],
  11: [2, 1, 2, 6, 3, 0],
  12: [2, 1, 3, 6, 3, 0],
  13: [2, 1, 3, 6, 4, 0],
  14: [2, 1, 4, 7, 4, 0],
  15: [2, 1, 4, 8, 4, 0],
  16: [2, 1, 5, 8, 4, 0],
  17: [2, 1, 5, 8, 4, 1],
  18: [2, 1, 5, 9, 4, 1],
  19: [2, 1, 5, 9, 5, 2],
  20: [2, 2, 5, 9, 5, 3],
  21: [2, 3, 5, 10, 5, 3],
  22: [2, 3, 5, 10, 6, 3],
  23: [2, 3, 6, 10, 6, 3],
  24: [3, 3, 6, 10, 7, 3],
  25: [3, 3, 6, 10, 7, 4],
  26: [3, 3, 6, 10, 7, 4],
  27: [3, 3, 7, 10, 7, 4],
  28: [3, 3, 7, 11, 7, 4],
  29: [3, 3, 8, 11, 7, 4],
  30: [3, 3, 8, 11, 8, 5],
  31: [3, 4, 8, 12, 8, 5],
  32: [3, 4, 8, 12, 8, 5],
  33: [3, 4, 8, 13, 8, 5],
  34: [3, 4, 8, 13, 9, 5],
  35: [4, 4, 8, 13, 9, 5],
  36: [4, 4, 8, 13, 9, 5],
  37: [4, 4, 8, 13, 9, 5],
  38: [4, 4, 8, 13, 9, 5],
  39: [4, 4, 8, 13, 9, 5],
  40: [4, 4, 8, 13, 9, 5],
  41: [4, 4, 8, 13, 9, 5],
  42: [4, 4, 8, 13, 9, 5],
  43: [4, 4, 8, 13, 9, 5],
  44: [4, 4, 8, 13, 9, 5],
  45: [4, 4, 8, 13, 9, 5],
  46: [4, 4, 8, 13, 9, 5],
  47: [4, 4, 8, 13, 9, 5],
  48: [4, 4, 8, 13, 9, 5],
  49: [4, 4, 8, 13, 9, 5],
  50: [4, 4, 8, 13, 9, 5],
  51: [4, 4, 8, 13, 9, 5],
  52: [4, 4, 8, 13, 9, 5],
  53: [4, 4, 8, 13, 9, 5],
  54: [4, 4, 8, 13, 9, 5],
  55: [4, 4, 8, 13, 9, 5],
  56: [4, 4, 8, 13, 9, 5],
  57: [4, 4, 8, 13, 9, 5],
  58: [4, 4, 8, 13, 9, 5],
  59: [4, 4, 8, 13, 9, 5],
  60: [4, 4, 8, 13, 9, 5],
  61: [4, 4, 8, 13, 9, 5],
  62: [4, 4, 8, 13, 9, 5],
  63: [4, 4, 8, 13, 9, 5],
  64: [4, 4, 8, 13, 9, 5],
  65: [4, 4, 8, 13, 9, 5],
  66: [4, 4, 8, 13, 9, 5],
  67: [4, 4, 8, 13, 9, 5],
  68: [4, 4, 8, 13, 9, 5],
  69: [4, 4, 8, 13, 9, 5],
  70: [4, 4, 8, 13, 9, 5],
};

const traitBonusTable: Record<number, [number, number, number, number, number, number]> = {
  1: [0, 0, 0, 1, 0, 0],
  2: [0, 0, 0, 1, 0, 0],
  3: [0, 0, 0, 1, 0, 0],
  4: [0, 0, 0, 1, 0, 0],
  5: [0, 0, 0, 2, 0, 0],
  6: [1, 0, 0, 2, 0, 0],
  7: [1, 0, 0, 3, 0, 0],
  8: [1, 0, 0, 3, 0, 0],
  9: [1, 0, 0, 3, 1, 0],
  10: [1, 0, 0, 3, 1, 1],
  11: [1, 0, 0, 3, 1, 1],
  12: [1, 0, 0, 3, 1, 1],
  13: [1, 0, 0, 3, 1, 1],
  14: [1, 0, 0, 3, 1, 1],
  15: [2, 0, 0, 3, 1, 1],
  16: [2, 0, 0, 3, 1, 1],
  17: [2, 0, 0, 3, 1, 1],
  18: [3, 0, 0, 3, 1, 1],
  19: [3, 0, 0, 3, 1, 1],
  20: [3, 0, 0, 3, 1, 1],
  21: [3, 0, 0, 3, 1, 1],
  22: [3, 0, 1, 3, 1, 1],
  23: [3, 0, 1, 3, 1, 1],
  24: [3, 0, 1, 3, 1, 1],
  25: [3, 1, 1, 3, 1, 1],
  26: [3, 1, 1, 3, 2, 1],
  27: [3, 2, 1, 3, 2, 1],
  28: [3, 2, 1, 3, 2, 1],
  29: [3, 2, 1, 3, 2, 1],
  30: [3, 2, 1, 3, 2, 1],
  31: [3, 2, 1, 3, 2, 1],
  32: [3, 2, 1, 4, 2, 1],
  33: [3, 2, 1, 4, 2, 1],
  34: [3, 2, 1, 4, 2, 1],
  35: [3, 2, 1, 4, 2, 1],
  36: [3, 2, 1, 5, 2, 1],
  37: [3, 2, 1, 5, 3, 1],
  38: [3, 2, 1, 5, 3, 2],
  39: [3, 2, 1, 5, 4, 3],
  40: [3, 2, 1, 5, 5, 3],
  41: [3, 2, 2, 6, 5, 3],
  42: [3, 2, 2, 7, 5, 3],
  43: [3, 2, 3, 7, 5, 3],
  44: [3, 3, 3, 7, 5, 3],
  45: [3, 4, 4, 7, 5, 3],
  46: [3, 4, 5, 7, 5, 3],
  47: [3, 5, 5, 8, 5, 3],
  48: [3, 5, 5, 9, 5, 3],
  49: [3, 6, 5, 9, 5, 3],
  50: [3, 6, 6, 10, 5, 3],
  51: [3, 6, 6, 11, 5, 3],
  52: [3, 7, 6, 11, 5, 3],
  53: [3, 8, 6, 11, 5, 3],
  54: [3, 8, 7, 11, 5, 3],
  55: [3, 8, 7, 12, 5, 3],
  56: [3, 8, 8, 12, 5, 3],
  57: [3, 8, 8, 12, 5, 3],
  58: [3, 8, 8, 12, 5, 3],
  59: [3, 8, 8, 12, 6, 3],
  60: [3, 8, 8, 12, 6, 3],
  61: [3, 8, 8, 12, 6, 3],
  62: [3, 8, 8, 12, 6, 3],
  63: [3, 8, 8, 12, 6, 3],
  64: [3, 8, 8, 12, 6, 3],
  65: [3, 8, 8, 12, 6, 3],
  66: [3, 8, 8, 12, 6, 3],
  67: [3, 8, 8, 12, 6, 3],
  68: [3, 8, 8, 12, 6, 3],
  69: [3, 8, 8, 12, 6, 3],
  70: [3, 8, 8, 12, 6, 3],
};

export class ElementalMaster extends Sorcerer {
  protected override CLASS_NAME = ClassName.ElementalMaster;
  protected override JobBonusTable = jobBonusTable;
  protected override TraitBonusTable = traitBonusTable;

  protected override minMaxLevel = JOB_4_MIN_MAX_LEVEL;
  protected override maxJob = JOB_4_MAX_JOB_LEVEL;

  private readonly _spirit = {
    1: 'Divulio',
    2: 'Ardor',
    3: 'Procella',
    4: 'Terramotus',
    5: 'Serpens',
  } as const;

  private readonly classNames4th = [ClassName.Only_4th, ClassName.ElementalMaster];
  private readonly atkSkillList4th: AtkSkillModel[] = [
    {
      name: 'Diamond Storm',
      label: '[V3] Diamond Storm Lv5',
      value: 'Diamond Storm==5',
      acd: 0.5,
      fct: 1.5,
      vct: 5,
      cd: 1,
      hit: 5,
      isMatk: true,
      element: ElementType.Water,
      formula: (input: AtkSkillFormulaInput): number => {
        const { model, skillLevel, status } = input;
        const { totalSpl } = status;
        const { level: baseLevel } = model;

        if (this.isSpirit('Divulio')) {
          return (5400 + skillLevel * 1800 + totalSpl * 10) * (baseLevel / 100);
        }

        return (400 + skillLevel * 1550 + totalSpl * 5) * (baseLevel / 100);
      },
    },
    {
      name: 'Conflagration',
      label: '[V3] Conflagration Lv5',
      value: 'Conflagration==5',
      acd: 0.5,
      fct: 1.5,
      vct: 5,
      cd: 2,
      isMatk: true,
      element: ElementType.Fire,
      totalHit: 10,
      formula: (input: AtkSkillFormulaInput): number => {
        const { model, skillLevel, status } = input;
        const { totalSpl } = status;
        const { level: baseLevel } = model;

        if (this.isSpirit('Ardor')) {
          return (500 + skillLevel * 1050 + totalSpl * 7) * (baseLevel / 100);
        }

        return (500 + skillLevel * 650 + totalSpl * 5) * (baseLevel / 100);
      },
    },
    {
      name: 'Lightning Land',
      label: '[V3] Lightning Land Lv5',
      value: 'Lightning Land==5',
      acd: 0.5,
      fct: 1.5,
      vct: 5,
      cd: 2,
      isMatk: true,
      element: ElementType.Wind,
      totalHit: 10,
      formula: (input: AtkSkillFormulaInput): number => {
        const { model, skillLevel, status } = input;
        const { totalSpl } = status;
        const { level: baseLevel } = model;

        if (this.isSpirit('Procella')) {
          return (500 + skillLevel * 1050 + totalSpl * 7) * (baseLevel / 100);
        }

        return (500 + skillLevel * 650 + totalSpl * 5) * (baseLevel / 100);
      },
    },
    {
      name: 'Terra Drive',
      label: '[V3] Terra Drive Lv5',
      value: 'Terra Drive==5',
      acd: 0.5,
      fct: 1.5,
      vct: 5,
      cd: 2,
      hit: 5,
      isMatk: true,
      element: ElementType.Earth,
      formula: (input: AtkSkillFormulaInput): number => {
        const { model, skillLevel, status } = input;
        const { totalSpl } = status;
        const { level: baseLevel } = model;

        if (this.isSpirit('Terramotus')) {
          return (5400 + skillLevel * 1800 + totalSpl * 10) * (baseLevel / 100);
        }

        return (400 + skillLevel * 1500 + totalSpl * 5) * (baseLevel / 100);
      },
    },
    {
      name: 'Venom Swamp',
      label: '[V3] Venom Swamp Lv5',
      value: 'Venom Swamp==5',
      acd: 0.5,
      fct: 1.5,
      vct: 5,
      cd: 2,
      isMatk: true,
      element: ElementType.Poison,
      totalHit: 10,
      formula: (input: AtkSkillFormulaInput): number => {
        const { model, skillLevel, status } = input;
        const { totalSpl } = status;
        const { level: baseLevel } = model;

        if (this.isSpirit('Serpens')) {
          return (500 + skillLevel * 1050 + totalSpl * 7) * (baseLevel / 100);
        }

        return (500 + skillLevel * 650 + totalSpl * 5) * (baseLevel / 100);
      },
    },
    {
      name: 'Elemental Buster',
      label: '[V3] Elemental Buster Lv10',
      value: 'Elemental Buster==10',
      acd: 0.5,
      fct: 1.5,
      vct: 4,
      cd: 5,
      isMatk: true,
      hit: 3,
      getElement: () => {
        const spiritLv = this.activeSkillLv('_ElementalMaster_spirit');

        return ElementalMasterSpirit[spiritLv] ?? ElementType.Neutral;
      },
      formula: (input: AtkSkillFormulaInput): number => {
        const { model, skillLevel, status, monster } = input;
        const { totalSpl } = status;
        const { level: baseLevel } = model;
        const raceBonus = monster.isRace('dragon', 'formless') ? 150 : 0;

        return (500 + skillLevel * (2200 + raceBonus) + totalSpl * 10) * (baseLevel / 100);
      },
    },
  ];
  private readonly activeSkillList4th: ActiveSkillModel[] = [
    {
      name: '_ElementalMaster_spirit',
      label: 'Master spirit',
      inputType: 'dropdown',
      dropdown: [
        { label: '-', value: 0, isUse: false },
        { label: this._spirit[1], value: 1, isUse: true },
        { label: this._spirit[2], value: 2, isUse: true },
        { label: this._spirit[3], value: 3, isUse: true },
        { label: this._spirit[4], value: 4, isUse: true },
        { label: this._spirit[5], value: 5, isUse: true },
      ],
    },
  ];
  private readonly passiveSkillList4th: PassiveSkillModel[] = [
    {
      name: 'Magic Book Mastery',
      label: 'Magic Book Mastery',
      inputType: 'dropdown',
      dropdown: genSkillList(10),
    },
    // {
    //   name: 'Elemental Spirit Mastery',
    //   label: 'Elemental Spirit',
    //   inputType: 'dropdown',
    //   dropdown: genSkillList(10)
    // },
  ];

  constructor() {
    super();

    this.inheritSkills({
      activeSkillList: this.activeSkillList4th,
      atkSkillList: this.atkSkillList4th,
      passiveSkillList: this.passiveSkillList4th,
      classNames: this.classNames4th,
    });
  }

  override setAdditionalBonus(params: AdditionalBonusInput): EquipmentSummaryModel {
    super.setAdditionalBonus(params);

    const { totalBonus, weapon } = params;

    const magicBookLv = this.learnLv('Magic Book Mastery');
    if (magicBookLv > 0 && weapon.isType('book')) {
      addBonus(totalBonus, 'm_my_element_water', magicBookLv);
      addBonus(totalBonus, 'm_my_element_wind', magicBookLv);
      addBonus(totalBonus, 'm_my_element_earth', magicBookLv);
      addBonus(totalBonus, 'm_my_element_fire', magicBookLv);
      addBonus(totalBonus, 'm_my_element_poison', magicBookLv);
    }

    this.setSpiritBonus(totalBonus);

    return totalBonus;
  }

  private setSpiritBonus(totalBonus: EquipmentSummaryModel) {
    const spiritName = this.spiritName;
    const mapSkill: Record<typeof spiritName, [SKILL_NAME, number]> = {
      Divulio: ['Cold Bolt', 100],
      Ardor: ['Fire Bolt', 100],
      Procella: ['Lightening Bolt', 100],
      Terramotus: ['Earth Spike', 80],
      Serpens: ['Kiling Cloud', 50],
    };
    const mapMyEle: Record<typeof spiritName, keyof typeof totalBonus> = {
      Divulio: 'm_my_element_water',
      Ardor: 'm_my_element_fire',
      Procella: 'm_my_element_wind',
      Terramotus: 'm_my_element_earth',
      Serpens: 'm_my_element_poison',
    };

    if (mapSkill[spiritName]) {
      const [skillName, bonus] = mapSkill[spiritName];
      addBonus(totalBonus, skillName as any, bonus);
    }
    if (mapMyEle[spiritName]) {
      addBonus(totalBonus, mapMyEle[spiritName], 10);
    }
  }

  private get spiritName(): (typeof this._spirit)[keyof typeof this._spirit] {
    const spirit = this.activeSkillLv('_ElementalMaster_spirit');

    return this._spirit[spirit];
  }

  private isSpirit(name: typeof this.spiritName) {
    return this.spiritName === name;
  }
}
