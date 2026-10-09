import type { Messages } from '../types/locale'
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
    breadcrumb: {
      label: 'navigatsiya zanjiri'
    },
    calendar: {
      label: 'Tadbir sanasi',
      monthPicker: 'Oy tanlash',
      nextMonth: 'Keyingi oy',
      nextYear: 'Keyingi yil',
      prevMonth: 'Oldingi oy',
      prevYear: 'Oldingi yil',
      yearPicker: 'Yil tanlash'
    },
    carousel: {
      dots: 'Koʻrsatish uchun slaydni tanlang',
      goto: '{slide}-slaydga o\'tish',
      next: 'Oldinga',
      prev: 'Ortga',
      roledescription: 'karusel',
      slide: 'slayd'
    },
    chatMessages: {
      autoScroll: 'Pastga aylantirish'
    },
    chatPrompt: {
      placeholder: 'Bu yerda savolingizni yozing…'
    },
    chatPromptSubmit: {
      label: 'Jo\'natish',
      reload: 'Qayta urinish',
      stop: 'Generatsiyani to\'xtatish'
    },
    chatReasoning: {
      thinking: 'O\'ylayapti…',
      thought: 'O\'yladi',
      thoughtFor: '{duration} o\'yladi'
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
      search: 'Natijalar',
      theme: 'Mavzu'
    },
    contentSearchButton: {
      label: 'Qidirish…'
    },
    contentToc: {
      title: 'Ushbu sahifada'
    },
    dropdownMenu: {
      noMatch: 'Mos keluvchi natija topilmadi',
      search: 'Qidirish…'
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
    drawer: {
      close: 'Yopish'
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
    inputDate: {
      day: 'kun',
      dayPeriod: 'AM/PM',
      era: 'era',
      hour: 'soat',
      minute: 'daqiqa',
      month: 'oy',
      second: 'soniya',
      timeZoneName: 'vaqt mintaqasi',
      year: 'yil'
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
    inputRating: {
      rate: '{length} dan {value} baho qoʻyish'
    },
    inputTime: {
      dayPeriod: 'AM/PM',
      hour: 'soat',
      minute: 'daqiqa',
      second: 'soniya',
      timeZoneName: 'vaqt mintaqasi'
    },
    listbox: {
      noData: 'Maʼlumot yoʻq',
      noMatch: 'Mos keluvchi natija topilmadi',
      search: 'Qidirish…'
    },
    modal: {
      close: 'Yopish'
    },
    pagination: {
      first: 'Birinchi sahifa',
      last: 'Oxirgi sahifa',
      next: 'Keyingi sahifa',
      page: '{page}-sahifa',
      prev: 'Oldingi sahifa'
    },
    pinInput: {
      input: 'PIN-kod, {index}-belgi, jami {length}'
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
      },
      prompt: {
        copy: 'So\'rovni nusxalash',
        openIn: '{name}da ochish'
      }
    },
    sidebar: {
      close: 'Yopish',
      toggle: 'Almashtirish'
    },
    selectMenu: {
      create: '"{label}" yaratish',
      noData: 'Maʼlumot yoʻq',
      noMatch: 'Mos keluvchi natija topilmadi',
      search: 'Qidirish…'
    },
    skeleton: {
      label: 'yuklanmoqda'
    },
    slideover: {
      close: 'Yopish'
    },
    slider: {
      max: 'Maksimum',
      min: 'Minimum',
      thumb: 'Surgich',
      value: '{index}-qiymat, jami {total}'
    },
    table: {
      noData: 'Maʼlumot yoʻq'
    },
    toast: {
      close: 'Yopish'
    },
    toaster: {
      label: 'Bildirishnoma',
      viewport: 'Bildirishnomalar ({hotkey})'
    }
  }
})
