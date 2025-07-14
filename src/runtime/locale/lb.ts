import type { Messages } from '../types'
import { defineLocale } from '../composables/defineLocale'

export default defineLocale<Messages>({
  name: 'Lëtzebuergesch',
  code: 'lb',
  messages: {
    inputMenu: {
      noMatch: 'Keng entspriechend Donnéeën',
      noData: 'Keng Donnéeën',
      create: '"{label}" erstellen'
    },
    calendar: {
      prevYear: 'Viregt Joer',
      nextYear: 'Nächst Joer',
      prevMonth: 'Virege Mount',
      nextMonth: 'Nächste Mount'
    },
    inputNumber: {
      increment: 'Inkrementéieren',
      decrement: 'Dekrementéieren'
    },
    commandPalette: {
      placeholder: 'Tippt e Befeel oder sicht...',
      noMatch: 'Keng entspriechend Donnéeën',
      noData: 'Keng Donnéeën',
      close: 'Zoumaachen',
      back: 'Zréck'
    },
    selectMenu: {
      noMatch: 'Keng entspriechend Donnéeën',
      noData: 'Keng Donnéeën',
      create: '"{label}" erstellen',
      search: 'Sichen..'
    },
    toast: {
      close: 'Zoumaachen'
    },
    carousel: {
      prev: 'Präz.',
      next: 'Näch.',
      dots: 'Wielt Dia fir ze weisen',
      goto: 'Gitt op d\'Slide {Slide}'
    },
    modal: {
      close: 'Zoumaachen'
    },
    slideover: {
      close: 'Zoumaachen'
    },
    alert: {
      close: 'Zoumaachen'
    },
    table: {
      noData: 'Keng Donnéeën'
    }
  }
})
