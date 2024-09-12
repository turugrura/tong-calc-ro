export enum ItemOptionNumber {
  /**
   * !!! [Warning] system treat W_Left_1 as an Righ hand side
   */
  W_Left_1 = 0,
  W_Left_2 = 1,
  W_Left_3 = 2,

  W_Right_1 = 3,
  W_Right_2 = 4,
  W_Right_3 = 5,

  Shield_1 = 6,
  Shield_2 = 7,
  // Shield_3,

  H_Upper_1 = 8,
  H_Upper_2 = 9,
  // H_Upper_3,
  H_Mid_1 = 10,
  H_Mid_2 = 11,
  // H_Mid_3,
  // H_Low_1,
  // H_Low_2,
  // H_Low_3,

  Armor_1 = 12,
  Armor_2 = 13,
  Armor_3 = 28,
  // Armor_3,
  Garment_1 = 14,
  Garment_2 = 15,
  // Garment_3,
  // Boot_1,
  // Boot_2,
  // Boot_3,

  A_Right_1 = 16,
  A_Right_2 = 17,
  // A_Right_3,
  A_Left_1 = 18,
  A_Left_2 = 19,
  // A_Left_3,

  SD_Wp_1 = 20,
  SD_Ar_1 = 21,
  SD_Sh_1 = 22,
  SD_B_1 = 23,
  SD_Ear_1 = 24,
  SD_Pan_1 = 25,

  X_HP = 26,
  X_SP = 27,
}

const slotNumbers = Object.values(ItemOptionNumber).filter((a) => Number.isInteger(a)) as number[];

export const MAX_OPTION_NUMBER = Math.max(...slotNumbers);
