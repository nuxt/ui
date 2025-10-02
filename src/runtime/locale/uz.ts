import type { Messages } from '../types'
import { defineLocale } from '../composables/defineLocale'

export default defineLocale<Messages>({
  name: 'Oʻzbek',
  code: 'uz',
  messages: {
    alert: {
      close: 'Yopish'
    },
    authForm: {
      hidePassword: 'Parolni yashirish',
      showPassword: 'Parolni ko\'rsatish',
      submit: 'Davom etish'
    },
    banner: {
      close: 'Yopish'
    },
    calendar: {
      nextMonth: 'Keyingi oy',
      nextYear: 'Keyingi yil',
      prevMonth: 'Oldingi oy',
      prevYear: 'Oldingi yil'
    },
    carousel: {
      dots: 'Koʻrsatish uchun slaydni tanlang',
      goto: '{slide}-slaydga o\'tish',
      next: 'Oldinga',
      prev: 'Ortga'
    },
    chatPrompt: {
      placeholder: 'Bu yerda savolingizni yozing…'
    },
    chatPromptSubmit: {
      label: 'Jo\'natish'
    },
    colorMode: {
      dark: 'Qorong\'i',
      light: 'Yorug\'',
      switchToDark: 'Qorong\'i rejimga o\'tish',
      switchToLight: 'Yorug\' rejimga o\'tish',
      system: 'Tizim'
    },
    commandPalette: {
      back: 'Orqaga',
      close: 'Yopish',
      noData: 'Maʼlumot yoʻq',
      noMatch: 'Mos keluvchi natija topilmadi',
      placeholder: 'Buyruq kiriting yoki qidiring…'
    },
    contentSearch: {
      links: 'Havolalar',
      theme: 'Mavzu'
    },
    contentSearchButton: {
      label: 'Qidirish…'
    },
    contentToc: {
      title: 'Ushbu sahifada'
    },
    dashboardSearch: {
      theme: 'Mavzu'
    },
    dashboardSearchButton: {
      label: 'Qidirish…'
    },
    dashboardSidebarCollapse: {
      collapse: 'Yon panelni yig\'ish',
      expand: 'Yon panelni kengaytirish'
    },
    dashboardSidebarToggle: {
      close: 'Yon panelni yopish',
      open: 'Yon panelni ochish'
    },
    error: {
      clear: 'Bosh sahifaga qaytish'
    },
    fileUpload: {
      removeFile: '{filename}ni oʻchirish'
    },
    header: {
      close: 'Menyuni yopish',
      open: 'Menyuni ochish'
    },
    inputMenu: {
      create: '"{label}" yaratish',
      noData: 'Maʼlumot yoʻq',
      noMatch: 'Mos keluvchi natija topilmadi'
    },
    inputNumber: {
      decrement: 'Ayirish',
      increment: 'Qoʻshish'
    },
    modal: {
      close: 'Yopish'
    },
    pricingTable: {
      caption: 'Narx planlarini taqqoslash'
    },
    prose: {
      codeCollapse: {
        closeText: 'Yig\'ish',
        name: 'kod',
        openText: 'Kengaytirish'
      },
      collapsible: {
        closeText: 'Yashirish',
        name: 'xususiyatlar',
        openText: 'Ko\'rsatish'
      },
      pre: {
        copy: 'Koddan buferga nusxa olish'
      }
    },
    selectMenu: {
      create: '"{label}" yaratish',
      noData: 'Maʼlumot yoʻq',
      noMatch: 'Mos keluvchi natija topilmadi',
      search: 'Qidirish…'
    },
    slideover: {
      close: 'Yopish'
    },
    table: {
      noData: 'Maʼlumot yoʻq'
    },
    toast: {
      close: 'Yopish'
    }
  }
})
