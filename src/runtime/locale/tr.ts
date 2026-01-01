import type { Messages } from '../types'
import { defineLocale } from '../composables/defineLocale'

export default defineLocale<Messages>({
  name: 'Türkçe',
  code: 'tr',
  messages: {
    alert: {
      close: 'Kapat'
    },
    authForm: {
      hidePassword: 'Şifreyi gizle',
      showPassword: 'Şifreyi göster',
      submit: 'Devam et'
    },
    banner: {
      close: 'Kapat'
    },
    calendar: {
      nextMonth: 'Sonraki ay',
      nextYear: 'Sonraki yıl',
      prevMonth: 'Önceki ay',
      prevYear: 'Önceki yıl'
    },
    carousel: {
      dots: 'Görüntülenecek slaydı seçin',
      goto: '{slide}. slayda git',
      next: 'Sonraki',
      prev: 'Önceki'
    },
    chatPrompt: {
      placeholder: 'Buraya mesajınızı yazın…'
    },
    chatPromptSubmit: {
      label: 'Gönder'
    },
    colorMode: {
      dark: 'Koyu',
      light: 'Açık',
      switchToDark: 'Koyu moda geç',
      switchToLight: 'Açık moda geç',
      system: 'Sistem'
    },
    commandPalette: {
      back: 'Geri',
      close: 'Kapat',
      noData: 'Veri yok',
      noMatch: 'Eşleşen veri yok',
      placeholder: 'Bir komut yazın veya arama yapın…'
    },
    contentSearch: {
      links: 'Bağlantılar',
      theme: 'Tema'
    },
    contentSearchButton: {
      label: 'Ara…'
    },
    contentToc: {
      title: 'Bu sayfada'
    },
    dashboardSearch: {
      theme: 'Tema'
    },
    dashboardSearchButton: {
      label: 'Ara…'
    },
    dashboardSidebarCollapse: {
      collapse: 'Kenar çubuğunu daralt',
      expand: 'Kenar çubuğunu genişlet'
    },
    dashboardSidebarToggle: {
      close: 'Kenar çubuğunu kapat',
      open: 'Kenar çubuğunu aç'
    },
    error: {
      clear: 'Ana sayfaya dön'
    },
    fileUpload: {
      removeFile: '{filename} kaldır'
    },
    header: {
      close: 'Menüyü kapat',
      open: 'Menüyü aç'
    },
    inputMenu: {
      create: '"{label}" oluştur',
      noData: 'Veri yok',
      noMatch: 'Eşleşen veri yok'
    },
    inputNumber: {
      decrement: 'Azalt',
      increment: 'Arttır'
    },
    modal: {
      close: 'Kapat'
    },
    pricingTable: {
      caption: 'Fiyat planlarını karşılaştır'
    },
    prose: {
      codeCollapse: {
        closeText: 'Daralt',
        name: 'kod',
        openText: 'Genişlet'
      },
      collapsible: {
        closeText: 'Gizle',
        name: 'özellikler',
        openText: 'Göster'
      },
      pre: {
        copy: 'Kodu panoya kopyala'
      }
    },
    selectMenu: {
      create: '"{label}" oluştur',
      noData: 'Veri yok',
      noMatch: 'Eşleşen veri yok',
      search: 'Ara…'
    },
    slideover: {
      close: 'Kapat'
    },
    table: {
      noData: 'Veri yok'
    },
    toast: {
      close: 'Kapat'
    }
  }
})
