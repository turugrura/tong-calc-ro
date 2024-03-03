import { Component, Input, OnInit } from '@angular/core';
import { MainModel } from '../../ro-calculator/models/main.model';
import { ItemTypeEnum } from '../../ro-calculator/constants/item-type.enum';

const displayMainItemKeys = [
  ItemTypeEnum.headUpper,
  ItemTypeEnum.headMiddle,
  ItemTypeEnum.headLower,
  ItemTypeEnum.armor,
  ItemTypeEnum.weapon,
  ItemTypeEnum.leftWeapon,
  ItemTypeEnum.shield,
  ItemTypeEnum.garment,
  ItemTypeEnum.boot,
  ItemTypeEnum.accRight,
  ItemTypeEnum.accLeft,
];
const allowHidden = {
  [ItemTypeEnum.leftWeapon]: true,
  [ItemTypeEnum.shield]: true,
};
const displayCostumeItemKeys = [
  // ItemTypeEnum.costumeEnchantUpper,
  // ItemTypeEnum.costumeEnchantMiddle,
  // ItemTypeEnum.costumeEnchantLower,
  // ItemTypeEnum.costumeEnchantGarment,
  // ItemTypeEnum.costumeEnchantGarment4,
];
const displayShadowItemKeys = [
  // ItemTypeEnum.shadowWeapon,
  // ItemTypeEnum.shadowArmor,
  // ItemTypeEnum.shadowShield,
  // ItemTypeEnum.shadowBoot,
  // ItemTypeEnum.shadowEarring,
  // ItemTypeEnum.shadowPendant,
];

@Component({
  selector: 'app-equipment-in-detail',
  templateUrl: './equipment-in-detail.component.html',
  styleUrls: ['./equipment-in-detail.component.css'],
})
export class EquipmentInDetailComponent implements OnInit {
  @Input({ required: true }) itemMap = {} as any;
  @Input({ required: true }) model = {} as any as MainModel;

  displayMainItems = [] as any[];
  displayCostumeItems = [] as any[];
  displayShadowItems = [] as any[];

  constructor() {}

  ngOnInit() {
    this.displayMainItems = displayMainItemKeys
      .map((itemType) => {
        const itemId = this.model[itemType];
        if (!itemId) {
          return { itemType, cardIds: [], enchantIds: [], isHidden: allowHidden[itemType] || false };
        }

        const refine = this.model[`${itemType}Refine`];
        const cardIds =
          itemType === ItemTypeEnum.weapon
            ? [
                this.model[ItemTypeEnum.weaponCard1],
                this.model[ItemTypeEnum.weaponCard2],
                this.model[ItemTypeEnum.weaponCard3],
                this.model[ItemTypeEnum.weaponCard4],
              ]
            : itemType === ItemTypeEnum.leftWeapon
            ? [
                this.model[ItemTypeEnum.leftWeaponCard1],
                this.model[ItemTypeEnum.leftWeaponCard2],
                this.model[ItemTypeEnum.leftWeaponCard3],
                this.model[ItemTypeEnum.leftWeaponCard4],
              ]
            : [this.model[`${itemType}Card`]];

        const enchantIds = [
          this.model[`${itemType}Enchant1`],
          this.model[`${itemType}Enchant2`],
          this.model[`${itemType}Enchant3`],
        ];

        return {
          itemType,
          mainId: itemId,
          isHead: itemType === ItemTypeEnum.headUpper || itemType === ItemTypeEnum.headMiddle,
          refineTxt: refine > 0 ? `+${refine}` : '',
          cardIds: cardIds.filter(Boolean),
          enchantIds: enchantIds.filter(Boolean),
        };
      })
      .filter((a) => !a.isHidden);

    this.displayCostumeItems = displayCostumeItemKeys.map((itemType) => {
      const itemId = this.model[itemType];
      if (!itemId) {
        return { itemType };
      }

      return {
        itemType,
        mainId: itemId,
      };
    });

    this.displayShadowItems = displayShadowItemKeys.map((itemType) => {
      const itemId = this.model[itemType];
      if (!itemId) {
        return { itemType };
      }

      const refine = this.model[`${itemType}Refine`];

      return {
        itemType,
        mainId: itemId,
        refineTxt: refine > 0 ? `+${refine}` : '',
      };
    });
  }

  getItemLabel(itemId: number) {
    return this.itemMap[itemId]?.name || 'empty';
  }
}
