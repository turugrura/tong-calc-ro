import { Component, OnDestroy, OnInit } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ItemTypeEnum } from '../constants/item-type.enum';
import { ClassID } from '../jobs/_class-name';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AuthService, EntirePresetWithTagsModel, PresetService } from 'src/app/api-services';
import { Subscription, finalize, of, switchMap, tap } from 'rxjs';

const displayMainItemKeys = [
  ItemTypeEnum.weapon,
  ItemTypeEnum.leftWeapon,
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
const allowHidden = {
  [ItemTypeEnum.leftWeapon]: true,
  [ItemTypeEnum.shield]: true,
};
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
export class PresetTableComponent implements OnInit, OnDestroy {
  presets: any[] = [];
  selectedPreset = undefined;
  model = {} as any;
  displayMainItems = [] as any[];
  displayCostumeItems = [] as any[];
  displayShadowItems = [] as any[];
  classLabelMap = ClassID;

  cloudPresets: (EntirePresetWithTagsModel & { value: string })[] = [];
  items = this.dynamicDialogConfig.data.items;

  subs: Subscription;
  isLoggedIn = this.authService.isLoggedIn;
  isProcessing = false;

  selectedCloudPreset = undefined;

  constructor(
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    public ref: DynamicDialogRef,
    private dynamicDialogConfig: DynamicDialogConfig,
    private authService: AuthService,
    private presetService: PresetService,
  ) {}

  ngOnDestroy(): void {
    if (typeof this.subs?.unsubscribe === 'function') {
      this.subs.unsubscribe();
    }
  }

  ngOnInit() {
    this.setPresetList();
    this.subs = this.authService.loggedInEvent$.subscribe((isLoggedIn) => {
      this.isLoggedIn = isLoggedIn;
    });
  }

  private getPresets() {
    return this.dynamicDialogConfig.data.getPresetFn();
  }

  private setPresetList() {
    if (this.isLoggedIn) {
      this.loadFromCloud(false).subscribe();
    } else {
      this.presets = this.getPresets();
    }
  }

  onSelectPreset(isLocal: boolean) {
    if (isLocal) {
      this.selectedCloudPreset = undefined;
      this.model = this.presets.find((a) => a.value === this.selectedPreset)?.model || {};
    } else {
      this.selectedPreset = undefined;
      this.model = this.cloudPresets.find((a) => a.id === this.selectedCloudPreset)?.model || {};
    }

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

  onLoadPresetClick() {
    if (this.isLoggedIn) {
      if (this.selectedCloudPreset) this.dynamicDialogConfig.data.loadPresetFn(this.selectedCloudPreset);
    } else {
      if (this.selectedPreset) this.dynamicDialogConfig.data.loadPresetFn(this.selectedPreset);
    }
  }

  getItemLabel(itemId: number) {
    return this.items[itemId]?.name || 'empty';
  }

  removePreset(targetPresetLabel: string, isMoveLocalToCloud = false) {
    if (this.isLoggedIn && !isMoveLocalToCloud) {
      this.isProcessing = true;
      this.presetService.deletePreset(this.selectedCloudPreset).subscribe(() => {
        this.cloudPresets = this.cloudPresets.filter((a) => a.id !== this.selectedCloudPreset);
        this.model = {};
        this.dynamicDialogConfig.data.removePresetFromListFn(this.selectedCloudPreset);
        this.selectedCloudPreset = undefined;

        this.messageService.add({
          severity: 'error',
          summary: `"${targetPresetLabel}" was deleted`,
        });

        this.onSelectPreset(false);
        this.isProcessing = false;
      });
    } else {
      const preSets = this.getPresets();
      const removedSets = preSets.filter((a) => a.value !== this.selectedPreset);
      this.dynamicDialogConfig.data.savePresetListFn(removedSets);
      this.dynamicDialogConfig.data.setPresetListFn();
      this.presets = removedSets;
      this.model = {};
      this.selectedPreset = undefined;

      if (!isMoveLocalToCloud) {
        this.messageService.add({
          severity: 'error',
          summary: `"${targetPresetLabel}" was deleted`,
        });
      }

      this.onSelectPreset(true);
    }
  }

  deletePreset() {
    let targetPreset = this.selectedPreset || this.selectedCloudPreset;
    if (this.isLoggedIn) {
      const name = this.cloudPresets.find((a) => a.id === targetPreset)?.label;
      if (name) targetPreset = name;
    }

    this.confirmationService.confirm({
      message: `Delete "${targetPreset}" ?`,
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.removePreset(targetPreset);
      },
    });
  }

  showMoveToCloudSuccess() {
    this.messageService.add({
      severity: 'success',
      summary: `"${this.selectedPreset}" was move to cloud.`,
    });
  }

  loadFromCloud(isInOtherProcessing: boolean) {
    if (!this.isLoggedIn) return of(null);

    if (!isInOtherProcessing) this.isProcessing = true;

    return this.presetService.getEntirePresets().pipe(
      tap((res) => {
        this.cloudPresets = res.map((a) => {
          return {
            ...a,
            value: a.id,
          };
        });
      }),
      finalize(() => {
        if (!isInOtherProcessing) this.isProcessing = false;
        console.log('load final', this.isProcessing);
      }),
    );
  }

  saveToCloud() {
    if (!this.isLoggedIn || !this.selectedPreset) return;

    const local = this.presets.find((a) => a.value === this.selectedPreset);
    if (!local) return;

    this.isProcessing = true;
    this.presetService
      .createPreset(local)
      .pipe(
        switchMap(() => this.loadFromCloud(true)),
        finalize(() => (this.isProcessing = false)),
      )
      .subscribe(() => {
        this.showMoveToCloudSuccess();
        this.removePreset(this.selectedPreset);
      });
  }
}
