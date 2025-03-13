import type { Messages } from '../types'
import { defineLocale } from '../composables/defineLocale'

export default defineLocale<Messages>({
  name: "O'zbek",
  code: 'uz',
  messages: {
    inputMenu: {
      noMatch: 'Mos keluvchi natija topilmadi',
      noData: 'Maʼlumot yoʻq',
      create: '"{label}" yaratish'
    },
    calendar: {
      prevYear: 'Oldingi yil',
      nextYear: 'Keyingi yil',
      prevMonth: 'Oldingi oy',
      nextMonth: 'Keyingi oy'
    },
    inputNumber: {
      increment: 'Qoʼshish',
      decrement: 'Ayirish'
    },
    commandPalette: {
      placeholder: 'Buyruq kiriting yoki qidiring...',
      noMatch: 'Mos keluvchi natija topilmadi',
      noData: 'Maʼlumot yoʻq',
      close: 'Yopish'
    },
    selectMenu: {
      noMatch: 'Mos keluvchi natija topilmadi',
      noData: 'Maʼlumot yoʻq',
      create: '"{label}" yaratish',
      search: 'Qidirish...'
    },
    toast: {
      close: 'Yopish'
    },
    carousel: {
      prev: 'Oldinga',
      next: 'Keyingisi',
      goto: '{slide}-slaydga o‘tish'
    },
    modal: {
      close: 'Yopish'
    },
    slideover: {
      close: 'Yopish'
    },
    alert: {
      close: 'Yopish'
    },
    table: {
      noData: 'Maʼlumot yoʻq'
    }
  }
})
