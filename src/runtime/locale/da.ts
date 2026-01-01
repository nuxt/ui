import type { Messages } from '../types'
import { defineLocale } from '../composables/defineLocale'

export default defineLocale<Messages>({
  name: 'Danish',
  code: 'da',
  messages: {
    alert: {
      close: 'Luk'
    },
    authForm: {
      hidePassword: 'Skjul adgangskode',
      showPassword: 'Vis adgangskode',
      submit: 'Fortsæt'
    },
    banner: {
      close: 'Luk'
    },
    calendar: {
      nextMonth: 'Næste måned',
      nextYear: 'Næste år',
      prevMonth: 'Forrige måned',
      prevYear: 'Forrige år'
    },
    carousel: {
      dots: 'Vælg dias til visning',
      goto: 'Gå til slide {slide}',
      next: 'Næste',
      prev: 'Forrige'
    },
    chatPrompt: {
      placeholder: 'Skriv din besked her…'
    },
    chatPromptSubmit: {
      label: 'Send'
    },
    colorMode: {
      dark: 'Mørk',
      light: 'Lys',
      switchToDark: 'Skift til mørk tilstand',
      switchToLight: 'Skift til lys tilstand',
      system: 'System'
    },
    commandPalette: {
      back: 'Tilbage',
      close: 'Luk',
      noData: 'Ingen data',
      noMatch: 'Ingen matchende data',
      placeholder: 'Skriv en kommando eller søg…'
    },
    contentSearch: {
      links: 'Links',
      theme: 'Tema'
    },
    contentSearchButton: {
      label: 'Søg…'
    },
    contentToc: {
      title: 'På denne side'
    },
    dashboardSearch: {
      theme: 'Tema'
    },
    dashboardSearchButton: {
      label: 'Søg…'
    },
    dashboardSidebarCollapse: {
      collapse: 'Sammenfold sidemenu',
      expand: 'Udvid sidemenu'
    },
    dashboardSidebarToggle: {
      close: 'Luk sidemenu',
      open: 'Åbn sidemenu'
    },
    error: {
      clear: 'Tilbage til forsiden'
    },
    fileUpload: {
      removeFile: 'Fjern {filename}'
    },
    header: {
      close: 'Luk menu',
      open: 'Åbn menu'
    },
    inputMenu: {
      create: 'Opret "{label}"',
      noData: 'Ingen data',
      noMatch: 'Ingen matchende data'
    },
    inputNumber: {
      decrement: 'Reducer',
      increment: 'Øg'
    },
    modal: {
      close: 'Luk'
    },
    pricingTable: {
      caption: 'Prisplaneringssammenligning'
    },
    prose: {
      codeCollapse: {
        closeText: 'Sammenfold',
        name: 'kode',
        openText: 'Udvid'
      },
      collapsible: {
        closeText: 'Skjul',
        name: 'egenskaber',
        openText: 'Vis'
      },
      pre: {
        copy: 'Kopiér kode til udklipsholder'
      }
    },
    selectMenu: {
      create: 'Opret "{label}"',
      noData: 'Ingen data',
      noMatch: 'Ingen matchende data',
      search: 'Søg…'
    },
    slideover: {
      close: 'Luk'
    },
    table: {
      noData: 'Ingen data'
    },
    toast: {
      close: 'Luk'
    }
  }
})
