import { defineLocale } from '../composables/defineLocale'

export default defineLocale({
  name: 'Norsk Bokmål',
  code: 'nb-NO',
  messages: {
    inputMenu: {
      noMatch: 'Ingen samsvarende data',
      noData: 'Ingen data',
      create: 'Opprett "{label}"'
    },
    calendar: {
      prevYear: 'Forrige år',
      nextYear: 'Neste år',
      prevMonth: 'Forrige måned',
      nextMonth: 'Neste måned'
    },
    inputNumber: {
      increment: 'Øk',
      decrement: 'Reduser'
    },
    commandPalette: {
      placeholder: 'Skriv inn en kommando eller søk...',
      noMatch: 'Ingen samsvarende data',
      noData: 'Ingen data',
      close: 'Lukk'
    },
    selectMenu: {
      noMatch: 'Ingen samsvarende data',
      noData: 'Ingen data',
      create: 'Opprett "{label}"',
      search: 'Søk...'
    },
    toast: {
      close: 'Lukk'
    },
    carousel: {
      prev: 'Forrige',
      next: 'Neste',
      goto: 'Gå til lysbilde {slide}'
    },
    modal: {
      close: 'Lukk'
    },
    slideover: {
      close: 'Lukk'
    },
    alert: {
      close: 'Lukk'
    },
    table: {
      noData: 'Ingen data'
    }
  }
})
