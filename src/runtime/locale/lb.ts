import type { Messages } from '../types/locale'
import { defineLocale } from '../composables/defineLocale'

export default defineLocale<Messages>({
  name: 'Lëtzebuergesch',
  code: 'lb',
  messages: {
    alert: {
      close: 'Zoumaachen'
    },
    authForm: {
      hidePassword: 'Passwuert verstoppen',
      showPassword: 'Passwuert uweisen',
      submit: 'Fortschécken'
    },
    banner: {
      close: 'Zoumaachen'
    },
    breadcrumb: {
      label: 'Navigatiounswee'
    },
    calendar: {
      label: 'Datum vum Evenement',
      monthPicker: 'Mountauswiel',
      nextMonth: 'Nächste Mount',
      nextYear: 'Nächst Joer',
      prevMonth: 'Virege Mount',
      prevYear: 'Viregt Joer',
      yearPicker: 'Joerauswiel'
    },
    carousel: {
      dots: 'Wielt Dia fir ze weisen',
      goto: 'Gitt op d\'Slide {slide}',
      next: 'Näch.',
      prev: 'Präz.',
      roledescription: 'Karussell',
      slide: 'Dia'
    },
    chatMessages: {
      autoScroll: 'No ënnen scrollen'
    },
    chatPrompt: {
      placeholder: 'Tippt hei Äre Message…'
    },
    chatPromptSubmit: {
      label: 'Prompt schécken',
      reload: 'Nach eng Kéier probéieren',
      stop: 'Generéieren stoppen'
    },
    chatReasoning: {
      thinking: 'Denkt no…',
      thought: 'Nogeduecht',
      thoughtFor: '{duration} nogeduecht'
    },
    colorMode: {
      dark: 'Donkel',
      light: 'Liicht',
      switchToDark: 'Op de Donkelmodus wiesselen',
      switchToLight: 'Op de Liichtmodus wiesselen',
      system: 'System'
    },
    commandPalette: {
      back: 'Zréck',
      close: 'Zoumaachen',
      noData: 'Keng Donnéeën',
      noMatch: 'Keng entspriechend Donnéeën',
      placeholder: 'Tippt e Befeel oder sicht…'
    },
    contentSearch: {
      links: 'Linken',
      search: 'Resultater',
      theme: 'Thema'
    },
    contentSearchButton: {
      label: 'Sichen…'
    },
    contentToc: {
      title: 'Op dëser Säit'
    },
    dropdownMenu: {
      noMatch: 'Keng entspriechend Donnéeën',
      search: 'Sichen…'
    },
    dashboardSearch: {
      theme: 'Thema'
    },
    dashboardSearchButton: {
      label: 'Sichen…'
    },
    dashboardSidebarCollapse: {
      collapse: 'Sidebar zouklappen',
      expand: 'Sidebar opklappen'
    },
    dashboardSidebarToggle: {
      close: 'Sidebar zoumaachen',
      open: 'Sidebar opmaachen'
    },
    drawer: {
      close: 'Zoumaachen'
    },
    error: {
      clear: 'Zréck op d\'Startsäit'
    },
    fileUpload: {
      removeFile: '{filename} ewechhuelen'
    },
    header: {
      close: 'Menü zoumaachen',
      open: 'Menü opmaachen'
    },
    inputDate: {
      day: 'Dag',
      dayPeriod: 'AM/PM',
      era: 'Epoch',
      hour: 'Stonn',
      minute: 'Minutt',
      month: 'Mount',
      second: 'Sekonn',
      timeZoneName: 'Zäitzon',
      year: 'Joer'
    },
    inputMenu: {
      create: '"{label}" erstellen',
      noData: 'Keng Donnéeën',
      noMatch: 'Keng entspriechend Donnéeën'
    },
    inputNumber: {
      decrement: 'Dekrementéieren',
      increment: 'Inkrementéieren'
    },
    inputRating: {
      rate: '{value} vu {length} bewäerten'
    },
    inputTime: {
      dayPeriod: 'AM/PM',
      hour: 'Stonn',
      minute: 'Minutt',
      second: 'Sekonn',
      timeZoneName: 'Zäitzon'
    },
    listbox: {
      noData: 'Keng Donnéeën',
      noMatch: 'Keng entspriechend Donnéeën',
      search: 'Sichen…'
    },
    modal: {
      close: 'Zoumaachen'
    },
    pagination: {
      first: 'Éischt Säit',
      last: 'Lescht Säit',
      next: 'Nächst Säit',
      page: 'Säit {page}',
      prev: 'Vireg Säit'
    },
    pinInput: {
      input: 'PIN-Code, Zeechen {index} vu {length}'
    },
    pricingTable: {
      caption: 'Vergläich vun de Präispläng'
    },
    prose: {
      codeCollapse: {
        closeText: 'Zouklappen',
        name: 'code',
        openText: 'Opklappen'
      },
      collapsible: {
        closeText: 'Verstoppen',
        name: 'eegenschaften',
        openText: 'Uweisen'
      },
      pre: {
        copy: 'Code an d\'Zwëschspäicher kopéieren'
      },
      prompt: {
        copy: 'Prompt kopéieren',
        openIn: 'An {name} opmaachen'
      }
    },
    sidebar: {
      close: 'Zoumaachen',
      toggle: 'Ëmschalten'
    },
    selectMenu: {
      create: '"{label}" erstellen',
      noData: 'Keng Donnéeën',
      noMatch: 'Keng entspriechend Donnéeën',
      search: 'Sichen…'
    },
    skeleton: {
      label: 'Lueden'
    },
    slideover: {
      close: 'Zoumaachen'
    },
    slider: {
      max: 'Maximum',
      min: 'Minimum',
      thumb: 'Regler',
      value: 'Wäert {index} vu {total}'
    },
    table: {
      noData: 'Keng Donnéeën'
    },
    toast: {
      close: 'Zoumaachen'
    },
    toaster: {
      label: 'Notifikatioun',
      viewport: 'Notifikatiounen ({hotkey})'
    }
  }
})
