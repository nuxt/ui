import type { Messages } from '../types'
import { defineLocale } from '../composables/defineLocale'

export default defineLocale<Messages>({
  name: 'Svenska',
  code: 'sv',
  messages: {
    inputMenu: {
      noMatch: 'Inga matchande data',
      noData: 'Inga data',
      create: 'Skapa "{label}"'
    },
    calendar: {
      prevYear: 'Föregående år',
      nextYear: 'Nästa år',
      prevMonth: 'Föregående månad',
      nextMonth: 'Nästa månad'
    },
    inputNumber: {
      increment: 'Öka',
      decrement: 'Minska'
    },
    commandPalette: {
      placeholder: 'Skriv ett kommando eller sök...',
      noMatch: 'Inga matchande data',
      noData: 'Inga data',
      close: 'Stäng',
      back: 'Tillbaka'
    },
    selectMenu: {
      noMatch: 'Inga matchande data',
      noData: 'Inga data',
      create: 'Skapa "{label}"',
      search: 'Sök...'
    },
    toast: {
      close: 'Stäng'
    },
    carousel: {
      prev: 'Föregående',
      next: 'Nästa',
      goto: 'Gå till {slide}'
    },
    modal: {
      close: 'Stäng'
    },
    slideover: {
      close: 'Stäng'
    },
    alert: {
      close: 'Stäng'
    },
    table: {
      noData: 'Inga data'
    }
  }
})
