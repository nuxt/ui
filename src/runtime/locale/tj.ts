import type { Messages } from '../types'
import { defineLocale } from '../composables/defineLocale'

export default defineLocale<Messages>({
  name: 'Тоҷикӣ',
  code: 'tj',
  messages: {
    alert: {
      close: 'Бастан'
    },
    authForm: {
      hidePassword: 'Пинҳон кардани парол',
      showPassword: 'Намоиши парол',
      submit: 'Идома додан'
    },
    banner: {
      close: 'Пӯшидан'
    },
    calendar: {
      nextMonth: 'Моҳи оянда',
      nextYear: 'Соли оянда',
      prevMonth: 'Моҳи гузашта',
      prevYear: 'Соли гузашта'
    },
    carousel: {
      dots: 'Слайдро барои намоиш интихоб кунед',
      goto: 'Ба слайди {slide} гузаред',
      next: 'Баъдӣ',
      prev: 'Қаблӣ'
    },
    chatPrompt: {
      placeholder: 'Пайём ворид кунед…'
    },
    chatPromptSubmit: {
      label: 'Фиристодан'
    },
    colorMode: {
      dark: 'Торик',
      light: 'Рӯшно',
      switchToDark: 'Гузариш ба ҳолати торик',
      switchToLight: 'Гузариш ба ҳолати рӯшно',
      system: 'Система'
    },
    commandPalette: {
      back: 'Бозгашт',
      close: 'Бастан',
      noData: 'Маълумот нест',
      noMatch: 'Маълумоти мувофиқ ёфт нашуд',
      placeholder: 'Фармонро нависед ё ҷустуҷӯ кунед…'
    },
    contentSearch: {
      links: 'Пайвандҳо',
      theme: 'Мавзӯъ'
    },
    contentSearchButton: {
      label: 'Ҷустуҷӯ'
    },
    contentToc: {
      title: 'Мундариҷа'
    },
    dashboardSearch: {
      theme: 'Мавзӯъ'
    },
    dashboardSearchButton: {
      label: 'Ҷустуҷӯ'
    },
    dashboardSidebarCollapse: {
      collapse: 'Кам кардан',
      expand: 'Васеъ кардан'
    },
    dashboardSidebarToggle: {
      close: 'Пӯшидан',
      open: 'Кушодан'
    },
    error: {
      clear: 'Тоза кардан'
    },
    fileUpload: {
      removeFile: '{filename}-ро хориҷ кунед'
    },
    header: {
      close: 'Пӯшидан',
      open: 'Кушодан'
    },
    inputMenu: {
      create: '"{label}" созед',
      noData: 'Маълумот нест',
      noMatch: 'Маълумоти мувофиқ ёфт нашуд'
    },
    inputNumber: {
      decrement: 'Кам кардан',
      increment: 'Зиёд кардан'
    },
    modal: {
      close: 'Бастан'
    },
    pricingTable: {
      caption: 'Ҷадвали нархҳо'
    },
    prose: {
      codeCollapse: {
        closeText: 'Кам кардан',
        name: 'код',
        openText: 'Васеъ кардан'
      },
      collapsible: {
        closeText: 'Пинҳон кардан',
        name: 'хусусиятҳо',
        openText: 'Намоиш додан'
      },
      pre: {
        copy: 'Нусха бардоштан'
      }
    },
    selectMenu: {
      create: '"{label}" созед',
      noData: 'Маълумот нест',
      noMatch: 'Маълумоти мувофиқ ёфт нашуд',
      search: 'Ҷустуҷӯ…'
    },
    slideover: {
      close: 'Бастан'
    },
    table: {
      noData: 'Маълумот нест'
    },
    toast: {
      close: 'Бастан'
    }
  }
})
