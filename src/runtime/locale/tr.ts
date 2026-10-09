import type { Messages } from '../types/locale'
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
    breadcrumb: {
      label: 'içerik haritası'
    },
    calendar: {
      label: 'Etkinlik tarihi',
      monthPicker: 'Ay seçici',
      nextMonth: 'Sonraki ay',
      nextYear: 'Sonraki yıl',
      prevMonth: 'Önceki ay',
      prevYear: 'Önceki yıl',
      yearPicker: 'Yıl seçici'
    },
    carousel: {
      dots: 'Görüntülenecek slaydı seçin',
      goto: '{slide}. slayda git',
      next: 'Sonraki',
      prev: 'Önceki',
      roledescription: 'karusel',
      slide: 'slayt'
    },
    chatMessages: {
      autoScroll: 'Aşağı kaydır'
    },
    chatPrompt: {
      placeholder: 'Buraya mesajınızı yazın…'
    },
    chatPromptSubmit: {
      label: 'Gönder',
      reload: 'Tekrar dene',
      stop: 'Oluşturmayı durdur'
    },
    chatReasoning: {
      thinking: 'Düşünüyor…',
      thought: 'Düşündü',
      thoughtFor: '{duration} düşündü'
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
      search: 'Sonuçlar',
      theme: 'Tema'
    },
    contentSearchButton: {
      label: 'Ara…'
    },
    contentToc: {
      title: 'Bu sayfada'
    },
    dropdownMenu: {
      noMatch: 'Eşleşen veri yok',
      search: 'Ara…'
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
    drawer: {
      close: 'Kapat'
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
    inputDate: {
      day: 'gün',
      dayPeriod: 'ÖÖ/ÖS',
      era: 'çağ',
      hour: 'saat',
      minute: 'dakika',
      month: 'ay',
      second: 'saniye',
      timeZoneName: 'saat dilimi',
      year: 'yıl'
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
    inputRating: {
      rate: '{length} üzerinden {value} puan ver'
    },
    inputTime: {
      dayPeriod: 'ÖÖ/ÖS',
      hour: 'saat',
      minute: 'dakika',
      second: 'saniye',
      timeZoneName: 'saat dilimi'
    },
    listbox: {
      noData: 'Veri yok',
      noMatch: 'Eşleşen veri yok',
      search: 'Ara…'
    },
    modal: {
      close: 'Kapat'
    },
    pagination: {
      first: 'İlk sayfa',
      last: 'Son sayfa',
      next: 'Sonraki sayfa',
      page: 'Sayfa {page}',
      prev: 'Önceki sayfa'
    },
    pinInput: {
      input: 'PIN kodu, {index}. karakter (toplam {length})'
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
      },
      prompt: {
        copy: 'İstemi kopyala',
        openIn: '{name} içinde aç'
      }
    },
    sidebar: {
      close: 'Kapat',
      toggle: 'Değiştir'
    },
    selectMenu: {
      create: '"{label}" oluştur',
      noData: 'Veri yok',
      noMatch: 'Eşleşen veri yok',
      search: 'Ara…'
    },
    skeleton: {
      label: 'yükleniyor'
    },
    slideover: {
      close: 'Kapat'
    },
    slider: {
      max: 'Maksimum',
      min: 'Minimum',
      thumb: 'Kaydırıcı',
      value: '{index}. değer (toplam {total})'
    },
    table: {
      noData: 'Veri yok'
    },
    toast: {
      close: 'Kapat'
    },
    toaster: {
      label: 'Bildirim',
      viewport: 'Bildirimler ({hotkey})'
    }
  }
})
