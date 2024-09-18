export interface EquipmentSummaryModel {
  weight: number;
  refine: number;
  baseDef?: number;

  hp: number;
  hpPercent: number;
  sp: number;
  spPercent: number;
  def: number;
  defPercent: number;
  softDef: number;
  softDefPercent: number;
  mdef: number;
  mdefPercent: number;
  softMdef: number;
  softMdefPercent: number;
  aspd: number;
  aspdPercent: number;
  skillAspd: number;
  skillAspdPercent: number;
  decreaseSkillAspdPercent: number;

  flatDmg: number;
  atk: number;
  x_atk: number;
  cannonballAtk: number;
  atkPercent: number;

  matk: number;
  matkPercent: number;
  allStatus: number;

  str: number;
  int: number;
  dex: number;
  luk: number;
  vit: number;
  agi: number;

  allTrait: number;
  pAtk: number;
  sMatk: number;
  pow: number;
  sta: number;
  wis: number;
  spl: number;
  con: number;
  crt: number;
  cRate: number;
  hplus: number;

  res: number;
  mres: number;
  monster_res: number;
  monster_mres: number;

  melee: number;
  range: number;
  bowRange: number;
  rangedReduction: number;
  meleeReduction: number;
  vct: number;
  vct_inc: number;
  acd: number;
  fct: number;
  fctPercent: number;
  cri: number;
  criDmg: number;
  perfectHit: number;
  hit: number;
  flee: number;
  perfectDodge: number;

  mildwind: number;
  dmg: number;
  ignore_size_penalty: number;
  p_infiltration: number;

  p_final: number;
  p_size_all: number;
  p_size_s: number;
  p_size_m: number;
  p_size_l: number;

  p_element_all: number;
  p_element_neutral: number;
  p_element_water: number;
  p_element_earth: number;
  p_element_fire: number;
  p_element_wind: number;
  p_element_poison: number;
  p_element_holy: number;
  p_element_dark: number;
  p_element_ghost: number;
  p_element_undead: number;

  p_race_all: number;
  p_race_formless: number;
  p_race_undead: number;
  p_race_brute: number;
  p_race_plant: number;
  p_race_insect: number;
  p_race_fish: number;
  p_race_demon: number;
  p_race_demihuman: number;
  p_race_angel: number;
  p_race_dragon: number;

  p_class_all: number;
  p_class_normal: number;
  p_class_boss: number;

  pene_res: number;
  pene_mres: number;

  p_pene_class_all: number;
  p_pene_class_normal: number;
  p_pene_class_boss: number;

  p_pene_race_all: number;
  p_pene_race_formless: number;
  p_pene_race_undead: number;
  p_pene_race_brute: number;
  p_pene_race_plant: number;
  p_pene_race_insect: number;
  p_pene_race_fish: number;
  p_pene_race_demon: number;
  p_pene_race_demihuman: number;
  p_pene_race_angel: number;
  p_pene_race_dragon: number;

  m_final: number;
  m_size_all: number;
  m_size_s: number;
  m_size_m: number;
  m_size_l: number;

  m_my_element_all: number;
  m_my_element_neutral: number;
  m_my_element_water: number;
  m_my_element_earth: number;
  m_my_element_fire: number;
  m_my_element_wind: number;
  m_my_element_poison: number;
  m_my_element_holy: number;
  m_my_element_dark: number;
  m_my_element_ghost: number;
  m_my_element_undead: number;

  m_element_all: number;
  m_element_neutral: number;
  m_element_water: number;
  m_element_earth: number;
  m_element_fire: number;
  m_element_wind: number;
  m_element_poison: number;
  m_element_holy: number;
  m_element_dark: number;
  m_element_ghost: number;
  m_element_undead: number;

  m_race_all: number;
  m_race_formless: number;
  m_race_undead: number;
  m_race_brute: number;
  m_race_plant: number;
  m_race_insect: number;
  m_race_fish: number;
  m_race_demon: number;
  m_race_demihuman: number;
  m_race_angel: number;
  m_race_dragon: number;

  m_class_all: number;
  m_class_normal: number;
  m_class_boss: number;

  m_pene_class_all: number;
  m_pene_class_boss: number;
  m_pene_class_normal: number;

  m_pene_race_all: number;
  m_pene_race_undead: number;
  m_pene_race_plant: number;
  m_pene_race_insect: number;
  m_pene_race_formless: number;
  m_pene_race_fish: number;
  m_pene_race_dragon: number;
  m_pene_race_demon: number;
  m_pene_race_demihuman: number;
  m_pene_race_brute: number;
  m_pene_race_angel: number;

  // Other from skill
  forceCri?: number;
  magnumBreakPsedoBonus?: number;
  magnumBreakClearEDP?: number;
  vctBySkill?: number;
  // [key: string]: number;
}
