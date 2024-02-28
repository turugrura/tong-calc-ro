import { JobBuffs } from '../constants/job-buffs';
import { CharacterBase } from '../jobs/_character-base.abstract';
import { MainModel } from '../models/main.model';

export const toUpsertPresetModel = (model: MainModel, cClass: CharacterBase) => {
  const activeSkills = model.activeSkills || [];
  const passiveSkills = model.passiveSkills || [];

  const skillBuffMap = {};
  const passiveSkillMap = {};
  const activeSkillMap = {};

  try {
    for (let i = 0; i < JobBuffs.length; i++) {
      skillBuffMap[JobBuffs[i].name] = model?.skillBuffs?.[i];
    }
    for (let i = 0; i < cClass.passiveSkills.length; i++) {
      passiveSkillMap[cClass.passiveSkills[i].name] = passiveSkills[i];
    }
    for (let i = 0; i < cClass.activeSkills.length; i++) {
      activeSkillMap[cClass.activeSkills[i].name] = activeSkills[i];
    }
  } catch (error) {
    console.log({ error });
  }

  return {
    ...model,
    activeSkills,
    passiveSkills,
    skillBuffMap,
    activeSkillMap,
    passiveSkillMap,
  };
};
