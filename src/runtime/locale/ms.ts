import type { Messages } from '../types'
import { defineLocale } from '../composables/defineLocale'

export default defineLocale<Messages>({
  name: 'Melayu',
  code: 'ms',
  messages: {
    alert: {
      close: 'Tutup'
    },
    authForm: {
      hidePassword: 'Sembunyikan kata laluan',
      showPassword: 'Tunjukkan kata laluan',
      submit: 'Teruskan'
    },
    banner: {
      close: 'Tutup'
    },
    calendar: {
      nextMonth: 'Bulan seterusnya',
      nextYear: 'Tahun seterusnya',
      prevMonth: 'Bulan sebelum',
      prevYear: 'Tahun sebelum'
    },
    carousel: {
      dots: 'Pilih slaid untuk dipaparkan',
      goto: 'Pergi ke slaid {slide}',
      next: 'Seterusnya',
      prev: 'Sebelum'
    },
    chatPrompt: {
      placeholder: 'Taip mesej anda di sini…'
    },
    chatPromptSubmit: {
      label: 'Hantar mesej'
    },
    colorMode: {
      dark: 'Gelap',
      light: 'Cerah',
      switchToDark: 'Tukar ke mod gelap',
      switchToLight: 'Tukar ke mod cerah',
      system: 'Sistem'
    },
    commandPalette: {
      back: 'Kembali',
      close: 'Tutup',
      noData: 'Tiada data',
      noMatch: 'Tiada data yang sepadan',
      placeholder: 'Taip arahan atau carian…'
    },
    contentSearch: {
      links: 'Pautan',
      theme: 'Tema'
    },
    contentSearchButton: {
      label: 'Cari…'
    },
    contentToc: {
      title: 'Di halaman ini'
    },
    dashboardSearch: {
      theme: 'Tema'
    },
    dashboardSearchButton: {
      label: 'Cari…'
    },
    dashboardSidebarCollapse: {
      collapse: 'Runtuhkan bar sisi',
      expand: 'Kembangkan bar sisi'
    },
    dashboardSidebarToggle: {
      close: 'Tutup bar sisi',
      open: 'Buka bar sisi'
    },
    error: {
      clear: 'Kembali ke laman utama'
    },
    fileUpload: {
      removeFile: 'Buang {filename}'
    },
    header: {
      close: 'Tutup menu',
      open: 'Buka menu'
    },
    inputMenu: {
      create: 'Cipta "{label}"',
      noData: 'Tiada data',
      noMatch: 'Tiada data yang sepadan'
    },
    inputNumber: {
      decrement: 'Kurangkan',
      increment: 'Naikkan'
    },
    modal: {
      close: 'Tutup'
    },
    pricingTable: {
      caption: 'Perbandingan pelan harga'
    },
    prose: {
      codeCollapse: {
        closeText: 'Runtuhkan',
        name: 'kod',
        openText: 'Kembangkan'
      },
      collapsible: {
        closeText: 'Sembunyikan',
        name: 'ciri',
        openText: 'Tunjukkan'
      },
      pre: {
        copy: 'Salin kod ke papan klip'
      }
    },
    selectMenu: {
      create: 'Cipta "{label}"',
      noData: 'Tiada data',
      noMatch: 'Tiada data yang sepadan',
      search: 'Cari…'
    },
    slideover: {
      close: 'Tutup'
    },
    table: {
      noData: 'Tiada data'
    },
    toast: {
      close: 'Tutup'
    }
  }
})
