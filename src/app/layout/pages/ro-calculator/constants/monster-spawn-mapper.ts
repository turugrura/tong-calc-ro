const Mapper = {
  iz_ac01: 'Test damage',
  abbey01: '110 - 125 nameless',
  abbey02: '110 - 125 nameless',
  abbey03: '110 - 125 nameless',
  nameless_n: '110 - 125 nameless',
  abyss_01: '115 - 125 มังกร 3',
  abyss_02: '115 - 125 มังกร 3',
  abyss_03: '115 - 125 มังกร 3',
  lhz_dun02: '120 - 135 Lab 2',
  lasa_dun02: '125 - 133 Lasa แมว 2',
  lasa_dun03: '133 - 150 Lasa แมว 3',
  lhz_dun04: '140 - 150 แลป 4',
  tur_d03_i: '150 - 160 เต่า 1',
  tur_d04_i: '150 - 170 เต่า 2',
  com_d02_i: '160 - 170 ลิง',
  prt_mz03_i: '170 - 175 ป่าบาโฟ',
  mag_dun03: '175 - 185 แมกม่า 3',
  ein_dun03: '180 - 190 เหมือง 3',
  odin_past: '187 - 200 odin 3',
  abyss_04: '192 - 200 มังกร 4',
  iz_d04_i: '140 - 150 น้ำ Under water 1',
  iz_d05_i: '180 - 200 น้ำ Under water 2',
  tha_t09: 'Thana ทานา 09',
  tha_t10: 'Thana ทานา 10',
  tha_t11: 'Thana ทานา 11',
  tha_t12: 'Thana ทานา 12',
  gl_cas01_: 'Abyss Glast Heim 1st Floor',
  hero_tra: 'Test damage',
  tra_fild: 'Test damage',
  prontera: 'Test damage',
  lhz_dun03: 'Lab 3',
  lhz_dun_n: 'Lab 5',
  ba_pw03: 'Magic Power Plant 2',
  ba_lost: 'Farm Lost Valley',
} as const;

export const MonsterGroupNames = [...new Set(Object.values(Mapper))].sort((a, b) => (a > b ? 1 : -1));

export const getMonsterSpawnMap = (spawn: string) => {
  const spawns = spawn.split(',').map((a) => Mapper[a]);

  return [...new Set(spawns)].join(', ');
};
