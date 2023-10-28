import { WeaponTypeName } from './weapon-type-mapper';

export const WeaponAmmoMapper: Partial<Record<WeaponTypeName, number>> = {
  bow: 1024,
  whip: 1024,
  instrument: 1024,
  gun: 1025,
};
