import type { Messages } from '../types/locale'
import { defineLocale } from '../composables/defineLocale'

export default defineLocale<Messages>({
  name: 'Hrvatski',
  code: 'hr',
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
      label: 'navigacijski put'
    },
    calendar: {
      label: 'Datum događaja',
      monthPicker: 'Odabir mjeseca',
      nextMonth: 'Sljedeći mjesec',
      nextYear: 'Sljedeća godina',
      prevMonth: 'Prethodni mjesec',
      prevYear: 'Prethodna godina',
      yearPicker: 'Odabir godine'
    },
    carousel: {
      dots: 'Odaberite slajd za prikaz',
      goto: 'Idi na slajd {slide}',
      next: 'Sljedeći',
      prev: 'Prethodni',
      roledescription: 'vrtuljak',
      slide: 'slajd'
    },
    chatMessages: {
      autoScroll: 'Pomakni na dno'
    },
    chatPrompt: {
      placeholder: 'Upišite svoju poruku ovdje…'
    },
    chatPromptSubmit: {
      label: 'Pošalji upit',
      reload: 'Pokušaj ponovno',
      stop: 'Zaustavi generiranje'
    },
    chatReasoning: {
      thinking: 'Razmišlja…',
      thought: 'Razmislio',
      thoughtFor: 'Razmišljao {duration}'
    },
    colorMode: {
      dark: 'Tamno',
      light: 'Svijetlo',
      switchToDark: 'Prebaci na tamni način rada',
      switchToLight: 'Prebaci na svijetli način rada',
      system: 'Sustav'
    },
    commandPalette: {
      back: 'Natrag',
      close: 'Zatvori',
      noData: 'Nema podataka',
      noMatch: 'Nema odgovarajućih podataka',
      placeholder: 'Upišite naredbu ili pretraživanje…'
    },
    contentSearch: {
      links: 'Poveznice',
      search: 'Rezultati',
      theme: 'Tema'
    },
    contentSearchButton: {
      label: 'Pretraživanje…'
    },
    contentToc: {
      title: 'Na ovoj stranici'
    },
    dropdownMenu: {
      noMatch: 'Nema odgovarajućih podataka',
      search: 'Pretraživanje…'
    },
    dashboardSearch: {
      theme: 'Tema'
    },
    dashboardSearchButton: {
      label: 'Pretraživanje…'
    },
    dashboardSidebarCollapse: {
      collapse: 'Smanji bočnu traku',
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
      clear: 'Natrag na početnu'
    },
    fileUpload: {
      removeFile: 'Ukloni {filename}'
    },
    header: {
      close: 'Zatvori izbornik',
      open: 'Otvori izbornik'
    },
    inputDate: {
      day: 'dan',
      dayPeriod: 'AM/PM',
      era: 'era',
      hour: 'sat',
      minute: 'minuta',
      month: 'mjesec',
      second: 'sekunda',
      timeZoneName: 'vremenska zona',
      year: 'godina'
    },
    inputMenu: {
      create: 'Stvori "{label}"',
      noData: 'Nema podataka',
      noMatch: 'Nema odgovarajućih podataka'
    },
    inputNumber: {
      decrement: 'Smanji',
      increment: 'Povećaj'
    },
    inputRating: {
      rate: 'Ocijeni {value} od {length}'
    },
    inputTime: {
      dayPeriod: 'AM/PM',
      hour: 'sat',
      minute: 'minuta',
      second: 'sekunda',
      timeZoneName: 'vremenska zona'
    },
    listbox: {
      noData: 'Nema podataka',
      noMatch: 'Nema odgovarajućih podataka',
      search: 'Pretraživanje…'
    },
    modal: {
      close: 'Zatvori'
    },
    pagination: {
      first: 'Prva stranica',
      last: 'Posljednja stranica',
      next: 'Sljedeća stranica',
      page: 'Stranica {page}',
      prev: 'Prethodna stranica'
    },
    pinInput: {
      input: 'PIN kod, znak {index} od {length}'
    },
    pricingTable: {
      caption: 'Usporedba cjenovnih planova'
    },
    prose: {
      codeCollapse: {
        closeText: 'Smanji',
        name: 'kod',
        openText: 'Proširi'
      },
      collapsible: {
        closeText: 'Sakrij',
        name: 'svojstva',
        openText: 'Prikaži'
      },
      pre: {
        copy: 'Kopiraj kod u međuspremnik'
      },
      prompt: {
        copy: 'Kopiraj prompt',
        openIn: 'Otvori u {name}'
      }
    },
    sidebar: {
      close: 'Zatvori',
      toggle: 'Prebaci'
    },
    selectMenu: {
      create: 'Stvori "{label}"',
      noData: 'Nema podataka',
      noMatch: 'Nema odgovarajućih podataka',
      search: 'Pretraživanje…'
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
      value: 'Vrijednost {index} od {total}'
    },
    table: {
      noData: 'Nema podataka'
    },
    toast: {
      close: 'Zatvori'
    },
    toaster: {
      label: 'Obavijest',
      viewport: 'Obavijesti ({hotkey})'
    }
  }
})
