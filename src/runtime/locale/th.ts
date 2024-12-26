import { defineLocale } from '../composables/defineLocale'

export default defineLocale({
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
      noMatch: 'ไม่พบข้อมูลที่ตรงกัน',
      noData: 'ไม่มีข้อมูล',
      close: 'ปิด'
    },
    selectMenu: {
      noMatch: 'ไม่พบข้อมูลที่ตรงกัน',
      noData: 'ไม่มีข้อมูล',
      create: 'สร้าง "{label}"'
    },
    toast: {
      close: 'ปิด'
    },
    carousel: {
      prev: 'ย้อนกลับ',
      next: 'ถัดไป',
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
