import type { Messages } from '../types/locale'
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
    breadcrumb: {
      label: 'naršymo kelias'
    },
    calendar: {
      label: 'Įvykio data',
      monthPicker: 'Mėnesio parinkiklis',
      nextMonth: 'Kitas mėnuo',
      nextYear: 'Kiti metai',
      prevMonth: 'Ankstesnis mėnuo',
      prevYear: 'Ankstesni metai',
      yearPicker: 'Metų parinkiklis'
    },
    carousel: {
      dots: 'Pasirinkite skaidrę rodymui',
      goto: 'Eiti į skaidrę {slide}',
      next: 'Pirmyn',
      prev: 'Atgal',
      roledescription: 'karuselė',
      slide: 'skaidrė'
    },
    chatMessages: {
      autoScroll: 'Slinkti žemyn'
    },
    chatPrompt: {
      placeholder: 'Įveskite savo žinutę čia…'
    },
    chatPromptSubmit: {
      label: 'Siųsti žinutę',
      reload: 'Bandyti dar kartą',
      stop: 'Sustabdyti generavimą'
    },
    chatReasoning: {
      thinking: 'Mąsto…',
      thought: 'Pamąstė',
      thoughtFor: 'Mąstė {duration}'
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
      search: 'Rezultatai',
      theme: 'Tema'
    },
    contentSearchButton: {
      label: 'Ieškoti…'
    },
    contentToc: {
      title: 'Šiame puslapyje'
    },
    dropdownMenu: {
      noMatch: 'Nėra atitinkančių duomenų',
      search: 'Ieškoti…'
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
    drawer: {
      close: 'Uždaryti'
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
    inputDate: {
      day: 'diena',
      dayPeriod: 'AM/PM',
      era: 'era',
      hour: 'valanda',
      minute: 'minutė',
      month: 'mėnuo',
      second: 'sekundė',
      timeZoneName: 'laiko juosta',
      year: 'metai'
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
    inputRating: {
      rate: 'Įvertinti {value} iš {length}'
    },
    inputTime: {
      dayPeriod: 'AM/PM',
      hour: 'valanda',
      minute: 'minutė',
      second: 'sekundė',
      timeZoneName: 'laiko juosta'
    },
    listbox: {
      noData: 'Nėra duomenų',
      noMatch: 'Nėra atitinkančių duomenų',
      search: 'Ieškoti…'
    },
    modal: {
      close: 'Uždaryti'
    },
    pagination: {
      first: 'Pirmas puslapis',
      last: 'Paskutinis puslapis',
      next: 'Kitas puslapis',
      page: 'Puslapis {page}',
      prev: 'Ankstesnis puslapis'
    },
    pinInput: {
      input: 'PIN kodas, simbolis {index} iš {length}'
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
      },
      prompt: {
        copy: 'Kopijuoti užklausą',
        openIn: 'Atidaryti {name}'
      }
    },
    sidebar: {
      close: 'Uždaryti',
      toggle: 'Perjungti'
    },
    selectMenu: {
      create: 'Sukurti „{label}"',
      noData: 'Nėra duomenų',
      noMatch: 'Nėra atitinkančių duomenų',
      search: 'Ieškoti…'
    },
    skeleton: {
      label: 'įkeliama'
    },
    slideover: {
      close: 'Uždaryti'
    },
    slider: {
      max: 'Maksimumas',
      min: 'Minimumas',
      thumb: 'Slankiklis',
      value: 'Reikšmė {index} iš {total}'
    },
    table: {
      noData: 'Nėra duomenų'
    },
    toast: {
      close: 'Uždaryti'
    },
    toaster: {
      label: 'Pranešimas',
      viewport: 'Pranešimai ({hotkey})'
    }
  }
})
