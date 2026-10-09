import type { Messages } from '../types/locale'
import { defineLocale } from '../composables/defineLocale'

export default defineLocale<Messages>({
  name: 'Тоҷикӣ',
  code: 'tg',
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
    breadcrumb: {
      label: 'занҷираи навигатсия'
    },
    calendar: {
      label: 'Санаи чорабинӣ',
      monthPicker: 'Интихоби моҳ',
      nextMonth: 'Моҳи оянда',
      nextYear: 'Соли оянда',
      prevMonth: 'Моҳи гузашта',
      prevYear: 'Соли гузашта',
      yearPicker: 'Интихоби сол'
    },
    carousel: {
      dots: 'Слайдро барои намоиш интихоб кунед',
      goto: 'Ба слайди {slide} гузаред',
      next: 'Баъдӣ',
      prev: 'Қаблӣ',
      roledescription: 'карусел',
      slide: 'слайд'
    },
    chatMessages: {
      autoScroll: 'Ба поён ҳаракат додан'
    },
    chatPrompt: {
      placeholder: 'Пайём ворид кунед…'
    },
    chatPromptSubmit: {
      label: 'Фиристодан',
      reload: 'Аз нав кӯшиш кардан',
      stop: 'Қатъ кардани эҷод'
    },
    chatReasoning: {
      thinking: 'Фикр мекунад…',
      thought: 'Фикр кард',
      thoughtFor: '{duration} фикр кард'
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
      search: 'Натиҷаҳо',
      theme: 'Мавзӯъ'
    },
    contentSearchButton: {
      label: 'Ҷустуҷӯ'
    },
    contentToc: {
      title: 'Мундариҷа'
    },
    dropdownMenu: {
      noMatch: 'Маълумоти мувофиқ ёфт нашуд',
      search: 'Ҷустуҷӯ…'
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
    drawer: {
      close: 'Бастан'
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
    inputDate: {
      day: 'рӯз',
      dayPeriod: 'AM/PM',
      era: 'давра',
      hour: 'соат',
      minute: 'дақиқа',
      month: 'моҳ',
      second: 'сония',
      timeZoneName: 'минтақаи вақт',
      year: 'сол'
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
    inputRating: {
      rate: '{value} аз {length} баҳо додан'
    },
    inputTime: {
      dayPeriod: 'AM/PM',
      hour: 'соат',
      minute: 'дақиқа',
      second: 'сония',
      timeZoneName: 'минтақаи вақт'
    },
    listbox: {
      noData: 'Маълумот нест',
      noMatch: 'Маълумоти мувофиқ ёфт нашуд',
      search: 'Ҷустуҷӯ…'
    },
    modal: {
      close: 'Бастан'
    },
    pagination: {
      first: 'Саҳифаи аввал',
      last: 'Саҳифаи охирин',
      next: 'Саҳифаи баъдӣ',
      page: 'Саҳифаи {page}',
      prev: 'Саҳифаи қаблӣ'
    },
    pinInput: {
      input: 'рамзи PIN, аломати {index} аз {length}'
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
      },
      prompt: {
        copy: 'Нусхабардории дархост',
        openIn: 'Кушодан дар {name}'
      }
    },
    sidebar: {
      close: 'Бастан',
      toggle: 'Иваз кардан'
    },
    selectMenu: {
      create: '"{label}" созед',
      noData: 'Маълумот нест',
      noMatch: 'Маълумоти мувофиқ ёфт нашуд',
      search: 'Ҷустуҷӯ…'
    },
    skeleton: {
      label: 'боргирӣ'
    },
    slideover: {
      close: 'Бастан'
    },
    slider: {
      max: 'Ҳадди аксар',
      min: 'Ҳадди ақал',
      thumb: 'Дастак',
      value: 'Қимати {index} аз {total}'
    },
    table: {
      noData: 'Маълумот нест'
    },
    toast: {
      close: 'Бастан'
    },
    toaster: {
      label: 'Огоҳинома',
      viewport: 'Огоҳиномаҳо ({hotkey})'
    }
  }
})
