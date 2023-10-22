import { ElementType } from '../constants/element-type.const';
import { InfoForClass } from '../models/info-for-class.model';
import { ClassName } from './_class-name';
import {
  ActiveSkillModel,
  AtkSkillFormulaInput,
  AtkSkillModel,
  CharacterBase,
  PassiveSkillModel,
} from './_character-base.abstract';
import { Sage } from './sage';

const jobBonusTable: Record<number, [number, number, number, number, number, number]> = {
  '1': [0, 0, 0, 1, 0, 0],
  '2': [0, 0, 0, 2, 0, 0],
  '3': [0, 0, 0, 2, 1, 0],
  '4': [0, 0, 1, 2, 1, 0],
  '5': [0, 0, 1, 3, 1, 0],
  '6': [0, 0, 1, 3, 1, 0],
  '7': [0, 0, 1, 3, 1, 0],
  '8': [0, 0, 1, 3, 1, 0],
  '9': [0, 0, 1, 3, 1, 0],
  '10': [1, 0, 1, 3, 1, 0],
  '11': [2, 0, 1, 3, 1, 0],
  '12': [2, 0, 1, 4, 1, 0],
  '13': [2, 0, 1, 5, 1, 0],
  '14': [2, 0, 2, 5, 1, 0],
  '15': [2, 0, 2, 5, 2, 0],
  '16': [2, 0, 2, 5, 2, 0],
  '17': [2, 0, 2, 5, 2, 0],
  '18': [2, 0, 2, 5, 2, 0],
  '19': [2, 0, 2, 5, 3, 0],
  '20': [2, 1, 2, 5, 3, 0],
  '21': [2, 2, 2, 5, 3, 0],
  '22': [2, 2, 2, 6, 3, 0],
  '23': [2, 2, 3, 6, 3, 0],
  '24': [2, 2, 3, 6, 4, 0],
  '25': [2, 2, 3, 6, 4, 0],
  '26': [2, 2, 3, 6, 4, 0],
  '27': [2, 2, 3, 6, 4, 0],
  '28': [2, 2, 3, 6, 4, 0],
  '29': [2, 2, 3, 6, 4, 0],
  '30': [2, 2, 3, 7, 4, 0],
  '31': [2, 2, 3, 7, 5, 0],
  '32': [2, 2, 4, 7, 5, 0],
  '33': [3, 2, 4, 7, 5, 0],
  '34': [3, 2, 4, 7, 5, 0],
  '35': [3, 2, 4, 7, 5, 0],
  '36': [3, 2, 4, 7, 5, 0],
  '37': [3, 2, 4, 7, 5, 0],
  '38': [3, 2, 4, 7, 5, 0],
  '39': [3, 2, 4, 8, 5, 0],
  '40': [3, 2, 4, 8, 6, 0],
  '41': [3, 3, 4, 8, 6, 0],
  '42': [3, 3, 4, 8, 6, 0],
  '43': [3, 3, 4, 8, 6, 0],
  '44': [3, 3, 4, 8, 7, 0],
  '45': [3, 3, 5, 8, 7, 0],
  '46': [3, 3, 5, 9, 7, 0],
  '47': [3, 3, 5, 9, 7, 1],
  '48': [3, 3, 5, 9, 7, 2],
  '49': [3, 3, 5, 9, 7, 3],
  '50': [3, 3, 5, 10, 7, 3],
  '51': [3, 3, 5, 10, 8, 3],
  '52': [3, 3, 5, 10, 8, 3],
  '53': [4, 3, 5, 10, 8, 3],
  '54': [4, 3, 5, 10, 8, 3],
  '55': [4, 4, 5, 10, 8, 3],
  '56': [4, 4, 5, 10, 8, 3],
  '57': [4, 4, 6, 10, 8, 3],
  '58': [4, 4, 6, 10, 8, 3],
  '59': [4, 4, 6, 10, 9, 3],
  '60': [4, 4, 6, 11, 9, 3],
  '61': [4, 4, 6, 11, 9, 3],
  '62': [4, 4, 6, 11, 9, 3],
  '63': [4, 4, 6, 11, 9, 3],
  '64': [4, 4, 6, 11, 9, 3],
  '65': [4, 4, 7, 12, 9, 4],
};

export class Sorcerer extends CharacterBase {
  protected readonly CLASS_NAME = ClassName.Sorcerer;
  protected readonly JobBonusTable = jobBonusTable;

  protected readonly initialStatusPoint = 100;
  protected readonly classNames = ['Only 3rd Cls', 'Sorcerer', 'Sorcerer Cls', 'Sorcerer Class'];
  protected readonly _atkSkillList: AtkSkillModel[] = [
    {
      name: 'Diamond Dust',
      label: 'Diamond Dust Lv 5',
      value: 'Diamond Dust==5',
      fct: 0,
      vct: 7,
      cd: 5,
      acd: 1,
      element: ElementType.Water,
      isMatk: true,
      levelList: [],
      formular: (input: AtkSkillFormulaInput): number => {
        const { model, skillLevel, status } = input;
        const baseLevel = model.level;
        const totalInt = status.totalInt;
        const learnedLv = this.learnSkillMap.get('Lightning Loader') || 0;

        // return ((skillLevel + 2) * totalInt + learnedLv * 300) * (baseLevel / 100); Rebalance
        return (skillLevel * totalInt + learnedLv * 200) * (baseLevel / 100);
      },
    },
    {
      name: 'Earth Grave',
      label: 'Earth Grave Lv 5',
      value: 'Earth Grave==5',
      fct: 1,
      vct: 3,
      cd: 5,
      acd: 1,
      element: ElementType.Earth,
      isMatk: true,
      levelList: [],
      formular: (input: AtkSkillFormulaInput): number => {
        const { model, skillLevel, status } = input;
        const baseLevel = model.level;
        const totalInt = status.totalInt;
        const learnedLv = this.learnSkillMap.get('Seismic Weapon') || 0;

        // return ((skillLevel + 2) * totalInt + learnedLv * 300) * (baseLevel / 100); Rebalance
        return (skillLevel * totalInt + learnedLv * 200) * (baseLevel / 100);
      },
    },
    {
      name: 'Psychic Wave',
      label: 'Psychic Wave Lv5',
      value: 'Psychic Wave==5',
      fct: 0.6,
      vct: 12,
      cd: 5,
      acd: 1,
      element: ElementType.Neutral,
      totalHit: 7,
      isMatk: true,
      levelList: [],
      formular: (input: AtkSkillFormulaInput): number => {
        const { model, skillLevel, status } = input;
        const baseLevel = model.level;
        const totalInt = status.totalInt;

        return (70 * skillLevel + 3 * totalInt) * (baseLevel / 100);
      },
    },
    {
      name: 'Varetyr Spear',
      label: 'Varetyr Spear Lv10',
      value: 'Varetyr Spear==10',
      fct: 1,
      vct: 4,
      cd: 5,
      acd: 1,
      element: ElementType.Wind,
      isMatk: true,
      levelList: [],
      formular: (input: AtkSkillFormulaInput): number => {
        const { model, skillLevel, status } = input;
        const baseLevel = model.level;
        const totalInt = status.totalInt;
        const strikingLvl = this.learnSkillMap.get('Striking') || 0;
        const endowLvl = this.learnSkillMap.get('Endow Tornado') || 0;

        // return (((skillLevel + 2) * totalInt) / 2 + (strikingLvl + endowLvl) * 150) * (baseLevel / 100); Rebalance
        return ((skillLevel * totalInt) / 2 + (strikingLvl + endowLvl) * 120) * (baseLevel / 100);
      },
    },
  ];
  protected readonly _activeSkillList: ActiveSkillModel[] = [];
  protected readonly _passiveSkillList: PassiveSkillModel[] = [
    {
      inputType: 'dropdown',
      label: 'Striking',
      name: 'Striking',
      dropdown: [
        { label: '-', isUse: false, value: 0 },
        { label: 'Lv 1', isUse: true, value: 1 },
        { label: 'Lv 2', isUse: true, value: 2 },
        { label: 'Lv 3', isUse: true, value: 3 },
        { label: 'Lv 4', isUse: true, value: 4 },
        { label: 'Lv 5', isUse: true, value: 5 },
      ],
    },
  ];

  constructor() {
    super();

    this.inheritBaseClass(new Sage());
  }

  override getMasteryAtk(params: InfoForClass): number {
    if (!this.bonuses?.masteryAtks) return 0;

    const { weapon } = params;
    const { typeName } = weapon.data;

    let atk = 0;
    for (const [_skillName, bonus] of Object.entries(this.bonuses.masteryAtks)) {
      atk += bonus[`${typeName}_atk`] || 0;
    }

    return atk;
  }

  override setAdditionalBonus(params: InfoForClass) {
    if (!this.bonuses?.masteryAtks) return params.totalBonus;

    const { totalBonus, weapon } = params;
    const { typeName } = weapon.data;

    const { masteryAtks, equipAtks } = this.bonuses;

    let aspdPercent = 0;
    for (const [_skillName, bonus] of Object.entries({ ...masteryAtks, ...equipAtks })) {
      aspdPercent += bonus[`${typeName}_aspdPercent`] || 0;
    }
    totalBonus['aspdPercent'] += aspdPercent;

    return totalBonus;
  }
}
