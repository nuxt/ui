import type { Messages } from '../types'
import { defineLocale } from '../composables/defineLocale'

export default defineLocale<Messages>({
  name: 'Қазақша',
  code: 'kk',
  messages: {
    inputMenu: {
      noMatch: 'Сәйкес келетін деректер жоқ',
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
      increment: 'Арттыру',
      decrement: 'Азайту'
    },
    commandPalette: {
      placeholder: 'Команда енгізіңіз немесе іздеңіз...',
      noMatch: 'Сәйкес келетін деректер жоқ',
      noData: 'Деректер жоқ',
      close: 'Жабу',
      back: 'Артқа'
    },
    selectMenu: {
      noMatch: 'Сәйкес келетін деректер жоқ',
      noData: 'Деректер жоқ',
      create: '"{label}" жасау',
      search: 'Іздеу...'
    },
    toast: {
      close: 'Жабу'
    },
    carousel: {
      prev: 'Алдыңғы',
      next: 'Келесі',
      goto: '{slide} слайдқа өту'
    },
    modal: {
      close: 'Жабу'
    },
    slideover: {
      close: 'Жабу'
    },
    alert: {
      close: 'Жабу'
    },
    table: {
      noData: 'Деректер жоқ'
    }
  }
})
