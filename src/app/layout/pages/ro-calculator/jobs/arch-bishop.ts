import { ElementType } from '../element-type.const';
import { Weapon } from '../weapon';
import { ClassName } from './_class-name';
import {
  ActiveSkillModel,
  AtkSkillFormulaInput,
  AtkSkillModel,
  CharacterBase,
  PassiveSkillModel,
} from './char-class.abstract';

const jobBonusTable: Record<number, [number, number, number, number, number, number]> = {
  '1': [0, 0, 0, 1, 0, 0],
  '2': [0, 0, 0, 1, 0, 0],
  '3': [0, 0, 1, 1, 0, 0],
  '4': [0, 0, 1, 1, 0, 0],
  '5': [0, 0, 1, 1, 1, 0],
  '6': [0, 0, 1, 1, 1, 0],
  '7': [0, 0, 1, 2, 1, 0],
  '8': [0, 0, 1, 3, 1, 0],
  '9': [0, 0, 1, 3, 1, 0],
  '10': [0, 0, 2, 3, 1, 0],
  '11': [0, 0, 3, 3, 1, 0],
  '12': [0, 0, 3, 3, 1, 0],
  '13': [0, 0, 3, 3, 1, 0],
  '14': [0, 0, 3, 3, 2, 0],
  '15': [0, 0, 3, 3, 3, 0],
  '16': [0, 0, 3, 3, 3, 0],
  '17': [0, 0, 3, 3, 3, 0],
  '18': [1, 0, 3, 3, 3, 0],
  '19': [2, 0, 3, 3, 3, 0],
  '20': [2, 0, 3, 3, 3, 0],
  '21': [2, 0, 3, 3, 3, 0],
  '22': [2, 0, 3, 4, 3, 0],
  '23': [2, 0, 3, 4, 3, 0],
  '24': [3, 0, 3, 4, 3, 0],
  '25': [3, 0, 3, 4, 3, 0],
  '26': [3, 1, 3, 4, 3, 0],
  '27': [3, 2, 3, 4, 3, 0],
  '28': [4, 2, 3, 4, 3, 0],
  '29': [4, 2, 3, 4, 3, 0],
  '30': [4, 2, 3, 4, 3, 0],
  '31': [4, 2, 3, 4, 3, 0],
  '32': [4, 2, 3, 5, 3, 0],
  '33': [4, 2, 3, 5, 3, 0],
  '34': [4, 2, 4, 5, 3, 0],
  '35': [4, 2, 4, 5, 3, 0],
  '36': [4, 2, 4, 5, 4, 0],
  '37': [4, 2, 4, 5, 4, 0],
  '38': [4, 3, 4, 5, 4, 0],
  '39': [4, 4, 4, 5, 4, 0],
  '40': [4, 4, 4, 6, 4, 0],
  '41': [4, 4, 4, 7, 4, 0],
  '42': [4, 4, 4, 7, 4, 0],
  '43': [4, 4, 4, 7, 4, 0],
  '44': [4, 4, 4, 7, 5, 0],
  '45': [4, 4, 5, 7, 5, 0],
  '46': [5, 4, 5, 7, 5, 0],
  '47': [5, 4, 5, 7, 5, 0],
  '48': [5, 4, 5, 7, 5, 0],
  '49': [5, 4, 5, 8, 5, 0],
  '50': [5, 4, 5, 8, 6, 0],
  // '50': [5, 4, 5, 9, 6, 1],
  '51': [5, 4, 5, 8, 6, 1],
  '52': [5, 5, 5, 8, 6, 1],
  '53': [5, 5, 6, 8, 6, 1],
  '54': [6, 5, 6, 8, 6, 1],
  '55': [6, 5, 6, 9, 6, 1],
  '56': [6, 5, 6, 9, 6, 1],
  '57': [6, 5, 7, 9, 6, 1],
  '58': [6, 5, 7, 9, 6, 2],
  '59': [6, 5, 7, 9, 7, 2],
  '60': [6, 5, 7, 10, 7, 2],
  '61': [6, 5, 7, 10, 7, 2],
  '62': [6, 5, 7, 10, 7, 2],
  '63': [6, 5, 7, 10, 7, 2],
  '64': [6, 5, 7, 10, 7, 2],
  '65': [6, 6, 7, 11, 7, 3],
};

export class ArchBishop extends CharacterBase {
  protected readonly CLASS_NAME = ClassName.ArchBishop;
  protected readonly JobBonusTable = jobBonusTable;

  protected readonly initialStatusPoint = 100;
  protected readonly classNames = [
    'Only 3rd Cls',
    'Acolyte',
    'Acolyte Cls',
    'Acolyte Class',
    'Priest',
    'Priest Cls',
    'Priest Class',
    'Arch Bishop',
    'Arch Bishop Cls',
    'Arch Bishop Class',
  ];
  protected readonly _atkSkillList: AtkSkillModel[] = [
    {
      label: 'Holy Light',
      name: 'Holy Light',
      acd: 0,
      cd: 0,
      fct: 0,
      vct: 0,
      isMatk: true,
      element: ElementType.Holy,
      value: 'Holy Light==1',
      formular: (): number => {
        return 125;
      },
      levelList: [{ label: 'Lv 1', value: 'Holy Light==1' }],
    },
    {
      label: 'Judex Lv 10',
      name: 'Judex',
      fct: 0.5,
      vct: 2,
      acd: 0.58,
      cd: 0,
      isMatk: true,
      element: ElementType.Holy,
      value: 'Judex==1',
      formular: (a: AtkSkillFormulaInput): number => {
        const { baseLevel, skillLevel, usedSkillSet } = a;

        return (300 + skillLevel * 40) * (baseLevel / 100);
      },
      levelList: [{ label: 'Lv 10', value: 'Judex==10' }],
    },
    {
      label: 'Adoramus Lv 10',
      name: 'Adoramus',
      fct: 0.5,
      vct: 2,
      acd: 0.5,
      cd: 2.5,
      isMatk: true,
      element: ElementType.Holy,
      value: 'Adoramus==10',
      formular: (a: AtkSkillFormulaInput): number => {
        const { baseLevel, skillLevel, usedSkillSet } = a;

        return (330 + skillLevel * 70) * (baseLevel / 100);
      },
      levelList: [{ label: 'Lv 10', value: 'Adoramus==10' }],
    },
  ];
  protected readonly _activeSkillList: ActiveSkillModel[] = [
    {
      inputType: 'dropdown',
      label: 'Magnificat',
      name: 'Magnificat',
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
  protected readonly _passiveSkillList: PassiveSkillModel[] = [
    {
      inputType: 'dropdown',
      label: 'Demon Bane',
      name: 'Demon Bane',
      isMasteryAtk: true,
      dropdown: [
        { label: '-', value: 0, isUse: false },
        { label: 'Lv 1', value: 1, isUse: true, bonus: { x_atk_race_demon: 3, x_atk_element_undead: 3 } },
        { label: 'Lv 2', value: 2, isUse: true, bonus: { x_atk_race_demon: 6, x_atk_element_undead: 6 } },
        { label: 'Lv 3', value: 3, isUse: true, bonus: { x_atk_race_demon: 9, x_atk_element_undead: 9 } },
        { label: 'Lv 4', value: 4, isUse: true, bonus: { x_atk_race_demon: 12, x_atk_element_undead: 12 } },
        { label: 'Lv 5', value: 5, isUse: true, bonus: { x_atk_race_demon: 15, x_atk_element_undead: 15 } },
        { label: 'Lv 6', value: 6, isUse: true, bonus: { x_atk_race_demon: 18, x_atk_element_undead: 18 } },
        { label: 'Lv 7', value: 7, isUse: true, bonus: { x_atk_race_demon: 21, x_atk_element_undead: 21 } },
        { label: 'Lv 8', value: 8, isUse: true, bonus: { x_atk_race_demon: 24, x_atk_element_undead: 24 } },
        { label: 'Lv 9', value: 9, isUse: true, bonus: { x_atk_race_demon: 27, x_atk_element_undead: 27 } },
        { label: 'Lv 10', value: 10, isUse: true, bonus: { x_atk_race_demon: 30, x_atk_element_undead: 30 } },
      ],
    },
    {
      inputType: 'dropdown',
      label: 'Mace Mastery',
      name: 'Mace Mastery',
      isEquipAtk: true,
      dropdown: [
        { label: '-', value: 0, isUse: false },
        { label: 'Lv 1', value: 1, isUse: true, bonus: { atk_Mace: 3, cri: 1 } },
        { label: 'Lv 2', value: 2, isUse: true, bonus: { atk_Mace: 6, cri: 2 } },
        { label: 'Lv 3', value: 3, isUse: true, bonus: { atk_Mace: 9, cri: 3 } },
        { label: 'Lv 4', value: 4, isUse: true, bonus: { atk_Mace: 12, cri: 4 } },
        { label: 'Lv 5', value: 5, isUse: true, bonus: { atk_Mace: 15, cri: 5 } },
        { label: 'Lv 6', value: 6, isUse: true, bonus: { atk_Mace: 18, cri: 6 } },
        { label: 'Lv 7', value: 7, isUse: true, bonus: { atk_Mace: 21, cri: 7 } },
        { label: 'Lv 8', value: 8, isUse: true, bonus: { atk_Mace: 24, cri: 8 } },
        { label: 'Lv 9', value: 9, isUse: true, bonus: { atk_Mace: 27, cri: 9 } },
        { label: 'Lv 10', value: 10, isUse: true, bonus: { atk_Mace: 30, cri: 10 } },
      ],
    },
    {
      inputType: 'dropdown',
      label: 'Meditation',
      name: 'Meditation',
      dropdown: [
        { label: '-', value: 0, isUse: false },
        { label: 'Lv 1', value: 1, isUse: true },
        { label: 'Lv 2', value: 2, isUse: true },
        { label: 'Lv 3', value: 3, isUse: true },
        { label: 'Lv 4', value: 4, isUse: true },
        { label: 'Lv 5', value: 5, isUse: true },
        { label: 'Lv 6', value: 6, isUse: true },
        { label: 'Lv 7', value: 7, isUse: true },
        { label: 'Lv 8', value: 8, isUse: true },
        { label: 'Lv 9', value: 9, isUse: true },
        { label: 'Lv 10', value: 10, isUse: true },
      ],
    },
  ];

  override getMasteryAtk(a: {
    level: number;
    weaponData: Weapon;
    passiveSkillIds: number[];
    element: string;
    race: string;
  }): number {
    const { weaponData, passiveSkillIds, element, race, level } = a;
    const weaponType = weaponData?.data?.typeName;
    const bonusBaseLv = 0.05 * (level + 1);
    const bonuses = this._passiveSkillList
      .map((s, idx) => s.dropdown.find((d) => d.value === passiveSkillIds[idx])?.bonus)
      .filter(Boolean);

    let totalAtk = 0;
    for (const bonus of bonuses) {
      const atk =
        bonus?.[`atk_${weaponType}`] ||
        Math.floor(bonus?.[`x_atk_race_${race}`] + bonusBaseLv || 0) ||
        Math.floor(bonus?.[`x_atk_element_${element}`] + bonusBaseLv || 0) ||
        0;
      totalAtk += atk;
    }
    // console.log({ bonuses, totalAtk, a });

    return totalAtk;
  }
}