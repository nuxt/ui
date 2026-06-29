import type { Messages } from '../types/locale'
import { defineLocale } from '../composables/defineLocale'

export default defineLocale<Messages>({
  name: 'Latviešu',
  code: 'lv',
  messages: {
    alert: {
      close: 'Aizvērt'
    },
    authForm: {
      hidePassword: 'Paslēpt paroli',
      showPassword: 'Rādīt paroli',
      submit: 'Turpināt'
    },
    banner: {
      close: 'Aizvērt'
    },
    calendar: {
      nextMonth: 'Nākamais mēnesis',
      nextYear: 'Nākamais gads',
      prevMonth: 'Iepriekšējais mēnesis',
      prevYear: 'Iepriekšējais gads'
    },
    carousel: {
      dots: 'Izvēlies slaidu, ko rādīt',
      goto: 'Pāriet uz slaidu {slide}',
      next: 'Nākamais',
      prev: 'Iepriekšējais'
    },
    chatPrompt: {
      placeholder: 'Raksti savu ziņu šeit…'
    },
    chatPromptSubmit: {
      label: 'Sūtīt ziņu'
    },
    colorMode: {
      dark: 'Tumšs',
      light: 'Gaišs',
      switchToDark: 'Pārslēgt uz tumšo režīmu',
      switchToLight: 'Pārslēgt uz gaišo režīmu',
      system: 'Sistēmas'
    },
    commandPalette: {
      back: 'Atpakaļ',
      close: 'Aizvērt',
      noData: 'Nav datu',
      noMatch: 'Nav atbilstošu datu',
      placeholder: 'Ievadi komandu vai meklē…'
    },
    contentSearch: {
      links: 'Saites',
      search: 'Rezultāti',
      theme: 'Tēma'
    },
    contentSearchButton: {
      label: 'Meklēt…'
    },
    contentToc: {
      title: 'Šajā lapā'
    },
    dropdownMenu: {
      noMatch: 'Nav atbilstošu datu',
      search: 'Meklēt…'
    },
    dashboardSearch: {
      theme: 'Tēma'
    },
    dashboardSearchButton: {
      label: 'Meklēt…'
    },
    dashboardSidebarCollapse: {
      collapse: 'Sakļaut sānjoslu',
      expand: 'Izvērst sānjoslu'
    },
    dashboardSidebarToggle: {
      close: 'Aizvērt sānjoslu',
      open: 'Atvērt sānjoslu'
    },
    error: {
      clear: 'Atpakaļ uz sākumlapu'
    },
    fileUpload: {
      removeFile: 'Noņemt {filename}'
    },
    header: {
      close: 'Aizvērt izvēlni',
      open: 'Atvērt izvēlni'
    },
    inputMenu: {
      create: 'Izveidot "{label}"',
      noData: 'Nav datu',
      noMatch: 'Nav atbilstošu datu'
    },
    inputNumber: {
      decrement: 'Samazināt',
      increment: 'Palielināt'
    },
    listbox: {
      noData: 'Nav datu',
      noMatch: 'Nav atbilstošu datu',
      search: 'Meklēt…'
    },
    modal: {
      close: 'Aizvērt'
    },
    pricingTable: {
      caption: 'Cenu salīdzinājums'
    },
    prose: {
      codeCollapse: {
        closeText: 'Sakļaut',
        name: 'kods',
        openText: 'Izvērst'
      },
      collapsible: {
        closeText: 'Paslēpt',
        name: 'īpašības',
        openText: 'Rādīt'
      },
      pre: {
        copy: 'Kopēt kodu'
      },
      prompt: {
        copy: 'Kopēt vaicājumu',
        openIn: 'Atvērt iekš {name}'
      }
    },
    chatReasoning: {
      thinking: 'Domā…',
      thought: 'Domāja',
      thoughtFor: 'Domāja {duration}'
    },
    sidebar: {
      close: 'Aizvērt',
      toggle: 'Pārslēgt'
    },
    selectMenu: {
      create: 'Izveidot "{label}"',
      noData: 'Nav datu',
      noMatch: 'Nav atbilstošu datu',
      search: 'Meklēt…'
    },
    slideover: {
      close: 'Aizvērt'
    },
    table: {
      noData: 'Nav datu'
    },
    toast: {
      close: 'Aizvērt'
    }
  }
})
