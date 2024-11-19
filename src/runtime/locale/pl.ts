import { defineLocale } from '../composables/defineLocale'

export default defineLocale({
  name: 'Polski',
  code: 'pl',
  messages: {
    inputMenu: {
      noMatch: 'Brak pasujących danych',
      noData: 'Brak danych',
      create: 'Utwórz "{label}"'
    },
    inputNumber: {
      increment: 'Zwiększ',
      decrement: 'Zmniejsz'
    },
    commandPalette: {
      noMatch: 'Brak pasujących danych',
      noData: 'Brak danych',
      close: 'Zamknij'
    },
    selectMenu: {
      noMatch: 'Brak pasujących danych',
      noData: 'Brak danych',
      create: 'Utwórz "{label}"'
    },
    toast: {
      close: 'Zamknij'
    },
    carousel: {
      prev: 'Poprzedni',
      next: 'Następny',
      goto: 'Idź do {slide}'
    },
    modal: {
      close: 'Zamknij'
    },
    slideover: {
      close: 'Zamknij'
    },
    alert: {
      close: 'Zamknij'
    },
    table: {
      noData: 'Brak danych'
    }
  }
})
