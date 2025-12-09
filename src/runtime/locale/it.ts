import type { Messages } from '../types'
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
    calendar: {
      nextMonth: 'Mese successivo',
      nextYear: 'Anno successivo',
      prevMonth: 'Mese precedente',
      prevYear: 'Anno precedente'
    },
    carousel: {
      dots: 'Scegli diapositiva da visualizzare',
      goto: 'Vai alla slide {slide}',
      next: 'Successiva',
      prev: 'Precedente'
    },
    chatPrompt: {
      placeholder: 'Scrivi il tuo messaggio qui…'
    },
    chatPromptSubmit: {
      label: 'Invia'
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
      theme: 'Tema'
    },
    contentSearchButton: {
      label: 'Cerca…'
    },
    contentToc: {
      title: 'In questa pagina'
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
    inputMenu: {
      create: 'Crea "{label}"',
      noData: 'Nessun dato',
      noMatch: 'Nessun dato corrispondente'
    },
    inputNumber: {
      decrement: 'Diminuisci',
      increment: 'Aumenta'
    },
    modal: {
      close: 'Chiudi'
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
      }
    },
    selectMenu: {
      create: 'Crea "{label}"',
      noData: 'Nessun dato',
      noMatch: 'Nessun dato corrispondente',
      search: 'Cerca…'
    },
    slideover: {
      close: 'Chiudi'
    },
    table: {
      noData: 'Nessun dato'
    },
    toast: {
      close: 'Chiudi'
    }
  }
})
