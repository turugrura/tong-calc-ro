export const floor = (_n: number, digit = 0): number => {
  const nn = _n;

  if (digit > 0) {
    const pow = Math.pow(10, digit);
    return floor(nn * pow) / pow;
  }

  return Math.floor(nn);
};
