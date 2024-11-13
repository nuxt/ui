import { defineLocale } from '../composables/defineLocale'

export default defineLocale({
  name: 'Italiano',
  code: 'it',
  messages: {
    inputMenu: {
      noMatch: 'Nessun dato corrispondente',
      noData: 'Nessun dato',
      create: 'Crea "{label}"'
    },
    commandPalette: {
      noMatch: 'Nessun dato corrispondente',
      noData: 'Nessun dato',
      close: 'Chiudi'
    },
    selectMenu: {
      noMatch: 'Nessun dato corrispondente',
      noData: 'Nessun dato',
      create: 'Crea "{label}"'
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
