import type { Messages } from '../types/locale'
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
    breadcrumb: {
      label: 'διαδρομή πλοήγησης'
    },
    calendar: {
      label: 'Ημερομηνία συμβάντος',
      monthPicker: 'Επιλογέας μήνα',
      nextMonth: 'Επόμενος μήνας',
      nextYear: 'Επόμενο έτος',
      prevMonth: 'Προηγούμενος μήνας',
      prevYear: 'Προηγούμενο έτος',
      yearPicker: 'Επιλογέας έτους'
    },
    carousel: {
      dots: 'Επιλέξτε διαφάνεια για εμφάνιση',
      goto: 'Μετάβαση στη διαφάνεια {slide}',
      next: 'Επόμενο',
      prev: 'Προηγούμενο',
      roledescription: 'καρουζέλ',
      slide: 'διαφάνεια'
    },
    chatMessages: {
      autoScroll: 'Κύλιση προς τα κάτω'
    },
    chatPrompt: {
      placeholder: 'Εδώ γράψτε το μήνυμά σας…'
    },
    chatPromptSubmit: {
      label: 'Αποστολή',
      reload: 'Επανάληψη',
      stop: 'Διακοπή δημιουργίας'
    },
    chatReasoning: {
      thinking: 'Σκέφτεται…',
      thought: 'Σκέφτηκε',
      thoughtFor: 'Σκέφτηκε για {duration}'
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
      search: 'Αποτελέσματα',
      theme: 'Θέμα'
    },
    contentSearchButton: {
      label: 'Αναζήτηση…'
    },
    contentToc: {
      title: 'Σε αυτή τη σελίδα'
    },
    dropdownMenu: {
      noMatch: 'Δεν βρέθηκαν δεδομένα',
      search: 'Αναζήτηση…'
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
    drawer: {
      close: 'Κλείσιμο'
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
    inputDate: {
      day: 'ημέρα',
      dayPeriod: 'πμ/μμ',
      era: 'περίοδος',
      hour: 'ώρα',
      minute: 'λεπτό',
      month: 'μήνας',
      second: 'δευτερόλεπτο',
      timeZoneName: 'ζώνη ώρας',
      year: 'έτος'
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
    inputRating: {
      rate: 'Βαθμολόγηση {value} από {length}'
    },
    inputTime: {
      dayPeriod: 'πμ/μμ',
      hour: 'ώρα',
      minute: 'λεπτό',
      second: 'δευτερόλεπτο',
      timeZoneName: 'ζώνη ώρας'
    },
    listbox: {
      noData: 'Δεν υπάρχουν δεδομένα',
      noMatch: 'Δεν βρέθηκαν δεδομένα',
      search: 'Αναζήτηση…'
    },
    modal: {
      close: 'Κλείσιμο'
    },
    pagination: {
      first: 'Πρώτη σελίδα',
      last: 'Τελευταία σελίδα',
      next: 'Επόμενη σελίδα',
      page: 'Σελίδα {page}',
      prev: 'Προηγούμενη σελίδα'
    },
    pinInput: {
      input: 'κωδικός PIN, χαρακτήρας {index} από {length}'
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
      },
      prompt: {
        copy: 'Αντιγραφή εντολής',
        openIn: 'Άνοιγμα σε {name}'
      }
    },
    sidebar: {
      close: 'Κλείσιμο',
      toggle: 'Εναλλαγή'
    },
    selectMenu: {
      create: 'Δημιουργία "{label}"',
      noData: 'Δεν υπάρχουν δεδομένα',
      noMatch: 'Δεν βρέθηκαν δεδομένα',
      search: 'Αναζήτηση…'
    },
    skeleton: {
      label: 'φόρτωση'
    },
    slideover: {
      close: 'Κλείσιμο'
    },
    slider: {
      max: 'Μέγιστο',
      min: 'Ελάχιστο',
      thumb: 'Ρυθμιστικό',
      value: 'Τιμή {index} από {total}'
    },
    table: {
      noData: 'Δεν υπάρχουν δεδομένα'
    },
    toast: {
      close: 'Κλείσιμο'
    },
    toaster: {
      label: 'Ειδοποίηση',
      viewport: 'Ειδοποιήσεις ({hotkey})'
    }
  }
})
