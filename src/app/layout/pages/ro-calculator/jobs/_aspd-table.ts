import { ClassName } from './_class-name';

type WSubType =
  | 'Katar'
  | 'Bow'
  | 'Instrument'
  | 'Whip'
  | 'One-Handed Staff'
  | 'Two-Handed Staff'
  | 'Gatling Gun'
  | 'Dagger'
  | 'left-Dagger'
  | 'Two-Handed Axe'
  | 'Axe'
  | 'left-Axe'
  | 'Rod'
  | 'Book'
  | 'Knuckle'
  | 'Mace'
  | 'Sword'
  | 'left-Sword'
  | 'Two-Handed Sword'
  | 'Jur'
  | 'Pistol'
  | 'Rifle'
  | 'Shotgun'
  | 'Grenade Launcher';

type MainAspdEffect = 'base' | 'shield';
type X = {
  [key in WSubType]?: number;
};
type Y = {
  [key in MainAspdEffect]: number;
};
interface XX extends Y, X {}

export const AspdTable: Record<ClassName, XX> = {
  [ClassName.Ranger]: { base: 156, shield: -8, Dagger: -10, Bow: -9 },
  [ClassName.Minstrel]: { base: 156, shield: -7, Dagger: -12, Bow: -10, Instrument: -5, Whip: -5 },
  [ClassName.Wanderer]: { base: 156, shield: -7, Dagger: -12, Bow: -10, Instrument: -5, Whip: -5 },
  [ClassName.Mechanic]: { base: 156, shield: -6, Dagger: -20, Sword: -25, Axe: -5, 'Two-Handed Axe': -8, Mace: -8 },
  [ClassName.Genetic]: { base: 156, shield: -4, Dagger: -10, Sword: -4, Axe: -11, 'Two-Handed Axe': -11, Mace: -5 },
  [ClassName.ArchBishop]: {
    base: 151,
    shield: -5,
    Mace: 0,
    'One-Handed Staff': -15,
    'Two-Handed Staff': -10,
    Book: 1,
    Knuckle: -5,
  },
  [ClassName.Sura]: { base: 158, shield: -5, Mace: -5, 'One-Handed Staff': -10, 'Two-Handed Staff': -12, Knuckle: -1 },
  [ClassName.Thief]: { base: 156, shield: -5 },
  [ClassName.AssasinCross]: { base: 156, shield: -5 },
  [ClassName.GuillotineCross]: {
    base: 156,
    shield: -9,
    Dagger: -2,
    Sword: -25,
    Katar: -2,
    'left-Dagger': -10,
    'left-Sword': -16,
  },
  [ClassName.Rogue]: { base: 156, shield: -5 },
  [ClassName.ShadowChaser]: { base: 156, shield: -5, Dagger: -3, Sword: -7, Bow: -7, Axe: -159 },
  [ClassName.Sage]: { base: 156, shield: -5 },
  [ClassName.Sorcerer]: {
    base: 156,
    shield: -5,
    Dagger: -10,
    'One-Handed Staff': -5,
    'Two-Handed Staff': -5,
    Book: -5,
  },
  [ClassName.Mage]: { base: 156, shield: -5 },
  [ClassName.Wizard]: { base: 156, shield: -5 },
  [ClassName.Warlock]: { base: 151, shield: -5, Dagger: -7, 'One-Handed Staff': -5, 'Two-Handed Staff': -5 },
  [ClassName.SoulReaper]: { base: 146, shield: -8, Dagger: 0, 'Two-Handed Staff': -3, 'One-Handed Staff': -3 },
  [ClassName.Rebellion]: {
    base: 146,
    shield: -6,
    Pistol: 5,
    Rifle: -5,
    Shotgun: -40,
    'Gatling Gun': 0,
    'Grenade Launcher': -50,
  },
} as const;