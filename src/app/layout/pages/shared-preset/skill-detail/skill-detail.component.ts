import { Component, Input, OnInit } from '@angular/core';
import { PresetModel } from 'src/app/api-services';
import { ActiveSkillModel, CharacterBase } from '../../../../jobs/_character-base.abstract';
import { JobBuffs } from '../../../../constants/job-buffs';

@Component({
    selector: 'app-skill-detail',
    templateUrl: './skill-detail.component.html',
    styleUrls: ['./skill-detail.component.css'],
    standalone: false
})
export class SkillDetailComponent implements OnInit {
  @Input({ required: true }) itemMap = {} as any;
  @Input({ required: true }) model = {} as any as PresetModel;
  @Input({ required: true }) job: CharacterBase;

  consumables = [] as { value: number; label: string }[];
  buffSkills = [] as { value: string; label: string }[];
  learnedSkills = [] as { value: string; label: string }[];
  activeSkills = [] as { value: string; label: string }[];

  constructor() {}

  ngOnInit() {
    this.formatSKillToDisplay();
  }

  private formatSKillToDisplay() {
    if (!this.job || !this.model) return;

    const consumables = [...(this.model.consumables || []), ...(this.model.consumables2 || []), ...(this.model.aspdPotions || []), this.model.aspdPotion].filter(Boolean);
    const arr = [] as typeof this.consumables;
    for (const itemId of consumables) {
      const item = this.itemMap[itemId];
      if (!item) continue;

      arr.push({
        label: item.name,
        value: itemId,
      });
    }
    this.consumables = arr;

    this.buffSkills = this.toStrArray(this.model.skillBuffMap, JobBuffs);
    this.learnedSkills = this.toStrArray(this.model.passiveSkillMap, this.job.passiveSkills);
    this.activeSkills = this.toStrArray(this.model.activeSkillMap, this.job.activeSkills);
  }

  private toStrArray(skillMap: Record<string, number>, skillMasterData: ActiveSkillModel[]) {
    const buffMap = skillMap || {};
    const arr = [] as { value: string; label: string }[];
    for (const master of skillMasterData || []) {
      const seletedLv = buffMap[master.name];
      if (!seletedLv || seletedLv === 0) continue;

      const lv = master.dropdown.find((a) => a.value === seletedLv);
      if (!lv) continue;

      arr.push({
        value: lv.label,
        label: master.label,
      });
    }

    return arr;
  }
}
