import { defineLocale } from '../composables/defineLocale'

export default defineLocale({
  name: 'Čeština',
  code: 'cs',
  messages: {
    inputMenu: {
      noMatch: 'Žádná shoda',
      noData: 'Žádná data',
      create: 'Vytvořit "{label}"'
    },
    calendar: {
      prevYear: 'Předchozí rok',
      nextYear: 'Další rok',
      prevMonth: 'Předchozí měsíc',
      nextMonth: 'Další měsíc'
    },
    inputNumber: {
      increment: 'Zvýšit',
      decrement: 'Snížit'
    },
    commandPalette: {
      placeholder: 'Zadejte příkaz nebo hledejte...',
      noMatch: 'Žádná shoda',
      noData: 'Žádná data',
      close: 'Zavřít'
    },
    selectMenu: {
      noMatch: 'Žádná shoda',
      noData: 'Žádná data',
      create: 'Vytvořit "{label}"',
      search: 'Hledat...'
    },
    toast: {
      close: 'Zavřít'
    },
    carousel: {
      prev: 'Předchozí',
      next: 'Další',
      goto: 'Přejít na {slide}'
    },
    modal: {
      close: 'Zavřít'
    },
    slideover: {
      close: 'Zavřít'
    },
    alert: {
      close: 'Zavřít'
    },
    table: {
      noData: 'Žádná data'
    }
  }
})
