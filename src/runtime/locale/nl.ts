import { defineLocale } from '../composables/defineLocale'

export default defineLocale({
  name: 'Nederlands',
  code: 'nl',
  messages: {
    inputMenu: {
      noMatch: 'Geen overeenkomende gegevens',
      noData: 'Geen gegevens',
      create: '"{label}" creëren'
    },
    inputNumber: {
      increment: 'Verhogen',
      decrement: 'Verlagen'
    },
    commandPalette: {
      noMatch: 'Geen overeenkomende gegevens',
      noData: 'Geen gegevens',
      close: 'Sluiten'
    },
    selectMenu: {
      noMatch: 'Geen overeenkomende gegevens',
      noData: 'Geen gegevens',
      create: '"{label}" creëren'
    },
    toast: {
      close: 'Sluiten'
    },
    carousel: {
      prev: 'Vorige',
      next: 'Volgende',
      goto: 'Ga naar dia {slide}'
    },
    modal: {
      close: 'Sluiten'
    },
    slideover: {
      close: 'Sluiten'
    },
    alert: {
      close: 'Sluiten'
    },
    table: {
      noData: 'Geen gegevens'
    }
  }
})
