import { Component, Input, OnInit } from '@angular/core';
import { MainModel } from '../../ro-calculator/models/main.model';
import { ItemTypeEnum } from '../../ro-calculator/constants/item-type.enum';

@Component({
  selector: 'app-equipment-ui',
  templateUrl: './equipment-ui.component.html',
  styleUrls: ['./equipment-ui.component.css'],
})
export class EquipmentUiComponent implements OnInit {
  @Input({ required: true }) itemMap = {} as any;
  @Input({ required: true }) model = {} as any as MainModel;

  mainItemNames = [
    [ItemTypeEnum.headUpper, ItemTypeEnum.headMiddle],
    [ItemTypeEnum.headLower, ItemTypeEnum.armor],
    [ItemTypeEnum.weapon, ItemTypeEnum.shield, ItemTypeEnum.leftWeapon],
    [ItemTypeEnum.garment, ItemTypeEnum.boot],
    [ItemTypeEnum.accRight, ItemTypeEnum.accLeft],
  ];
  shadowItemNames = [
    [ItemTypeEnum.costumeEnchantUpper, ItemTypeEnum.costumeEnchantMiddle],
    [ItemTypeEnum.costumeEnchantLower, ItemTypeEnum.shadowArmor],
    [ItemTypeEnum.shadowWeapon, ItemTypeEnum.shadowShield],
    [ItemTypeEnum.costumeEnchantGarment, ItemTypeEnum.shadowBoot],
    [ItemTypeEnum.shadowEarring, ItemTypeEnum.shadowPendant],
  ];

  constructor() {}

  ngOnInit() {
    console.log('');
  }
}
