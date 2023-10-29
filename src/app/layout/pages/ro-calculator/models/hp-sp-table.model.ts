export interface HpSpModel {
  jobs: Record<string, boolean>;
  baseHp: Record<string, number>;
  baseSp: Record<string, number>;
}

export type HpSpTable = HpSpModel[];
