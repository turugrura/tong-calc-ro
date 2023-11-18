export const floor = (n: number, digit = 0): number => {
  if (digit > 0) {
    const pow = Math.pow(10, digit);
    return floor(n * pow) / pow;
  }

  return Math.floor(n);
};
