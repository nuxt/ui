import type { Messages } from '../types/locale'
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
    breadcrumb: {
      label: 'jejak navigasi'
    },
    calendar: {
      label: 'Tanggal Acara',
      monthPicker: 'Pemilih Bulan',
      nextMonth: 'Bulan berikutnya',
      nextYear: 'Tahun berikutnya',
      prevMonth: 'Bulan sebelumnya',
      prevYear: 'Tahun sebelumnya',
      yearPicker: 'Pemilih Tahun'
    },
    carousel: {
      dots: 'Pilih slide untuk ditampilkan',
      goto: 'Pergi ke slide {slide}',
      next: 'Berikutnya',
      prev: 'Sebelumnya',
      roledescription: 'korsel',
      slide: 'slide'
    },
    chatMessages: {
      autoScroll: 'Gulir ke bawah'
    },
    chatPrompt: {
      placeholder: 'Tulis pesan Anda di sini…'
    },
    chatPromptSubmit: {
      label: 'Kirim',
      reload: 'Coba lagi',
      stop: 'Hentikan pembuatan'
    },
    chatReasoning: {
      thinking: 'Berpikir…',
      thought: 'Telah berpikir',
      thoughtFor: 'Berpikir selama {duration}'
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
      search: 'Hasil',
      theme: 'Tema'
    },
    contentSearchButton: {
      label: 'Cari…'
    },
    contentToc: {
      title: 'Pada halaman ini'
    },
    dropdownMenu: {
      noMatch: 'Tidak ada data yang cocok',
      search: 'Cari…'
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
    drawer: {
      close: 'Tutup'
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
    inputDate: {
      day: 'hari',
      dayPeriod: 'AM/PM',
      era: 'era',
      hour: 'jam',
      minute: 'menit',
      month: 'bulan',
      second: 'detik',
      timeZoneName: 'zona waktu',
      year: 'tahun'
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
    inputRating: {
      rate: 'Beri nilai {value} dari {length}'
    },
    inputTime: {
      dayPeriod: 'AM/PM',
      hour: 'jam',
      minute: 'menit',
      second: 'detik',
      timeZoneName: 'zona waktu'
    },
    listbox: {
      noData: 'Tidak ada data',
      noMatch: 'Tidak ada data yang cocok',
      search: 'Cari…'
    },
    modal: {
      close: 'Tutup'
    },
    pagination: {
      first: 'Halaman pertama',
      last: 'Halaman terakhir',
      next: 'Halaman selanjutnya',
      page: 'Halaman {page}',
      prev: 'Halaman sebelumnya'
    },
    pinInput: {
      input: 'kode PIN, karakter {index} dari {length}'
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
      },
      prompt: {
        copy: 'Salin prompt',
        openIn: 'Buka di {name}'
      }
    },
    sidebar: {
      close: 'Tutup',
      toggle: 'Alihkan'
    },
    selectMenu: {
      create: 'Buat "{label}"',
      noData: 'Tidak ada data',
      noMatch: 'Tidak ada data yang cocok',
      search: 'Cari…'
    },
    skeleton: {
      label: 'memuat'
    },
    slideover: {
      close: 'Tutup'
    },
    slider: {
      max: 'Maksimum',
      min: 'Minimum',
      thumb: 'Penggeser',
      value: 'Nilai {index} dari {total}'
    },
    table: {
      noData: 'Tidak ada data'
    },
    toast: {
      close: 'Tutup'
    },
    toaster: {
      label: 'Notifikasi',
      viewport: 'Notifikasi ({hotkey})'
    }
  }
})
