import type { Messages } from '../types'
import { defineLocale } from '../composables/defineLocale'

export default defineLocale<Messages>({
  name: 'Nederlands',
  code: 'nl',
  messages: {
    inputMenu: {
      noMatch: 'Geen overeenkomende gegevens',
      noData: 'Geen gegevens',
      create: '"{label}" creëren'
    },
    calendar: {
      prevYear: 'Vorig jaar',
      nextYear: 'Volgend jaar',
      prevMonth: 'Vorige maand',
      nextMonth: 'Volgende maand'
    },
    inputNumber: {
      increment: 'Verhogen',
      decrement: 'Verlagen'
    },
    commandPalette: {
      placeholder: 'Typ een commando of zoek...',
      noMatch: 'Geen overeenkomende gegevens',
      noData: 'Geen gegevens',
      close: 'Sluiten'
    },
    selectMenu: {
      noMatch: 'Geen overeenkomende gegevens',
      noData: 'Geen gegevens',
      create: '"{label}" creëren',
      search: 'Zoeken...'
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
