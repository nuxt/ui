import type { Messages } from '../types/locale'
import { defineLocale } from '../composables/defineLocale'

export default defineLocale<Messages>({
  name: 'Dansk',
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
    breadcrumb: {
      label: 'brødkrummesti'
    },
    calendar: {
      label: 'Begivenhedsdato',
      monthPicker: 'Månedsvælger',
      nextMonth: 'Næste måned',
      nextYear: 'Næste år',
      prevMonth: 'Forrige måned',
      prevYear: 'Forrige år',
      yearPicker: 'Årsvælger'
    },
    carousel: {
      dots: 'Vælg dias til visning',
      goto: 'Gå til slide {slide}',
      next: 'Næste',
      prev: 'Forrige',
      roledescription: 'karrusel',
      slide: 'dias'
    },
    chatMessages: {
      autoScroll: 'Rul til bunden'
    },
    chatPrompt: {
      placeholder: 'Skriv din besked her…'
    },
    chatPromptSubmit: {
      label: 'Send',
      reload: 'Prøv igen',
      stop: 'Stop generering'
    },
    chatReasoning: {
      thinking: 'Tænker…',
      thought: 'Tænkte',
      thoughtFor: 'Tænkte i {duration}'
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
      search: 'Resultater',
      theme: 'Tema'
    },
    contentSearchButton: {
      label: 'Søg…'
    },
    contentToc: {
      title: 'På denne side'
    },
    dropdownMenu: {
      noMatch: 'Ingen matchende data',
      search: 'Søg…'
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
    drawer: {
      close: 'Luk'
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
    inputDate: {
      day: 'dag',
      dayPeriod: 'AM/PM',
      era: 'æra',
      hour: 'time',
      minute: 'minut',
      month: 'måned',
      second: 'sekund',
      timeZoneName: 'tidszone',
      year: 'år'
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
    inputRating: {
      rate: 'Bedøm {value} ud af {length}'
    },
    inputTime: {
      dayPeriod: 'AM/PM',
      hour: 'time',
      minute: 'minut',
      second: 'sekund',
      timeZoneName: 'tidszone'
    },
    listbox: {
      noData: 'Ingen data',
      noMatch: 'Ingen matchende data',
      search: 'Søg…'
    },
    modal: {
      close: 'Luk'
    },
    pagination: {
      first: 'Første side',
      last: 'Sidste side',
      next: 'Næste side',
      page: 'Side {page}',
      prev: 'Forrige side'
    },
    pinInput: {
      input: 'pinkode, tegn {index} af {length}'
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
      },
      prompt: {
        copy: 'Kopiér prompt',
        openIn: 'Åbn i {name}'
      }
    },
    sidebar: {
      close: 'Luk',
      toggle: 'Skift'
    },
    selectMenu: {
      create: 'Opret "{label}"',
      noData: 'Ingen data',
      noMatch: 'Ingen matchende data',
      search: 'Søg…'
    },
    skeleton: {
      label: 'indlæser'
    },
    slideover: {
      close: 'Luk'
    },
    slider: {
      max: 'Maksimum',
      min: 'Minimum',
      thumb: 'Skyder',
      value: 'Værdi {index} af {total}'
    },
    table: {
      noData: 'Ingen data'
    },
    toast: {
      close: 'Luk'
    },
    toaster: {
      label: 'Notifikation',
      viewport: 'Notifikationer ({hotkey})'
    }
  }
})
