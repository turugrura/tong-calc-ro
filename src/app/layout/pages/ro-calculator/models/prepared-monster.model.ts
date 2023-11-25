import { ElementType } from '../constants/element-type.const';

export interface PreparedMonsterModel {
  name: string;
  /**
   * lowercase
   */
  race: string;
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
}
