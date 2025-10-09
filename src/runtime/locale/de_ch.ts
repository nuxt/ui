import type { Messages } from '../types'
import { defineLocale } from '../composables/defineLocale'

export default defineLocale<Messages>({
  name: 'Schweizerdeutsch',
  code: 'de-CH',
  messages: {
    alert: {
      close: 'Schliessen'
    },
    authForm: {
      hidePassword: 'Passwort verbergen',
      showPassword: 'Passwort anzeigen',
      submit: 'Weiter'
    },
    banner: {
      close: 'Schliessen'
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
      close: 'Schliessen',
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
      close: 'Seitenleiste schliessen',
      open: 'Seitenleiste öffnen'
    },
    error: {
      clear: 'Zurück zur Startseite'
    },
    fileUpload: {
      removeFile: '{filename} entfernen'
    },
    header: {
      close: 'Menü schliessen',
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
      close: 'Schliessen'
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
      close: 'Schliessen'
    },
    table: {
      noData: 'Keine Daten'
    },
    toast: {
      close: 'Schliessen'
    }
  }
})
