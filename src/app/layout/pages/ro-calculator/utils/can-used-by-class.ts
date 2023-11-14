import { CharacterBase } from '../jobs/_character-base.abstract';

export const canUsedByClass = <T extends { usebleClass?: string[]; unusableClass?: string[] }>(
  _class: CharacterBase,
) => {
  return ({ unusableClass, usebleClass }: T): boolean => {
    let can = true;
    if (Array.isArray(usebleClass) && usebleClass.length > 0) {
      can = usebleClass.some((clsName) => _class.classNameSet.has(clsName));
    }
    if (Array.isArray(unusableClass) && unusableClass.length > 0) {
      can = !unusableClass.some((clsName) => _class.classNameSet.has(clsName));
    }

    return can;
  };
};
