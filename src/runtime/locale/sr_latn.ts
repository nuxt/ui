import type { Messages } from '../types/locale'
import { defineLocale } from '../composables/defineLocale'

export default defineLocale<Messages>({
  name: 'Srpski (latinica)',
  code: 'sr-LATN',
  messages: {
    alert: {
      close: 'Zatvori'
    },
    authForm: {
      hidePassword: 'Sakrij lozinku',
      showPassword: 'Prikaži lozinku',
      submit: 'Nastavi'
    },
    banner: {
      close: 'Zatvori'
    },
    breadcrumb: {
      label: 'navigaciona putanja'
    },
    calendar: {
      label: 'Datum događaja',
      monthPicker: 'Izbor meseca',
      nextMonth: 'Sledeći mesec',
      nextYear: 'Sledeća godina',
      prevMonth: 'Prethodni mesec',
      prevYear: 'Prethodna godina',
      yearPicker: 'Izbor godine'
    },
    carousel: {
      dots: 'Izaberi slajd za prikaz',
      goto: 'Idi na slajd {slide}',
      next: 'Sledeći',
      prev: 'Prethodni',
      roledescription: 'karusel',
      slide: 'slajd'
    },
    chatAttachment: {
      uploading: 'Otpremanje',
      error: 'Otpremanje nije uspelo'
    },
    chatMessages: {
      autoScroll: 'Pomeri na dno'
    },
    chatPrompt: {
      placeholder: 'Unesi poruku ovde…',
      queue: 'Poruke na čekanju',
      sendNow: 'Pošalji odmah',
      edit: 'Izmeni',
      remove: 'Ukloni'
    },
    chatPromptSubmit: {
      label: 'Pošalji upit',
      reload: 'Pokušaj ponovo',
      stop: 'Zaustavi generisanje'
    },
    colorMode: {
      dark: 'Tamno',
      light: 'Svetlo',
      switchToDark: 'Prebaci na tamni režim',
      switchToLight: 'Prebaci na svetli režim',
      system: 'Sistem'
    },
    commandPalette: {
      back: 'Nazad',
      close: 'Zatvori',
      noData: 'Nema podataka',
      noMatch: 'Nema odgovarajućih podataka',
      placeholder: 'Unesi komandu ili pretraži…',
      results: 'Rezultati'
    },
    contentSearch: {
      links: 'Linkovi',
      search: 'Rezultati',
      theme: 'Tema'
    },
    contentSearchButton: {
      label: 'Pretraži…'
    },
    contentToc: {
      title: 'Na ovoj stranici'
    },
    dropdownMenu: {
      noMatch: 'Nema odgovarajućih podataka',
      search: 'Pretraži…'
    },
    dashboardSearch: {
      theme: 'Tema'
    },
    dashboardSearchButton: {
      label: 'Pretraži…'
    },
    dashboardSidebarCollapse: {
      collapse: 'Skupi bočnu traku',
      expand: 'Proširi bočnu traku'
    },
    dashboardSidebarToggle: {
      close: 'Zatvori bočnu traku',
      open: 'Otvori bočnu traku'
    },
    drawer: {
      close: 'Zatvori'
    },
    error: {
      clear: 'Nazad na početnu'
    },
    fileUpload: {
      removeFile: 'Ukloni {filename}'
    },
    header: {
      close: 'Zatvori meni',
      open: 'Otvori meni'
    },
    inputDate: {
      day: 'dan',
      dayPeriod: 'AM/PM',
      era: 'era',
      hour: 'sat',
      minute: 'minut',
      month: 'mesec',
      second: 'sekund',
      timeZoneName: 'vremenska zona',
      year: 'godina'
    },
    inputMenu: {
      create: 'Kreiraj "{label}"',
      noData: 'Nema podataka',
      noMatch: 'Nema odgovarajućih podataka',
      trigger: 'Prikaži opcije'
    },
    inputNumber: {
      decrement: 'Smanji',
      increment: 'Povećaj',
      roledescription: 'numeričko polje'
    },
    inputRating: {
      rate: 'Oceni {value} od {length}'
    },
    inputTime: {
      dayPeriod: 'AM/PM',
      hour: 'sat',
      minute: 'minut',
      second: 'sekund',
      timeZoneName: 'vremenska zona'
    },
    listbox: {
      noData: 'Nema podataka',
      noMatch: 'Nema odgovarajućih podataka',
      search: 'Pretraži…'
    },
    modal: {
      close: 'Zatvori'
    },
    pagination: {
      first: 'Prva stranica',
      last: 'Poslednja stranica',
      next: 'Sledeća stranica',
      page: 'Stranica {page}',
      prev: 'Prethodna stranica'
    },
    pinInput: {
      input: 'PIN polje {index} od {length}'
    },
    pricingTable: {
      caption: 'Poređenje cenovnih planova'
    },
    prose: {
      codeCollapse: {
        closeText: 'Skupi',
        name: 'kod',
        openText: 'Proširi'
      },
      collapsible: {
        closeText: 'Sakrij',
        name: 'svojstva',
        openText: 'Prikaži'
      },
      pre: {
        copy: 'Kopiraj kod u privremenu memoriju'
      },
      prompt: {
        copy: 'Kopiraj upit',
        openIn: 'Otvori u {name}'
      }
    },
    chatReasoning: {
      thinking: 'Razmišljam…',
      thought: 'Razmišljanje',
      thoughtFor: 'Razmišljanje: {duration}'
    },
    sidebar: {
      close: 'Zatvori',
      toggle: 'Prikaži/sakrij'
    },
    selectMenu: {
      create: 'Kreiraj "{label}"',
      noData: 'Nema podataka',
      noMatch: 'Nema odgovarajućih podataka',
      search: 'Pretraži…'
    },
    skeleton: {
      label: 'učitavanje'
    },
    slideover: {
      close: 'Zatvori'
    },
    slider: {
      max: 'Maksimum',
      min: 'Minimum',
      thumb: 'Klizač',
      value: 'Vrednost {index} od {total}'
    },
    stepper: {
      label: 'napredak'
    },
    table: {
      noData: 'Nema podataka'
    },
    toast: {
      close: 'Zatvori'
    },
    toaster: {
      label: 'Obaveštenje',
      viewport: 'Obaveštenja ({hotkey})'
    }
  }
})
