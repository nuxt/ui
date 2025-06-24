import type { Messages } from '../types'
import { defineLocale } from '../composables/defineLocale'

export default defineLocale<Messages>({
  name: 'Català',
  code: 'ca',
  messages: {
    inputMenu: {
      noMatch: 'No hi ha dades coincidents',
      noData: 'Sense dades',
      create: 'Crear "{label}"'
    },
    calendar: {
      prevYear: 'Any anterior',
      nextYear: 'Any següent',
      prevMonth: 'Mes anterior',
      nextMonth: 'Mes següent'
    },
    inputNumber: {
      increment: 'Incrementar',
      decrement: 'Decrementar'
    },
    commandPalette: {
      placeholder: 'Escriu una ordre o cerca...',
      noMatch: 'No hi ha dades coincidents',
      noData: 'Sense dades',
      close: 'Tancar',
      back: 'Enrere'
    },
    selectMenu: {
      noMatch: 'No hi ha dades coincidents',
      noData: 'Sense dades',
      create: 'Crear "{label}"',
      search: 'Cerca...'
    },
    toast: {
      close: 'Tancar'
    },
    carousel: {
      prev: 'Anterior',
      next: 'Següent',
      goto: 'Anar a la diapositiva {slide}'
    },
    modal: {
      close: 'Tancar'
    },
    slideover: {
      close: 'Tancar'
    },
    alert: {
      close: 'Tancar'
    },
    table: {
      noData: 'Sense dades'
    }
  }
})
