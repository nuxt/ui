import type { Messages } from '../types'
import { defineLocale } from '../composables/defineLocale'

export default defineLocale<Messages>({
  name: 'ไทย',
  code: 'th',
  messages: {
    alert: {
      close: 'ปิด'
    },
    authForm: {
      hidePassword: 'ซ่อนรหัสผ่าน',
      showPassword: 'แสดงรหัสผ่าน',
      submit: 'ดำเนินการต่อ'
    },
    banner: {
      close: 'ปิด'
    },
    calendar: {
      nextMonth: 'เดือนถัดไป',
      nextYear: 'ปีถัดไป',
      prevMonth: 'เดือนก่อนหน้า',
      prevYear: 'ปีก่อนหน้า'
    },
    carousel: {
      dots: 'เลือกสไลด์ที่จะแสดง',
      goto: 'ไปที่ {slide}',
      next: 'ถัดไป',
      prev: 'ย้อนกลับ'
    },
    chatPrompt: {
      placeholder: 'กรุณาป้อนข้อความของคุณที่นี่…'
    },
    chatPromptSubmit: {
      label: 'ส่ง'
    },
    colorMode: {
      dark: 'มืด',
      light: 'สว่าง',
      switchToDark: 'เปลี่ยนเป็นโหมดมืด',
      switchToLight: 'เปลี่ยนเป็นโหมดสว่าง',
      system: 'ระบบ'
    },
    commandPalette: {
      back: 'ย้อนกลับ',
      close: 'ปิด',
      noData: 'ไม่มีข้อมูล',
      noMatch: 'ไม่พบข้อมูลที่ตรงกัน',
      placeholder: 'พิมพ์คำสั่งหรือค้นหา…'
    },
    contentSearch: {
      links: 'ลิงก์',
      theme: 'ธีม'
    },
    contentSearchButton: {
      label: 'ค้นหา…'
    },
    contentToc: {
      title: 'ในหน้านี้'
    },
    dashboardSearch: {
      theme: 'ธีม'
    },
    dashboardSearchButton: {
      label: 'ค้นหา…'
    },
    dashboardSidebarCollapse: {
      collapse: 'ย่อแถบด้านข้าง',
      expand: 'ขยายแถบด้านข้าง'
    },
    dashboardSidebarToggle: {
      close: 'ปิดแถบด้านข้าง',
      open: 'เปิดแถบด้านข้าง'
    },
    error: {
      clear: 'กลับไปยังหน้าหลัก'
    },
    fileUpload: {
      removeFile: 'ลบ {filename}'
    },
    header: {
      close: 'ปิดเมนู',
      open: 'เปิดเมนู'
    },
    inputMenu: {
      create: 'สร้าง "{label}"',
      noData: 'ไม่มีข้อมูล',
      noMatch: 'ไม่พบข้อมูลที่ตรงกัน'
    },
    inputNumber: {
      decrement: 'ลด',
      increment: 'เพิ่ม'
    },
    modal: {
      close: 'ปิด'
    },
    pricingTable: {
      caption: 'การเปรียบเทียบราคาสินค้า'
    },
    prose: {
      codeCollapse: {
        closeText: 'ย่อ',
        name: 'โค้ด',
        openText: 'ขยาย'
      },
      collapsible: {
        closeText: 'ซ่อน',
        name: 'คุณสมบัติ',
        openText: 'แสดง'
      },
      pre: {
        copy: 'คัดลอกโค้ดไปยังคลิปบอร์ด'
      }
    },
    selectMenu: {
      create: 'สร้าง "{label}"',
      noData: 'ไม่มีข้อมูล',
      noMatch: 'ไม่พบข้อมูลที่ตรงกัน',
      search: 'ค้นหา…'
    },
    slideover: {
      close: 'ปิด'
    },
    table: {
      noData: 'ไม่มีข้อมูล'
    },
    toast: {
      close: 'ปิด'
    }
  }
})
