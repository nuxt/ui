import type { Messages } from '../types/locale'
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
    breadcrumb: {
      label: 'навигациялык жол'
    },
    calendar: {
      label: 'Иш-чаранын күнү',
      monthPicker: 'Айды тандоо',
      nextMonth: 'Кийинки ай',
      nextYear: 'Кийинки жыл',
      prevMonth: 'Алдыңкы ай',
      prevYear: 'Алдыңкы жыл',
      yearPicker: 'Жылды тандоо'
    },
    carousel: {
      dots: 'Көрсөтүү үчүн слайдды тандаңыз',
      goto: '{slide} слайдга өтүү',
      next: 'Кийинки',
      prev: 'Алдыңкы',
      roledescription: 'карусель',
      slide: 'слайд'
    },
    chatMessages: {
      autoScroll: 'Ылдый жылдыруу'
    },
    chatPrompt: {
      placeholder: 'Бул жерге билдирүүңүздү жазыңыз…'
    },
    chatPromptSubmit: {
      label: 'Билдирүү жөнөтүү',
      reload: 'Кайра аракет кылуу',
      stop: 'Генерацияны токтотуу'
    },
    chatReasoning: {
      thinking: 'Ойлонуда…',
      thought: 'Ойлонду',
      thoughtFor: '{duration} ойлонду'
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
      search: 'Жыйынтыктар',
      theme: 'Тема'
    },
    contentSearchButton: {
      label: 'Издөө…'
    },
    contentToc: {
      title: 'Бул бетте'
    },
    dropdownMenu: {
      noMatch: 'Сүйлөшкөн маалыматтар жок',
      search: 'Издөө…'
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
    drawer: {
      close: 'Жабуу'
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
    inputDate: {
      day: 'күн',
      dayPeriod: 'AM/PM',
      era: 'заман',
      hour: 'саат',
      minute: 'мүнөт',
      month: 'ай',
      second: 'секунд',
      timeZoneName: 'убакыт алкагы',
      year: 'жыл'
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
    inputRating: {
      rate: '{length} ичинен {value} деп баалоо'
    },
    inputTime: {
      dayPeriod: 'AM/PM',
      hour: 'саат',
      minute: 'мүнөт',
      second: 'секунд',
      timeZoneName: 'убакыт алкагы'
    },
    listbox: {
      noData: 'Маалымат жок',
      noMatch: 'Сүйлөшкөн маалыматтар жок',
      search: 'Издөө…'
    },
    modal: {
      close: 'Жабуу'
    },
    pagination: {
      first: 'Биринчи бет',
      last: 'Акыркы бет',
      next: 'Кийинки бет',
      page: '{page}-бет',
      prev: 'Алдыңкы бет'
    },
    pinInput: {
      input: 'PIN код, {length} ичинен {index}-белги'
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
      },
      prompt: {
        copy: 'Суроону көчүрүү',
        openIn: '{name} ичинде ачуу'
      }
    },
    sidebar: {
      close: 'Жабуу',
      toggle: 'Которуу'
    },
    selectMenu: {
      create: '"{label}" жасоо',
      noData: 'Маалымат жок',
      noMatch: 'Сүйлөшкөн маалыматтар жок',
      search: 'Издөө…'
    },
    skeleton: {
      label: 'жүктөлүүдө'
    },
    slideover: {
      close: 'Жабуу'
    },
    slider: {
      max: 'Максимум',
      min: 'Минимум',
      thumb: 'Сыдырма',
      value: '{total} ичинен {index}-маани'
    },
    table: {
      noData: 'Маалымат жок'
    },
    toast: {
      close: 'Жабуу'
    },
    toaster: {
      label: 'Билдирме',
      viewport: 'Билдирмелер ({hotkey})'
    }
  }
})
