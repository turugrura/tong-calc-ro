const Mapper = {
  iz_ac01: 'Test damage',
  lasa_dun02: '125 - 133 Lasa แมว 2',
  lasa_dun03: '133 - 150 Lasa แมว 3',
  lhz_dun04: '140 แลป 4',
  tur_d03_i: '150 - 160 เต่า 1',
  tur_d04_i: '150 - 175 เต่า 2',
  mag_dun03: '175 - 185 แมกม่า 3',
  prt_mz03_i: '170 - 175 ป่าบาโฟ',
  ein_dun03: '175 - 190 เหมือง 3',
  abyss_04: '190 - 200 มังกร 4',
  odin_past: '190 - 200 odin 3',
  iz_d04_i: '135 - 150 Illuion of under water 4',
  iz_d05_i: '190 - 200 Illuion of under water 5',
  hero_tra: 'Test damage',
  tra_fild: 'Test damage',
  prontera: 'Test damage',
} as const;

export const MonsterGroupNames = [...new Set(Object.values(Mapper))].sort((a, b) => (a > b ? 1 : -1));

export const getMonsterSpawnMap = (spawn: string) => {
  const spawns = spawn.split(',').map((a) => Mapper[a]);

  return [...new Set(spawns)].join(',');
};
