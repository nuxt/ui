import { defineLocale } from '../composables/defineLocale'

export default defineLocale({
  name: 'Slovenčina',
  code: 'sk',
  messages: {
    inputMenu: {
      noMatch: 'Žiadna zhoda',
      noData: 'Žiadne dáta',
      create: 'Vytvoriť "{label}"'
    },
    calendar: {
      prevYear: 'Predchádzajúci rok',
      nextYear: 'Nasledujúci rok',
      prevMonth: 'Predchádzajúci mesiac',
      nextMonth: 'Nasledujúci mesiac'
    },
    inputNumber: {
      increment: 'Zvýšiť',
      decrement: 'Znížiť'
    },
    commandPalette: {
      noMatch: 'Žiadna zhoda',
      noData: 'Žiadne dáta',
      close: 'Zatvoriť'
    },
    selectMenu: {
      noMatch: 'Žiadna zhoda',
      noData: 'Žiadne dáta',
      create: 'Vytvoriť "{label}"'
    },
    toast: {
      close: 'Zatvoriť'
    },
    carousel: {
      prev: 'Predchádzajúci',
      next: 'Nasledujúci',
      goto: 'Prejsť na {slide}'
    },
    modal: {
      close: 'Zatvoriť'
    },
    slideover: {
      close: 'Zatvoriť'
    },
    alert: {
      close: 'Zatvoriť'
    },
    table: {
      noData: 'Žiadne dáta'
    }
  }
})
