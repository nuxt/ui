import type { Messages } from '../types'
import { defineLocale } from '../composables/defineLocale'

export default defineLocale<Messages>({
  name: 'Norsk Bokmål',
  code: 'nb-NO',
  messages: {
    authForm: {
      submit: 'Fortsett',
      hidePassword: 'Skjul passord',
      showPassword: 'Vis passord'
    },
    banner: {
      close: 'Lukk'
    },
    chatPrompt: {
      placeholder: 'Skriv din melding her...'
    },
    chatPromptSubmit: {
      label: 'Send'
    },
    colorMode: {
      system: 'System',
      light: 'Lys',
      dark: 'Mørk',
      switchToLight: 'Bytt til lys modus',
      switchToDark: 'Bytt til mørk modus'
    },
    contentSearch: {
      links: 'Lenker',
      theme: 'Tema'
    },
    contentSearchButton: {
      label: 'Søk...'
    },
    contentToc: {
      title: 'På denne siden'
    },
    dashboardSearch: {
      theme: 'Tema'
    },
    dashboardSearchButton: {
      label: 'Søk...'
    },
    dashboardSidebarCollapse: {
      expand: 'Utvid sidepanel',
      collapse: 'Skjul sidepanel'
    },
    dashboardSidebarToggle: {
      close: 'Lukk sidepanel',
      open: 'Åpne sidepanel'
    },
    error: {
      clear: 'Tilbake til forsiden'
    },
    header: {
      close: 'Lukk meny',
      open: 'Åpne meny'
    },
    pricingTable: {
      caption: 'Prisplaneringssammenligning'
    },
    prose: {
      codeCollapse: {
        name: 'kode',
        openText: 'Utvid',
        closeText: 'Skjul'
      },
      collapsible: {
        name: 'egenskaper',
        openText: 'Vis',
        closeText: 'Skjul'
      },
      pre: {
        copy: 'Kopier kode til utklippstavle'
      }
    },
    inputMenu: {
      noMatch: 'Ingen samsvarende data',
      noData: 'Ingen data',
      create: 'Opprett "{label}"'
    },
    calendar: {
      prevYear: 'Forrige år',
      nextYear: 'Neste år',
      prevMonth: 'Forrige måned',
      nextMonth: 'Neste måned'
    },
    inputNumber: {
      increment: 'Øk',
      decrement: 'Reduser'
    },
    commandPalette: {
      placeholder: 'Skriv inn en kommando eller søk...',
      noMatch: 'Ingen samsvarende data',
      noData: 'Ingen data',
      close: 'Lukk',
      back: 'Tilbake'
    },
    selectMenu: {
      noMatch: 'Ingen samsvarende data',
      noData: 'Ingen data',
      create: 'Opprett "{label}"',
      search: 'Søk...'
    },
    toast: {
      close: 'Lukk'
    },
    carousel: {
      prev: 'Forrige',
      next: 'Neste',
      dots: 'Velg lysbilde som skal vises',
      goto: 'Gå til lysbilde {slide}'
    },
    modal: {
      close: 'Lukk'
    },
    slideover: {
      close: 'Lukk'
    },
    alert: {
      close: 'Lukk'
    },
    table: {
      noData: 'Ingen data'
    },
    fileUpload: {
      removeFile: 'Fjern {filename}'
    }
  }
})
