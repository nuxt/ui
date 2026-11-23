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
      showPassword: 'Parolni koʻrsatish',
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
      goto: '{slide}-slaydga oʻtish',
      next: 'Oldinga',
      prev: 'Ortga',
      roledescription: 'karusel',
      slide: 'slayd'
    },
    chatAttachment: {
      uploading: 'Yuklanmoqda',
      error: 'Yuklab boʻlmadi'
    },
    chatMessages: {
      autoScroll: 'Pastga oʻtish'
    },
    chatPrompt: {
      placeholder: 'Bu yerda savolingizni yozing…',
      queue: 'Navbatdagi xabarlar',
      sendNow: 'Hozir yuborish',
      edit: 'Tahrirlash',
      remove: 'Oʻchirish'
    },
    chatPromptSubmit: {
      label: 'Joʻnatish',
      reload: 'Qayta urinish',
      stop: 'Generatsiyani toʻxtatish'
    },
    chatReasoning: {
      thinking: 'Oʻylayapti…',
      thought: 'Oʻyladi',
      thoughtFor: '{duration} davomida oʻyladi'
    },
    colorMode: {
      dark: 'Qorongʻi',
      light: 'Yorugʻ',
      switchToDark: 'Qorongʻi rejimga oʻtish',
      switchToLight: 'Yorugʻ rejimga oʻtish',
      system: 'Tizim'
    },
    commandPalette: {
      back: 'Orqaga',
      close: 'Yopish',
      noData: 'Maʼlumot yoʻq',
      noMatch: 'Mos keluvchi natija topilmadi',
      placeholder: 'Buyruq kiriting yoki qidiring…',
      results: 'Natijalar'
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
      collapse: 'Yon panelni yigʻish',
      expand: 'Yon panelni kengaytirish'
    },
    dashboardSidebarToggle: {
      close: 'Yon panelni yopish',
      open: 'Yon panelni ochish'
    },
    drawer: {
      close: 'Yopish'
    },
    editorEmojiMenu: {
      label: 'Emojilar'
    },
    editorMentionMenu: {
      label: 'Tilga olishlar'
    },
    editorSuggestionMenu: {
      label: 'Takliflar'
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
      noMatch: 'Mos keluvchi natija topilmadi',
      trigger: 'Variantlarni koʻrsatish'
    },
    inputNumber: {
      decrement: 'Kamaytirish',
      increment: 'Oshirish',
      roledescription: 'raqamli maydon'
    },
    inputRating: {
      rate: '{length} balldan {value} baho qoʻyish'
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
      caption: 'Tarif rejalarini taqqoslash'
    },
    prose: {
      codeCollapse: {
        closeText: 'yigʻish',
        label: '{name} {text}',
        name: 'Kodni',
        openText: 'kengaytirish'
      },
      collapsible: {
        closeText: 'yashirish',
        label: '{name} {text}',
        name: 'Xususiyatlarni',
        openText: 'koʻrsatish'
      },
      pre: {
        copy: 'Kodni buferga nusxalash'
      },
      prompt: {
        copy: 'Soʻrovni nusxalash',
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
    stepper: {
      label: 'jarayon'
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
