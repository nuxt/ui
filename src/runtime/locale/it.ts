import type { Messages } from '../types/locale'
import { defineLocale } from '../composables/defineLocale'

export default defineLocale<Messages>({
  name: 'Italiano',
  code: 'it',
  messages: {
    alert: {
      close: 'Chiudi'
    },
    authForm: {
      hidePassword: 'Nascondi password',
      showPassword: 'Mostra password',
      submit: 'Continua'
    },
    banner: {
      close: 'Chiudi'
    },
    breadcrumb: {
      label: 'percorso di navigazione'
    },
    calendar: {
      label: 'Data dell\'evento',
      monthPicker: 'Selettore del mese',
      nextMonth: 'Mese successivo',
      nextYear: 'Anno successivo',
      prevMonth: 'Mese precedente',
      prevYear: 'Anno precedente',
      yearPicker: 'Selettore dell\'anno'
    },
    carousel: {
      dots: 'Scegli diapositiva da visualizzare',
      goto: 'Vai alla slide {slide}',
      next: 'Successiva',
      prev: 'Precedente',
      roledescription: 'carosello',
      slide: 'diapositiva'
    },
    chatMessages: {
      autoScroll: 'Scorri in fondo'
    },
    chatPrompt: {
      placeholder: 'Scrivi il tuo messaggio qui…'
    },
    chatPromptSubmit: {
      label: 'Invia',
      reload: 'Riprova',
      stop: 'Interrompi generazione'
    },
    chatReasoning: {
      thinking: 'Pensando…',
      thought: 'Ha pensato',
      thoughtFor: 'Ha pensato per {duration}'
    },
    colorMode: {
      dark: 'Scuro',
      light: 'Chiaro',
      switchToDark: 'Passa alla modalità scura',
      switchToLight: 'Passa alla modalità chiara',
      system: 'Sistema'
    },
    commandPalette: {
      back: 'Indietro',
      close: 'Chiudi',
      noData: 'Nessun dato',
      noMatch: 'Nessun dato corrispondente',
      placeholder: 'Digita un comando o cerca…'
    },
    contentSearch: {
      links: 'Collegamenti',
      search: 'Risultati',
      theme: 'Tema'
    },
    contentSearchButton: {
      label: 'Cerca…'
    },
    contentToc: {
      title: 'In questa pagina'
    },
    dropdownMenu: {
      noMatch: 'Nessun dato corrispondente',
      search: 'Cerca…'
    },
    dashboardSearch: {
      theme: 'Tema'
    },
    dashboardSearchButton: {
      label: 'Cerca…'
    },
    dashboardSidebarCollapse: {
      collapse: 'Comprimi barra laterale',
      expand: 'Espandi barra laterale'
    },
    dashboardSidebarToggle: {
      close: 'Chiudi barra laterale',
      open: 'Apri barra laterale'
    },
    drawer: {
      close: 'Chiudi'
    },
    error: {
      clear: 'Torna alla home'
    },
    fileUpload: {
      removeFile: 'Rimuovi {filename}'
    },
    header: {
      close: 'Chiudi menu',
      open: 'Apri menu'
    },
    inputDate: {
      day: 'giorno',
      dayPeriod: 'AM/PM',
      era: 'era',
      hour: 'ora',
      minute: 'minuto',
      month: 'mese',
      second: 'secondo',
      timeZoneName: 'fuso orario',
      year: 'anno'
    },
    inputMenu: {
      create: 'Crea "{label}"',
      noData: 'Nessun dato',
      noMatch: 'Nessun dato corrispondente'
    },
    inputNumber: {
      decrement: 'Diminuisci',
      increment: 'Aumenta'
    },
    inputRating: {
      rate: 'Valuta {value} su {length}'
    },
    inputTime: {
      dayPeriod: 'AM/PM',
      hour: 'ora',
      minute: 'minuto',
      second: 'secondo',
      timeZoneName: 'fuso orario'
    },
    listbox: {
      noData: 'Nessun dato',
      noMatch: 'Nessun dato corrispondente',
      search: 'Cerca…'
    },
    modal: {
      close: 'Chiudi'
    },
    pagination: {
      first: 'Prima pagina',
      last: 'Ultima pagina',
      next: 'Pagina seguente',
      page: 'Pagina {page}',
      prev: 'Pagina precedente'
    },
    pinInput: {
      input: 'codice PIN, carattere {index} di {length}'
    },
    pricingTable: {
      caption: 'Confronto dei piani di prezzo'
    },
    prose: {
      codeCollapse: {
        closeText: 'Comprimi',
        name: 'codice',
        openText: 'Espandi'
      },
      collapsible: {
        closeText: 'Nascondi',
        name: 'proprietà',
        openText: 'Mostra'
      },
      pre: {
        copy: 'Copia codice negli appunti'
      },
      prompt: {
        copy: 'Copia prompt',
        openIn: 'Apri in {name}'
      }
    },
    sidebar: {
      close: 'Chiudi',
      toggle: 'Alterna'
    },
    selectMenu: {
      create: 'Crea "{label}"',
      noData: 'Nessun dato',
      noMatch: 'Nessun dato corrispondente',
      search: 'Cerca…'
    },
    skeleton: {
      label: 'caricamento'
    },
    slideover: {
      close: 'Chiudi'
    },
    slider: {
      max: 'Massimo',
      min: 'Minimo',
      thumb: 'Cursore',
      value: 'Valore {index} di {total}'
    },
    table: {
      noData: 'Nessun dato'
    },
    toast: {
      close: 'Chiudi'
    },
    toaster: {
      label: 'Notifica',
      viewport: 'Notifiche ({hotkey})'
    }
  }
})
