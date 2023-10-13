import { ElementType } from '../element-type.const';
import { ClassName } from './_class-name';
import { ActiveSkillModel, AtkSkillModel, CharacterBase, PassiveSkillModel } from './char-class.abstract';

const jobBonusTable: Record<number, [number, number, number, number, number, number]> = {
  '1': [0, 0, 0, 0, 0, 0],
  '2': [0, 0, 0, 1, 0, 0],
  '3': [0, 0, 0, 1, 0, 0],
  '4': [0, 0, 0, 1, 0, 0],
  '5': [0, 0, 0, 1, 0, 0],
  '6': [0, 0, 0, 1, 1, 0],
  '7': [0, 0, 0, 1, 1, 0],
  '8': [0, 0, 0, 1, 1, 0],
  '9': [0, 0, 0, 1, 1, 0],
  '10': [0, 0, 0, 1, 2, 0],
  '11': [0, 0, 0, 1, 2, 0],
  '12': [0, 0, 0, 1, 2, 0],
  '13': [0, 0, 0, 1, 2, 0],
  '14': [0, 0, 0, 2, 2, 0],
  '15': [0, 0, 0, 2, 2, 0],
  '16': [0, 0, 0, 2, 2, 0],
  '17': [0, 0, 0, 2, 2, 0],
  '18': [0, 1, 0, 2, 2, 0],
  '19': [0, 1, 0, 2, 2, 0],
  '20': [0, 1, 0, 2, 2, 0],
  '21': [0, 1, 0, 2, 2, 0],
  '22': [0, 1, 0, 3, 2, 0],
  '23': [0, 1, 0, 3, 2, 0],
  '24': [0, 1, 0, 3, 2, 0],
  '25': [0, 1, 0, 3, 2, 0],
  '26': [0, 2, 0, 3, 2, 0],
  '27': [0, 2, 0, 3, 2, 0],
  '28': [0, 2, 0, 3, 2, 0],
  '29': [0, 2, 0, 3, 2, 0],
  '30': [0, 2, 0, 3, 2, 1],
  '31': [0, 2, 0, 3, 2, 1],
  '32': [0, 2, 0, 3, 2, 1],
  '33': [0, 2, 0, 4, 2, 1],
  '34': [0, 2, 0, 4, 2, 1],
  '35': [0, 2, 0, 4, 2, 1],
  '36': [0, 2, 0, 4, 3, 1],
  '37': [0, 2, 0, 4, 3, 1],
  '38': [0, 2, 0, 5, 3, 1],
  '39': [0, 2, 0, 5, 3, 1],
  '40': [0, 3, 0, 5, 3, 1],
  '41': [0, 3, 0, 5, 3, 1],
  '42': [0, 3, 0, 5, 3, 2],
  '43': [0, 3, 0, 5, 3, 2],
  '44': [0, 3, 0, 6, 3, 2],
  '45': [0, 3, 0, 6, 3, 2],
  '46': [0, 3, 0, 7, 3, 2],
  '47': [0, 4, 0, 7, 3, 2],
  '48': [0, 4, 0, 7, 3, 2],
  '49': [0, 4, 0, 7, 3, 3],
  '50': [0, 4, 0, 8, 3, 3],
  '51': [0, 4, 0, 8, 3, 3],
  '52': [0, 4, 0, 8, 3, 3],
  '53': [0, 4, 0, 8, 3, 3],
  '54': [0, 4, 0, 8, 3, 3],
  '55': [0, 4, 0, 8, 3, 3],
  '56': [0, 4, 0, 8, 3, 3],
  '57': [0, 4, 0, 8, 3, 3],
  '58': [0, 4, 0, 8, 3, 3],
  '59': [0, 4, 0, 8, 3, 3],
  '60': [0, 4, 0, 8, 3, 3],
  '61': [0, 4, 0, 8, 3, 3],
  '62': [0, 4, 0, 8, 3, 3],
  '63': [0, 4, 0, 8, 3, 3],
  '64': [0, 4, 0, 8, 3, 3],
  '65': [0, 4, 0, 8, 3, 3],
};

export class Mage extends CharacterBase {
  protected readonly CLASS_NAME = ClassName.Mage;
  protected readonly JobBonusTable = jobBonusTable;

  protected readonly initialStatusPoint = 40;
  protected readonly classNames = ['Mage', 'Mage Class', 'Mage Cls'];
  protected readonly _atkSkillList: AtkSkillModel[] = [
    {
      label: 'Cold Bolt',
      name: 'Cold Bolt',
      acd: 0,
      cd: 0,
      fct: 0,
      vct: 0,
      isMatk: true,
      element: ElementType.Water,
      value: 'Cold Bolt==1',
      formular: (): number => {
        return 100;
      },
      levelList: [{ label: 'Lv 1', value: 'Cold Bolt==1' }],
    },
  ];
  protected readonly _activeSkillList: ActiveSkillModel[] = [];
  protected readonly _passiveSkillList: PassiveSkillModel[] = [];
}
