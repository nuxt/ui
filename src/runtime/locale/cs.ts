import type { Messages } from '../types'
import { defineLocale } from '../composables/defineLocale'

export default defineLocale<Messages>({
  name: 'Čeština',
  code: 'cs',
  messages: {
    inputMenu: {
      noMatch: 'Žádná shoda',
      noData: 'Žádná data',
      create: 'Vytvořit "{label}"'
    },
    calendar: {
      prevYear: 'Předchozí rok',
      nextYear: 'Další rok',
      prevMonth: 'Předchozí měsíc',
      nextMonth: 'Další měsíc'
    },
    inputNumber: {
      increment: 'Zvýšit',
      decrement: 'Snížit'
    },
    commandPalette: {
      placeholder: 'Zadejte příkaz nebo hledejte...',
      noMatch: 'Žádná shoda',
      noData: 'Žádná data',
      close: 'Zavřít',
      back: 'Zpět'
    },
    selectMenu: {
      noMatch: 'Žádná shoda',
      noData: 'Žádná data',
      create: 'Vytvořit "{label}"',
      search: 'Hledat...'
    },
    toast: {
      close: 'Zavřít'
    },
    carousel: {
      prev: 'Předchozí',
      next: 'Další',
      dots: 'Vyberte snímek k zobrazení',
      goto: 'Přejít na {slide}'
    },
    modal: {
      close: 'Zavřít'
    },
    slideover: {
      close: 'Zavřít'
    },
    alert: {
      close: 'Zavřít'
    },
    table: {
      noData: 'Žádná data'
    },
    fileUpload: {
      removeFile: 'Odebrat {filename}'
    }
  }
})
