import type { Messages } from '../types/locale'
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
    breadcrumb: {
      label: 'يېتەكلەش يولى'
    },
    calendar: {
      label: 'پائالىيەت چېسلاسى',
      monthPicker: 'ئاي تاللىغۇچ',
      nextMonth: 'كېلەر ئاي',
      nextYear: 'كېلەر يىل',
      prevMonth: 'ئالدىنقى ئاي',
      prevYear: 'ئالدىنقى يىل',
      yearPicker: 'يىل تاللىغۇچ'
    },
    carousel: {
      dots: 'كۆرسىتىدىغان سلايدنى تاللاڭ',
      next: 'كېيىنكى',
      prev: 'ئالدىنقى',
      roledescription: 'ئايلانما كۆرسەتكۈچ',
      slide: 'سلايد',
      slideLabel: '{slide} / {total}'
    },
    chatAttachment: {
      uploading: 'يۈكلەۋاتىدۇ',
      error: 'يۈكلەش مەغلۇپ بولدى'
    },
    chatMessages: {
      autoScroll: 'ئاستىغا سۈرۈش'
    },
    chatPrompt: {
      placeholder: 'خەت كىرگۈزۈڭ…',
      queue: 'ئۆچىرەتتىكى ئۇچۇرلار',
      sendNow: 'ھازىرلا يوللاش',
      edit: 'تەھرىرلەش',
      remove: 'چىقىرىۋېتىش'
    },
    chatPromptSubmit: {
      label: 'يوللاش',
      reload: 'قايتا سىناش',
      stop: 'ھاسىل قىلىشنى توختىتىش'
    },
    chatReasoning: {
      thinking: 'ئويلاۋاتىدۇ…',
      thought: 'ئويلاندى',
      thoughtFor: '{duration} ئويلاندى'
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
      filterPlaceholder: 'بۇيرۇق كىرگۈزۈڭ ياكى ئىزدەڭ…',
      noData: 'سانلىق مەلۇمات يوق',
      noMatch: 'ماس كېلىدىغان سانلىق مەلۇمات يوق',
      results: 'نەتىجىلەر'
    },
    contentSearch: {
      links: 'ئۇلانمىلار',
      search: 'نەتىجىلەر',
      theme: 'تېما'
    },
    contentSearchButton: {
      label: 'ئىزدەش…'
    },
    contentToc: {
      title: 'مەزمۇن'
    },
    dropdownMenu: {
      filterPlaceholder: 'ئىزدەش…',
      noMatch: 'ماس كېلىدىغان سانلىق مەلۇمات يوق'
    },
    dashboardSearch: {
      theme: 'تېما'
    },
    dashboardSearchButton: {
      label: 'ئىزدەش…'
    },
    dashboardSidebarCollapse: {
      collapse: 'تارايتىش',
      expand: 'كېڭەيتىش'
    },
    dashboardSidebarToggle: {
      close: 'تاقاش',
      open: 'ئېچىش'
    },
    drawer: {
      close: 'تاقاش'
    },
    editorEmojiMenu: {
      label: 'ئىموجىلار'
    },
    editorMentionMenu: {
      label: 'تىلغا ئېلىشلار'
    },
    editorSuggestionMenu: {
      label: 'تەكلىپلەر'
    },
    error: {
      clear: 'باش بەتكە قايتىش'
    },
    fileUpload: {
      removeFile: '{filename} نى ئۆچۈرۈش'
    },
    header: {
      close: 'تاقاش',
      open: 'ئېچىش'
    },
    inputDate: {
      day: 'كۈن',
      dayPeriod: 'AM/PM',
      era: 'دەۋر',
      hour: 'سائەت',
      minute: 'مىنۇت',
      month: 'ئاي',
      second: 'سېكۇنت',
      timeZoneName: 'ۋاقىت رايونى',
      year: 'يىل'
    },
    inputMenu: {
      create: '"{label}" نى قۇرۇش',
      noData: 'سانلىق مەلۇمات يوق',
      noMatch: 'ماس كېلىدىغان سانلىق مەلۇمات يوق',
      trigger: 'تاللانمىلارنى كۆرسىتىش'
    },
    inputNumber: {
      decrement: 'ئازايتىش',
      increment: 'كۆپەيتىش',
      roledescription: 'سان بۆلىكى'
    },
    inputRating: {
      rate: '{value} نومۇر بېرىش، جەمئىي {length}'
    },
    inputTime: {
      dayPeriod: 'AM/PM',
      hour: 'سائەت',
      minute: 'مىنۇت',
      second: 'سېكۇنت',
      timeZoneName: 'ۋاقىت رايونى'
    },
    listbox: {
      filterPlaceholder: 'ئىزدەش…',
      noData: 'سانلىق مەلۇمات يوق',
      noMatch: 'ماس كېلىدىغان سانلىق مەلۇمات يوق'
    },
    modal: {
      close: 'تاقاش'
    },
    pagination: {
      first: 'بىرىنچى بەت',
      last: 'ئاخىرقى بەت',
      next: 'كېيىنكى بەت',
      page: '{page}-بەت',
      prev: 'ئالدىنقى بەت'
    },
    pinInput: {
      input: 'PIN كودى، {index}-ھەرپ، جەمئىي {length}'
    },
    pricingTable: {
      caption: 'باھا جەدۋىلى'
    },
    prose: {
      codeCollapse: {
        closeText: 'تارايتىش',
        label: '{name} {text}',
        name: 'كودنى',
        openText: 'كېڭەيتىش'
      },
      collapsible: {
        closeText: 'يوشۇرۇش',
        label: '{name} {text}',
        name: 'خاسلىقلارنى',
        openText: 'كۆرسىتىش'
      },
      pre: {
        copy: 'كۆچۈرۈش'
      },
      prompt: {
        copy: 'كۆچۈرۈش',
        openIn: '{name} دا ئېچىش'
      }
    },
    sidebar: {
      close: 'تاقاش',
      toggle: 'ئالماشتۇرۇش'
    },
    selectMenu: {
      create: '"{label}" نى قۇرۇش',
      filterPlaceholder: 'ئىزدەش…',
      noData: 'سانلىق مەلۇمات يوق',
      noMatch: 'ماس كېلىدىغان سانلىق مەلۇمات يوق'
    },
    skeleton: {
      label: 'يۈكلىنىۋاتىدۇ'
    },
    slideover: {
      close: 'تاقاش'
    },
    slider: {
      max: 'ئەڭ چوڭ',
      min: 'ئەڭ كىچىك',
      thumb: 'سىيرىغۇچ',
      value: '{index}-قىممەت، جەمئىي {total}'
    },
    stepper: {
      label: 'ئىلگىرىلەش'
    },
    table: {
      noData: 'سانلىق مەلۇمات يوق'
    },
    toast: {
      close: 'تاقاش'
    },
    toaster: {
      label: 'ئۇقتۇرۇش',
      viewport: 'ئۇقتۇرۇشلار ({hotkey})'
    }
  }
})
