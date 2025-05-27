import type { Messages } from '../types'
import { defineLocale } from '../composables/defineLocale'

export default defineLocale<Messages>({
  name: 'Polski',
  code: 'pl',
  messages: {
    inputMenu: {
      noMatch: 'Brak pasujących danych',
      noData: 'Brak danych',
      create: 'Utwórz "{label}"'
    },
    calendar: {
      prevYear: 'Poprzedni rok',
      nextYear: 'Przyszły rok',
      prevMonth: 'Poprzedni miesiąc',
      nextMonth: 'Przyszły miesiąc'
    },
    inputNumber: {
      increment: 'Zwiększ',
      decrement: 'Zmniejsz'
    },
    commandPalette: {
      placeholder: 'Wpisz polecenie lub wyszukaj...',
      noMatch: 'Brak pasujących danych',
      noData: 'Brak danych',
      close: 'Zamknij',
      back: 'Wstecz'
    },
    selectMenu: {
      noMatch: 'Brak pasujących danych',
      noData: 'Brak danych',
      create: 'Utwórz "{label}"',
      search: 'Szukaj...'
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
