import type { Messages } from '../types/locale'
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
    breadcrumb: {
      label: 'Brotkrümelnavigation'
    },
    calendar: {
      label: 'Ereignisdatum',
      monthPicker: 'Monatsauswahl',
      nextMonth: 'Nächster Monat',
      nextYear: 'Nächstes Jahr',
      prevMonth: 'Vorheriger Monat',
      prevYear: 'Vorheriges Jahr',
      yearPicker: 'Jahresauswahl'
    },
    carousel: {
      dots: 'Folie zur Anzeige auswählen',
      goto: 'Gehe zu {slide}',
      next: 'Weiter',
      prev: 'Zurück',
      roledescription: 'Karussell',
      slide: 'Folie'
    },
    chatMessages: {
      autoScroll: 'Nach unten scrollen'
    },
    chatPrompt: {
      placeholder: 'Hier schreiben Sie Ihre Nachricht…'
    },
    chatPromptSubmit: {
      label: 'Senden',
      reload: 'Erneut versuchen',
      stop: 'Generierung stoppen'
    },
    chatReasoning: {
      thinking: 'Denkt nach…',
      thought: 'Nachgedacht',
      thoughtFor: '{duration} nachgedacht'
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
      search: 'Ergebnisse',
      theme: 'Thema'
    },
    contentSearchButton: {
      label: 'Suchen…'
    },
    contentToc: {
      title: 'Auf dieser Seite'
    },
    dropdownMenu: {
      noMatch: 'Nichts gefunden',
      search: 'Suchen…'
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
    drawer: {
      close: 'Schließen'
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
    inputDate: {
      day: 'Tag',
      dayPeriod: 'AM/PM',
      era: 'Epoche',
      hour: 'Stunde',
      minute: 'Minute',
      month: 'Monat',
      second: 'Sekunde',
      timeZoneName: 'Zeitzone',
      year: 'Jahr'
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
    inputRating: {
      rate: 'Mit {value} von {length} bewerten'
    },
    inputTime: {
      dayPeriod: 'AM/PM',
      hour: 'Stunde',
      minute: 'Minute',
      second: 'Sekunde',
      timeZoneName: 'Zeitzone'
    },
    listbox: {
      noData: 'Keine Daten',
      noMatch: 'Nichts gefunden',
      search: 'Suchen…'
    },
    modal: {
      close: 'Schließen'
    },
    pagination: {
      first: 'Erste Seite',
      last: 'Letzte Seite',
      next: 'Nächste Seite',
      page: 'Seite {page}',
      prev: 'Vorherige Seite'
    },
    pinInput: {
      input: 'PIN-Code, Zeichen {index} von {length}'
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
      },
      prompt: {
        copy: 'Prompt kopieren',
        openIn: 'In {name} öffnen'
      }
    },
    sidebar: {
      close: 'Schließen',
      toggle: 'Umschalten'
    },
    selectMenu: {
      create: '"{label}" erstellen',
      noData: 'Keine Daten',
      noMatch: 'Nichts gefunden',
      search: 'Suchen…'
    },
    skeleton: {
      label: 'wird geladen'
    },
    slideover: {
      close: 'Schließen'
    },
    slider: {
      max: 'Maximum',
      min: 'Minimum',
      thumb: 'Schieberegler',
      value: 'Wert {index} von {total}'
    },
    table: {
      noData: 'Keine Daten'
    },
    toast: {
      close: 'Schließen'
    },
    toaster: {
      label: 'Benachrichtigung',
      viewport: 'Benachrichtigungen ({hotkey})'
    }
  }
})
