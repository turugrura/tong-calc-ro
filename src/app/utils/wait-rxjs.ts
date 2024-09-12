import { delay, of, take } from 'rxjs';

export const waitRxjs = <T>(second: number = 0.1, res = null as T) => {
  return of(res).pipe(delay(1000 * second), take(1));
};
