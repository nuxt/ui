import type { Messages } from '../types/locale'
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
    breadcrumb: {
      label: 'brødsmulesti'
    },
    calendar: {
      label: 'Hendelsesdato',
      monthPicker: 'Månedsvelger',
      nextMonth: 'Neste måned',
      nextYear: 'Neste år',
      prevMonth: 'Forrige måned',
      prevYear: 'Forrige år',
      yearPicker: 'Årsvelger'
    },
    carousel: {
      dots: 'Velg lysbilde som skal vises',
      goto: 'Gå til lysbilde {slide}',
      next: 'Neste',
      prev: 'Forrige',
      roledescription: 'karusell',
      slide: 'lysbilde'
    },
    chatMessages: {
      autoScroll: 'Rull til bunnen'
    },
    chatPrompt: {
      placeholder: 'Skriv din melding her…'
    },
    chatPromptSubmit: {
      label: 'Send',
      reload: 'Prøv igjen',
      stop: 'Stopp generering'
    },
    chatReasoning: {
      thinking: 'Tenker…',
      thought: 'Tenkte',
      thoughtFor: 'Tenkte i {duration}'
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
      search: 'Resultater',
      theme: 'Tema'
    },
    contentSearchButton: {
      label: 'Søk…'
    },
    contentToc: {
      title: 'På denne siden'
    },
    dropdownMenu: {
      noMatch: 'Ingen samsvarende data',
      search: 'Søk…'
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
    drawer: {
      close: 'Lukk'
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
    inputDate: {
      day: 'dag',
      dayPeriod: 'AM/PM',
      era: 'tidsalder',
      hour: 'time',
      minute: 'minutt',
      month: 'måned',
      second: 'sekund',
      timeZoneName: 'tidssone',
      year: 'år'
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
    inputRating: {
      rate: 'Gi {value} av {length}'
    },
    inputTime: {
      dayPeriod: 'AM/PM',
      hour: 'time',
      minute: 'minutt',
      second: 'sekund',
      timeZoneName: 'tidssone'
    },
    listbox: {
      noData: 'Ingen data',
      noMatch: 'Ingen samsvarende data',
      search: 'Søk…'
    },
    modal: {
      close: 'Lukk'
    },
    pagination: {
      first: 'Første side',
      last: 'Siste side',
      next: 'Neste side',
      page: 'Side {page}',
      prev: 'Forrige side'
    },
    pinInput: {
      input: 'PIN-kode, tegn {index} av {length}'
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
      },
      prompt: {
        copy: 'Kopier ledetekst',
        openIn: 'Åpne i {name}'
      }
    },
    sidebar: {
      close: 'Lukk',
      toggle: 'Veksle'
    },
    selectMenu: {
      create: 'Opprett "{label}"',
      noData: 'Ingen data',
      noMatch: 'Ingen samsvarende data',
      search: 'Søk…'
    },
    skeleton: {
      label: 'laster inn'
    },
    slideover: {
      close: 'Lukk'
    },
    slider: {
      max: 'Maksimum',
      min: 'Minimum',
      thumb: 'Glidebryter',
      value: 'Verdi {index} av {total}'
    },
    table: {
      noData: 'Ingen data'
    },
    toast: {
      close: 'Lukk'
    },
    toaster: {
      label: 'Varsel',
      viewport: 'Varsler ({hotkey})'
    }
  }
})
