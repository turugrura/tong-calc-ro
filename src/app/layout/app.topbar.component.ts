import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthService } from '../api-services';
import { LayoutService } from './service/app.layout.service';

@Component({
  selector: 'app-topbar',
  templateUrl: './app.topbar.component.html',
  styleUrls: ['./app.topbar.component.css'],
  providers: [ConfirmationService, MessageService, DialogService],
})
export class AppTopBarComponent implements OnInit, OnDestroy {
  activeItem: MenuItem | undefined;
  items: MenuItem[] = [
    {
      label: 'Calculator',
      icon: 'pi pi-fw pi-home',
      routerLink: ['/'],
      routerLinkActiveOptions: {
        exact: true,
      },
    },
    {
      label: 'Shared Presets',
      icon: 'pi pi-fw pi-list',
      routerLink: ['/shared-presets'],
    },
    {
      label: 'Item Ranking',
      icon: 'pi pi-fw pi-sort-amount-down',
      routerLink: ['/preset-summary'],
      isNew: true,
    } as any,
  ];

  @ViewChild('menubutton') menuButton!: ElementRef;

  @ViewChild('topbarmenubutton') topbarMenuButton!: ElementRef;

  @ViewChild('topbarmenu') menu!: ElementRef;

  visible: boolean = false;
  visibleInfo: boolean = false;
  visibleReference = false;
  env = environment;

  infos = [
    'ข้อมูลไอเทม มอนสเตอร์ และสกิล ทั้งหมดมาจากเว็บ "divine-pride"',
    'เปลี่ยน Theme ทึ่ปุ่ม Config ตรงขวากลาง',
    'ข้อมูลที่บันทึกไว้จะถูกเก็บไว้ที่ browser, ถ้าล้างข้อมูล browser ก็จะถูกลบไปด้วย',
    'เงื่อนไขที่เขียนไว้ว่า "ทุกๆการเรียนรู้สกิล" ต้องกดอัพในช่อง "Learn to get bonuses" ถึงจะได้ bonus, ถ้าไม่มีให้อัพจะให้เป็น bonus เป็น Lv MAX',
    'options ในแถวอาวุธจะอยู่ตลอด สามารถใช้เป็น What if ได้',
    'My Magical Element ใน options = เพิ่ม Damage ทางเวทมนตร์ธาตุ ...',
    'การเปรียบเทียบอาวุธ 2 มือยังไม่รองรับการเปลี่ยนมือซ้าย',
    'Job 61-64, 66-69 จะได้ Bonus ไม่ตรงเพราะไม่มีข้อมูล',
    'Tab "Summary" คือ ใส่อะไรบ้าง/อัพสกิลอะไรบ้าง/การคำนวนทั้งหมด',
    'Tab "Equipments Summary" คือ bonus ของไอเทมแบบภาพรวม',
    'Tab "Item Descriptions" คือ bonus ของไอเทมแต่ละชิ้นและคำอธิบาย (เอาไว้ตรวจสอบว่าได้ bonus ถูกไหม)',
  ];

  references: { label: string; link: string; writer: string; date?: string; }[] = [
    {
      label: 'Jobs Improvement Bundle Update (20 June 2024)',
      writer: 'RO GGT',
      link: 'https://ro.gnjoy.in.th/bundleupdate13',
    },
    {
      label: 'Old Headgear & Enchant Improve',
      writer: 'RO GGT',
      link: 'https://ro.gnjoy.in.th/old-headgear-enchant-improve',
    },
    {
      label: 'New Elemental Table Adjustment',
      writer: 'RO GGT',
      link: 'https://ro.gnjoy.in.th/new-elemental-table-adjustment',
    },
    {
      label: 'Quarter 1 Class Improvement 2024',
      writer: 'RO GGT',
      link: 'https://ro.gnjoy.in.th/quarter-1-class-improvement-2024',
    },
    {
      label: 'Bonus JOB LV.70',
      writer: 'RO GGT',
      link: 'https://ro.gnjoy.in.th/newyear_adventure_2024/assets/img/additional/Ragnarok-Today/POP-UP-Job-BONUS.jpg',
    },
    {
      label: 'Class Improvement [Sura, Warlock, Minstrel&Wanderer]',
      writer: 'RO GGT',
      link: 'https://ro.gnjoy.in.th/class-improvement-sura-warlock-minstrelwanderer',
    },
    {
      label: 'Skills Balance (1st, 2nd and transcendent classes skills)',
      writer: 'RO GGT',
      link: 'https://ro.gnjoy.in.th/skills-balance-1st-2nd-and-transcendent-classes-skills',
    },
    {
      label: 'Geffen Magic Tournament Enchant System Update!',
      writer: 'RO GGT',
      link: 'https://ro.gnjoy.in.th/geffen-magic-tournament-enchant-system-update',
    },
    {
      label: 'Develop note ! Balance Skill ขยายขีดจำกัดเลเวลสูงสุดของ Extended Class',
      writer: 'RO GGT',
      link: 'https://ro.gnjoy.in.th/develop-note-extended',
    },
    {
      label: 'Items & Monsters & Skill infomation',
      writer: 'DIVINE PRIDE',
      link: 'https://www.divine-pride.net/',
    },
    {
      label: 'Skill infomation',
      writer: 'IRO Wiki',
      link: 'https://irowiki.org/wiki/Main_Page',
    },
    {
      label: 'ATK',
      writer: 'IRO Wiki',
      link: 'https://irowiki.org/wiki/ATK',
    },
    {
      label: 'MATK',
      writer: 'IRO Wiki',
      link: 'https://irowiki.org/wiki/MATK',
    },
    {
      label: 'Malangdo Enchants',
      writer: 'IRO Wiki',
      link: 'https://irowiki.org/wiki/Malangdo_Enchants',
    },
    {
      label: 'KRO : Jobs improvement project',
      writer: 'Sigma',
      link: 'https://www.divine-pride.net/forum/index.php?/topic/3723-kro-jobs-improvement-project',
    },
    {
      label: 'KRO : Episode 17.2 enchant info : Automatic equipment and Sin weapons.',
      writer: 'Sigma',
      link: 'https://www.divine-pride.net/forum/index.php?/topic/4176-kro-episode-172-enchant-info-automatic-equipment-and-sin-weapons',
    },
    {
      label: 'KRO : Glast Heim challenge mode enchant',
      writer: 'Sigma',
      link: 'https://www.divine-pride.net/forum/index.php?/topic/3879-kro-glast-heim-challenge-mode-enchant/',
    },
    {
      label: 'KRO : Thanatos Tower revamp',
      writer: 'Sigma',
      link: 'https://www.divine-pride.net/forum/index.php?/topic/4277-kro-thanatos-tower-revamp/',
    },
    {
      label: 'KRO : Illusion of Under Water',
      writer: 'Sigma',
      link: 'https://www.divine-pride.net/forum/index.php?/topic/4319-kro-illusion-of-under-water',
    },
    {
      label: 'RO Podcast EP 7 : ส่อง KRO patchnote Q4 + คุยเรื่อง debuff',
      writer: 'Sigma the fallen',
      link: 'https://www.youtube.com/live/xUiYYi6o6gA?si=EdJvXnchwtionL_4&t=1515',
    },
    {
      label: 'สกิล Class 4 V2',
      writer: 'Sigma the fallen',
      link: 'https://sigmathefallen.blogspot.com/',
    },
    {
      label: 'เจาะลึก Stat ต่างๆ ใน Renewal Part I : Matk & Mdef',
      writer: 'Sigma the fallen',
      link: 'https://web.facebook.com/notes/3202008843255644/',
    },
    {
      label: 'Enchantment System',
      writer: 'Hazy Forest',
      link: 'https://hazyforest.com/equipment:enchantment_system',
    },
    {
      label: 'Enchant Deadly Poison หรือที่เรียกติดปากกันว่า EDP',
      writer: 'Assing',
      link: 'https://www.pingbooster.com/th/blog/detail/ragnarok-online-edp-enchant-deadly-poison-assassin',
    },
    {
      label: 'คุณสมบัติลับยาแอส ทำยังไงให้ตีแรงที่สุด (โปรดเปิดคำบรรยายเพื่อข้อมูลที่ครบถ้วน)',
      writer: '/\\ssing (แอสซิ่ง)',
      link: 'https://youtu.be/WvSbULJ2CGU?si=Ae5vY9teaGZDXSRB',
    },
    {
      label: 'Enchants',
      writer: 'trifectaro.com',
      link: 'https://trifectaro.com/mediawiki/index.php/Enchants',
    },
    {
      label: 'Open-source RO emulator',
      writer: 'rAthena',
      link: 'https://github.com/rathena/rathena',
    },
    // {
    //   label: '',
    //   writer: '',
    //   link: '',
    // },
  ];

  updates: { v: string; date: string; logs: string[]; }[] = [
    {
      v: 'V3.2.7',
      date: '31-05-2568',
      logs: [
        "Added Master shadow sets, Trait shadow sets",
        "Added Hyper Novice skills (Jupitel Thunderstorm, Hell's Drive)",
        'Updated Item Ranking data',
      ],
    },
    {
      v: 'V3.2.6',
      date: '29-05-2568',
      logs: [
        "Added Official updated items",
      ],
    },
    {
      v: 'V3.2.5',
      date: '30-04-2568',
      logs: [
        "Added Official updated items",
      ],
    },
    {
      v: 'V3.2.4',
      date: '10-04-2568',
      logs: [
        "Added Official updated items",
      ],
    },
    {
      v: 'V3.2.3',
      date: '04-04-2568',
      logs: [
        "Added Official updated items",
        "Added ArchMage skills (All Bloom, Violent Quake) !!! calculate just 1 hit DO NOT trust DPS",
        "Fixed Cardinal 'Fidus Animus' should affect to 'Framen', 'Arbitrium' & 'Pneumaticus Procella' only",
        "Fixed Gray Wolf Soul Ring Enchant",
      ],
    },
    {
      v: 'V3.2.2',
      date: '20-03-2568',
      logs: [
        "Added Official updated items",
        "Fixed cri damage percentage of StarEmperor skills",
        "Fixed Doram skill not be the latest version (Catnip Meteor, Lunatic Carrot Beat)",
      ],
    },
    {
      v: 'V3.2.1',
      date: '06-03-2568',
      logs: [
        "Added Official updated items",
      ],
    },
    {
      v: 'V3.2.0',
      date: '02-03-2568',
      logs: [
        "Updated Main class skill V3",
        "Updated Extended class skill V2",
        "Added Official updated items",
      ],
    },
    {
      v: 'V3.1.15',
      date: '06-02-2568',
      logs: [
        "Added Official updated items",
        "Added Time Gap weapons",
        "Added Yorscalp set",
      ],
    },
    {
      v: 'V3.1.14',
      date: '24-01-2568',
      logs: [
        "Added Trait stat options",
        "Added Official updated items",
      ],
    },
    {
      v: 'V3.1.13',
      date: '16-01-2568',
      logs: [
        "Added Exotic-LT enchantment",
        "Fixed Inquisitor aspd penalty for knuckle (-10 --> -1)",
      ],
    },
    {
      v: 'V3.1.12',
      date: '09-01-2568',
      logs: [
        "Added Official updated items",
      ],
    },
    {
      v: 'V3.1.11',
      date: '12-12-2567',
      logs: [
        "Added Official updated items",
      ],
    },
    {
      v: 'V3.1.10',
      date: '07-12-2567',
      logs: [
        "Fixed cri rate effective of Crescive Bolt from 50% to 100%",
        "Added skills Hawk Rush, Dancing Knife, From the Abyss, Abyss Square",
      ],
    },
    {
      v: 'V3.1.9',
      date: '01-12-2567',
      logs: [
        "Fixed cri damage effective of 4th class skills from 100% to 50%",
        "Fixed Inquisitor aspd",
        "Added Official updated items",
      ],
    },
    {
      v: 'V3.1.8',
      date: '21-11-2567',
      logs: [
        "Added Official updated items",
      ],
    },
    {
      v: 'V3.1.7',
      date: '14-11-2567',
      logs: [
        "Updated Booster shadows to V2",
      ],
    },
    {
      v: 'V3.1.6',
      date: '07-11-2567',
      logs: [
        "Added Official updated items",
        'Updated Ranking data',
      ],
    },
    {
      v: 'V3.1.5',
      date: '31-10-2567',
      logs: [
        "Added Official updated items",
        "Added Item series (Glacier weapons, Herosria accessories, Unknown boots)",
        'Fixed reported bugs',
      ],
    },
    {
      v: 'V3.1.4',
      date: '20-10-2567',
      logs: [
        "Changed monsters HP (Rudus4, Amiticia, Niffheim)",
        "Calculate debuff as bug version [Raid + DC = melee 290%, + Quake = 440%] [Raid + Spore = Range 220%, + Oleum + Quake = 485%]",
        "Added Adulter Fides weapons",
        'Added requested items/monsters',
        'Fixed reported bugs',
      ],
    },
    {
      v: 'V3.1.3',
      date: '03-10-2567',
      logs: [
        "Added item series (Glacier armor)",
        'Added Official updated items',
      ],
    },
    {
      v: 'V3.1.2',
      date: '30-09-2567',
      logs: [
        "Added item series (Gaeblog, Muqaddas weapon, Flush Einbech weapons)",
        'Added requested items/monsters',
        'Fixed reported bugs',
      ],
    },
    {
      v: 'V3.1.1',
      date: '29-09-2567',
      logs: [
        "Added item series (Poenitentia, Snow Flower, Geffen Night Arena, Crafted weapons, Varmundt's Biosphere, Hall of Life, Furious, Heroic Token)",
        'Added requested items/monsters',
        'Higlight dropdown item lv >= 200',
        'Fixed 2-handed weapon comparing',
        'Fixed reported bugs',
      ],
    },
    {
      v: 'V3.1.0',
      date: '23-09-2567',
      logs: [
        'Added Night Watch skills',
        'Updated base HP/SP (ขอบคุณข้อมูลจากปู่Sigma)',
        'Added item series (OSAD, Dim Glacier, Vivatus)',
        'Added requested items',
        'Fixed reported bugs'
      ],
    },
    {
      v: 'V3.0.0',
      date: '21-09-2567',
      logs: [
        'Supported 4th class with 2nd skill version (only main Class)',
        'Added item series (Thanos AD weapon, The Hero LT weapon, Nebula set, Gray wolf set, Varmundt set)',
        'Added Official updated items'
      ],
    },
    {
      v: 'V2.3.3',
      date: '05-09-2567',
      logs: ['Fixed reported bugs', 'Added Official updated items'],
    },
    {
      v: 'V2.3.2',
      date: '22-08-2567',
      logs: ['Added Official updated items', 'Added requested items & monsters', 'Updated Ranking data'],
    },
    {
      v: 'V2.3.1',
      date: '08-08-2567',
      logs: ['Added Royal Guard skill (Improved Cannon Spear)', 'Added Official updated items'],
    },
    {
      v: 'V2.3.0',
      date: '29-07-2567',
      logs: ['Fixed reported bugs', 'Added feature Elemental table (ปุ่มแว่นขยายใน Battle summary)', 'Supported costume enchant comparing'],
    },
    {
      v: 'V2.2.4',
      date: '25-07-2567',
      logs: ['Fixed reported bugs', 'Added Official updated items'],
    },
    {
      v: 'V2.2.3',
      date: '18-07-2567',
      logs: ['Fixed reported bugs', 'Added BP5 items'],
    },
    {
      v: 'V2.2.2',
      date: '11-07-2567',
      logs: ['Fixed reported bugs', 'Added Official updated items', 'Updated data for Item Ranking'],
    },
    {
      v: 'V2.2.1',
      date: '27-06-2567',
      logs: ['Fixed reported bugs', 'Added Official updated items', 'Added Eden Weapons', 'Added requested items & monsters', 'Updated data for Item Ranking'],
    },
    {
      v: 'V2.2.0',
      date: '22-06-2567',
      logs: [
        'Updated new elemental table',
        'Updated old lab headgear bonus',
        'Updated job improvement bundle',
        'Added Sorcerer skill [ Fist Spell ]',
        'Added Sura skills [ Dragon Combo, Fallen Empire, Lion Howling, Earth Shaker ]',
        'Added MC skills [ Knuckle Boost, Vulcan Arm ]',
        'Added Adanvanced Eden Shadow Equipments',
        'Added requested items',
      ],
    },
    {
      v: 'V2.1.5',
      date: '13-06-2567',
      logs: ['Fixed reported bugs', 'Added Official updated items', 'Added requested items', 'Updated data for Item Ranking'],
    },
    {
      v: 'V2.1.4',
      date: '30-05-2567',
      logs: ['Fixed reported bugs', 'Added Official updated items', 'Added requested items', 'Updated data for Item Ranking'],
    },
    {
      v: 'V2.1.3',
      date: '16-05-2567',
      logs: ['Fixed reported bugs', 'Added Official updated items', 'Added requested items/monsters', 'Updated data for Item Ranking'],
    },
    {
      v: 'V2.1.2',
      date: '09-05-2567',
      logs: ['Fixed reported bugs', 'Added requested items', 'Highlight fix position accessory card', 'Updated data for Item Ranking'],
    },
    {
      v: 'V2.1.1',
      date: '02-05-2567',
      logs: [
        'Fixed reported bugs',
        'Added Official updated items',
        'Added Geffen Night Arena cards',
        'Added requested items/monsters',
        'Supported skill level selection [ Arm Cannon, Hell Gate, Psychic Wave, Severe Rainstorm ]',
        'Updated data for Item Ranking',
      ],
    },
    {
      v: 'V2.1.0',
      date: '26-04-2567',
      logs: ['Fixed reported bugs', 'Added Item Ranking page', 'Added Super Novice skill [ Bowling Bash, Wind Cutter ]', 'Added requested items/monsters'],
    },
    {
      v: 'V2.0.9',
      date: '19-04-2567',
      logs: ['Fixed reported bugs', 'Added Official updated items', 'Added requested items/monsters'],
    },
    {
      v: 'V2.0.8',
      date: '06-04-2567',
      logs: ['Fixed reported bugs', 'Added requested items'],
    },
    {
      v: 'V2.0.7',
      date: '04-04-2567',
      logs: [
        'Fixed reported bugs',
        'Added Sura skill [ Hell Gate, Sky Blow ]',
        'Added RG skill [ Improved Over Brand ]',
        'Added ArchBishop skill [ Improved Judex ]',
        'Added SC skill [ Improved Fatal Manance ]',
        'Added Official updated items',
        'Added requested items',
      ],
    },
    {
      v: 'V2.0.6',
      date: '31-03-2567',
      logs: ['Fixed reported bugs', 'Fixed Cri rate to monster formula', 'Added requested items'],
    },
    {
      v: 'V2.0.5',
      date: '22-03-2567',
      logs: ['Fixed reported bugs', 'Added Noblesse, Imperial & Grace sets', 'Added Sura skill (Lightning Ride)'],
    },
    {
      v: 'V2.0.4',
      date: '21-03-2567',
      logs: [
        'Fixed reported bugs',
        'Added Official updated items (exclude Noblesse, Imperial & Grace sets)',
        'Added Booster weapons',
        'Added Accessories from Thanatos Tower revamp (Sinful & Brilliant)',
        'Added Equipments from Illusion of Under Water',
        'Added requested items',
        'Added SC skill (Severe Rainstorm)',
        'Removed old skill versions',
      ],
    },
    {
      v: 'V2.0.3',
      date: '16-03-2567',
      logs: [
        'Fixed reported bugs',
        'Added All class skill (Napalm Vulcan lv4)',
        'Added Warlock skill (Drain Life)',
        'Added Buff/Debuff (Shield spell, Dark Claw)',
        'Added requested items',
      ],
    },
    {
      v: 'V2.0.2',
      date: '11-03-2567',
      logs: ['Added "คลิปวิธีใช้งานเว็บ"', 'Enable Shadow equipment comparing', 'Added requested items & monsters'],
    },
    {
      v: 'V2.0.1',
      date: '09-03-2567',
      logs: [
        'Added Rune Knight skill (Improved Hundred Spears)',
        'Added Royal Guard skill (Improved Banishing Point, Genesis Ray, Cannon Spear)',
        'Added Genetic skill (Improved Cart Tornado, Cart Cannon, Spore Explosion, Acid Bomb)',
        'Added Mechanic skill (Improved Axe Tornado, Arm Cannon, Power Swing)',
        'Added Ranger skill (Improved Focused Arrow)',
        'Added Buff/Debuff (Bunch of Shrimp, Moonlight Serenade, Striking, Raid)',
      ],
    },
    {
      v: 'V2.0.0',
      date: '07-03-2567',
      logs: ['Added Official updated items', 'Added "Login" to saving presets on cloud', 'Added "Shared presets" page'],
    },
    {
      v: 'V1.8.6',
      date: '22-02-2567',
      logs: ['Added Penetration item options', 'Added Official updated items', 'Added requested items'],
    },
    {
      v: 'V1.8.5',
      date: '08-02-2567',
      logs: ['Fixed reported bugs', 'Added Official updated items', 'Added requested items'],
    },
    {
      v: 'V1.8.4',
      date: '03-02-2567',
      logs: [
        'Fixed reported bugs',
        'Added SE offensive skills (Falling Stars)',
        'Added Kagerou offensive skills (Kunai Explosion)',
        'Added Oboro offensive skills (Cross Slash)',
        'Added requested items & monsters',
      ],
    },
    {
      v: 'V1.8.3',
      date: '25-01-2567',
      logs: [
        'Fixed Skill half cri rate formula from [(Cri rate/2) - Cri shield] to [(Cri rate - Cri shield)/2]',
        'Fixed reported bugs',
        'Added Official updated items',
        'Added Warlock, Sorcerer offensive skills (Fire Bolt, Cold Bolt, Lightening Bolt)',
        'Added requested items & monsters',
      ],
    },
    {
      v: 'V1.8.2',
      date: '20-01-2567',
      logs: [
        'Fixed reported bugs',
        'Expanded refine level to +18',
        'Added SC offensive skills (Meteor Storm)',
        "Added Super Novice offensive skills (Gravitational Field, Fire Bolt, Cold Bolt, Lightening Bolt, Heaven's Drive, Lord of Vermilion)",
        'Added Warlock offensive skill (Gravitational Field)',
        'Added Mechanic offensive skill (Arm Cannon lv3)',
        'Added requested items & monsters',
      ],
    },
    {
      v: 'V1.8.1',
      date: '11-01-2567',
      logs: [
        'Fixed reported bugs',
        'Added Official updated items',
        'Added Weapon Lv4 & all head gears for Super Novice',
        'Added Super Novice offensive skill (Psychic Wave, Shield Chain)',
        'Added requested items',
      ],
    },
    {
      v: 'V1.8.0',
      date: '07-01-2567',
      logs: [
        'Fixed reported bugs',
        'Supported Super Novice class',
        'Added SC, Git-Cross learnable skill (Hiding ***กดอัพสกิลใหม่นะครับ ลำดับสกิลมันเปลี่ยน)',
        'Added Penetration summary table (next to "Skill bonus / Multiplier Summary")',
        'Added requested items',
      ],
    },
    {
      v: 'V1.7.12',
      date: '06-01-2567',
      logs: [
        'Fixed Advance Katar Mastery to effect only Katar Weapon',
        'Fixed reported bugs',
        'Added Feature search item by bonus stat (search icon on center right screen)',
        'Added Buff (Magnum Break)',
        'Added Rune Knight offensive skills (Sonic Wave, Wind Cutter)',
        'Added Sura offensive skill (Knuckle Arrow)',
        'Added Warlock skill effect (Released ***effected to all skills)',
        'Added requested items',
      ],
    },
    {
      v: 'V1.7.11',
      date: '29-12-2566',
      logs: [
        'Fixed reported bugs',
        'Added Official updated items',
        'Added EP 17.2 Card sets',
        'Added 3rd Class costume enchant stones (Upper,Middle,Lower)',
        'Added Royal Guard offensive skill (Gloria Domini)',
        'Added requested items, monsters',
      ],
    },
    {
      v: 'V1.7.10',
      date: '25-12-2566',
      logs: ['Fixed reported bugs', 'Added requested items'],
    },
    {
      v: 'V1.7.9',
      date: '18-12-2566',
      logs: ['Added SC offensive skill (Fient Bomb)', 'Added Sin weapons (EP 17.2)', 'Added requested items'],
    },
    {
      v: 'V1.7.8',
      date: '16-12-2566',
      logs: ['Fixed reported bugs', 'Added Warlock, Sorcerer learnable skill (Fire Wall)', 'Added SC offensive skill (Comet)', 'Added requested items'],
    },
    {
      v: 'V1.7.7',
      date: '14-12-2566',
      logs: [
        'Fixed Berserk potion unavailable for SR/SE',
        'Fixed reported bugs',
        'Added Rune Knight offensive skill (Dragon Breath & Improved versions)',
        'Added Official updated items',
        'Added requested items',
      ],
    },
    {
      v: 'V1.7.6',
      date: '13-12-2566',
      logs: [
        'Fixed Rampage Blast base level modifier from /120 to /100',
        'Fixed Berserk potion unavailable for some classes',
        'Fixed reported bugs',
        'Supported HP/SP calculation (only main class)',
        'Added Sura offensive skill (Tiger Cannon)',
        'Added GX offensive skill (Soul Destroyer & Improved versions)',
        'Added requested items & Monsters',
      ],
    },
    {
      v: 'V1.7.5',
      date: '10-12-2566',
      logs: [
        'Fixed Cross Impact base level modifier from /100 to /120',
        'Fixed Aimed Bolt total hit related to monster size',
        'Fixed reported bugs',
        'Supported job 70',
        'Added GX offensive skill (Improved Rolling Cutter, Improved Cross Impact)',
        'Added Ranger offensive skill (Improved AS, Improved AB)',
        'Added requested items',
      ],
    },
    {
      v: 'V1.7.4',
      date: '30-11-2566',
      logs: ['Fixed reported bugs', 'Added SC offensive skill (Psychic Wave)', 'Added requested items'],
    },
    {
      v: 'V1.7.3',
      date: '28-11-2566',
      logs: ['Fixed reported bugs', 'Display dex*2 + int*1 on stat summary', 'Added Automatic sets (17.2)', 'Added requested items'],
    },
    {
      v: 'V1.7.2',
      date: '27-11-2566',
      logs: ['Fixed reported bugs', 'Added Archbishop offensive skill (Improved Adoramus)', 'Added requested items'],
    },
    {
      v: 'V1.7.1',
      date: '26-11-2566',
      logs: [
        'Fixed Oboro max passive skill level',
        'Fixed Charm bonus skill damage to be flatten',
        'Fixed Physical damage to ghost monster',
        'Fixed reported bugs',
        'Added Warlock offensive skill (Earth Strain, Frost Misty)',
        'Added Rune Knight offensive skill (Ignition Break & Improved version)',
        'Added Biolab headgear',
        'Added requested items & monsters from Lab 5',
      ],
    },
    {
      v: 'V1.7.0',
      date: '25-11-2566',
      logs: ['Fixed Soul Reaper ASPD', 'Fixed Judex formula', 'Fixed reported bugs', 'Supported Oboro class', 'Added requested items & monsters'],
    },
    {
      v: 'V1.6.5',
      date: '23-11-2566',
      logs: ['Fixed MATK formula', 'Fixed Fatal Manace formula', 'Fixed Katar crirate', 'Added requested items'],
    },
    {
      v: 'V1.6.4',
      date: '22-11-2566',
      logs: [
        'Fixed reported bugs',
        'Fixed items cannot choose option (Reporter: "แก้สักทีนะ ตูแจ้งไปเป็นชาติแล้ววว")',
        'Display diff percentage when compare item',
        'Added Guillotine Cross skill ([Improved] Cross Impact)',
        'Added requested items',
      ],
    },
    {
      v: 'V1.6.3',
      date: '20-11-2566',
      logs: [
        'Fixed reported bugs',
        'Fixed Sword size penalty to 75 100 75',
        'Added Guillotine Cross skill (Cross Ripper Slasher)',
        'Added Royal Guard skill (Earth Drive)',
        'Added requested monsters',
        'Added requested items',
      ],
    },
    {
      v: 'V1.6.2',
      date: '19-11-2566',
      logs: [
        'Supported level 200',
        'Supported toggle bonus from "Has a chance"',
        'Added Warlock offensive skill (Chain Lightning)',
        'Added Kagerou offensive skill (Swirling Petal)',
        'Added Multiplier summary section (below Battle summary section)',
        'Added requested items',
      ],
    },
    {
      v: 'V1.6.1',
      date: '16-11-2566',
      logs: [
        'Fixed One-hand Axe cannot equip shield',
        'Added Minstrel/Wanderer offensive skill (Reverberation)',
        'Added Official updated items',
        'Added requested items',
      ],
    },
    {
      v: 'V1.6.0',
      date: '15-11-2566',
      logs: [
        'Fixed uneffect combo Temporal boot & Modified boot',
        'Improved MATK formula (damage slightly decreased)',
        'Supported Rune Knight class',
        'Supported Sura class',
        'Added requested items',
      ],
    },
    {
      v: 'V1.5.1',
      date: '13-11-2566',
      logs: ['Added penetration shadow equipments (white)', 'Added requested items'],
    },
    {
      v: 'V1.5.0',
      date: '12-11-2566',
      logs: ['Supported Star Emperor class', 'Added Doram active skill (Bunch of Shrimp)'],
    },
    {
      v: 'V1.4.4',
      date: '11-11-2566',
      logs: [
        'Fixed Arm cannon lv4 formula',
        'Fixed MA damage to be melee type',
        'Fixed reported bugs',
        'Added MC offensive skill (Cart Tornado)',
        'Added Severe Rainstorm Lv4',
        'Added requested items',
      ],
    },
    {
      v: 'V1.4.3',
      date: '08-11-2566',
      logs: [
        'Fixed SC Triangle shot formula',
        'Fixed MC Arm cannon base lvl bonus to /120',
        'Fixed reported bugs',
        'Added RG active skill (Shield Spell)',
        'Added GitCross offensive skill (Counter Slash) ',
        'Added requested items',
      ],
    },
    {
      v: 'V1.4.2',
      date: '07-11-2566',
      logs: ['Fixed Magma3 monsters stat', 'Fixed reported bugs', 'Added MC learnable skill (Power Swing)', 'Added requested items'],
    },
    {
      v: 'V1.4.1',
      date: '06-11-2566',
      logs: ['Fixed reported bugs', 'Added Doram passive skill (Spirit of life)', 'Added MC offensive skill (Arm Cannon lv4)', 'Added requested items'],
    },
    {
      v: 'V1.4.0',
      date: '05-11-2566',
      logs: [
        'Fixed Comet does not effected to physical damage',
        'Fixed reported bugs',
        'Supported Genetic class',
        'Supported toggle Hidden basic attack (see at the config button)',
        'Added Odin3 equipments & cards',
        'Added Abyss4 equipments & cards',
        'Added requested items',
      ],
    },
    {
      v: 'V1.3.0',
      date: '04-11-2566',
      logs: [
        'Fixed incorrect EDP calculation to Dark monster',
        'Fixed reported bugs',
        'Removed Doram skill bonus from base level',
        'Supported Kagerou class',
        'Added Buff skill (Comet Amp (working as a monster debuff, not a player buff))',
        'Added Einbech Dun3 equipments & cards',
        'Added requested items',
      ],
    },
    {
      v: 'V1.2.1',
      date: '03-11-2566',
      logs: [
        'Fixed compared item not include the main item options',
        'Fixed Dual weapon ASPD calculation',
        'Fixed incorrect Rebellion status points',
        'Fixed EDP not effect to Cross Impact',
        'Fixed reported bugs',
        'Added Buff skill (Odin Power)',
        'Added requested items',
      ],
    },
    {
      v: 'V1.2.0',
      date: '02-11-2566',
      logs: ['Fixed reported bugs', 'Supported Dual weapon', 'Added offensive skill (Canon Spear)', 'Added requested items & lastest update items'],
    },
    {
      v: 'V1.1.4',
      date: '01-11-2566',
      logs: ['Fixed reported bugs', 'Added requested items'],
    },
    {
      v: 'V1.1.3',
      date: '31-10-2566',
      logs: ['Fixed reported bugs', 'Added Dark claw & No Limit to SC Active skills', 'Added requested items'],
    },
    {
      v: 'V1.1.2',
      date: '30-10-2566',
      logs: ['Fixed Aimed Bolt by remove bonus from Fear Breeze', 'Added offensive skill (Dragon Tail, Gods Hammer, Cross Impact)', 'Added requested items'],
    },
    {
      v: 'V1.1.1',
      date: '29-10-2566',
      logs: ['Fixed SR job bonus', 'Fixed size multiplier option not working', 'Supported Thananos card', 'Added requested items.'],
    },
    {
      v: 'V1.1.0',
      date: '28-10-2566',
      logs: ['Supported Minstrel & Wanderer', 'Added Edda weapon and enchants', 'Fixed reported bugs'],
    },
    {
      v: 'V1.0.4',
      date: '26-10-2566',
      logs: ['Added Ranger, SR & Sorcerer skill to get bonus', 'Added items', 'Supported 4th slot garment costume'],
    },
    {
      v: 'V1.0.3',
      date: '25-10-2566',
      logs: ['Fixed cannot compare weapon', 'Added items & monsters'],
    },
    {
      v: 'V1.0.2',
      date: '24-10-2566',
      logs: ['Fixed EDP calculation', 'Changed Rolling Cutter to Melee damage'],
    },
    {
      v: 'V1.0.1',
      date: '24-10-2566',
      logs: ['Fixed items bonus', 'Fixed dark monster calculation', 'Update Racing cap & Enchants'],
    },
  ];
  localVersion = localStorage.getItem('version') || '';
  lastestVersion = this.updates[0].v;

  unreadVersion = this.updates.findIndex((a) => a.v === this.localVersion);
  showUnreadVersion = this.unreadVersion === -1 ? this.updates.length + 1 : this.unreadVersion;

  visibleUpdate = this.lastestVersion !== this.localVersion;

  username: string;

  obs = [] as Subscription[];

  constructor(
    public layoutService: LayoutService,
    private readonly authService: AuthService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
  ) { }

  ngOnDestroy(): void {
    for (const subscription of this.obs) {
      subscription?.unsubscribe();
    }
  }

  ngOnInit(): void {
    const o = this.authService.profileEventObs$.subscribe((profile) => {
      this.username = profile?.name;
    });
    this.obs.push(o);
  }

  logout() {
    this.waitConfirm('Logout ?').then((isConfirm) => {
      if (!isConfirm) return;

      this.authService.logout();
      this.messageService.add({
        severity: 'success',
        summary: 'Logout',
      });
    });
  }

  showDialog() {
    this.visible = true;
  }

  showUpdateDialog() {
    this.visibleUpdate = true;
  }

  showReferenceDialog() {
    this.visibleReference = true;
  }

  onHideUpdateDialog() {
    // localStorage.setItem('version', this.updates[0].v);
    // this.showUnreadVersion = 0;
  }

  onReadUpdateClick(version: string) {
    localStorage.setItem('version', version);
    this.unreadVersion = this.updates.findIndex((a) => a.v === version);
    this.showUnreadVersion = this.unreadVersion === -1 ? this.updates.length + 1 : this.unreadVersion;
  }

  showInfoDialog() {
    this.visibleInfo = true;
  }

  showMyProfile() {
    this.layoutService.showMyProfileSidebar();
  }

  private waitConfirm(message: string, icon?: string) {
    return new Promise((res) => {
      this.confirmationService.confirm({
        message: message,
        header: 'Confirmation',
        icon: icon || 'pi pi-exclamation-triangle',
        accept: () => {
          res(true);
        },
        reject: () => {
          console.log('reject confirm');
          res(false);
        },
      });
    });
  }
}
