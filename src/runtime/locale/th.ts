import type { Messages } from '../types'
import { defineLocale } from '../composables/defineLocale'

export default defineLocale<Messages>({
  name: 'ไทย',
  code: 'th',
  messages: {
    inputMenu: {
      noMatch: 'ไม่พบข้อมูลที่ตรงกัน',
      noData: 'ไม่มีข้อมูล',
      create: 'สร้าง "{label}"'
    },
    calendar: {
      prevYear: 'ปีก่อนหน้า',
      nextYear: 'ปีถัดไป',
      prevMonth: 'เดือนก่อนหน้า',
      nextMonth: 'เดือนถัดไป'
    },
    inputNumber: {
      increment: 'เพิ่ม',
      decrement: 'ลด'
    },
    commandPalette: {
      placeholder: 'พิมพ์คำสั่งหรือค้นหา...',
      noMatch: 'ไม่พบข้อมูลที่ตรงกัน',
      noData: 'ไม่มีข้อมูล',
      close: 'ปิด',
      back: 'ย้อนกลับ'
    },
    selectMenu: {
      noMatch: 'ไม่พบข้อมูลที่ตรงกัน',
      noData: 'ไม่มีข้อมูล',
      create: 'สร้าง "{label}"',
      search: 'ค้นหา...'
    },
    toast: {
      close: 'ปิด'
    },
    carousel: {
      prev: 'ย้อนกลับ',
      next: 'ถัดไป',
      dots: 'เลือกสไลด์ที่จะแสดง',
      goto: 'ไปที่ {slide}'
    },
    modal: {
      close: 'ปิด'
    },
    slideover: {
      close: 'ปิด'
    },
    alert: {
      close: 'ปิด'
    },
    table: {
      noData: 'ไม่มีข้อมูล'
    }
  }
})
