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
   * lowercase
   */
  element: string;
  elementUpper: string;
  elementLevel: string;
  elementLevelUpper: string;
  type: string;
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
