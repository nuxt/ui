import type { Messages } from '../types'
import { defineLocale } from '../composables/defineLocale'

export default defineLocale<Messages>({
  name: 'Türkçe',
  code: 'tr',
  messages: {
    inputMenu: {
      noMatch: 'Eşleşen veri yok',
      noData: 'Veri yok',
      create: '"{label}" oluştur'
    },
    calendar: {
      prevYear: 'Önceki yıl',
      nextYear: 'Sonraki yıl',
      prevMonth: 'Önceki ay',
      nextMonth: 'Sonraki ay'
    },
    inputNumber: {
      increment: 'Arttır',
      decrement: 'Azalt'
    },
    commandPalette: {
      placeholder: 'Bir komut yazın veya arama yapın...',
      noMatch: 'Eşleşen veri yok',
      noData: 'Veri yok',
      close: 'Kapat'
    },
    selectMenu: {
      noMatch: 'Eşleşen veri yok',
      noData: 'Veri yok',
      create: '"{label}" oluştur',
      search: 'Ara...'
    },
    toast: {
      close: 'Kapat'
    },
    carousel: {
      prev: 'Önceki',
      next: 'Sonraki',
      goto: '{slide}. slayda git'
    },
    modal: {
      close: 'Kapat'
    },
    slideover: {
      close: 'Kapat'
    },
    alert: {
      close: 'Kapat'
    },
    table: {
      noData: 'Veri yok'
    }
  }
})
