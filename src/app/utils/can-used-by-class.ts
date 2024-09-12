import { CharacterBase } from '../jobs/_character-base.abstract';

export const canUsedByClass = <T extends { usableClass?: string[]; unusableClass?: string[] }>(_class: CharacterBase) => {
  return ({ unusableClass, usableClass }: T): boolean => {
    let can = true;
    if (Array.isArray(usableClass) && usableClass.length > 0) {
      can = usableClass.some((clsName) => _class.classNameSet.has(clsName));
    }
    if (Array.isArray(unusableClass) && unusableClass.length > 0) {
      can = !unusableClass.some((clsName) => _class.classNameSet.has(clsName));
    }

    return can;
  };
};
