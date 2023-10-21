import { PreparedMonsterModel } from './prepared-monster.model';
import { Weapon } from './weapon';

export interface InfoForClass {
  weapon: Weapon;
  monster: PreparedMonsterModel;
  model: Record<string, any>;
  totalBonus: Record<string, any>;
}
