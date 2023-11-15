import { WeaponTypeName } from './weapon-type-mapper';

export const AllowShieldTable: Partial<Record<WeaponTypeName, true>> = {
  sword: true,
  whip: true,
  instrument: true,
  fist: true,
  dagger: true,
  mace: true,
  rod: true,
  book: true,
  spear: true,
};
