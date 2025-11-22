import type { Messages } from '../types'
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
    calendar: {
      nextMonth: 'Sljedeći mjesec',
      nextYear: 'Sljedeća godina',
      prevMonth: 'Prethodni mjesec',
      prevYear: 'Prethodna godina'
    },
    carousel: {
      dots: 'Odaberite slajd za prikaz',
      goto: 'Idi na slajd {slide}',
      next: 'Sljedeći',
      prev: 'Prethodni'
    },
    chatPrompt: {
      placeholder: 'Upišite svoju poruku ovdje…'
    },
    chatPromptSubmit: {
      label: 'Pošalji upit'
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
      theme: 'Tema'
    },
    contentSearchButton: {
      label: 'Pretraživanje…'
    },
    contentToc: {
      title: 'Na ovoj stranici'
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
    inputMenu: {
      create: 'Stvori "{label}"',
      noData: 'Nema podataka',
      noMatch: 'Nema odgovarajućih podataka'
    },
    inputNumber: {
      decrement: 'Smanji',
      increment: 'Povećaj'
    },
    modal: {
      close: 'Zatvori'
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
      }
    },
    selectMenu: {
      create: 'Stvori "{label}"',
      noData: 'Nema podataka',
      noMatch: 'Nema odgovarajućih podataka',
      search: 'Pretraživanje…'
    },
    slideover: {
      close: 'Zatvori'
    },
    table: {
      noData: 'Nema podataka'
    },
    toast: {
      close: 'Zatvori'
    }
  }
})
