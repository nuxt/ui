import type { Messages } from '../types'
import { defineLocale } from '../composables/defineLocale'

export default defineLocale<Messages>({
  name: 'Română',
  code: 'ro',
  messages: {
    inputMenu: {
      noMatch: 'Nu există date corespunzătoare',
      noData: 'Nu există date',
      create: 'Creează "{label}"'
    },
    calendar: {
      prevYear: 'Anul precedent',
      nextYear: 'Anul următor',
      prevMonth: 'Luna precedentă',
      nextMonth: 'Luna următoare'
    },
    inputNumber: {
      increment: 'Crește',
      decrement: 'Scade'
    },
    commandPalette: {
      placeholder: 'Tastează o comandă sau caută...',
      noMatch: 'Nu există date corespunzătoare',
      noData: 'Nu există date',
      close: 'Închide',
      back: 'Înapoi'
    },
    selectMenu: {
      noMatch: 'Nu există date corespunzătoare',
      noData: 'Nu există date',
      create: 'Creează "{label}"',
      search: 'Caută...'
    },
    toast: {
      close: 'Închide'
    },
    carousel: {
      prev: 'Anterior',
      next: 'Următor',
      goto: 'Mergi la diapozitivul {slide}'
    },
    modal: {
      close: 'Închide'
    },
    slideover: {
      close: 'Închide'
    },
    alert: {
      close: 'Închide'
    },
    table: {
      noData: 'Nu există date'
    }
  }
})
