import { ElementType } from '../element-type.const';
import { ClassName } from './_class-name';
import { ActiveSkillModel, AtkSkillModel, CharacterBase, PassiveSkillModel } from './char-class.abstract';
import { Mage } from './mage';

const jobBonusTable: Record<number, [number, number, number, number, number, number]> = {
  '1': [0, 0, 0, 1, 0, 0],
  '2': [0, 0, 0, 2, 0, 0],
  '3': [0, 0, 0, 2, 1, 0],
  '4': [0, 0, 0, 2, 1, 0],
  '5': [0, 0, 0, 2, 1, 0],
  '6': [0, 0, 0, 2, 2, 0],
  '7': [0, 0, 0, 3, 2, 0],
  '8': [0, 1, 0, 3, 2, 0],
  '9': [0, 1, 0, 3, 2, 0],
  '10': [0, 1, 0, 3, 2, 0],
  '11': [0, 1, 0, 3, 2, 0],
  '12': [0, 1, 0, 4, 2, 0],
  '13': [0, 1, 0, 4, 3, 0],
  '14': [0, 1, 0, 4, 3, 0],
  '15': [0, 1, 1, 4, 3, 0],
  '16': [0, 1, 1, 4, 3, 0],
  '17': [0, 1, 1, 4, 3, 0],
  '18': [0, 1, 2, 4, 3, 0],
  '19': [0, 1, 2, 4, 4, 0],
  '20': [0, 2, 2, 4, 4, 0],
  '21': [0, 2, 2, 4, 4, 0],
  '22': [0, 2, 2, 4, 4, 0],
  '23': [0, 2, 2, 5, 4, 0],
  '24': [0, 2, 3, 5, 4, 0],
  '25': [0, 2, 4, 5, 4, 0],
  '26': [0, 2, 4, 5, 4, 0],
  '27': [0, 2, 4, 5, 4, 0],
  '28': [0, 2, 4, 5, 5, 0],
  '29': [0, 3, 4, 5, 5, 0],
  '30': [0, 3, 4, 5, 5, 0],
  '31': [0, 3, 4, 5, 5, 1],
  '32': [0, 3, 4, 5, 5, 1],
  '33': [0, 3, 4, 5, 5, 1],
  '34': [1, 3, 4, 5, 5, 1],
  '35': [1, 3, 4, 6, 5, 1],
  '36': [1, 3, 4, 7, 5, 1],
  '37': [1, 3, 4, 7, 5, 1],
  '38': [1, 3, 4, 7, 5, 1],
  '39': [1, 3, 4, 7, 6, 1],
  '40': [1, 4, 4, 7, 6, 1],
  '41': [1, 4, 4, 8, 6, 1],
  '42': [1, 4, 4, 8, 6, 1],
  '43': [1, 4, 4, 8, 6, 1],
  '44': [1, 4, 4, 9, 6, 1],
  '45': [1, 4, 4, 10, 6, 1],
  '46': [1, 4, 4, 10, 6, 1],
  '47': [1, 5, 4, 10, 6, 1],
  '48': [1, 5, 4, 10, 6, 1],
  '49': [1, 5, 4, 10, 6, 1],
  '50': [1, 5, 4, 11, 6, 1],
  '51': [1, 5, 4, 11, 7, 1],
  '52': [1, 5, 5, 11, 7, 1],
  '53': [1, 5, 5, 11, 7, 2],
  '54': [1, 6, 5, 11, 7, 2],
  '55': [1, 6, 5, 12, 7, 2],
  '56': [1, 6, 5, 12, 7, 2],
  '57': [1, 6, 6, 12, 7, 2],
  '58': [1, 7, 6, 12, 7, 2],
  '59': [1, 7, 6, 12, 8, 2],
  '60': [1, 7, 6, 13, 8, 2],
  '61': [1, 7, 6, 13, 8, 2],
  '62': [1, 7, 6, 13, 8, 2],
  '63': [1, 7, 6, 13, 8, 2],
  '64': [1, 7, 6, 13, 8, 2],
  '65': [1, 7, 7, 14, 8, 3],
};

export class Wizard extends CharacterBase {
  protected readonly CLASS_NAME = ClassName.Wizard;
  protected readonly JobBonusTable = jobBonusTable;

  protected initialStatusPoint = 100;
  protected classNames = ['Hi-Class', 'Wizard', 'Wizard Class', 'Wizard Cls'];
  protected _atkSkillList: AtkSkillModel[] = [
    {
      label: 'Soul Drain',
      name: 'Soul Drain',
      value: 'Soul Drain==10',
      acd: 0,
      fct: 0,
      vct: 0,
      cd: 0,
      isMatk: true,
      levelList: [{ label: 'Lv 10', value: 'Soul Drain==10' }],
      formular: ({ baseLevel, skillLevel }: { baseLevel: number; skillLevel: number }): number => {
        return (95 + skillLevel * 15) * (baseLevel / 100);
      },
    },
    {
      label: 'Napalm Vulcan',
      name: 'Napalm Vulcan',
      value: 'Napalm Vulcan==5',
      fct: 0.3,
      vct: 0.5,
      acd: 0.5,
      cd: 1,
      isMatk: true,
      element: ElementType.Ghost,
      levelList: [{ label: 'Lv 5', value: 'Napalm Vulcan==5' }],
      formular: ({ baseLevel, skillLevel }: { baseLevel: number; skillLevel: number }): number => {
        return skillLevel * 70 * (baseLevel / 100);
      },
    },
    {
      label: "Heaven's Drive",
      name: "Heaven's Drive",
      value: "Heaven's Drive==5",
      fct: 0.8,
      vct: 1.9,
      acd: 0.5,
      cd: 0,
      isMatk: true,
      element: ElementType.Earth,
      levelList: [{ label: 'Lv 5', value: "Heaven's Drive==5" }],
      formular: ({ baseLevel }: { baseLevel: number; skillLevel: number }): number => {
        return 125 * (baseLevel / 100);
      },
    },
  ];
  protected _activeSkillList: ActiveSkillModel[] = [
    {
      inputType: 'dropdown',
      label: 'Mystical Amp',
      name: 'Mystical Amplification',
      isEquipAtk: true,
      dropdown: [
        { label: '-', isUse: false, value: 0 },
        { label: 'Lv 1', isUse: true, value: 1, bonus: { mysticAmp: 5 } },
        { label: 'Lv 2', isUse: true, value: 2, bonus: { mysticAmp: 10 } },
        { label: 'Lv 3', isUse: true, value: 1, bonus: { mysticAmp: 15 } },
        { label: 'Lv 4', isUse: true, value: 2, bonus: { mysticAmp: 20 } },
        { label: 'Lv 5', isUse: true, value: 3, bonus: { mysticAmp: 25 } },
        { label: 'Lv 6', isUse: true, value: 3, bonus: { mysticAmp: 30 } },
        { label: 'Lv 7', isUse: true, value: 4, bonus: { mysticAmp: 35 } },
        { label: 'Lv 8', isUse: true, value: 4, bonus: { mysticAmp: 40 } },
        { label: 'Lv 9', isUse: true, value: 5, bonus: { mysticAmp: 45 } },
        { label: 'Lv 10', isUse: true, value: 5, bonus: { mysticAmp: 50 } },
      ],
    },
  ];
  protected _passiveSkillList: PassiveSkillModel[] = [
    {
      inputType: 'dropdown',
      label: 'Soul Drain',
      name: 'Soul Drain',
      dropdown: [
        { label: '-', isUse: false, value: 0 },
        { label: 'Lv 1', isUse: true, value: 1 },
        { label: 'Lv 2', isUse: true, value: 2 },
        { label: 'Lv 3', isUse: true, value: 1 },
        { label: 'Lv 4', isUse: true, value: 2 },
        { label: 'Lv 5', isUse: true, value: 3 },
        { label: 'Lv 6', isUse: true, value: 3 },
        { label: 'Lv 7', isUse: true, value: 4 },
        { label: 'Lv 8', isUse: true, value: 4 },
        { label: 'Lv 9', isUse: true, value: 5 },
        { label: 'Lv 10', isUse: true, value: 5 },
      ],
    },
    {
      inputType: 'dropdown',
      label: 'Gravitational',
      name: 'Gravitational Field',
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

    this.inheritBaseClass(new Mage());
  }
}
