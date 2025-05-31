import { DropdownModel } from './dropdown.model';

export interface ItemListModel {
  weaponList: DropdownModel[];
  leftWeaponList: DropdownModel[];
  weaponCardList: DropdownModel[];
  ammoList: DropdownModel[];
  headUpperList: DropdownModel[];
  headMiddleList: DropdownModel[];
  headLowerList: DropdownModel[];
  headCardList: DropdownModel[];
  armorList: DropdownModel[];
  armorCardList: DropdownModel[];
  shieldList: DropdownModel[];
  shieldCardList: DropdownModel[];
  garmentList: DropdownModel[];
  garmentCardList: DropdownModel[];
  bootList: DropdownModel[];
  bootCardList: DropdownModel[];
  accList: DropdownModel[];
  accCardList: DropdownModel[];
  accLeftList: DropdownModel[];
  accLeftCardList: DropdownModel[];
  accRightList: DropdownModel[];
  accRightCardList: DropdownModel[];
  petList: DropdownModel[];

  costumeUpperList: DropdownModel[];
  costumeMiddleList: DropdownModel[];
  costumeLowerList: DropdownModel[];
  costumeGarmentList: DropdownModel[];

  costumeEnhUpperList: DropdownModel[];
  costumeEnhMiddleList: DropdownModel[];
  costumeEnhLowerList: DropdownModel[];
  costumeEnhGarmentList: DropdownModel[];
  costumeEnhGarment2List: DropdownModel[];
  costumeEnhGarment4List: DropdownModel[];

  shadowWeaponList: DropdownModel[];
  shadowArmorList: DropdownModel[];
  shadowShieldList: DropdownModel[];
  shadowBootList: DropdownModel[];
  shadowEarringList: DropdownModel[];
  shadowPendantList: DropdownModel[];
}
