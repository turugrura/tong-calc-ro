import { ElementType } from '../constants/element-type.const';

export interface PreparedMonsterModel {
  name: string;
  level: number;
  /**
   * lowercase
   */
  race: 'formless' | 'undead' | 'brute' | 'plant' | 'insect' | 'fish' | 'demon' | 'demihuman' | 'angel' | 'dragon';
  raceUpper: string;
  size: 's' | 'm' | 'l';
  sizeUpper: string;
  sizeFullUpper: string;
  /**
   * lowercase ex neutral
   */
  element: string;
  elementUpper: ElementType;
  /**
   * Neutral 1
   */
  elementLevel: string;
  elementLevelN: number;
  elementLevelUpper: string;
  type: 'normal' | 'boss';
  isMvp: boolean;
  typeUpper: string;
  softDef: number;
  softMDef: number;
  hitRequireFor100: number;
  criShield: number;
  def: number;
  mdef: number;
  hp: number;
  str: number;
  agi: number;
  dex: number;
  vit: number;
  int: number;
  luk: number;
  res: number;
  mres: number;
}
