import { Component, OnInit } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ItemTypeEnum } from '../constants/item-type.enum';
import { ClassID } from '../jobs/_class-name';
import { ConfirmationService, MessageService } from 'primeng/api';

const displayMainItemKeys = [
  ItemTypeEnum.weapon,
  ItemTypeEnum.shield,
  ItemTypeEnum.headUpper,
  ItemTypeEnum.headMiddle,
  ItemTypeEnum.headLower,
  ItemTypeEnum.armor,
  ItemTypeEnum.garment,
  ItemTypeEnum.boot,
  ItemTypeEnum.accRight,
  ItemTypeEnum.accLeft,
];
const displayCostumeItemKeys = [
  ItemTypeEnum.costumeEnchantUpper,
  ItemTypeEnum.costumeEnchantMiddle,
  ItemTypeEnum.costumeEnchantLower,
  ItemTypeEnum.costumeEnchantGarment,
  ItemTypeEnum.costumeEnchantGarment4,
];
const displayShadowItemKeys = [
  ItemTypeEnum.shadowWeapon,
  ItemTypeEnum.shadowArmor,
  ItemTypeEnum.shadowShield,
  ItemTypeEnum.shadowBoot,
  ItemTypeEnum.shadowEarring,
  ItemTypeEnum.shadowPendant,
];

@Component({
  selector: 'app-preset-table',
  templateUrl: './preset-table.component.html',
  styleUrls: ['../ro-calculator.component.css'],
})
export class PresetTableComponent implements OnInit {
  presets: any[] = [];
  selectedPreset = undefined;
  model = {} as any;
  displayMainItems = [] as any[];
  displayCostumeItems = [] as any[];
  displayShadowItems = [] as any[];
  classLabelMap = ClassID;

  items = this.dynamicDialogConfig.data.items;

  constructor(
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    public ref: DynamicDialogRef,
    private dynamicDialogConfig: DynamicDialogConfig,
  ) {}

  ngOnInit() {
    this.setPresetList();
    this.selectedPreset = this.presets[0]?.value;
    this.onSelectPreset();
  }

  private getPresets() {
    return this.dynamicDialogConfig.data.getPresetFn();
  }

  private setPresetList() {
    this.presets = this.getPresets();
  }

  onSelectPreset() {
    this.model = this.presets.find((a) => a.value === this.selectedPreset)?.model || {};

    this.displayMainItems = displayMainItemKeys
      .map((itemType) => {
        const itemId = this.model[itemType];
        if (!itemId) {
          return { itemType, cardIds: [], enchantIds: [], isHidden: itemType === ItemTypeEnum.shield };
        }

        const refine = this.model[`${itemType}Refine`];
        const cardIds =
          itemType === ItemTypeEnum.weapon
            ? [
                this.model[
                  (ItemTypeEnum.weaponCard1,
                  ItemTypeEnum.weaponCard2,
                  ItemTypeEnum.weaponCard3,
                  ItemTypeEnum.weaponCard4)
                ],
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

  onLoadPresetClick() {
    this.dynamicDialogConfig.data.loadPresetFn(this.selectedPreset);
  }

  getItemLabel(itemId: number) {
    return this.items[itemId]?.name || 'empty';
  }

  deletePreset() {
    this.confirmationService.confirm({
      message: `Delete "${this.selectedPreset}" ?`,
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        // this.isInProcessingPreset = true;
        const preSets = this.getPresets();
        const removedSets = preSets.filter((a) => a.value !== this.selectedPreset);
        this.dynamicDialogConfig.data.savePresetListFn(removedSets);
        this.dynamicDialogConfig.data.setPresetListFn();
        this.presets = removedSets;
        this.model = {};

        this.messageService.add({
          severity: 'error',
          summary: `"${this.selectedPreset}" was deleted`,
        });
        this.selectedPreset = '';

        // waitRxjs(0.2)
        //   .pipe(
        //     tap(() => {
        //       const preSets = this.getPresets();
        //       const removedSets = preSets.filter((a) => a.value !== value || this.selectedPreset);
        //       this.dynamicDialogConfig.data.savePresetListFn(removedSets);
        //     }),
        //     delay(200),
        //     tap(() => this.setPresetList()),
        //     finalize(() => {
        //       this.messageService.add({
        //         severity: 'error',
        //         summary: `"${value || this.selectedPreset}" was deleted`,
        //       });
        //       this.selectedPreset = '';
        //       // this.isInProcessingPreset = false;
        //     }),
        //   )
        //   .subscribe();

        // this.isInProcessingPreset = false;
      },
    });
  }
}
