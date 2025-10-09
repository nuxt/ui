import type { Messages } from '../types'
import { defineLocale } from '../composables/defineLocale'

export default defineLocale<Messages>({
  name: 'ئۇيغۇرچە',
  code: 'ug-CN',
  dir: 'rtl',
  messages: {
    alert: {
      close: 'تاقاش'
    },
    authForm: {
      hidePassword: 'پارولنى يوشۇرۇش',
      showPassword: 'پارولنى كۆرسىتىش',
      submit: 'دەۋام قىلىش'
    },
    banner: {
      close: 'تاقاش'
    },
    calendar: {
      nextMonth: 'كېلەر ئاي',
      nextYear: 'كېلەر يىل',
      prevMonth: 'ئالدىنقى ئاي',
      prevYear: 'ئالدىنقى يىل'
    },
    carousel: {
      dots: 'كۆرسىتىدىغان سلايدنى تاللاڭ',
      goto: '{slide}-بەتكە ئاتلاش',
      next: 'كېيىنكى بەت',
      prev: 'ئالدىنقى بەت'
    },
    chatPrompt: {
      placeholder: 'خەت كىرگۈزۈڭ…'
    },
    chatPromptSubmit: {
      label: 'يوللاش'
    },
    colorMode: {
      dark: 'قاراڭغۇ',
      light: 'يورۇق',
      switchToDark: 'قاراڭغۇ ھالەتكە ئالماشتۇرۇش',
      switchToLight: 'يورۇق ھالەتكە ئالماشتۇرۇش',
      system: 'سىستېما'
    },
    commandPalette: {
      back: 'قايتىش',
      close: 'تاقاش',
      noData: 'سانلىق مەلۇمات يوق',
      noMatch: 'ماس كېلىدىغان سانلىق مەلۇمات يوق',
      placeholder: 'بۇيرۇق كىرگۈزۈڭ ياكى ئىزدەڭ…'
    },
    contentSearch: {
      links: 'ئۇلانمىلار',
      theme: 'تېما'
    },
    contentSearchButton: {
      label: 'ئىزدەش'
    },
    contentToc: {
      title: 'مەزمۇن'
    },
    dashboardSearch: {
      theme: 'تېما'
    },
    dashboardSearchButton: {
      label: 'ئىزدەش'
    },
    dashboardSidebarCollapse: {
      collapse: 'تارايتىش',
      expand: 'كېڭەيتىش'
    },
    dashboardSidebarToggle: {
      close: 'تاقاش',
      open: 'ئېچىش'
    },
    error: {
      clear: 'تازىلاش'
    },
    fileUpload: {
      removeFile: '{filename} ئۆچۈرۈش'
    },
    header: {
      close: 'تاقاش',
      open: 'ئېچىش'
    },
    inputMenu: {
      create: '"{label}" نى قۇرۇش',
      noData: 'سانلىق مەلۇمات يوق',
      noMatch: 'ماس كېلىدىغان سانلىق مەلۇمات يوق'
    },
    inputNumber: {
      decrement: 'ئازايتىش',
      increment: 'كۆپەيتىش'
    },
    modal: {
      close: 'تاقاش'
    },
    pricingTable: {
      caption: 'باھا جەدۋىلى'
    },
    prose: {
      codeCollapse: {
        closeText: 'تارايتىش',
        name: 'كود',
        openText: 'كېڭەيتىش'
      },
      collapsible: {
        closeText: 'يوشۇرۇش',
        name: 'خاسلىقلار',
        openText: 'كۆرسىتىش'
      },
      pre: {
        copy: 'كۆچۈرۈش'
      }
    },
    selectMenu: {
      create: '"{label}" نى قۇرۇش',
      noData: 'سانلىق مەلۇمات يوق',
      noMatch: 'ماس كېلىدىغان سانلىق مەلۇمات يوق',
      search: 'ئىزدەش…'
    },
    slideover: {
      close: 'تاقاش'
    },
    table: {
      noData: 'سانلىق مەلۇمات يوق'
    },
    toast: {
      close: 'تاقاش'
    }
  }
})
