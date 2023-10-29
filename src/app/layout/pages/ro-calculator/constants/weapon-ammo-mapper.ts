import { ItemSubTypeId } from './item-sub-type.enum';
import { WeaponTypeName } from './weapon-type-mapper';

export const WeaponAmmoMapper: Partial<Record<WeaponTypeName, number>> = {
  bow: ItemSubTypeId.Arrow,
  whip: ItemSubTypeId.Arrow,
  instrument: ItemSubTypeId.Arrow,
  gun: ItemSubTypeId.Bullet,
};
