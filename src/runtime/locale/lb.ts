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
    chatAttachment: {
      uploading: 'Gëtt eropgelueden',
      error: 'Eropluede feelgeschloen'
    },
    chatMessages: {
      autoScroll: 'No ënnen scrollen'
    },
    chatPrompt: {
      placeholder: 'Tippt hei Äre Message…',
      queue: 'Messagen an der Schlaang',
      sendNow: 'Elo schécken',
      edit: 'Änneren',
      remove: 'Ewechhuelen'
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
      filterPlaceholder: 'Tippt e Befeel oder sicht…',
      noData: 'Keng Donnéeën',
      noMatch: 'Keng entspriechend Donnéeën',
      results: 'Resultater'
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
      filterPlaceholder: 'Sichen…',
      noMatch: 'Keng entspriechend Donnéeën'
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
      noMatch: 'Keng entspriechend Donnéeën',
      trigger: 'Optiounen uweisen'
    },
    inputNumber: {
      decrement: 'Dekrementéieren',
      increment: 'Inkrementéieren',
      roledescription: 'Zuelefeld'
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
      filterPlaceholder: 'Sichen…',
      noData: 'Keng Donnéeën',
      noMatch: 'Keng entspriechend Donnéeën'
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
      filterPlaceholder: 'Sichen…',
      noData: 'Keng Donnéeën',
      noMatch: 'Keng entspriechend Donnéeën'
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
    stepper: {
      label: 'Fortschrëtt'
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
