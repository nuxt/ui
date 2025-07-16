import type { Messages } from '../types'
import { defineLocale } from '../composables/defineLocale'

export default defineLocale<Messages>({
  name: 'Тоҷикӣ',
  code: 'tj',
  messages: {
    inputMenu: {
      noMatch: 'Маълумоти мувофиқ ёфт нашуд',
      noData: 'Маълумот нест',
      create: '"{label}" созед'
    },
    calendar: {
      prevYear: 'Соли гузашта',
      nextYear: 'Соли оянда',
      prevMonth: 'Моҳи гузашта',
      nextMonth: 'Моҳи оянда'
    },
    inputNumber: {
      increment: 'Зиёд кардан',
      decrement: 'Кам кардан'
    },
    commandPalette: {
      placeholder: 'Фармонро нависед ё ҷустуҷӯ кунед...',
      noMatch: 'Маълумоти мувофиқ ёфт нашуд',
      noData: 'Маълумот нест',
      close: 'Бастан',
      back: 'Бозгашт'
    },
    selectMenu: {
      noMatch: 'Маълумоти мувофиқ ёфт нашуд',
      noData: 'Маълумот нест',
      create: '"{label}" созед',
      search: 'Ҷустуҷӯ...'
    },
    toast: {
      close: 'Бастан'
    },
    carousel: {
      prev: 'Қаблӣ',
      next: 'Баъдӣ',
      dots: 'Слайдро барои намоиш интихоб кунед',
      goto: 'Ба слайди {slide} гузаред'
    },
    modal: {
      close: 'Бастан'
    },
    slideover: {
      close: 'Бастан'
    },
    alert: {
      close: 'Бастан'
    },
    table: {
      noData: 'Маълумот нест'
    }
  }
})
