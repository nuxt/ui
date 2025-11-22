import type { Messages } from '../types'
import { defineLocale } from '../composables/defineLocale'

export default defineLocale<Messages>({
  name: 'Azərbaycanca',
  code: 'az',
  messages: {
    alert: {
      close: 'Bağla'
    },
    authForm: {
      hidePassword: 'Şifrəni gizlət',
      showPassword: 'Şifrəni göstər',
      submit: 'Davam et'
    },
    banner: {
      close: 'Bağla'
    },
    calendar: {
      nextMonth: 'Növbəti ay',
      nextYear: 'Növbəti il',
      prevMonth: 'Əvvəlki ay',
      prevYear: 'Əvvəlki il'
    },
    carousel: {
      dots: 'Göstərmək üçün slayd seçin',
      goto: 'Slayd {slide} keç',
      next: 'Növbəti',
      prev: 'Əvvəlki'
    },
    chatPrompt: {
      placeholder: 'Buraya mesajınızı yazın…'
    },
    chatPromptSubmit: {
      label: 'Göndər'
    },
    colorMode: {
      dark: 'Qaranlıq',
      light: 'İşıqlı',
      switchToDark: 'Qaranlıq rejimə keç',
      switchToLight: 'İşıqlı rejimə keç',
      system: 'Sistem'
    },
    commandPalette: {
      back: 'Geri',
      close: 'Bağla',
      noData: 'Məlumat yoxdur',
      noMatch: 'Uyğun məlumat tapılmadı',
      placeholder: 'Əmr daxil edin və ya axtarın…'
    },
    contentSearch: {
      links: 'Bağlantılar',
      theme: 'Tema'
    },
    contentSearchButton: {
      label: 'Axtar…'
    },
    contentToc: {
      title: 'Bu səhifədə'
    },
    dashboardSearch: {
      theme: 'Tema'
    },
    dashboardSearchButton: {
      label: 'Axtar…'
    },
    dashboardSidebarCollapse: {
      collapse: 'Yan paneli daralt',
      expand: 'Yan paneli genişlət'
    },
    dashboardSidebarToggle: {
      close: 'Yan paneli bağla',
      open: 'Yan paneli aç'
    },
    error: {
      clear: 'Ana səhifəyə qayıt'
    },
    fileUpload: {
      removeFile: '{filename} sil'
    },
    header: {
      close: 'Menyunu bağla',
      open: 'Menyunu aç'
    },
    inputMenu: {
      create: '"{label}" yarat',
      noData: 'Məlumat yoxdur',
      noMatch: 'Uyğun məlumat tapılmadı'
    },
    inputNumber: {
      decrement: 'Azalt',
      increment: 'Artır'
    },
    modal: {
      close: 'Bağla'
    },
    pricingTable: {
      caption: 'Qiymət planlarının müqayisəsi'
    },
    prose: {
      codeCollapse: {
        closeText: 'Daralt',
        name: 'kod',
        openText: 'Genişlət'
      },
      collapsible: {
        closeText: 'Gizlət',
        name: 'xüsusiyyətlər',
        openText: 'Göstər'
      },
      pre: {
        copy: 'Kodu buferə kopyala'
      }
    },
    selectMenu: {
      create: '"{label}" yarat',
      noData: 'Məlumat yoxdur',
      noMatch: 'Uyğun məlumat tapılmadı',
      search: 'Axtar…'
    },
    slideover: {
      close: 'Bağla'
    },
    table: {
      noData: 'Məlumat yoxdur'
    },
    toast: {
      close: 'Bağla'
    }
  }
})
