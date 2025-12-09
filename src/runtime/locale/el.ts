import type { Messages } from '../types'
import { defineLocale } from '../composables/defineLocale'

export default defineLocale<Messages>({
  name: 'Ελληνικά',
  code: 'el',
  messages: {
    alert: {
      close: 'Κλείσιμο'
    },
    authForm: {
      hidePassword: 'Απόκρυψη κωδικού',
      showPassword: 'Εμφάνιση κωδικού',
      submit: 'Συνέχεια'
    },
    banner: {
      close: 'Κλείσιμο'
    },
    calendar: {
      nextMonth: 'Επόμενος μήνας',
      nextYear: 'Επόμενο έτος',
      prevMonth: 'Προηγούμενος μήνας',
      prevYear: 'Προηγούμενο έτος'
    },
    carousel: {
      dots: 'Επιλέξτε διαφάνεια για εμφάνιση',
      goto: 'Μετάβαση στη διαφάνεια {slide}',
      next: 'Επόμενο',
      prev: 'Προηγούμενο'
    },
    chatPrompt: {
      placeholder: 'Εδώ γράψτε το μήνυμά σας…'
    },
    chatPromptSubmit: {
      label: 'Αποστολή'
    },
    colorMode: {
      dark: 'Σκοτεινό',
      light: 'Φωτεινό',
      switchToDark: 'Αλλαγή σε σκοτεινή λειτουργία',
      switchToLight: 'Αλλαγή σε φωτεινή λειτουργία',
      system: 'Σύστημα'
    },
    commandPalette: {
      back: 'Πίσω',
      close: 'Κλείσιμο',
      noData: 'Δεν υπάρχουν δεδομένα',
      noMatch: 'Δεν βρέθηκαν δεδομένα',
      placeholder: 'Πληκτρολογήστε μια εντολή ή αναζητήστε…'
    },
    contentSearch: {
      links: 'Σύνδεσμοι',
      theme: 'Θέμα'
    },
    contentSearchButton: {
      label: 'Αναζήτηση…'
    },
    contentToc: {
      title: 'Σε αυτή τη σελίδα'
    },
    dashboardSearch: {
      theme: 'Θέμα'
    },
    dashboardSearchButton: {
      label: 'Αναζήτηση…'
    },
    dashboardSidebarCollapse: {
      collapse: 'Σύμπτυξη πλευρικής μπάρας',
      expand: 'Επέκταση πλευρικής μπάρας'
    },
    dashboardSidebarToggle: {
      close: 'Κλείσιμο πλευρικής μπάρας',
      open: 'Άνοιγμα πλευρικής μπάρας'
    },
    error: {
      clear: 'Επιστροφή στην αρχική'
    },
    fileUpload: {
      removeFile: 'Αφαίρεση {filename}'
    },
    header: {
      close: 'Κλείσιμο μενού',
      open: 'Άνοιγμα μενού'
    },
    inputMenu: {
      create: 'Δημιουργία "{label}"',
      noData: 'Δεν υπάρχουν δεδομένα',
      noMatch: 'Δεν βρέθηκαν δεδομένα'
    },
    inputNumber: {
      decrement: 'Μείωση',
      increment: 'Αύξηση'
    },
    modal: {
      close: 'Κλείσιμο'
    },
    pricingTable: {
      caption: 'Σύγκριση προγραμμάτων τιμολόγησης'
    },
    prose: {
      codeCollapse: {
        closeText: 'Σύμπτυξη',
        name: 'κώδικας',
        openText: 'Επέκταση'
      },
      collapsible: {
        closeText: 'Απόκρυψη',
        name: 'ιδιότητες',
        openText: 'Εμφάνιση'
      },
      pre: {
        copy: 'Αντιγραφή κώδικα στο πρόχειρο'
      }
    },
    selectMenu: {
      create: 'Δημιουργία "{label}"',
      noData: 'Δεν υπάρχουν δεδομένα',
      noMatch: 'Δεν βρέθηκαν δεδομένα',
      search: 'Αναζήτηση…'
    },
    slideover: {
      close: 'Κλείσιμο'
    },
    table: {
      noData: 'Δεν υπάρχουν δεδομένα'
    },
    toast: {
      close: 'Κλείσιμο'
    }
  }
})
