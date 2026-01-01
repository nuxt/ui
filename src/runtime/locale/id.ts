import type { Messages } from '../types'
import { defineLocale } from '../composables/defineLocale'

export default defineLocale<Messages>({
  name: 'Bahasa Indonesia',
  code: 'id',
  messages: {
    alert: {
      close: 'Tutup'
    },
    authForm: {
      hidePassword: 'Sembunyikan kata sandi',
      showPassword: 'Tampilkan kata sandi',
      submit: 'Lanjutkan'
    },
    banner: {
      close: 'Tutup'
    },
    calendar: {
      nextMonth: 'Bulan berikutnya',
      nextYear: 'Tahun berikutnya',
      prevMonth: 'Bulan sebelumnya',
      prevYear: 'Tahun sebelumnya'
    },
    carousel: {
      dots: 'Pilih slide untuk ditampilkan',
      goto: 'Pergi ke slide {slide}',
      next: 'Berikutnya',
      prev: 'Sebelumnya'
    },
    chatPrompt: {
      placeholder: 'Tulis pesan Anda di sini…'
    },
    chatPromptSubmit: {
      label: 'Kirim'
    },
    colorMode: {
      dark: 'Gelap',
      light: 'Terang',
      switchToDark: 'Beralih ke mode gelap',
      switchToLight: 'Beralih ke mode terang',
      system: 'Sistem'
    },
    commandPalette: {
      back: 'Kembali',
      close: 'Tutup',
      noData: 'Tidak ada data',
      noMatch: 'Tidak ada data yang cocok',
      placeholder: 'Ketik perintah atau cari…'
    },
    contentSearch: {
      links: 'Tautan',
      theme: 'Tema'
    },
    contentSearchButton: {
      label: 'Cari…'
    },
    contentToc: {
      title: 'Pada halaman ini'
    },
    dashboardSearch: {
      theme: 'Tema'
    },
    dashboardSearchButton: {
      label: 'Cari…'
    },
    dashboardSidebarCollapse: {
      collapse: 'Ciutkan sidebar',
      expand: 'Perluas sidebar'
    },
    dashboardSidebarToggle: {
      close: 'Tutup sidebar',
      open: 'Buka sidebar'
    },
    error: {
      clear: 'Kembali ke beranda'
    },
    fileUpload: {
      removeFile: 'Hapus {filename}'
    },
    header: {
      close: 'Tutup menu',
      open: 'Buka menu'
    },
    inputMenu: {
      create: 'Buat "{label}"',
      noData: 'Tidak ada data',
      noMatch: 'Tidak ada data yang cocok'
    },
    inputNumber: {
      decrement: 'Kurangi',
      increment: 'Tambah'
    },
    modal: {
      close: 'Tutup'
    },
    pricingTable: {
      caption: 'Perbandingan Harga'
    },
    prose: {
      codeCollapse: {
        closeText: 'Ciutkan',
        name: 'kode',
        openText: 'Perluas'
      },
      collapsible: {
        closeText: 'Sembunyikan',
        name: 'properti',
        openText: 'Tampilkan'
      },
      pre: {
        copy: 'Salin kode ke clipboard'
      }
    },
    selectMenu: {
      create: 'Buat "{label}"',
      noData: 'Tidak ada data',
      noMatch: 'Tidak ada data yang cocok',
      search: 'Cari…'
    },
    slideover: {
      close: 'Tutup'
    },
    table: {
      noData: 'Tidak ada data'
    },
    toast: {
      close: 'Tutup'
    }
  }
})
