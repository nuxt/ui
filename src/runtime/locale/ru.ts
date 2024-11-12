import { defineLocale } from '../composables/defineLocale'

export default defineLocale('Русский', 'ru', {
  inputMenu: {
    noMatch: 'Совпадений не найдено',
    noData: 'Нет данных',
    create: 'Создать "{label}"'
  },
  inputNumber: {
    increment: 'Увеличить',
    decrement: 'Уменьшить'
  },
  commandPalette: {
    noMatch: 'Совпадений не найдено',
    noData: 'Нет данных',
    close: 'Закрыть'
  },
  selectMenu: {
    noMatch: 'Совпадений не найдено',
    noData: 'Нет данных',
    create: 'Создать "{label}"'
  },
  toast: {
    close: 'Закрыть'
  },
  carousel: {
    prev: 'Назад',
    next: 'Далее',
    goto: 'Перейти к {slide}'
  },
  modal: {
    close: 'Закрыть'
  },
  slideover: {
    close: 'Закрыть'
  },
  alert: {
    close: 'Закрыть'
  },
  table: {
    noData: 'Нет данных'
  }
})
