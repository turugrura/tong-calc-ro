const Mapper = {
  iz_ac01: 'Test damage',
  lasa_dun02: '125 - 133 Lasa แมว 2',
  lasa_dun03: '133 - 150 Lasa แมว 3',
  tur_d03_i: '150 - 160 เต่า 1',
  tur_d04_i: '150 - 175 เต่า 2',
  mag_dun03: '175 - 185 mag3 แมก3',
  prt_mz03_i: '170 - 175  ป่าบาโฟ Bapho',
  ein_dun03: '175 - xxx เหมือง 3',
  iz_d04_i: 'Iillusion of under water 4',
  iz_d05_i: 'Iillusion of under water 5',
  hero_tra: 'Test damage',
  tra_fild: 'Test damage',
} as const;

export const getMonsterSpawnMap = (spawn: string) => {
  const spawns = spawn.split(',').map((a) => Mapper[a]);

  return [...new Set(spawns)].join(',');
};
