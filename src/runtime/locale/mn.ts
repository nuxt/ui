import type { Messages } from '../types'
import { defineLocale } from '../composables/defineLocale'

export default defineLocale<Messages>({
  name: 'Монгол',
  code: 'mn',
  messages: {
    inputMenu: {
      noMatch: 'Тохирох мэдээлэл олдсонгүй',
      noData: 'Мэдээлэл байхгүй',
      create: '"{label}" үүсгэх'
    },
    calendar: {
      prevYear: 'Өмнөх жил',
      nextYear: 'Дараа жил',
      prevMonth: 'Өмнөх сар',
      nextMonth: 'Дараа сар'
    },
    inputNumber: {
      increment: 'Нэмэх',
      decrement: 'Хасах'
    },
    commandPalette: {
      placeholder: 'Комманд бичих эсвэл хайлт хийх...',
      noMatch: 'Тохирох мэдээлэл олдсонгүй',
      noData: 'Мэдээлэл байхгүй',
      close: 'Хаах'
    },
    selectMenu: {
      noMatch: 'Тохирох мэдээлэл олдсонгүй',
      noData: 'Мэдээлэл байхгүй',
      create: '"{label}" үүсгэх',
      search: 'Хайх...'
    },
    toast: {
      close: 'Хаах'
    },
    carousel: {
      prev: 'Өмнөх',
      next: 'Дараах',
      goto: '{slide}-р хуудсанд шилжих'
    },
    modal: {
      close: 'Хаах'
    },
    slideover: {
      close: 'Хаах'
    },
    alert: {
      close: 'Хаах'
    },
    table: {
      noData: 'Мэдээлэл байхгүй'
    }
  }
})
