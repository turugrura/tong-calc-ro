import { DropdownModel } from '../models/dropdown.model';
import { CharacterBase } from './_character-base.abstract';
import { ClassID, ClassIcon } from './_class-name';
import { ArchBishop } from './arch-bishop';
import { Doram } from './doram';
import { DragonKnight } from './dragon-knight';
import { Genetic } from './genetic';
import { GitCross } from './git-cross';
import { Kagerou } from './kagerou';
import { Mechanic } from './mechanic';
import { Minstrel } from './minstrel';
import { Oboro } from './oboro';
import { Ranger } from './ranger';
import { Rebelion } from './rebellion';
import { RoyalGuard } from './royal-guard';
import { RuneKnight } from './rune-knight';
import { ShadowChaser } from './shadow-chaser';
import { Sorcerer } from './sorcerer';
import { SoulReaper } from './soul-reaper';
import { StarEmperor } from './star-emperor';
import { SuperNovice } from './super-novice';
import { Sura } from './sura';
import { Wanderer } from './wanderer';
import { Warlock } from './warlock';
import { Windhawk } from './windhawk';

export const getClassDropdownList = (): (DropdownModel & { icon: number; instant: CharacterBase })[] => {
  return [
    { label: ClassID[11], value: 11, icon: ClassIcon[11], instant: new RoyalGuard() },
    { label: ClassID[12], value: 12, icon: ClassIcon[12], instant: new RuneKnight() },
    { label: ClassID[7], value: 7, icon: ClassIcon[7], instant: new ArchBishop() },
    { label: ClassID[13], value: 13, icon: ClassIcon[13], instant: new Sura() },
    { label: ClassID[2], value: 2, icon: ClassIcon[2], instant: new Ranger() },
    { label: ClassID[21], value: 21, icon: ClassIcon[21], instant: new Minstrel() },
    { label: ClassID[22], value: 22, icon: ClassIcon[22], instant: new Wanderer() },
    { label: ClassID[5], value: 5, icon: ClassIcon[5], instant: new GitCross() },
    { label: ClassID[4], value: 4, icon: ClassIcon[4], instant: new ShadowChaser() },
    { label: ClassID[6], value: 6, icon: ClassIcon[6], instant: new Warlock() },
    { label: ClassID[8], value: 8, icon: ClassIcon[8], instant: new Sorcerer() },
    { label: ClassID[10], value: 10, icon: ClassIcon[10], instant: new Mechanic() },
    { label: ClassID[9], value: 9, icon: ClassIcon[9], instant: new Genetic() },
    { label: ClassID[30], value: 30, icon: ClassIcon[30], instant: new SuperNovice() },
    { label: ClassID[3], value: 3, icon: ClassIcon[3], instant: new SoulReaper() },
    { label: ClassID[33], value: 33, icon: ClassIcon[33], instant: new StarEmperor() },
    { label: ClassID[17], value: 17, icon: ClassIcon[17], instant: new Oboro() },
    { label: ClassID[18], value: 18, icon: ClassIcon[18], instant: new Kagerou() },
    { label: ClassID[1], value: 1, icon: ClassIcon[1], instant: new Rebelion() },
    { label: ClassID[31], value: 31, icon: ClassIcon[31], instant: new Doram() },

    { label: ClassID[4252], value: 4252, icon: ClassIcon[4252], instant: new DragonKnight() },
    { label: ClassID[4257], value: 4257, icon: ClassIcon[4257], instant: new Windhawk() },
  ];
};
