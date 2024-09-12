export const sortObj = <T>(field: keyof T, order = 1) => {
  return (a: T, b: T) => {
    if (a[field] > b[field]) return 1 * order;

    return -1 * order;
  };
};
