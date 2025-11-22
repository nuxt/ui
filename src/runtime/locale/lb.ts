import type { Messages } from '../types'
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
    calendar: {
      nextMonth: 'Nächste Mount',
      nextYear: 'Nächst Joer',
      prevMonth: 'Virege Mount',
      prevYear: 'Viregt Joer'
    },
    carousel: {
      dots: 'Wielt Dia fir ze weisen',
      goto: 'Gitt op d\'Slide {Slide}',
      next: 'Näch.',
      prev: 'Präz.'
    },
    chatPrompt: {
      placeholder: 'Tippt hei Äre Message…'
    },
    chatPromptSubmit: {
      label: 'Prompt schécken'
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
      theme: 'Thema'
    },
    contentSearchButton: {
      label: 'Sichen…'
    },
    contentToc: {
      title: 'Op dëser Säit'
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
    inputMenu: {
      create: '"{label}" erstellen',
      noData: 'Keng Donnéeën',
      noMatch: 'Keng entspriechend Donnéeën'
    },
    inputNumber: {
      decrement: 'Dekrementéieren',
      increment: 'Inkrementéieren'
    },
    modal: {
      close: 'Zoumaachen'
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
      }
    },
    selectMenu: {
      create: '"{label}" erstellen',
      noData: 'Keng Donnéeën',
      noMatch: 'Keng entspriechend Donnéeën',
      search: 'Sichen..'
    },
    slideover: {
      close: 'Zoumaachen'
    },
    table: {
      noData: 'Keng Donnéeën'
    },
    toast: {
      close: 'Zoumaachen'
    }
  }
})
