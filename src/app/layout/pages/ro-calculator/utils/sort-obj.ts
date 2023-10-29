export const sortObj = <T>(field: keyof T) => {
  return (a: T, b: T) => {
    if (a[field] > b[field]) return 1;

    return -1;
  };
};
