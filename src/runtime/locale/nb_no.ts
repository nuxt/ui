import type { Messages } from '../types'
import { defineLocale } from '../composables/defineLocale'

export default defineLocale<Messages>({
  name: 'Norsk Bokmål',
  code: 'nb-NO',
  messages: {
    alert: {
      close: 'Lukk'
    },
    authForm: {
      hidePassword: 'Skjul passord',
      showPassword: 'Vis passord',
      submit: 'Fortsett'
    },
    banner: {
      close: 'Lukk'
    },
    calendar: {
      nextMonth: 'Neste måned',
      nextYear: 'Neste år',
      prevMonth: 'Forrige måned',
      prevYear: 'Forrige år'
    },
    carousel: {
      dots: 'Velg lysbilde som skal vises',
      goto: 'Gå til lysbilde {slide}',
      next: 'Neste',
      prev: 'Forrige'
    },
    chatPrompt: {
      placeholder: 'Skriv din melding her…'
    },
    chatPromptSubmit: {
      label: 'Send'
    },
    colorMode: {
      dark: 'Mørk',
      light: 'Lys',
      switchToDark: 'Bytt til mørk modus',
      switchToLight: 'Bytt til lys modus',
      system: 'System'
    },
    commandPalette: {
      back: 'Tilbake',
      close: 'Lukk',
      noData: 'Ingen data',
      noMatch: 'Ingen samsvarende data',
      placeholder: 'Skriv inn en kommando eller søk…'
    },
    contentSearch: {
      links: 'Lenker',
      theme: 'Tema'
    },
    contentSearchButton: {
      label: 'Søk…'
    },
    contentToc: {
      title: 'På denne siden'
    },
    dashboardSearch: {
      theme: 'Tema'
    },
    dashboardSearchButton: {
      label: 'Søk…'
    },
    dashboardSidebarCollapse: {
      collapse: 'Skjul sidepanel',
      expand: 'Utvid sidepanel'
    },
    dashboardSidebarToggle: {
      close: 'Lukk sidepanel',
      open: 'Åpne sidepanel'
    },
    error: {
      clear: 'Tilbake til forsiden'
    },
    fileUpload: {
      removeFile: 'Fjern {filename}'
    },
    header: {
      close: 'Lukk meny',
      open: 'Åpne meny'
    },
    inputMenu: {
      create: 'Opprett "{label}"',
      noData: 'Ingen data',
      noMatch: 'Ingen samsvarende data'
    },
    inputNumber: {
      decrement: 'Reduser',
      increment: 'Øk'
    },
    modal: {
      close: 'Lukk'
    },
    pricingTable: {
      caption: 'Prisplaneringssammenligning'
    },
    prose: {
      codeCollapse: {
        closeText: 'Skjul',
        name: 'kode',
        openText: 'Utvid'
      },
      collapsible: {
        closeText: 'Skjul',
        name: 'egenskaper',
        openText: 'Vis'
      },
      pre: {
        copy: 'Kopier kode til utklippstavle'
      }
    },
    selectMenu: {
      create: 'Opprett "{label}"',
      noData: 'Ingen data',
      noMatch: 'Ingen samsvarende data',
      search: 'Søk…'
    },
    slideover: {
      close: 'Lukk'
    },
    table: {
      noData: 'Ingen data'
    },
    toast: {
      close: 'Lukk'
    }
  }
})
