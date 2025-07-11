import type { Messages } from '../types'
import { defineLocale } from '../composables/defineLocale'

export default defineLocale<Messages>({
  name: 'Български',
  code: 'bg',
  messages: {
    inputMenu: {
      noMatch: 'Няма съвпадение на данни',
      noData: 'Няма данни',
      create: 'Създайте "{label}"'
    },
    calendar: {
      prevYear: 'Предишна година',
      nextYear: 'Следваща година',
      prevMonth: 'Предишен месец',
      nextMonth: 'Следващ месец'
    },
    inputNumber: {
      increment: 'Увеличаване',
      decrement: 'Намаляване'
    },
    fileUpload: {
      empty: 'Пераглядаць або перацягнуць файлы сюды',
      removeAll: 'Выдаліць усё',
      addFiles: 'Дадаць файл(ы)',
      files: 'Файлы'
    },
    commandPalette: {
      placeholder: 'Въведете команда или потърсете...',
      noMatch: 'Няма съвпадение на данни',
      noData: 'Няма данни',
      close: 'Затворете',
      back: 'Назад'
    },
    selectMenu: {
      noMatch: 'Няма съвпадение на данни',
      noData: 'Няма данни',
      create: 'Създайте "{label}"',
      search: 'Потърсете...'
    },
    toast: {
      close: 'Затворете'
    },
    carousel: {
      prev: 'Назад',
      next: 'Напред',
      dots: 'Изберете слайд за показване',
      goto: 'Отидете на слайд {slide}'
    },
    modal: {
      close: 'Затворете'
    },
    slideover: {
      close: 'Затворете'
    },
    alert: {
      close: 'Затворете'
    },
    table: {
      noData: 'Няма данни'
    }
  }
})
