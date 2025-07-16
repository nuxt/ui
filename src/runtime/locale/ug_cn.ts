import type { Messages } from '../types'
import { defineLocale } from '../composables/defineLocale'

export default defineLocale<Messages>({
  name: 'ئۇيغۇرچە',
  code: 'ug-CN',
  dir: 'rtl',
  messages: {
    inputMenu: {
      noMatch: 'ماس كېلىدىغان سانلىق مەلۇمات يوق',
      noData: 'سانلىق مەلۇمات يوق',
      create: '"{label}" نى قۇرۇش'
    },
    calendar: {
      prevYear: 'ئالدىنقى يىل',
      nextYear: 'كېلەر يىل',
      prevMonth: 'ئالدىنقى ئاي',
      nextMonth: 'كېلەر ئاي'
    },
    inputNumber: {
      increment: 'كۆپەيتىش',
      decrement: 'ئازايتىش'
    },
    commandPalette: {
      placeholder: 'بۇيرۇق كىرگۈزۈڭ ياكى ئىزدەڭ...',
      noMatch: 'ماس كېلىدىغان سانلىق مەلۇمات يوق',
      noData: 'سانلىق مەلۇمات يوق',
      close: 'تاقاش',
      back: 'قايتىش'
    },
    selectMenu: {
      noMatch: 'ماس كېلىدىغان سانلىق مەلۇمات يوق',
      noData: 'سانلىق مەلۇمات يوق',
      create: '"{label}" نى قۇرۇش',
      search: 'ئىزدەش...'
    },
    toast: {
      close: 'تاقاش'
    },
    carousel: {
      prev: 'ئالدىنقى بەت',
      next: 'كېيىنكى بەت',
      dots: 'كۆرسىتىدىغان سلايدنى تاللاڭ',
      goto: '{slide}-بەتكە ئاتلاش'
    },
    modal: {
      close: 'تاقاش'
    },
    slideover: {
      close: 'تاقاش'
    },
    alert: {
      close: 'تاقاش'
    },
    table: {
      noData: 'سانلىق مەلۇمات يوق'
    }
  }
})
