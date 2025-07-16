import type { Messages } from '../types'
import { defineLocale } from '../composables/defineLocale'

export default defineLocale<Messages>({
  name: 'Ελληνικά',
  code: 'el',
  messages: {
    inputMenu: {
      noMatch: 'Δεν βρέθηκαν δεδομένα',
      noData: 'Δεν υπάρχουν δεδομένα',
      create: 'Δημιουργία "{label}"'
    },
    calendar: {
      prevYear: 'Προηγούμενο έτος',
      nextYear: 'Επόμενο έτος',
      prevMonth: 'Προηγούμενος μήνας',
      nextMonth: 'Επόμενος μήνας'
    },
    inputNumber: {
      increment: 'Αύξηση',
      decrement: 'Μείωση'
    },
    commandPalette: {
      placeholder: 'Πληκτρολογήστε μια εντολή ή αναζητήστε...',
      noMatch: 'Δεν βρέθηκαν δεδομένα',
      noData: 'Δεν υπάρχουν δεδομένα',
      close: 'Κλείσιμο',
      back: 'Πίσω'
    },
    selectMenu: {
      noMatch: 'Δεν βρέθηκαν δεδομένα',
      noData: 'Δεν υπάρχουν δεδομένα',
      create: 'Δημιουργία "{label}"',
      search: 'Αναζήτηση...'
    },
    toast: {
      close: 'Κλείσιμο'
    },
    carousel: {
      prev: 'Προηγούμενο',
      next: 'Επόμενο',
      dots: 'Επιλέξτε διαφάνεια για εμφάνιση',
      goto: 'Μετάβαση στη διαφάνεια {slide}'
    },
    modal: {
      close: 'Κλείσιμο'
    },
    slideover: {
      close: 'Κλείσιμο'
    },
    alert: {
      close: 'Κλείσιμο'
    },
    table: {
      noData: 'Δεν υπάρχουν δεδομένα'
    }
  }
})
