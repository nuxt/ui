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
    breadcrumb: {
      label: 'navigācijas ceļš'
    },
    calendar: {
      label: 'Notikuma datums',
      monthPicker: 'Mēneša atlasītājs',
      nextMonth: 'Nākamais mēnesis',
      nextYear: 'Nākamais gads',
      prevMonth: 'Iepriekšējais mēnesis',
      prevYear: 'Iepriekšējais gads',
      yearPicker: 'Gada atlasītājs'
    },
    carousel: {
      dots: 'Izvēlies slaidu, ko rādīt',
      goto: 'Pāriet uz slaidu {slide}',
      next: 'Nākamais',
      prev: 'Iepriekšējais',
      roledescription: 'karuselis',
      slide: 'slaids'
    },
    chatMessages: {
      autoScroll: 'Ritināt uz leju'
    },
    chatPrompt: {
      placeholder: 'Raksti savu ziņu šeit…'
    },
    chatPromptSubmit: {
      label: 'Sūtīt ziņu',
      reload: 'Mēģināt vēlreiz',
      stop: 'Apturēt ģenerēšanu'
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
    drawer: {
      close: 'Aizvērt'
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
    inputDate: {
      day: 'diena',
      dayPeriod: 'AM/PM',
      era: 'ēra',
      hour: 'stunda',
      minute: 'minūte',
      month: 'mēnesis',
      second: 'sekunde',
      timeZoneName: 'laika josla',
      year: 'gads'
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
    inputRating: {
      rate: 'Novērtēt ar {value} no {length}'
    },
    inputTime: {
      dayPeriod: 'AM/PM',
      hour: 'stunda',
      minute: 'minūte',
      second: 'sekunde',
      timeZoneName: 'laika josla'
    },
    listbox: {
      noData: 'Nav datu',
      noMatch: 'Nav atbilstošu datu',
      search: 'Meklēt…'
    },
    modal: {
      close: 'Aizvērt'
    },
    pagination: {
      first: 'Pirmā lapa',
      last: 'Pēdējā lapa',
      next: 'Nākamā lapa',
      page: 'Lapa {page}',
      prev: 'Iepriekšējā lapa'
    },
    pinInput: {
      input: 'PIN kods, rakstzīme {index} no {length}'
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
    skeleton: {
      label: 'ielādē'
    },
    slideover: {
      close: 'Aizvērt'
    },
    slider: {
      max: 'Maksimums',
      min: 'Minimums',
      thumb: 'Slīdnis',
      value: 'Vērtība {index} no {total}'
    },
    table: {
      noData: 'Nav datu'
    },
    toast: {
      close: 'Aizvērt'
    },
    toaster: {
      label: 'Paziņojums',
      viewport: 'Paziņojumi ({hotkey})'
    }
  }
})
