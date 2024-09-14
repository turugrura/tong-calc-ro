import { DropdownModel } from '../models/dropdown.model';
import { CharacterBase } from './_character-base.abstract';
import { ClassID, ClassIcon } from './_class-name';
import { AbyssChaser } from './AbyssChaser';
import { ArchBishop } from './ArchBishop';
import { ArchMage } from './ArchMage';
import { Biolo } from './Biolo';
import { Cardinal } from './Cardinal';
import { Doram } from './Doram';
import { DragonKnight } from './DragonKnight';
import { ElementalMaster } from './ElementalMaster';
import { Genetic } from './Genetic';
import { GuillotineCross } from './GuillotineCross';
import { HyperNovice } from './HyperNovice';
import { ImperialGuard } from './ImperialGuard';
import { Inquisitor } from './Inquisitor';
import { Kagerou } from './Kagerou';
import { Mechanic } from './Mechanic';
import { Meister } from './Meister';
import { Minstrel } from './Minstrel';
import { NightWatch } from './NightWatch';
import { Oboro } from './Oboro';
import { Ranger } from './Ranger';
import { Rebellion } from './Rebellion';
import { RoyalGuard } from './RoyalGuard';
import { RuneKnight } from './RuneKnight';
import { ShadowChaser } from './ShadowChaser';
import { ShadowCross } from './ShadowCross';
import { Shinkiro } from './Shinkiro';
import { Shiranui } from './Shiranui';
import { SkyEmperor } from './SkyEmperor';
import { Sorcerer } from './Sorcerer';
import { SoulReaper } from './SoulReaper';
import { SoulAscetic } from './SoulAscetic';
import { SpiritHandler } from './SpiritHandler';
import { StarEmperor } from './StarEmperor';
import { SuperNovice } from './SuperNovice';
import { Sura } from './Sura';
import { Troubadour } from './Troubadour';
import { Trouvere } from './Trouvere';
import { Wanderer } from './Wanderer';
import { Warlock } from './Warlock';
import { Windhawk } from './Windhawk';

const toClassItem = (id: number) => ({ label: ClassID[id], value: id, icon: ClassIcon[id] });

export const getClassDropdownList = (): (DropdownModel & { icon: number; instant: CharacterBase })[] => {
  return [
    { ...toClassItem(11), instant: new RoyalGuard() },
    { ...toClassItem(12), instant: new RuneKnight() },
    { ...toClassItem(7), instant: new ArchBishop() },
    { ...toClassItem(13), instant: new Sura() },
    { ...toClassItem(2), instant: new Ranger() },
    { ...toClassItem(21), instant: new Minstrel() },
    { ...toClassItem(22), instant: new Wanderer() },
    { ...toClassItem(5), instant: new GuillotineCross() },
    { ...toClassItem(4), instant: new ShadowChaser() },
    { ...toClassItem(6), instant: new Warlock() },
    { ...toClassItem(8), instant: new Sorcerer() },
    { ...toClassItem(10), instant: new Mechanic() },
    { ...toClassItem(9), instant: new Genetic() },

    { ...toClassItem(30), instant: new SuperNovice() },
    { ...toClassItem(3), instant: new SoulReaper() },
    { ...toClassItem(33), instant: new StarEmperor() },
    { ...toClassItem(17), instant: new Oboro() },
    { ...toClassItem(18), instant: new Kagerou() },
    { ...toClassItem(1), instant: new Rebellion() },
    { ...toClassItem(31), instant: new Doram() },

    { ...toClassItem(4252), instant: new DragonKnight() },
    { ...toClassItem(4258), instant: new ImperialGuard() },
    { ...toClassItem(4256), instant: new Cardinal() },
    { ...toClassItem(4262), instant: new Inquisitor() },
    { ...toClassItem(4257), instant: new Windhawk() },
    { ...toClassItem(4254), instant: new ShadowCross() },
    { ...toClassItem(4260), instant: new AbyssChaser() },
    { ...toClassItem(4263), instant: new Troubadour() },
    { ...toClassItem(4264), instant: new Trouvere() },
    { ...toClassItem(4255), instant: new ArchMage() },
    { ...toClassItem(4261), instant: new ElementalMaster() },
    { ...toClassItem(4253), instant: new Meister() },
    { ...toClassItem(4259), instant: new Biolo() },

    { ...toClassItem(4307), instant: new HyperNovice() },
    { ...toClassItem(4303), instant: new SoulAscetic() },
    { ...toClassItem(4302), instant: new SkyEmperor() },
    { ...toClassItem(4305), instant: new Shiranui() },
    { ...toClassItem(4304), instant: new Shinkiro() },
    { ...toClassItem(4306), instant: new NightWatch() },
    { ...toClassItem(4308), instant: new SpiritHandler() },
  ];
};
