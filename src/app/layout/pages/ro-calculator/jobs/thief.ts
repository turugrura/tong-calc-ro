import { ClassName } from './_class-name';
import { ActiveSkillModel, AtkSkillModel, CharacterBase, PassiveSkillModel } from './_character-base.abstract';
import { ImproveDodgeFn } from '../constants/share-passive-skills';

const jobBonusTable: Record<number, [number, number, number, number, number, number]> = {};

export class Thief extends CharacterBase {
  protected readonly CLASS_NAME = ClassName.Thief;
  protected readonly JobBonusTable = jobBonusTable;

  protected readonly initialStatusPoint = 40;
  protected readonly classNames = ['Thief', 'Thief Cls', 'Thief Class'];
  protected readonly _atkSkillList: AtkSkillModel[] = [];
  protected readonly _activeSkillList: ActiveSkillModel[] = [];
  protected readonly _passiveSkillList: PassiveSkillModel[] = [ImproveDodgeFn()];
}
