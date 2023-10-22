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
    'เงื่อนไขที่เขียนไว้ว่า "ทุกๆการเรียนรู้สกิล" ต้องกดอัพในช่อง "Learnable Skills" ถึงจะได้ bonus, ไม่มีให้อัพจะให้เป็น bonus เป็น Lv MAX',
    'ยังไม่รองรับอาวุธ 2 มือ',
    'Tab "Summary" คือ ใส่อะไรบ้าง/อัพสกิลอะไรบ้าง/การคำนวนทั้งหมด',
    'Tab "Equipments Summary" คือ bonus ของไอเทมแบบภาพรวม',
    'Tab "Item Descriptions" คือ bonus ของไอเทมแต่ละชิ้นและคำอธิบาย (เอาไว้ตรวจสอบว่าได้ bonus ถูกไหม)',
  ];

  constructor(public layoutService: LayoutService) {}

  showDialog() {
    this.visible = true;
  }

  showInfoDialog() {
    this.visibleInfo = true;
  }
}
