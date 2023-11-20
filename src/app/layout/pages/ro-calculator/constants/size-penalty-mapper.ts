import { WeaponTypeName } from './weapon-type-mapper';

export const SizePenaltyMapper: Record<WeaponTypeName, { s: number; m: number; l: number }> = {
  dagger: { s: 100, m: 75, l: 50 },
  sword: { s: 75, m: 100, l: 75 },
  twohandSword: { s: 75, m: 75, l: 100 },
  axe: { s: 50, m: 75, l: 100 },
  twohandAxe: { s: 50, m: 75, l: 100 },
  mace: { s: 100, m: 100, l: 100 },
  twohandMace: { s: 100, m: 100, l: 100 },
  spear: { s: 75, m: 75, l: 100 },
  twohandSpear: { s: 75, m: 75, l: 100 },
  rod: { s: 100, m: 100, l: 100 },
  twohandRod: { s: 100, m: 100, l: 100 },
  bow: { s: 100, m: 100, l: 75 },
  katar: { s: 75, m: 100, l: 75 },
  book: { s: 100, m: 100, l: 50 },
  fist: { s: 100, m: 100, l: 75 },
  instrument: { s: 75, m: 100, l: 75 },
  whip: { s: 75, m: 100, l: 50 },
  gun: { s: 100, m: 100, l: 100 },
  shuriken: { s: 75, m: 75, l: 100 },
} as const;
