import type { Messages } from '../types'
import { defineLocale } from '../composables/defineLocale'

export default defineLocale<Messages>({
  name: 'Deutsch',
  code: 'de',
  messages: {
    alert: {
      close: 'Schließen'
    },
    authForm: {
      hidePassword: 'Passwort verbergen',
      showPassword: 'Passwort anzeigen',
      submit: 'Weiter'
    },
    banner: {
      close: 'Schließen'
    },
    calendar: {
      nextMonth: 'Nächster Monat',
      nextYear: 'Nächstes Jahr',
      prevMonth: 'Vorheriger Monat',
      prevYear: 'Vorheriges Jahr'
    },
    carousel: {
      dots: 'Folie zur Anzeige auswählen',
      goto: 'Gehe zu {slide}',
      next: 'Weiter',
      prev: 'Zurück'
    },
    chatPrompt: {
      placeholder: 'Hier schreiben Sie Ihre Nachricht…'
    },
    chatPromptSubmit: {
      label: 'Senden'
    },
    colorMode: {
      dark: 'Dunkel',
      light: 'Hell',
      switchToDark: 'Zum dunklen Modus wechseln',
      switchToLight: 'Zum hellen Modus wechseln',
      system: 'System'
    },
    commandPalette: {
      back: 'Zurück',
      close: 'Schließen',
      noData: 'Keine Daten',
      noMatch: 'Nichts gefunden',
      placeholder: 'Geben Sie einen Befehl ein oder suchen Sie…'
    },
    contentSearch: {
      links: 'Links',
      theme: 'Thema'
    },
    contentSearchButton: {
      label: 'Suchen…'
    },
    contentToc: {
      title: 'Auf dieser Seite'
    },
    dashboardSearch: {
      theme: 'Thema'
    },
    dashboardSearchButton: {
      label: 'Suchen…'
    },
    dashboardSidebarCollapse: {
      collapse: 'Seitenleiste einklappen',
      expand: 'Seitenleiste erweitern'
    },
    dashboardSidebarToggle: {
      close: 'Seitenleiste schließen',
      open: 'Seitenleiste öffnen'
    },
    error: {
      clear: 'Zurück zur Startseite'
    },
    fileUpload: {
      removeFile: '{filename} entfernen'
    },
    header: {
      close: 'Menü schließen',
      open: 'Menü öffnen'
    },
    inputMenu: {
      create: '"{label}" erstellen',
      noData: 'Keine Daten',
      noMatch: 'Nichts gefunden'
    },
    inputNumber: {
      decrement: 'Verringern',
      increment: 'Erhöhen'
    },
    modal: {
      close: 'Schließen'
    },
    pricingTable: {
      caption: 'Preisplanvergleich'
    },
    prose: {
      codeCollapse: {
        closeText: 'Reduzieren',
        name: 'Code',
        openText: 'Erweitern'
      },
      collapsible: {
        closeText: 'Ausblenden',
        name: 'Eigenschaften',
        openText: 'Anzeigen'
      },
      pre: {
        copy: 'Code in die Zwischenablage kopieren'
      }
    },
    selectMenu: {
      create: '"{label}" erstellen',
      noData: 'Keine Daten',
      noMatch: 'Nichts gefunden',
      search: 'Suchen…'
    },
    slideover: {
      close: 'Schließen'
    },
    table: {
      noData: 'Keine Daten'
    },
    toast: {
      close: 'Schließen'
    }
  }
})
