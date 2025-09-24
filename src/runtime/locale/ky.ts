import type { Messages } from '../types'
import { defineLocale } from '../composables/defineLocale'

export default defineLocale<Messages>({
  name: 'Кыргызча',
  code: 'ky',
  messages: {
    alert: {
      close: 'Жабуу'
    },
    authForm: {
      hidePassword: 'Сырсөздү жашыруу',
      showPassword: 'Сырсөздү көрсөтүү',
      submit: 'Улантуу'
    },
    banner: {
      close: 'Жабуу'
    },
    calendar: {
      nextMonth: 'Кийинки ай',
      nextYear: 'Кийинки жыл',
      prevMonth: 'Алдыңкы ай',
      prevYear: 'Алдыңкы жыл'
    },
    carousel: {
      dots: 'Көрсөтүү үчүн слайдды тандаңыз',
      goto: '{slide} слайдга өтүү',
      next: 'Кийинки',
      prev: 'Алдыңкы'
    },
    chatPrompt: {
      placeholder: 'Бул жерге билдирүүңүздү жазыңыз…'
    },
    chatPromptSubmit: {
      label: 'Билдирүү жөнөтүү'
    },
    colorMode: {
      dark: 'Караңгы',
      light: 'Жарык',
      switchToDark: 'Караңгы режимге өтүү',
      switchToLight: 'Жарык режимге өтүү',
      system: 'Система'
    },
    commandPalette: {
      back: 'Артка',
      close: 'Жабуу',
      noData: 'Маалымат жок',
      noMatch: 'Эч нерсе табылган жок',
      placeholder: 'Буйрук киргизиңиз же издөө…'
    },
    contentSearch: {
      links: 'Шилтемелер',
      theme: 'Тема'
    },
    contentSearchButton: {
      label: 'Издөө…'
    },
    contentToc: {
      title: 'Бул бетте'
    },
    dashboardSearch: {
      theme: 'Тема'
    },
    dashboardSearchButton: {
      label: 'Издөө…'
    },
    dashboardSidebarCollapse: {
      collapse: 'Каптал тилкесин жыйноо',
      expand: 'Каптал тилкесин кеңейтүү'
    },
    dashboardSidebarToggle: {
      close: 'Каптал тилкесин жабуу',
      open: 'Каптал тилкесин ачуу'
    },
    error: {
      clear: 'Башкы бетке кайтуу'
    },
    fileUpload: {
      removeFile: '{filename} өчүрүү'
    },
    header: {
      close: 'Менюну жабуу',
      open: 'Менюну ачуу'
    },
    inputMenu: {
      create: '"{label}" жасоо',
      noData: 'Маалымат жок',
      noMatch: 'Эч нерсе табылган жок'
    },
    inputNumber: {
      decrement: 'Азайтуу',
      increment: 'Кошуу'
    },
    modal: {
      close: 'Жабуу'
    },
    pricingTable: {
      caption: 'Баалардын салыштыруу таблицасы'
    },
    prose: {
      codeCollapse: {
        closeText: 'Жыйноо',
        name: 'код',
        openText: 'Кеңейтүү'
      },
      collapsible: {
        closeText: 'Жашыруу',
        name: 'касиеттер',
        openText: 'Көрсөтүү'
      },
      pre: {
        copy: 'Кодду алмашуу буферине көчүрүү'
      }
    },
    selectMenu: {
      create: '"{label}" жасоо',
      noData: 'Маалымат жок',
      noMatch: 'Сүйлөшкөн маалыматтар жок',
      search: 'Издөө…'
    },
    slideover: {
      close: 'Жабуу'
    },
    table: {
      noData: 'Маалымат жок'
    },
    toast: {
      close: 'Жабуу'
    }
  }
})
