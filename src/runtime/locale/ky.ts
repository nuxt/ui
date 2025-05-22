import type { Messages } from '../types'
import { defineLocale } from '../composables/defineLocale'

export default defineLocale<Messages>({
  name: 'Кыргызча',
  code: 'ky',
  messages: {
    inputMenu: {
      noMatch: 'Эч нерсе табылган жок',
      noData: 'Маалымат жок',
      create: '"{label}" жасоо'
    },
    calendar: {
      prevYear: 'Алдыңкы жыл',
      nextYear: 'Кийинки жыл',
      prevMonth: 'Алдыңкы ай',
      nextMonth: 'Кийинки ай'
    },
    inputNumber: {
      increment: 'Кошуу',
      decrement: 'Азайтуу'
    },
    commandPalette: {
      placeholder: 'Буйрук киргизиңиз же издөө…',
      noMatch: 'Эч нерсе табылган жок',
      noData: 'Маалымат жок',
      close: 'Жабуу'
    },
    selectMenu: {
      noMatch: 'Сүйлөшкөн маалыматтар жок',
      noData: 'Маалымат жок',
      create: '"{label}" жасоо',
      search: 'Издөө...'
    },
    toast: {
      close: 'Жабуу'
    },
    carousel: {
      prev: 'Алдыңкы',
      next: 'Кийинки',
      goto: '{slide} слайдга өтүү'
    },
    modal: {
      close: 'Жабуу'
    },
    slideover: {
      close: 'Жабуу'
    },
    alert: {
      close: 'Жабуу'
    },
    table: {
      noData: 'Маалымат жок'
    }
  }
})
