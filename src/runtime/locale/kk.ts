import type { Messages } from '../types'
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
    calendar: {
      nextMonth: 'Келесі ай',
      nextYear: 'Келесі жыл',
      prevMonth: 'Алдыңғы ай',
      prevYear: 'Алдыңғы жыл'
    },
    carousel: {
      dots: 'Көрсету үшін слайдты таңдаңыз',
      goto: '{slide} слайдқа өту',
      next: 'Келесі',
      prev: 'Алдыңғы'
    },
    chatPrompt: {
      placeholder: 'Хабар енгізіңіз…'
    },
    chatPromptSubmit: {
      label: 'Жіберу'
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
      noData: 'Деректер жоқ',
      noMatch: 'Сәйкес келетін деректер жоқ',
      placeholder: 'Команда енгізіңіз немесе іздеңіз…'
    },
    contentSearch: {
      links: 'Сілтемелер',
      theme: 'Тақырып'
    },
    contentSearchButton: {
      label: 'Іздеу'
    },
    contentToc: {
      title: 'Мазмұны'
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
    inputMenu: {
      create: '"{label}" жасау',
      noData: 'Деректер жоқ',
      noMatch: 'Сәйкес келетін деректер жоқ'
    },
    inputNumber: {
      decrement: 'Азайту',
      increment: 'Арттыру'
    },
    modal: {
      close: 'Жабу'
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
      }
    },
    selectMenu: {
      create: '"{label}" жасау',
      noData: 'Деректер жоқ',
      noMatch: 'Сәйкес келетін деректер жоқ',
      search: 'Іздеу…'
    },
    slideover: {
      close: 'Жабу'
    },
    table: {
      noData: 'Деректер жоқ'
    },
    toast: {
      close: 'Жабу'
    }
  }
})
