import { ClassName } from './_class-name';
import { ActiveSkillModel, AtkSkillModel, CharacterBase, PassiveSkillModel } from './_character-base.abstract';
import { DemonBane, Heal } from '../constants/share-passive-skills';

const jobBonusTable: Record<number, [number, number, number, number, number, number]> = {};

export class Acolyte extends CharacterBase {
  protected readonly CLASS_NAME = ClassName.Acolyte;
  protected readonly JobBonusTable = jobBonusTable;

  protected readonly initialStatusPoint = 40;
  protected readonly classNames = ['Acolyte', 'Acolyte Cls', 'Acolyte Class'];
  protected readonly _atkSkillList: AtkSkillModel[] = [];
  protected readonly _activeSkillList: ActiveSkillModel[] = [];
  protected readonly _passiveSkillList: PassiveSkillModel[] = [Heal, DemonBane];
}
