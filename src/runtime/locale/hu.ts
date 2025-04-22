import type { Messages } from '../types'
import { defineLocale } from '../composables/defineLocale'

export default defineLocale<Messages>({
  name: 'Magyar',
  code: 'hu',
  messages: {
    inputMenu: {
      noMatch: 'Nincs találat',
      noData: 'Nincs adat',
      create: '"{label}" létrehozása'
    },
    calendar: {
      prevYear: 'Előző év',
      nextYear: 'Következő év',
      prevMonth: 'Előző hónap',
      nextMonth: 'Következő hónap'
    },
    inputNumber: {
      increment: 'Növel',
      decrement: 'Csökkent'
    },
    commandPalette: {
      placeholder: 'Írjon be egy parancsot vagy keressen...',
      noMatch: 'Nincs találat',
      noData: 'Nincs adat',
      close: 'Bezárás'
    },
    selectMenu: {
      noMatch: 'Nincs találat',
      noData: 'Nincs adat',
      create: '"{label}" létrehozása',
      search: 'Keresés...'
    },
    toast: {
      close: 'Bezárás'
    },
    carousel: {
      prev: 'Előző',
      next: 'Következő',
      goto: 'Ugrás ide {slide}'
    },
    modal: {
      close: 'Bezárás'
    },
    slideover: {
      close: 'Bezárás'
    },
    alert: {
      close: 'Bezárás'
    },
    table: {
      noData: 'Nincs adat'
    }
  }
})
