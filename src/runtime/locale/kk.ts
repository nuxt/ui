import type { Messages } from '../types'
import { defineLocale } from '../composables/defineLocale'

export default defineLocale<Messages>({
  name: 'Қазақша',
  code: 'kk',
  messages: {
    inputMenu: {
      noMatch: 'Сәйкес деректер табылмады',
      noData: 'Деректер жоқ',
      create: '"{label}" жасау'
    },
    calendar: {
      prevYear: 'Алдыңғы жыл',
      nextYear: 'Келесі жыл',
      prevMonth: 'Алдыңғы ай',
      nextMonth: 'Келесі ай'
    },
    inputNumber: {
      increment: 'Артыру',
      decrement: 'Азайту'
    },
    commandPalette: {
      placeholder: 'Бұйрық теріңіз немесе іздеңіз...',
      noMatch: 'Совпадений не найдено',
      noData: 'Нет данных',
      close: 'Жабу'
    },
    selectMenu: {
      noMatch: 'Совпадений не найдено',
      noData: 'Нет данных',
      create: 'Создать "{label}"',
      search: 'Іздеу...'
    },
    toast: {
      close: 'Закрыть'
    },
    carousel: {
      prev: 'Артқа',
      next: 'Келесі',
      goto: '{slide} слайдқа өту'
    },
    modal: {
      close: 'Закрыть'
    },
    slideover: {
      close: 'Закрыть'
    },
    alert: {
      close: 'Закрыть'
    },
    table: {
      noData: 'Нет данных'
    }
  }
})
