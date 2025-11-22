import type { Messages } from '../types'
import { defineLocale } from '../composables/defineLocale'

export default defineLocale<Messages>({
  name: 'Lietuvių',
  code: 'lt',
  messages: {
    alert: {
      close: 'Uždaryti'
    },
    authForm: {
      hidePassword: 'Slėpti slaptažodį',
      showPassword: 'Rodyti slaptažodį',
      submit: 'Tęsti'
    },
    banner: {
      close: 'Uždaryti'
    },
    calendar: {
      nextMonth: 'Kitas mėnuo',
      nextYear: 'Kiti metai',
      prevMonth: 'Ankstesnis mėnuo',
      prevYear: 'Ankstesni metai'
    },
    carousel: {
      dots: 'Pasirinkite skaidrę rodymui',
      goto: 'Eiti į skaidrę {slide}',
      next: 'Pirmyn',
      prev: 'Atgal'
    },
    chatPrompt: {
      placeholder: 'Įveskite savo žinutę čia…'
    },
    chatPromptSubmit: {
      label: 'Siųsti žinutę'
    },
    colorMode: {
      dark: 'Tamsus',
      light: 'Šviesus',
      switchToDark: 'Perjungti į tamsų režimą',
      switchToLight: 'Perjungti į šviesų režimą',
      system: 'Sistema'
    },
    commandPalette: {
      back: 'Atgal',
      close: 'Uždaryti',
      noData: 'Nėra duomenų',
      noMatch: 'Nėra atitinkančių duomenų',
      placeholder: 'Įveskite komandą arba ieškokite…'
    },
    contentSearch: {
      links: 'Nuorodos',
      theme: 'Tema'
    },
    contentSearchButton: {
      label: 'Ieškoti…'
    },
    contentToc: {
      title: 'Šiame puslapyje'
    },
    dashboardSearch: {
      theme: 'Tema'
    },
    dashboardSearchButton: {
      label: 'Ieškoti…'
    },
    dashboardSidebarCollapse: {
      collapse: 'Suskleisti šoninę juostą',
      expand: 'Išplėsti šoninę juostą'
    },
    dashboardSidebarToggle: {
      close: 'Uždaryti šoninę juostą',
      open: 'Atidaryti šoninę juostą'
    },
    error: {
      clear: 'Grįžti į pradžią'
    },
    fileUpload: {
      removeFile: 'Pašalinti {filename}'
    },
    header: {
      close: 'Uždaryti meniu',
      open: 'Atidaryti meniu'
    },
    inputMenu: {
      create: 'Sukurti „{label}"',
      noData: 'Nėra duomenų',
      noMatch: 'Nėra atitinkančių duomenų'
    },
    inputNumber: {
      decrement: 'Sumažinti',
      increment: 'Padidinti'
    },
    modal: {
      close: 'Uždaryti'
    },
    pricingTable: {
      caption: 'Kainų planų palyginimas'
    },
    prose: {
      codeCollapse: {
        closeText: 'Suskleisti',
        name: 'kodas',
        openText: 'Išplėsti'
      },
      collapsible: {
        closeText: 'Slėpti',
        name: 'savybės',
        openText: 'Rodyti'
      },
      pre: {
        copy: 'Kopijuoti kodą į iškarpinę'
      }
    },
    selectMenu: {
      create: 'Sukurti „{label}"',
      noData: 'Nėra duomenų',
      noMatch: 'Nėra atitinkančių duomenų',
      search: 'Ieškoti…'
    },
    slideover: {
      close: 'Uždaryti'
    },
    table: {
      noData: 'Nėra duomenų'
    },
    toast: {
      close: 'Uždaryti'
    }
  }
})
