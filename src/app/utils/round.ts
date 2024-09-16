export const round = (val: number, precision: number): number => {
  const factor = Math.pow(10, precision);

  return Math.round(val * factor) / factor;
};

export const roundUp = (number: number, precision: number): number => {
  const factor = Math.pow(10, precision);

  return Math.ceil(number * factor) / factor;
};
