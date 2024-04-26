export interface ItemRankingModel {
  ItemId: number | string;
  ItemName: string;
  ColorStyle: string;
  Percentage: number;
  UsingRate: number;
  TotalPreset: number;
  TotalAccount: number;
  TotalEnchant: number;
  Enchants: Record<string, number>;
  EnchantInfos: { id: number; name: string }[];
  IsEnchant: boolean;
}
