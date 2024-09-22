import { agi, fatal14, fs47, int, luk, sh14, sp14, str, vit } from './_basic';

export const heroBootLt4 = [...str(1, 5), ...int(1, 5), ...agi(1, 5), ...vit(1, 5), ...luk(1, 5)];

export const heroBootLt3 = [...sp14, ...sh14, ...fatal14, ...fs47];

export const heroBootLt2 = ['HeroBoots_STR', 'HeroBoots_LUK', 'HeroBoots_DEX', 'HeroBoots_INT', 'HeroBoots_VIT', 'HeroBoots_AGI'];
