import { Component, OnDestroy, OnInit } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ItemTypeEnum } from '../../../../constants/item-type.enum';
import { ClassID, ClassIcon } from '../../../../jobs/_class-name';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AuthService, EntirePresetWithTagsModel, PresetService } from 'src/app/api-services';
import { Observable, Subscription, catchError, finalize, of, switchMap, tap } from 'rxjs';
import { availableTags, tagSeverityMap } from '../../../../constants/available-tags';
import { ToErrorDetail } from 'src/app/app-errors';
import { getClassDropdownList } from '../../../../jobs/_class-list';

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
  classList = getClassDropdownList();
  selectedClassIdFilter = undefined;

  cloudPresets: (EntirePresetWithTagsModel & { value: string; icon: number })[] = [];
  displayCloudPresets: typeof this.cloudPresets = [];
  items = this.dynamicDialogConfig.data.items;
  jobIconMap = { ...ClassIcon };

  subs: Subscription;
  isLoggedIn = this.authService.isLoggedIn;
  isProcessing = false;

  presetInfo = {} as EntirePresetWithTagsModel;
  selectedCloudPreset = undefined;
  isSharedPreset = false;
  availableTags = availableTags.map((a) => {
    return { ...a };
  });
  selectedTags = [] as string[];
  currentTags = [] as { tag: string; severity: string }[];
  tagSeverityMap = tagSeverityMap;

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

  private getCurrentPreset() {
    if (this.isLoggedIn) {
      return this.cloudPresets.find((a) => a.id === this.selectedCloudPreset);
    }

    return this.presets.find((a) => a.id === this.selectedPreset);
  }

  private waitConfirm(message: string, icon?: string) {
    return new Promise((res) => {
      this.confirmationService.confirm({
        message: message,
        header: 'Confirmation',
        icon: icon || 'pi pi-exclamation-triangle',
        accept: () => {
          res(true);
        },
        reject: () => {
          console.log('reject confirm');
          res(false);
        },
      });
    });
  }

  private calAPIWithLoading<T>(fn: Observable<T>, successMsg: string) {
    this.isProcessing = true;

    return fn
      .pipe(
        tap(() => {
          this.messageService.add({
            severity: 'success',
            summary: successMsg,
          });
        }),
        catchError((err) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: ToErrorDetail(err),
          });

          return of(null);
        }),
        finalize(() => {
          this.isProcessing = false;
        }),
      )
      .subscribe();
  }

  onRenamePresetClick(newName: string) {
    if (!this.isLoggedIn) return;

    const preset = this.getCurrentPreset() as (typeof this.cloudPresets)[0];
    if (!preset) return;

    const name = newName.substring(0, 100);
    this.waitConfirm(`Want to rename "${preset.label}" to "${name}" ?`).then((isConfirm) => {
      if (!isConfirm) return;

      const ob = this.presetService
        .updatePreset(preset.id, {
          label: name,
        })
        .pipe(
          tap((updatedPreset) => {
            preset.label = updatedPreset.label;
          }),
        );

      this.calAPIWithLoading(ob, `"${preset.label}" was renamed.`);
    });
  }

  onSelectPreset(isLocal: boolean) {
    if (isLocal) {
      this.selectedCloudPreset = undefined;
      this.model = this.presets.find((a) => a.value === this.selectedPreset)?.model || {};
      this.selectedTags = [];
    } else {
      this.selectedPreset = undefined;
      this.presetInfo = this.cloudPresets.find((a) => a.id === this.selectedCloudPreset);
      this.isSharedPreset = this.presetInfo?.isPublished ?? false;
      this.currentTags = this.presetInfo?.tags?.map((a, i) => ({ tag: a.tag, severity: this.getTagSeverity(a.tag, i) })) || [];

      this.selectedTags = this.presetInfo?.tags?.map((a) => a.tag);
      this.model = this.presetInfo?.model || {};
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
            ? [this.model[ItemTypeEnum.weaponCard1], this.model[ItemTypeEnum.weaponCard2], this.model[ItemTypeEnum.weaponCard3], this.model[ItemTypeEnum.weaponCard4]]
            : itemType === ItemTypeEnum.leftWeapon
            ? [
                this.model[ItemTypeEnum.leftWeaponCard1],
                this.model[ItemTypeEnum.leftWeaponCard2],
                this.model[ItemTypeEnum.leftWeaponCard3],
                this.model[ItemTypeEnum.leftWeaponCard4],
              ]
            : [this.model[`${itemType}Card`]];

        const enchantIds = [this.model[`${itemType}Enchant1`], this.model[`${itemType}Enchant2`], this.model[`${itemType}Enchant3`]];

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
        this.onClassFilterChange();

        this.messageService.add({
          severity: 'success',
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
          severity: 'success',
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

  sharePreset(publishName: string) {
    const preset = this.cloudPresets.find((a) => a.id === this.selectedCloudPreset);
    if (!preset || !publishName) return;

    this.waitConfirm(`Shared preset cannot be update, want to share "${preset.label}" ?`).then((isConfirm) => {
      if (!isConfirm) return;

      const ob = this.presetService
        .sharePreset(preset.id, {
          publishName: publishName.substring(0, 200),
        })
        .pipe(
          tap((sharedPreset) => {
            preset.publishName = sharedPreset.publishName;
            preset.isPublished = sharedPreset.isPublished;
            preset.publishedAt = sharedPreset.publishedAt;
            this.isSharedPreset = true;
          }),
        );

      this.calAPIWithLoading(ob, `"${preset.label}" was share`);
    });
  }

  unsharePreset() {
    const preset = this.cloudPresets.find((a) => a.id === this.selectedCloudPreset);
    if (!preset || !preset.isPublished) return;

    this.waitConfirm(`Cancel sharing "${preset.label}" ?`).then((isConfirm) => {
      if (!isConfirm) return;

      const ob = this.presetService.unsharePreset(preset.id).pipe(
        tap((sharedPreset) => {
          preset.publishName = sharedPreset.publishName;
          preset.isPublished = sharedPreset.isPublished;
          preset.publishedAt = sharedPreset.publishedAt;
          this.isSharedPreset = false;
        }),
      );

      this.calAPIWithLoading(ob, `Sharing "${preset.label}" was cancel`);
    });
  }

  addTags() {
    const preset = this.cloudPresets.find((a) => a.id === this.selectedCloudPreset);
    if (!preset) return;

    const selectedTags = this.selectedTags || [];

    this.waitConfirm(`Update tags ?`).then((isConfirm) => {
      if (!isConfirm) return;

      const ob = this.presetService
        .addPresetTags(preset.id, {
          createTags: this.selectedTags,
          deleteTags: preset.tags.filter((t) => !selectedTags.includes(t.tag)).map((a) => a.tag),
        })
        .pipe(
          tap((presetTag) => {
            preset.tags = presetTag.tags;
          }),
        );

      this.calAPIWithLoading(ob, `Tag was update`);
    });
  }

  getTagSeverity(tagName: string, no: number) {
    const x = no % 4;
    switch (x) {
      case 0:
        return 'success';
      case 1:
        return 'info';
      case 2:
        return 'warning';
      case 3:
        return 'danger';
      default:
        return '';
    }
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
            icon: ClassIcon[a.model.class],
          };
        });
        this.displayCloudPresets = this.cloudPresets;
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

  onClassFilterChange() {
    if (this.selectedClassIdFilter) {
      this.displayCloudPresets = this.cloudPresets.filter((a) => a.model.class === this.selectedClassIdFilter);
    } else {
      this.displayCloudPresets = this.cloudPresets;
    }
  }

  exportPresetsToFile() {
    // Chuyển đổi presets thành chuỗi JSON
    const presetsString = JSON.stringify(this.presets, null, 2);
    
    // Tạo blob từ chuỗi
    const blob = new Blob([presetsString], { type: 'text/plain;charset=utf-8' });
    
    // Tạo URL cho blob
    const url = window.URL.createObjectURL(blob);
    
    // Tạo timestamp cho tên file
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    
    // Tạo element a để download
    const link = document.createElement('a');
    link.href = url;
    link.download = `ro-presets_${timestamp}.txt`;
    
    // Thêm link vào document, click để download và xóa đi
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Giải phóng URL object
    window.URL.revokeObjectURL(url);
  }

  importPresetsFromFile(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedPresets = JSON.parse(e.target?.result as string);
        
        if (!Array.isArray(importedPresets)) {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Invalid preset file format'
          });
          return;
        }

        this.confirmationService.confirm({
          message: `Import ${importedPresets.length} presets?`,
          header: 'Confirmation',
          icon: 'pi pi-exclamation-triangle',
          accept: () => {
            const currentPresets = this.getPresets();
            const mergedPresets = [...currentPresets];
            
            importedPresets.forEach(newPreset => {
              let newValue = newPreset.value;
              let counter = 1;
              
              // Kiểm tra nếu value đã tồn tại thì thêm số vào sau
              while (mergedPresets.some(p => p.value === newValue)) {
                newValue = `${newPreset.value}_${counter}`;
                counter++;
              }
              
              // Cập nhật value và label nếu có thay đổi
              if (newValue !== newPreset.value) {
                newPreset.value = newValue;
                newPreset.label = `${newPreset.label}_${counter-1}`;
              }
              
              mergedPresets.push(newPreset);
            });

            this.dynamicDialogConfig.data.savePresetListFn(mergedPresets);
            this.dynamicDialogConfig.data.setPresetListFn();
            this.presets = mergedPresets;

            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: `Imported ${importedPresets.length} presets successfully`
            });
          }
        });

      } catch (error) {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to parse preset file'
        });
      }
    };

    reader.readAsText(file);
    event.target.value = '';
  }
}
