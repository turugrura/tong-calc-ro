import { WeaponTypeName } from "./weapon-type-mapper";

export const AllowShieldTable: Partial<Record<WeaponTypeName, true>> = {
  sword: true,
  dagger: true,
  mace: true,
  rod: true,
  book: true,
  spear: true,
};
