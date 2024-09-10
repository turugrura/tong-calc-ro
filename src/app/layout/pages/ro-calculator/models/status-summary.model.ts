export interface TraitStatus {
  basePow: number;
  equipPow: number;
  totalPow: number;

  baseSta: number;
  equipSta: number;
  totalSta: number;

  baseWis: number;
  equipWis: number;
  totalWis: number;

  baseSpl: number;
  equipSpl: number;
  totalSpl: number;

  baseCon: number;
  equipCon: number;
  totalCon: number;

  baseCrt: number;
  equipCrt: number;
  totalCrt: number;
}

export interface StatusSummary extends TraitStatus {
  baseStr: number;
  equipStr: number;
  totalStr: number;

  baseInt: number;
  equipInt: number;
  totalInt: number;

  baseLuk: number;
  equipLuk: number;
  totalLuk: number;

  baseVit: number;
  equipVit: number;
  totalVit: number;

  baseDex: number;
  equipDex: number;
  totalDex: number;

  baseAgi: number;
  equipAgi: number;
  totalAgi: number;
}
