import type { Messages } from '../types/locale'
import { defineLocale } from '../composables/defineLocale'

export default defineLocale<Messages>({
  name: 'Қазақша',
  code: 'kk',
  messages: {
    alert: {
      close: 'Жабу'
    },
    authForm: {
      hidePassword: 'Құпия сөзді жасыру',
      showPassword: 'Құпия сөзді көрсету',
      submit: 'Жалғастыру'
    },
    banner: {
      close: 'Жабу'
    },
    breadcrumb: {
      label: 'навигациялық жол'
    },
    calendar: {
      label: 'Оқиға күні',
      monthPicker: 'Айды таңдау',
      nextMonth: 'Келесі ай',
      nextYear: 'Келесі жыл',
      prevMonth: 'Алдыңғы ай',
      prevYear: 'Алдыңғы жыл',
      yearPicker: 'Жылды таңдау'
    },
    carousel: {
      dots: 'Көрсету үшін слайдты таңдаңыз',
      goto: '{slide} слайдқа өту',
      next: 'Келесі',
      prev: 'Алдыңғы',
      roledescription: 'карусель',
      slide: 'слайд'
    },
    chatAttachment: {
      uploading: 'Жүктелуде',
      error: 'Жүктеу сәтсіз аяқталды'
    },
    chatMessages: {
      autoScroll: 'Төмен айналдыру'
    },
    chatPrompt: {
      placeholder: 'Хабар енгізіңіз…',
      queue: 'Кезектегі хабарламалар',
      sendNow: 'Қазір жіберу',
      edit: 'Өңдеу',
      remove: 'Жою'
    },
    chatPromptSubmit: {
      label: 'Жіберу',
      reload: 'Қайталау',
      stop: 'Генерацияны тоқтату'
    },
    chatReasoning: {
      thinking: 'Ойлануда…',
      thought: 'Ойланды',
      thoughtFor: '{duration} ойланды'
    },
    colorMode: {
      dark: 'Қараңғы',
      light: 'Ашық',
      switchToDark: 'Қараңғы режимге ауысу',
      switchToLight: 'Ашық режимге ауысу',
      system: 'Жүйе'
    },
    commandPalette: {
      back: 'Артқа',
      close: 'Жабу',
      filterPlaceholder: 'Команда енгізіңіз немесе іздеңіз…',
      noData: 'Деректер жоқ',
      noMatch: 'Сәйкес келетін деректер жоқ',
      results: 'Нәтижелер'
    },
    contentSearch: {
      links: 'Сілтемелер',
      search: 'Нәтижелер',
      theme: 'Тақырып'
    },
    contentSearchButton: {
      label: 'Іздеу'
    },
    contentToc: {
      title: 'Мазмұны'
    },
    dropdownMenu: {
      filterPlaceholder: 'Іздеу…',
      noMatch: 'Сәйкес келетін деректер жоқ'
    },
    dashboardSearch: {
      theme: 'Тақырып'
    },
    dashboardSearchButton: {
      label: 'Іздеу'
    },
    dashboardSidebarCollapse: {
      collapse: 'Жию',
      expand: 'Кеңейту'
    },
    dashboardSidebarToggle: {
      close: 'Жабу',
      open: 'Ашу'
    },
    drawer: {
      close: 'Жабу'
    },
    error: {
      clear: 'Тазалау'
    },
    fileUpload: {
      removeFile: '{filename} жою'
    },
    header: {
      close: 'Жабу',
      open: 'Ашу'
    },
    inputDate: {
      day: 'күн',
      dayPeriod: 'AM/PM',
      era: 'дәуір',
      hour: 'сағат',
      minute: 'минут',
      month: 'ай',
      second: 'секунд',
      timeZoneName: 'уақыт белдеуі',
      year: 'жыл'
    },
    inputMenu: {
      create: '"{label}" жасау',
      noData: 'Деректер жоқ',
      noMatch: 'Сәйкес келетін деректер жоқ',
      trigger: 'Нұсқаларды көрсету'
    },
    inputNumber: {
      decrement: 'Азайту',
      increment: 'Арттыру',
      roledescription: 'сандық өріс'
    },
    inputRating: {
      rate: '{length} ішінен {value} деп бағалау'
    },
    inputTime: {
      dayPeriod: 'AM/PM',
      hour: 'сағат',
      minute: 'минут',
      second: 'секунд',
      timeZoneName: 'уақыт белдеуі'
    },
    listbox: {
      filterPlaceholder: 'Іздеу…',
      noData: 'Деректер жоқ',
      noMatch: 'Сәйкес келетін деректер жоқ'
    },
    modal: {
      close: 'Жабу'
    },
    pagination: {
      first: 'Бірінші бет',
      last: 'Соңғы бет',
      next: 'Келесі бет',
      page: '{page}-бет',
      prev: 'Алдыңғы бет'
    },
    pinInput: {
      input: 'PIN код, {length} ішінен {index}-таңба'
    },
    pricingTable: {
      caption: 'Баға кестесі'
    },
    prose: {
      codeCollapse: {
        closeText: 'Жиыру',
        name: 'код',
        openText: 'Кеңейту'
      },
      collapsible: {
        closeText: 'Жасыру',
        name: 'қасиеттер',
        openText: 'Көрсету'
      },
      pre: {
        copy: 'Кодты алмасу буферіне көшіру'
      },
      prompt: {
        copy: 'Сұранысты көшіру',
        openIn: '{name} ішінде ашу'
      }
    },
    sidebar: {
      close: 'Жабу',
      toggle: 'Ауыстыру'
    },
    selectMenu: {
      create: '"{label}" жасау',
      filterPlaceholder: 'Іздеу…',
      noData: 'Деректер жоқ',
      noMatch: 'Сәйкес келетін деректер жоқ'
    },
    skeleton: {
      label: 'жүктелуде'
    },
    slideover: {
      close: 'Жабу'
    },
    slider: {
      max: 'Максимум',
      min: 'Минимум',
      thumb: 'Жүгірткі',
      value: '{total} ішінен {index}-мән'
    },
    stepper: {
      label: 'прогресс'
    },
    table: {
      noData: 'Деректер жоқ'
    },
    toast: {
      close: 'Жабу'
    },
    toaster: {
      label: 'Хабарландыру',
      viewport: 'Хабарландырулар ({hotkey})'
    }
  }
})
