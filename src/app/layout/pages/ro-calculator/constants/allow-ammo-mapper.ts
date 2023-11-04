import { ClassName } from '../jobs/_class-name';
import { WeaponTypeName } from './weapon-type-mapper';

export const AllowAmmoMapper: Partial<Record<WeaponTypeName, boolean>> = {
  bow: true,
  gun: true,
  whip: true,
  instrument: true,
  shuriken: true,
};

export const AllowAmmoClassMapper: Partial<Record<ClassName, boolean>> = {
  Oboro: true,
  Kagerou: true,
  Mechanic: true,
};
