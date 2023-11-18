import { floor } from './floor';

export const calcDmgDps = (params: {
  min: number;
  max: number;
  cri: number;
  criDmg: number;
  hitsPerSec: number;
  accRate: number;
}) => {
  const { min, max, cri, criDmg, hitsPerSec, accRate } = params;
  const avgBasicDamage = floor((min + max) / 2);
  const limitedCriRate = Math.min(cri, 100);
  const limitedAccuracy = Math.min(accRate, 100);
  const criHit = criDmg * limitedCriRate;
  const nonCriHit = (100 - limitedCriRate) * avgBasicDamage * (1 - (100 - limitedAccuracy) / 100);
  const totalDamage = floor((nonCriHit + criHit) / 100);

  return floor(hitsPerSec * totalDamage);
};
