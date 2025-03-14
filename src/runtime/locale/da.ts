import type { Messages } from '../types'
import { defineLocale } from '../composables/defineLocale'

export default defineLocale<Messages>({
  name: 'Danish',
  code: 'da',
  messages: {
    inputMenu: {
      noMatch: 'Ingen matchende data',
      noData: 'Ingen data',
      create: 'Opret "{label}"'
    },
    calendar: {
      prevYear: 'Forrige år',
      nextYear: 'Næste år',
      prevMonth: 'Forrige måned',
      nextMonth: 'Næste måned'
    },
    inputNumber: {
      increment: 'Øg',
      decrement: 'Reducer'
    },
    commandPalette: {
      placeholder: 'Skriv en kommando eller søg...',
      noMatch: 'Ingen matchende data',
      noData: 'Ingen data',
      close: 'Luk'
    },
    selectMenu: {
      noMatch: 'Ingen matchende data',
      noData: 'Ingen data',
      create: 'Opret "{label}"',
      search: 'Søg...'
    },
    toast: {
      close: 'Luk'
    },
    carousel: {
      prev: 'Forrige',
      next: 'Næste',
      goto: 'Gå til slide {slide}'
    },
    modal: {
      close: 'Luk'
    },
    slideover: {
      close: 'Luk'
    },
    alert: {
      close: 'Luk'
    },
    table: {
      noData: 'Ingen data'
    }
  }
})
