import type { Messages } from '../types'
import { defineLocale } from '../composables/defineLocale'

export default defineLocale<Messages>({
  name: 'Hindi',
  code: 'hi',
  messages: {
    inputMenu: {
      noMatch: 'कोई मेल खाता डेटा नहीं',
      noData: 'कोई डेटा नहीं',
      create: '"{label}" बनाएँ'
    },
    calendar: {
      prevYear: 'पिछला वर्ष',
      nextYear: 'अगला वर्ष',
      prevMonth: 'पिछला महीना',
      nextMonth: 'अगला महीना'
    },
    inputNumber: {
      increment: 'बढ़ाना',
      decrement: 'घटाना'
    },
    commandPalette: {
      placeholder: 'एक आदेश या खोज टाइप करें...',
      noMatch: 'कोई मेल खाता डेटा नहीं',
      noData: 'कोई डेटा नहीं',
      close: 'बंद करें',
      back: 'वापस'
    },
    selectMenu: {
      noMatch: 'कोई मेल खाता डेटा नहीं',
      noData: 'कोई डेटा नहीं',
      create: '"{label}" बनाएँ',
      search: 'खोजें...'
    },
    toast: {
      close: 'बंद करें'
    },
    carousel: {
      prev: 'पिछला',
      next: 'अगला',
      goto: 'स्लाइड {slide} पर जाएँ'
    },
    modal: {
      close: 'बंद करें'
    },
    slideover: {
      close: 'बंद करें'
    },
    alert: {
      close: 'बंद करें'
    },
    table: {
      noData: 'कोई डेटा नहीं'
    }
  }
})
