import type { Messages } from '../types/locale'
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
    breadcrumb: {
      label: 'naviqasiya yolu'
    },
    calendar: {
      label: 'Tədbir tarixi',
      monthPicker: 'Ay seçimi',
      nextMonth: 'Növbəti ay',
      nextYear: 'Növbəti il',
      prevMonth: 'Əvvəlki ay',
      prevYear: 'Əvvəlki il',
      yearPicker: 'İl seçimi'
    },
    carousel: {
      dots: 'Göstərmək üçün slayd seçin',
      goto: 'Slayd {slide} keç',
      next: 'Növbəti',
      prev: 'Əvvəlki',
      roledescription: 'karusel',
      slide: 'slayd'
    },
    chatMessages: {
      autoScroll: 'Aşağı sürüşdür'
    },
    chatPrompt: {
      placeholder: 'Buraya mesajınızı yazın…'
    },
    chatPromptSubmit: {
      label: 'Göndər',
      reload: 'Yenidən cəhd et',
      stop: 'Yaratmanı dayandır'
    },
    chatReasoning: {
      thinking: 'Düşünür…',
      thought: 'Düşündü',
      thoughtFor: '{duration} düşündü'
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
      search: 'Nəticələr',
      theme: 'Tema'
    },
    contentSearchButton: {
      label: 'Axtar…'
    },
    contentToc: {
      title: 'Bu səhifədə'
    },
    dropdownMenu: {
      noMatch: 'Uyğun məlumat tapılmadı',
      search: 'Axtar…'
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
    drawer: {
      close: 'Bağla'
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
    inputDate: {
      day: 'gün',
      dayPeriod: 'AM/PM',
      era: 'era',
      hour: 'saat',
      minute: 'dəqiqə',
      month: 'ay',
      second: 'saniyə',
      timeZoneName: 'saat qurşağı',
      year: 'il'
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
    inputRating: {
      rate: '{length} üzərindən {value} qiymət ver'
    },
    inputTime: {
      dayPeriod: 'AM/PM',
      hour: 'saat',
      minute: 'dəqiqə',
      second: 'saniyə',
      timeZoneName: 'saat qurşağı'
    },
    listbox: {
      noData: 'Məlumat yoxdur',
      noMatch: 'Uyğun məlumat tapılmadı',
      search: 'Axtar…'
    },
    modal: {
      close: 'Bağla'
    },
    pagination: {
      first: 'İlk səhifə',
      last: 'Son səhifə',
      next: 'Növbəti səhifə',
      page: 'Səhifə {page}',
      prev: 'Əvvəlki səhifə'
    },
    pinInput: {
      input: 'PIN kod, simvol {index} / {length}'
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
      },
      prompt: {
        copy: 'Təlimatı kopyala',
        openIn: '{name} ilə aç'
      }
    },
    sidebar: {
      close: 'Bağla',
      toggle: 'Dəyişdir'
    },
    selectMenu: {
      create: '"{label}" yarat',
      noData: 'Məlumat yoxdur',
      noMatch: 'Uyğun məlumat tapılmadı',
      search: 'Axtar…'
    },
    skeleton: {
      label: 'yüklənir'
    },
    slideover: {
      close: 'Bağla'
    },
    slider: {
      max: 'Maksimum',
      min: 'Minimum',
      thumb: 'Tutacaq',
      value: 'Dəyər {index} / {total}'
    },
    table: {
      noData: 'Məlumat yoxdur'
    },
    toast: {
      close: 'Bağla'
    },
    toaster: {
      label: 'Bildiriş',
      viewport: 'Bildirişlər ({hotkey})'
    }
  }
})
