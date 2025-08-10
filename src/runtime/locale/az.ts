import type { Messages } from '../types'
import { defineLocale } from '../composables/defineLocale'

export default defineLocale<Messages>({
  name: 'Azərbaycanca',
  code: 'az',
  messages: {
    inputMenu: {
      noMatch: 'Uyğun məlumat tapılmadı',
      noData: 'Məlumat yoxdur',
      create: '"{label}" yarat'
    },
    calendar: {
      prevYear: 'Əvvəlki il',
      nextYear: 'Növbəti il',
      prevMonth: 'Əvvəlki ay',
      nextMonth: 'Növbəti ay'
    },
    inputNumber: {
      increment: 'Artır',
      decrement: 'Azalt'
    },
    commandPalette: {
      placeholder: 'Əmr daxil edin və ya axtarın...',
      noMatch: 'Uyğun məlumat tapılmadı',
      noData: 'Məlumat yoxdur',
      close: 'Bağla',
      back: 'Geri'
    },
    selectMenu: {
      noMatch: 'Uyğun məlumat tapılmadı',
      noData: 'Məlumat yoxdur',
      create: '"{label}" yarat',
      search: 'Axtar...'
    },
    toast: {
      close: 'Bağla'
    },
    carousel: {
      prev: 'Əvvəlki',
      next: 'Növbəti',
      dots: 'Göstərmək üçün slayd seçin',
      goto: 'Slayd {slide} keç'
    },
    modal: {
      close: 'Bağla'
    },
    slideover: {
      close: 'Bağla'
    },
    alert: {
      close: 'Bağla'
    },
    table: {
      noData: 'Məlumat yoxdur'
    },
    fileUpload: {
      removeFile: '{filename} sil'
    }
  }
})
