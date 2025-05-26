import type { Messages } from '../types'
import { defineLocale } from '../composables/defineLocale'

export default defineLocale<Messages>({
  name: 'Eesti',
  code: 'et',
  messages: {
    inputMenu: {
      noMatch: 'Pole vastavaid andmeid',
      noData: 'Pole andmeid',
      create: 'Loo "{label}"'
    },
    calendar: {
      prevYear: 'Eelmine aasta',
      nextYear: 'Järgmine aasta',
      prevMonth: 'Eelmine kuu',
      nextMonth: 'Järgmine kuu'
    },
    inputNumber: {
      increment: 'Suurenda',
      decrement: 'Vähenda'
    },
    commandPalette: {
      placeholder: 'Sisesta käsk või otsi...',
      noMatch: 'Pole vastavaid andmeid',
      noData: 'Pole andmeid',
      close: 'Sulge',
      back: 'Tagasi'
    },
    selectMenu: {
      noMatch: 'Pole vastavaid andmeid',
      noData: 'Pole andmeid',
      create: 'Loo "{label}"',
      search: 'Otsi...'
    },
    toast: {
      close: 'Sulge'
    },
    carousel: {
      prev: 'Eel',
      next: 'Järg',
      goto: 'Mine slaidile {slide}'
    },
    modal: {
      close: 'Sulge'
    },
    slideover: {
      close: 'Sulge'
    },
    alert: {
      close: 'Sulge'
    },
    table: {
      noData: 'Pole andmeid'
    }
  }
})
