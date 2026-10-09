import type { Messages } from '../types/locale'
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
    breadcrumb: {
      label: 'เส้นทางนำทาง'
    },
    calendar: {
      label: 'วันที่ของกิจกรรม',
      monthPicker: 'ตัวเลือกเดือน',
      nextMonth: 'เดือนถัดไป',
      nextYear: 'ปีถัดไป',
      prevMonth: 'เดือนก่อนหน้า',
      prevYear: 'ปีก่อนหน้า',
      yearPicker: 'ตัวเลือกปี'
    },
    carousel: {
      dots: 'เลือกสไลด์ที่จะแสดง',
      goto: 'ไปที่ {slide}',
      next: 'ถัดไป',
      prev: 'ย้อนกลับ',
      roledescription: 'ภาพหมุนเวียน',
      slide: 'สไลด์'
    },
    chatMessages: {
      autoScroll: 'เลื่อนลงล่างสุด'
    },
    chatPrompt: {
      placeholder: 'กรุณาป้อนข้อความของคุณที่นี่…'
    },
    chatPromptSubmit: {
      label: 'ส่ง',
      reload: 'ลองอีกครั้ง',
      stop: 'หยุดการสร้าง'
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
      search: 'ผลลัพธ์',
      theme: 'ธีม'
    },
    contentSearchButton: {
      label: 'ค้นหา…'
    },
    contentToc: {
      title: 'ในหน้านี้'
    },
    dropdownMenu: {
      noMatch: 'ไม่พบข้อมูลที่ตรงกัน',
      search: 'ค้นหา…'
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
    drawer: {
      close: 'ปิด'
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
    inputDate: {
      day: 'วัน',
      dayPeriod: 'ก่อนเที่ยง/หลังเที่ยง',
      era: 'สมัย',
      hour: 'ชั่วโมง',
      minute: 'นาที',
      month: 'เดือน',
      second: 'วินาที',
      timeZoneName: 'เขตเวลา',
      year: 'ปี'
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
    inputRating: {
      rate: 'ให้คะแนน {value} จาก {length}'
    },
    inputTime: {
      dayPeriod: 'ก่อนเที่ยง/หลังเที่ยง',
      hour: 'ชั่วโมง',
      minute: 'นาที',
      second: 'วินาที',
      timeZoneName: 'เขตเวลา'
    },
    listbox: {
      noData: 'ไม่มีข้อมูล',
      noMatch: 'ไม่พบข้อมูลที่ตรงกัน',
      search: 'ค้นหา…'
    },
    modal: {
      close: 'ปิด'
    },
    pagination: {
      first: 'หน้าแรก',
      last: 'หน้าสุดท้าย',
      next: 'หน้าต่อไป',
      page: 'หน้า {page}',
      prev: 'หน้าที่แล้ว'
    },
    pinInput: {
      input: 'รหัส PIN ตัวที่ {index} จาก {length}'
    },
    pricingTable: {
      caption: 'การเปรียบเทียบราคา'
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
      },
      prompt: {
        copy: 'คัดลอกพรอมต์',
        openIn: 'เปิดใน {name}'
      }
    },
    chatReasoning: {
      thinking: 'กำลังคิด…',
      thought: 'คิดแล้ว',
      thoughtFor: 'คิดเป็นเวลา {duration}'
    },
    sidebar: {
      close: 'ปิด',
      toggle: 'สลับ'
    },
    selectMenu: {
      create: 'สร้าง "{label}"',
      noData: 'ไม่มีข้อมูล',
      noMatch: 'ไม่พบข้อมูลที่ตรงกัน',
      search: 'ค้นหา…'
    },
    skeleton: {
      label: 'กำลังโหลด'
    },
    slideover: {
      close: 'ปิด'
    },
    slider: {
      max: 'สูงสุด',
      min: 'ต่ำสุด',
      thumb: 'ตัวเลื่อน',
      value: 'ค่าที่ {index} จาก {total}'
    },
    table: {
      noData: 'ไม่มีข้อมูล'
    },
    toast: {
      close: 'ปิด'
    },
    toaster: {
      label: 'การแจ้งเตือน',
      viewport: 'การแจ้งเตือน ({hotkey})'
    }
  }
})
