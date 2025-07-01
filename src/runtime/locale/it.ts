import type { Messages } from '../types'
import { defineLocale } from '../composables/defineLocale'

export default defineLocale<Messages>({
  name: 'Italiano',
  code: 'it',
  messages: {
    inputMenu: {
      noMatch: 'Nessun dato corrispondente',
      noData: 'Nessun dato',
      create: 'Crea "{label}"'
    },
    calendar: {
      prevYear: 'Anno precedente',
      nextYear: 'Anno successivo',
      prevMonth: 'Mese precedente',
      nextMonth: 'Mese successivo'
    },
    inputNumber: {
      increment: 'Aumenta',
      decrement: 'Diminuisci'
    },
    commandPalette: {
      placeholder: 'Digita un comando o cerca...',
      noMatch: 'Nessun dato corrispondente',
      noData: 'Nessun dato',
      close: 'Chiudi',
      back: 'Indietro'
    },
    selectMenu: {
      noMatch: 'Nessun dato corrispondente',
      noData: 'Nessun dato',
      create: 'Crea "{label}"',
      search: 'Cerca...'
    },
    toast: {
      close: 'Chiudi'
    },
    carousel: {
      prev: 'Precedente',
      next: 'Successiva',
      goto: 'Vai alla slide {slide}'
    },
    modal: {
      close: 'Chiudi'
    },
    slideover: {
      close: 'Chiudi'
    },
    alert: {
      close: 'Chiudi'
    },
    table: {
      noData: 'Nessun dato'
    }
  }
})
