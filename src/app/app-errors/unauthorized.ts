import { AppErrorBase } from './base-error';

export class Unauthorized extends AppErrorBase {
  constructor() {
    super('Unauthorized');
  }
}
