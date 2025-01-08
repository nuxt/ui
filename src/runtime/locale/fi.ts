import { defineLocale } from '../composables/defineLocale'

export default defineLocale({
  name: 'Suomeksi',
  code: 'fi',
  messages: {
    inputMenu: {
      noMatch: 'Ei vastaavia tietoja',
      noData: 'Ei tietoja',
      create: 'Luo "{label}"'
    },
    calendar: {
      prevYear: 'Edellinen vuosi',
      nextYear: 'Seuraava vuosi',
      prevMonth: 'Edellinen kuukausi',
      nextMonth: 'Seuraava kuukausi'
    },
    inputNumber: {
      increment: 'Kasvata',
      decrement: 'Vähennä'
    },
    commandPalette: {
      noMatch: 'Ei vastaavia tietoja',
      noData: 'Ei tietoja',
      close: 'Sulje'
    },
    selectMenu: {
      noMatch: 'Ei vastaavia tietoja',
      noData: 'Ei tietoja',
      create: 'Luo "{label}"'
    },
    toast: {
      close: 'Sulje'
    },
    carousel: {
      prev: 'Edellinen',
      next: 'Seuraava',
      goto: 'Siirry sivulle {slide}'
    },
    modal: {
      close: 'Sulje'
    },
    slideover: {
      close: 'Sulje'
    },
    alert: {
      close: 'Sulje'
    },
    table: {
      noData: 'Ei tietoja'
    }
  }
})
