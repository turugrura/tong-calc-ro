import { ClassName } from '../jobs/_class-name';
import { ItemSubTypeId } from './item-sub-type.enum';
import { WeaponTypeName } from './weapon-type-mapper';

export const WeaponAmmoMapper: Partial<Record<WeaponTypeName, ItemSubTypeId>> = {
  bow: ItemSubTypeId.Arrow,
  whip: ItemSubTypeId.Arrow,
  instrument: ItemSubTypeId.Arrow,
  gun: ItemSubTypeId.Bullet,
  shuriken: ItemSubTypeId.Kunai,
};

export const ClassAmmoMapper: Partial<Record<ClassName, ItemSubTypeId>> = {
  Oboro: ItemSubTypeId.Kunai,
  Shinkiro: ItemSubTypeId.Kunai,
  Kagerou: ItemSubTypeId.Kunai,
  Shiranui: ItemSubTypeId.Kunai,
  Mechanic: ItemSubTypeId.Cannonball,
  Meister: ItemSubTypeId.Cannonball,
  Genetic: ItemSubTypeId.Cannonball,
  Biolo: ItemSubTypeId.Cannonball,
};
