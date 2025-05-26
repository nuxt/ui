import type { Messages } from '../types'
import { defineLocale } from '../composables/defineLocale'

export default defineLocale<Messages>({
  name: 'Melayu',
  code: 'ms',
  messages: {
    inputMenu: {
      noMatch: 'Tiada data yang sepadan',
      noData: 'Tiada data',
      create: 'Cipta "{label}"'
    },
    calendar: {
      prevYear: 'Tahun sebelum',
      nextYear: 'Tahun seterusnya',
      prevMonth: 'Bulan sebelum',
      nextMonth: 'Bulan seterusnya'
    },
    inputNumber: {
      increment: 'Naikkan',
      decrement: 'Kurangkan'
    },
    commandPalette: {
      placeholder: 'Taip arahan atau carian...',
      noMatch: 'Tiada data yang sepadan',
      noData: 'Tiada data',
      close: 'Tutup',
      back: 'Kembali'
    },
    selectMenu: {
      noMatch: 'Tiada data yang sepadan',
      noData: 'Tiada data',
      create: 'Cipta "{label}"',
      search: 'Cari...'
    },
    toast: {
      close: 'Tutup'
    },
    carousel: {
      prev: 'Sebelum',
      next: 'Seterusnya',
      goto: 'Pergi ke slaid {slide}'
    },
    modal: {
      close: 'Tutup'
    },
    slideover: {
      close: 'Tutup'
    },
    alert: {
      close: 'Tutup'
    },
    table: {
      noData: 'Tiada data'
    }
  }
})
