import { AtkSkillModel } from '../jobs/_character-base.abstract';
import { SkillAspdModel } from '../models/damage-summary.model';
import { EquipmentSummaryModel } from '../models/equipment-summary.model';
import { StatusSummary } from '../models/status-summary.model';
import { floor } from './floor';

export const calcSkillAspd = (params: {
  skillData: AtkSkillModel;
  totalEquipStatus: EquipmentSummaryModel;
  status: StatusSummary;
}): SkillAspdModel => {
  const { skillData, totalEquipStatus, status } = params;
  const { name, acd: skillAcd, cd: skillCd, fct: skillFct, vct: skillVct } = skillData;

  const reduceSkillCd = totalEquipStatus[`cd__${name}`] || 0;
  const reduceSkillVct = totalEquipStatus[`vct__${name}`] || 0;
  const reduceSkillVctFix = totalEquipStatus[`fix_vct__${name}`] || 0;
  const reduceSkillFct = totalEquipStatus[`fct__${name}`] || 0;
  const reduceSkillFctPercent = totalEquipStatus[`fctPercent__${name}`] || 0;
  const reduceSkillAcd = totalEquipStatus[`acd__${name}`] || 0;

  const { acd, vct, vct_inc = 0, fct, fctPercent } = totalEquipStatus;
  const { totalDex, totalInt } = status;

  const vctByStat = Math.max(0, 1 - Math.sqrt(floor((totalDex * 2 + totalInt) / 530, 3)));
  const vctGlobal = Math.max(0, 1 - (vct - vct_inc) / 100);
  const vctSkill = Math.max(0, 1 - reduceSkillVct / 100);

  const reducedVct = Math.max(0, floor((skillVct - reduceSkillVctFix) * vctByStat * vctGlobal * vctSkill, 2));
  const reducedCd = Math.max(0, floor(skillCd - reduceSkillCd, 2));
  const reducedAcd = Math.max(0, floor((skillAcd - reduceSkillAcd) * (1 - acd * 0.01), 2));

  const reducedFct = Math.max(
    0,
    floor((skillFct - reduceSkillFct - fct) * (1 - fctPercent * 0.01) * (1 - reduceSkillFctPercent * 0.01), 2),
  );

  const blockPeriod = Math.max(reducedCd, reducedAcd);
  const castPeriod = floor(reducedVct + reducedFct, 3);
  const hitPeriod = floor(blockPeriod + castPeriod, 3);

  return {
    cd: skillCd,
    reducedCd,
    vct: skillVct,
    sumDex2Int1: totalDex * 2 + totalInt,
    vctByStat,
    vctSkill,
    reducedVct,
    fct: skillFct,
    reducedFct,
    acd: skillAcd,
    reducedAcd,
    castPeriod: castPeriod,
    hitPeriod,
    totalHitPerSec: floor(1 / hitPeriod, 2),
  };
};
