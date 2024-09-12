import { WeaponTypeName } from './weapon-type-mapper';

export const AllowAmmoMapper: Partial<Record<WeaponTypeName, boolean>> = {
  bow: true,
  gun: true,
  whip: true,
  instrument: true,
  shuriken: true,
};
