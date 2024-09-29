import { AtkSkillModel } from '../jobs/_character-base.abstract';
import { SkillAspdModel } from '../models/damage-summary.model';
import { EquipmentSummaryModel } from '../models/equipment-summary.model';
import { StatusSummary } from '../models/status-summary.model';
import { floor } from './floor';
import { round, roundUp } from './round';

export const calcSkillAspd = (params: {
  skillData: AtkSkillModel;
  totalEquipStatus: EquipmentSummaryModel;
  status: StatusSummary;
  skillLevel: number;
}): SkillAspdModel => {
  const { skillData, totalEquipStatus, status, skillLevel } = params;
  const { name, acd: baseSkillAcd } = skillData;
  const { cd: baseSkillCd, fct: baseSkillFct, vct: baseSkillVct } = skillData;

  const skillAcd = typeof baseSkillAcd === 'function' ? baseSkillAcd(skillLevel) : baseSkillAcd;
  let skillCd = typeof baseSkillCd === 'function' ? baseSkillCd(skillLevel) : baseSkillCd;
  let skillFct = typeof baseSkillFct === 'function' ? baseSkillFct(skillLevel) : baseSkillFct;
  let skillVct = typeof baseSkillVct === 'function' ? baseSkillVct(skillLevel) : baseSkillVct;
  skillCd = floor(skillCd, 3)
  skillFct = floor(skillFct, 3)
  skillVct = floor(skillVct, 3)
  if (totalEquipStatus['releasedSkill']) {
    skillCd = 0;
    skillFct = 0;
    skillVct = 0;
  }

  const reduceSkillCd = totalEquipStatus[`cd__${name}`] || 0;
  const reduceSkillVct = totalEquipStatus[`vct__${name}`] || 0;
  const reduceSkillVctFix = totalEquipStatus[`fix_vct__${name}`] || 0;
  const reduceSkillFct = totalEquipStatus[`fct__${name}`] || 0;
  const reduceSkillFctPercent = totalEquipStatus[`fctPercent__${name}`] || 0;
  const reduceSkillAcd = totalEquipStatus[`acd__${name}`] || 0;

  const { acd, vct, vct_inc = 0, fct, fctPercent, vctBySkill = 0 } = totalEquipStatus;
  const { totalDex, totalInt } = status;

  const precision = 4;
  const dex2Int1 = totalDex * 2 + totalInt;
  const vctByStat = Math.max(0, 1 - Math.sqrt(floor(dex2Int1 / 530, 5)));
  const vctGlobal = Math.max(0, 1 - (vct - vct_inc) / 100);
  const vctSkill = Math.max(0, 1 - reduceSkillVct / 100);
  const vctBySkill_ = (100 - vctBySkill) / 100;

  const reducedVct = Math.max(0, roundUp((skillVct - reduceSkillVctFix) * vctByStat * vctGlobal * vctSkill * vctBySkill_, precision));
  const reducedCd = Math.max(0, roundUp(skillCd - reduceSkillCd, precision));
  const reducedAcd = Math.max(0, round((skillAcd - reduceSkillAcd) * (1 - acd * 0.01), precision));

  const reducedFct = Math.max(0, roundUp((skillFct - reduceSkillFct - fct) * (1 - fctPercent * 0.01) * (1 - reduceSkillFctPercent * 0.01), precision));

  const blockPeriod = Math.max(reducedCd, reducedAcd);
  const castPeriod = roundUp(reducedVct + reducedFct, precision);
  const hitPeriod = round(blockPeriod + castPeriod, 5);
  // console.log({ vctByStat, reducedVct, reducedCd, reducedAcd, hitPeriod });

  return {
    cd: skillCd,
    reducedCd,
    vct: skillVct,
    sumDex2Int1: dex2Int1,
    vctByStat,
    vctSkill,
    reducedVct,
    fct: skillFct,
    reducedFct,
    acd: skillAcd,
    reducedAcd,
    castPeriod: castPeriod,
    hitPeriod,
    totalHitPerSec: floor(1 / hitPeriod, 1),
  };
};
