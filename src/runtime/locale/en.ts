import { defineLocale } from '../composables/defineLocale'

export default defineLocale({
  name: 'English',
  code: 'en',
  ui: {
    inputMenu: {
      noMatch: 'No matching data',
      noData: 'No data',
      create: 'Create "{label}"'
    },
    commandPalette: {
      noMatch: 'No matching data',
      noData: 'No data',
      close: 'Close'
    },
    selectMenu: {
      noMatch: 'No matching data',
      noData: 'No data',
      create: 'Create "{label}"'
    },
    toast: {
      close: 'Close'
    },
    carousel: {
      prev: 'Prev',
      next: 'Next',
      goto: 'Go to slide {slide}'
    },
    modal: {
      close: 'Close'
    },
    slideover: {
      close: 'Close'
    },
    alert: {
      close: 'Close'
    },
    table: {
      noData: 'No data'
    }
  }
})
