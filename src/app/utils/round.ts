export const round = (val: number, precision: number): number => {
  const factor = Math.pow(10, precision);

  return Math.round(val * factor) / factor;
};
