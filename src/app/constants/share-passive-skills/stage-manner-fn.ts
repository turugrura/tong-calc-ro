import { genSkillList } from 'src/app/utils';
import { PassiveSkillModel } from '../../jobs/_character-base.abstract';

export const StageMannerFn = (): PassiveSkillModel => ({
  label: 'Stage Manner',
  name: 'Stage Manner',
  inputType: 'dropdown',
  dropdown: genSkillList(5),
});
