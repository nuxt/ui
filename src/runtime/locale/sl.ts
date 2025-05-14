import type { Messages } from '../types'
import { defineLocale } from '../composables/defineLocale'

export default defineLocale<Messages>({
  name: 'Slovenščina',
  code: 'sl',
  messages: {
    inputMenu: {
      noMatch: 'Ni ujemanj',
      noData: 'Ni podatkov',
      create: 'Ustvari "{label}"'
    },
    calendar: {
      prevYear: 'Prejšnje leto',
      nextYear: 'Naslednje leto',
      prevMonth: 'Prejšnji mesec',
      nextMonth: 'Naslednji mesec'
    },
    inputNumber: {
      increment: 'Povišaj',
      decrement: 'Zmanjšaj'
    },
    commandPalette: {
      placeholder: 'Vpiši ukaz ali išči...',
      noMatch: 'Ni ujemanj',
      noData: 'Ni podatkov',
      close: 'Zapri'
    },
    selectMenu: {
      noMatch: 'Ni ujemanj',
      noData: 'Ni podatkov',
      create: 'Ustvari "{label}"',
      search: 'Išči...'
    },
    toast: {
      close: 'Zapri'
    },
    carousel: {
      prev: 'Nazaj',
      next: 'Naprej',
      goto: 'Pojdi na {slide}'
    },
    modal: {
      close: 'Zapri'
    },
    slideover: {
      close: 'Zapri'
    },
    alert: {
      close: 'Zapri'
    },
    table: {
      noData: 'Ni podatkov'
    }
  }
})
