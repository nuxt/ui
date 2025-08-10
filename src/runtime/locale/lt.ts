import type { Messages } from '../types'
import { defineLocale } from '../composables/defineLocale'

export default defineLocale<Messages>({
  name: 'Lietuvių',
  code: 'lt',
  messages: {
    inputMenu: {
      noMatch: 'Nėra atitinkančių duomenų',
      noData: 'Nėra duomenų',
      create: 'Sukurti „{label}“'
    },
    calendar: {
      prevYear: 'Ankstesni metai',
      nextYear: 'Kiti metai',
      prevMonth: 'Ankstesnis mėnuo',
      nextMonth: 'Kitas mėnuo'
    },
    inputNumber: {
      increment: 'Padidinti',
      decrement: 'Sumažinti'
    },
    commandPalette: {
      placeholder: 'Įveskite komandą arba ieškokite...',
      noMatch: 'Nėra atitinkančių duomenų',
      noData: 'Nėra duomenų',
      close: 'Uždaryti',
      back: 'Atgal'
    },
    selectMenu: {
      noMatch: 'Nėra atitinkančių duomenų',
      noData: 'Nėra duomenų',
      create: 'Sukurti „{label}“',
      search: 'Ieškoti...'
    },
    toast: {
      close: 'Uždaryti'
    },
    carousel: {
      prev: 'Atgal',
      next: 'Pirmyn',
      dots: 'Pasirinkite skaidrę rodymui',
      goto: 'Eiti į skaidrę {slide}'
    },
    modal: {
      close: 'Uždaryti'
    },
    slideover: {
      close: 'Uždaryti'
    },
    alert: {
      close: 'Uždaryti'
    },
    table: {
      noData: 'Nėra duomenų'
    },
    fileUpload: {
      removeFile: 'Pašalinti {filename}'
    }
  }
})
