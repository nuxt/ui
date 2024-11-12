import { defineLocale } from '../composables/defineLocale'

export default defineLocale('Italiano', 'it', {
  inputMenu: {
    noMatch: 'Nessun dato corrispondente',
    noData: 'Nessun dato',
    create: 'Creare "{label}"'
  },
  inputNumber: {
    increment: 'Aumenta',
    decrement: 'Diminuisci'
  },
  commandPalette: {
    noMatch: 'Nessun dato corrispondente',
    noData: 'Nessun dato',
    close: 'Chiudi'
  },
  selectMenu: {
    noMatch: 'Nessun dato corrispondente',
    noData: 'Nessun dato',
    create: 'Creare "{label}"'
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
    noData: 'Nessuno dato'
  }
})
