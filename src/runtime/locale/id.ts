import { defineLocale } from '../composables/defineLocale'

export default defineLocale({
  name: 'Indonesia',
  code: 'id',
  messages: {
    inputMenu: {
      noMatch: 'Tidak ada data yang cocok',
      noData: 'Tidak ada data',
      create: 'Buat "{label}"'
    },
    calendar: {
      prevYear: 'Tahun sebelumnya',
      nextYear: 'Tahun berikutnya',
      prevMonth: 'Bulan sebelumnya',
      nextMonth: 'Bulan berikutnya'
    },
    inputNumber: {
      increment: 'Tambah',
      decrement: 'Kurangi'
    },
    commandPalette: {
      placeholder: 'Ketik perintah atau cari...',
      noMatch: 'Tidak ada data yang cocok',
      noData: 'Tidak ada data',
      close: 'Tutup'
    },
    selectMenu: {
      noMatch: 'Tidak ada data yang cocok',
      noData: 'Tidak ada data',
      create: 'Buat "{label}"',
      search: 'Cari...'
    },
    toast: {
      close: 'Tutup'
    },
    carousel: {
      prev: 'Sebelumnya',
      next: 'Berikutnya',
      goto: 'Pergi ke slide {slide}'
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
      noData: 'Tidak ada data'
    }
  }
})
