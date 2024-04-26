import { ClassID } from '../../ro-calculator/jobs/_class-name';
import { EquipmentPosition } from './equipment-position';
import { ItemRankingModel } from './item-ranking.model';

export type JobIdMapType<T> = Record<keyof typeof ClassID, T>;

export type ItemPositionType = EquipmentPosition;

export type EquipmentRankingModel = Record<ItemPositionType, ItemRankingModel[]>;

export type TotalSummaryModel = JobIdMapType<Record<string, EquipmentRankingModel>>;

export type JobSummary = JobIdMapType<number>;

export type JobSkillSummary = JobIdMapType<Record<string, number>>;
