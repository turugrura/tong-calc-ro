import { EquipmentSummaryModel } from './equipment-summary.model';

export interface PostCalcSkillModel {
  totalBonus: EquipmentSummaryModel;
  skillName: string;
  skillLevel: number;
}
