import { Component, ElementRef, ViewChild } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { LayoutService } from './service/app.layout.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-topbar',
  templateUrl: './app.topbar.component.html',
})
export class AppTopBarComponent {
  items!: MenuItem[];

  @ViewChild('menubutton') menuButton!: ElementRef;

  @ViewChild('topbarmenubutton') topbarMenuButton!: ElementRef;

  @ViewChild('topbarmenu') menu!: ElementRef;

  visible: boolean = false;
  visibleInfo: boolean = false;
  env = environment;

  infos = [
    'เปลี่ยน Theme ทึ่ปุ่ม Config ตรงขวากลาง',
    'ข้อมูลที่บันทึกไว้จะถูกเก็บไว้ที่ browser, ถ้าล้างข้อมูล browser ก็จะถูกลบไปด้วย',
    'เงื่อนไขที่เขียนไว้ว่า "ทุกๆการเรียนรู้สกิล" ต้องกดอัพในช่อง "Learn to get bonuses" ถึงจะได้ bonus, ถ้าไม่มีให้อัพจะให้เป็น bonus เป็น Lv MAX',
    'options ในแถวอาวุธจะอยู่ตลอด เอาไว้ใส่ options ของไอเทมทั้งตัว(ไม่รวม shadow equipment)',
    'My Magical Element ใน options = เพิ่ม Damage ทางเวทมนตร์ธาตุ ...',
    'การเปรียบเทียบอาวุธ 2 มือยังไม่รองรับการเปลี่ยนมือซ้าย',
    'Job 61-64 จะได้ Bonus ไม่ตรงเพราะไม่มีข้อมูล',
    'Tab "Summary" คือ ใส่อะไรบ้าง/อัพสกิลอะไรบ้าง/การคำนวนทั้งหมด',
    'Tab "Equipments Summary" คือ bonus ของไอเทมแบบภาพรวม',
    'Tab "Item Descriptions" คือ bonus ของไอเทมแต่ละชิ้นและคำอธิบาย (เอาไว้ตรวจสอบว่าได้ bonus ถูกไหม)',
  ];

  updates: { v: string; date: string; logs: string[] }[] = [
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
        'Added Official latest update items',
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
      logs: [
        'Fixed Magma3 monsters stat',
        'Fixed reported bugs',
        'Added MC learnable skill (Power Swing)',
        'Added requested items',
      ],
    },
    {
      v: 'V1.4.1',
      date: '06-11-2566',
      logs: [
        'Fixed reported bugs',
        'Added Doram passive skill (Spirit of life)',
        'Added MC offensive skill (Arm Cannon lv4)',
        'Added requested items',
      ],
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
      logs: [
        'Fixed reported bugs',
        'Supported Dual weapon',
        'Added offensive skill (Canon Spear)',
        'Added requested items & lastest update items',
      ],
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
      logs: [
        'Fixed Aimed Bolt by remove bonus from Fear Breeze',
        'Added offensive skill (Dragon Tail, Gods Hammer, Cross Impact)',
        'Added requested items',
      ],
    },
    {
      v: 'V1.1.1',
      date: '29-10-2566',
      logs: [
        'Fixed SR job bonus',
        'Fixed size multiplier option not working',
        'Supported Thananos card',
        'Added requested items.',
      ],
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

  constructor(public layoutService: LayoutService) {}

  showDialog() {
    this.visible = true;
  }

  showUpdateDialog() {
    this.visibleUpdate = true;
  }

  onHideUpdateDialog() {
    localStorage.setItem('version', this.updates[0].v);
    this.showUnreadVersion = 0;
  }

  showInfoDialog() {
    this.visibleInfo = true;
  }
}
