import type { Messages } from '../types'
import { defineLocale } from '../composables/defineLocale'

export default defineLocale<Messages>({
  name: 'Монгол',
  code: 'mn',
  messages: {
    alert: {
      close: 'Хаах'
    },
    authForm: {
      hidePassword: 'Нууц үгийг нуух',
      showPassword: 'Нууц үгийг харуулах',
      submit: 'Үргэлжлүүлэх'
    },
    banner: {
      close: 'Хаах'
    },
    calendar: {
      nextMonth: 'Дараа сар',
      nextYear: 'Дараа жил',
      prevMonth: 'Өмнөх сар',
      prevYear: 'Өмнөх жил'
    },
    carousel: {
      dots: 'Харуулах слайдыг сонгоно уу',
      goto: '{slide}-р хуудсанд шилжих',
      next: 'Дараах',
      prev: 'Өмнөх'
    },
    chatPrompt: {
      placeholder: 'Энд мессежээ бичнэ үү…'
    },
    chatPromptSubmit: {
      label: 'Мессеж илгээх'
    },
    colorMode: {
      dark: 'Хар',
      light: 'Цагаан',
      switchToDark: 'Хар горимд шилжих',
      switchToLight: 'Цагаан горимд шилжих',
      system: 'Систем'
    },
    commandPalette: {
      back: 'Буцах',
      close: 'Хаах',
      noData: 'Мэдээлэл байхгүй',
      noMatch: 'Тохирох мэдээлэл олдсонгүй',
      placeholder: 'Комманд бичих эсвэл хайлт хийх…'
    },
    contentSearch: {
      links: 'Холбоосууд',
      theme: 'Загвар'
    },
    contentSearchButton: {
      label: 'Хайх…'
    },
    contentToc: {
      title: 'Энэ хуудсанд'
    },
    dashboardSearch: {
      theme: 'Загвар'
    },
    dashboardSearchButton: {
      label: 'Хайх…'
    },
    dashboardSidebarCollapse: {
      collapse: 'Хажуугийн самбарыг хураах',
      expand: 'Хажуугийн самбарыг дэлгэх'
    },
    dashboardSidebarToggle: {
      close: 'Хажуугийн самбарыг хаах',
      open: 'Хажуугийн самбарыг нээх'
    },
    error: {
      clear: 'Нүүр хуудас руу буцах'
    },
    fileUpload: {
      removeFile: '{filename} устгах'
    },
    header: {
      close: 'Цэсийг хаах',
      open: 'Цэсийг нээх'
    },
    inputMenu: {
      create: '"{label}" үүсгэх',
      noData: 'Мэдээлэл байхгүй',
      noMatch: 'Тохирох мэдээлэл олдсонгүй'
    },
    inputNumber: {
      decrement: 'Хасах',
      increment: 'Нэмэх'
    },
    modal: {
      close: 'Хаах'
    },
    pricingTable: {
      caption: 'Үнийн төлөвлөгөөний харьцуулалт'
    },
    prose: {
      codeCollapse: {
        closeText: 'Хураах',
        name: 'код',
        openText: 'Дэлгэх'
      },
      collapsible: {
        closeText: 'Нуух',
        name: 'шинж чанарууд',
        openText: 'Харуулах'
      },
      pre: {
        copy: 'Кодыг санах ойд хуулах'
      }
    },
    selectMenu: {
      create: '"{label}" үүсгэх',
      noData: 'Мэдээлэл байхгүй',
      noMatch: 'Тохирох мэдээлэл олдсонгүй',
      search: 'Хайх…'
    },
    slideover: {
      close: 'Хаах'
    },
    table: {
      noData: 'Мэдээлэл байхгүй'
    },
    toast: {
      close: 'Хаах'
    }
  }
})
