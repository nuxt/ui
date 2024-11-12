import { defineLocale } from '../composables/defineLocale'

export default defineLocale({
  name: 'Deutsch',
  code: 'de',
  ui: {
    inputMenu: {
      noMatch: 'Nichts gefunden',
      noData: 'Keine Daten',
      create: 'Erstellen "{label}"'
    },
    commandPalette: {
      noMatch: 'Nichts gefunden',
      noData: 'Keine Daten',
      close: 'Schließen'
    },
    selectMenu: {
      noMatch: 'Nichts gefunden',
      noData: 'Keine Daten',
      create: 'Erstellen "{label}"'
    },
    toast: {
      close: 'Schließen'
    },
    carousel: {
      prev: 'Weiter',
      next: 'Zurück',
      goto: 'Gehe zu {slide}'
    },
    modal: {
      close: 'Schließen'
    },
    slideover: {
      close: 'Schließen'
    },
    alert: {
      close: 'Schließen'
    },
    table: {
      noData: 'Keine Daten'
    }
  }
})
