import { ClassName } from './_class-name';
import { AssassinCross } from './assassin-cross';
import {
  ActiveSkillModel,
  AtkSkillFormulaInput,
  AtkSkillModel,
  CharacterBase,
  PassiveSkillModel,
} from './_character-base.abstract';
import { InfoForClass } from '../models/info-for-class.model';
import { DarkClaw } from '../constants/share-active-skills';

const jobBonusTable: Record<number, [number, number, number, number, number, number]> = {
  '1': [0, 1, 0, 0, 0, 0],
  '2': [0, 1, 0, 0, 1, 0],
  '3': [0, 1, 0, 0, 1, 0],
  '4': [1, 1, 0, 0, 1, 0],
  '5': [2, 1, 0, 0, 1, 0],
  '6': [2, 1, 0, 0, 1, 0],
  '7': [2, 1, 0, 0, 1, 0],
  '8': [2, 1, 0, 0, 1, 0],
  '9': [3, 1, 0, 0, 1, 0],
  '10': [3, 2, 0, 0, 1, 0],
  '11': [3, 2, 0, 0, 2, 0],
  '12': [3, 2, 0, 0, 2, 0],
  '13': [3, 2, 0, 0, 2, 0],
  '14': [3, 2, 1, 0, 2, 0],
  '15': [3, 2, 2, 0, 2, 0],
  '16': [4, 2, 2, 0, 2, 0],
  '17': [4, 2, 2, 0, 2, 0],
  '18': [4, 2, 2, 0, 2, 0],
  '19': [4, 2, 3, 0, 2, 0],
  '20': [5, 2, 3, 0, 2, 0],
  '21': [5, 2, 3, 0, 2, 0],
  '22': [5, 2, 3, 0, 2, 0],
  '23': [5, 3, 3, 0, 2, 0],
  '24': [5, 4, 3, 0, 2, 0],
  '25': [5, 4, 3, 0, 3, 0],
  '26': [5, 4, 3, 0, 3, 0],
  '27': [5, 4, 3, 0, 3, 0],
  '28': [5, 4, 3, 1, 3, 0],
  '29': [5, 4, 3, 2, 3, 0],
  '30': [6, 4, 3, 2, 3, 0],
  '31': [6, 4, 4, 2, 3, 0],
  '32': [6, 4, 4, 2, 3, 0],
  '33': [6, 4, 4, 2, 3, 0],
  '34': [6, 4, 4, 2, 3, 0],
  '35': [6, 5, 4, 2, 3, 0],
  '36': [6, 5, 4, 2, 4, 0],
  '37': [6, 5, 4, 2, 5, 0],
  '38': [6, 5, 4, 2, 5, 0],
  '39': [6, 5, 4, 2, 5, 0],
  '40': [6, 5, 4, 2, 5, 0],
  '41': [6, 5, 4, 3, 5, 0],
  '42': [6, 5, 5, 3, 5, 0],
  '43': [6, 6, 5, 3, 5, 0],
  '44': [6, 7, 5, 3, 5, 0],
  '45': [6, 7, 5, 3, 5, 0],
  '46': [6, 7, 5, 3, 5, 0],
  '47': [6, 7, 5, 3, 5, 0],
  '48': [6, 7, 5, 4, 5, 0],
  '49': [6, 7, 5, 4, 6, 0],
  '50': [6, 7, 5, 4, 7, 0],
  '51': [6, 7, 5, 4, 7, 1],
  '52': [7, 7, 5, 4, 7, 1],
  '53': [7, 8, 5, 4, 7, 1],
  '54': [7, 8, 6, 4, 7, 1],
  '55': [7, 8, 6, 4, 7, 1],
  '56': [7, 8, 6, 5, 7, 1],
  '57': [7, 8, 6, 5, 7, 1],
  '58': [8, 8, 6, 5, 7, 1],
  '59': [8, 8, 6, 5, 7, 2],
  '60': [8, 9, 6, 5, 7, 2],
  '61': [8, 9, 6, 5, 7, 2],
  '62': [8, 9, 6, 5, 8, 2],
  '63': [8, 9, 6, 5, 8, 2],
  '64': [8, 9, 6, 5, 8, 3],
  '65': [8, 10, 6, 5, 8, 3],
};

export class GitCross extends CharacterBase {
  protected readonly CLASS_NAME = ClassName.GuillotineCross;
  protected readonly JobBonusTable = jobBonusTable;

  protected initialStatusPoint = 100;
  protected classNames = ['Guillotine Cross', 'Guillotine Cross Class', 'Guillotine Cross Cls', 'Only 3rd Cls'];
  protected _atkSkillList: AtkSkillModel[] = [
    {
      label: 'Rolling Cutter Lv5',
      name: 'Rolling Cutter',
      value: 'Rolling Cutter==5',
      acd: 0.2,
      fct: 0,
      vct: 0,
      cd: 0,
      isMelee: true,
      levelList: [],
      formula: (input: AtkSkillFormulaInput): number => {
        const { model, skillLevel } = input;
        const baseLevel = model.level;

        return (50 + skillLevel * 50) * (baseLevel / 100);
      },
    },
    {
      label: 'Cross Impact Lv5',
      name: 'Cross Impact',
      value: 'Cross Impact==5',
      acd: 0.5,
      fct: 0,
      vct: 0,
      cd: 0,
      isMelee: true,
      hit: 7,
      levelList: [],
      formula: (input: AtkSkillFormulaInput): number => {
        const { model, skillLevel } = input;
        const baseLevel = model.level;

        return (1000 + skillLevel * 100) * (baseLevel / 100);
      },
    },
  ];
  protected _activeSkillList: ActiveSkillModel[] = [DarkClaw];
  protected _passiveSkillList: PassiveSkillModel[] = [];

  constructor() {
    super();

    this.inheritBaseClass(new AssassinCross());
  }

  override getMasteryAtk(info: InfoForClass): number {
    if (!info.weapon?.data) return 0;

    const { typeName } = info.weapon.data;

    return this.calcHiddenMasteryAtk(info, { prefix: `x_${typeName}` }).totalAtk;
  }
}
