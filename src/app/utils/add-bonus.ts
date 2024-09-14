export const addBonus = <T>(model: T, bonusName: keyof T, bonusVal: number) => {
  (model[bonusName] as number) = ((model[bonusName] as number) || 0) + bonusVal;
};
