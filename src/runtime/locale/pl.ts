import type { Messages } from '../types'
import { defineLocale } from '../composables/defineLocale'

export default defineLocale<Messages>({
  name: 'Polski',
  code: 'pl',
  messages: {
    alert: {
      close: 'Zamknij'
    },
    authForm: {
      hidePassword: 'Ukryj hasło',
      showPassword: 'Pokaż hasło',
      submit: 'Kontynuuj'
    },
    banner: {
      close: 'Zamknij'
    },
    calendar: {
      nextMonth: 'Przyszły miesiąc',
      nextYear: 'Przyszły rok',
      prevMonth: 'Poprzedni miesiąc',
      prevYear: 'Poprzedni rok'
    },
    carousel: {
      dots: 'Wybierz slajd do wyświetlenia',
      goto: 'Idź do {slide}',
      next: 'Następny',
      prev: 'Poprzedni'
    },
    chatPrompt: {
      placeholder: 'Tutaj wpisz swoją wiadomość…'
    },
    chatPromptSubmit: {
      label: 'Wyślij'
    },
    colorMode: {
      dark: 'Ciemny',
      light: 'Jasny',
      switchToDark: 'Przełącz na tryb ciemny',
      switchToLight: 'Przełącz na tryb jasny',
      system: 'System'
    },
    commandPalette: {
      back: 'Wstecz',
      close: 'Zamknij',
      noData: 'Brak danych',
      noMatch: 'Brak pasujących danych',
      placeholder: 'Wpisz polecenie lub wyszukaj…'
    },
    contentSearch: {
      links: 'Linki',
      theme: 'Motyw'
    },
    contentSearchButton: {
      label: 'Szukaj…'
    },
    contentToc: {
      title: 'Na tej stronie'
    },
    dashboardSearch: {
      theme: 'Motyw'
    },
    dashboardSearchButton: {
      label: 'Szukaj…'
    },
    dashboardSidebarCollapse: {
      collapse: 'Zwiń pasek boczny',
      expand: 'Rozwiń pasek boczny'
    },
    dashboardSidebarToggle: {
      close: 'Zamknij pasek boczny',
      open: 'Otwórz pasek boczny'
    },
    error: {
      clear: 'Powrót do strony głównej'
    },
    fileUpload: {
      removeFile: 'Usuń {filename}'
    },
    header: {
      close: 'Zamknij menu',
      open: 'Otwórz menu'
    },
    inputMenu: {
      create: 'Utwórz "{label}"',
      noData: 'Brak danych',
      noMatch: 'Brak pasujących danych'
    },
    inputNumber: {
      decrement: 'Zmniejsz',
      increment: 'Zwiększ'
    },
    modal: {
      close: 'Zamknij'
    },
    pricingTable: {
      caption: 'Porównanie planów cenowych'
    },
    prose: {
      codeCollapse: {
        closeText: 'Zwiń',
        name: 'kod',
        openText: 'Rozwiń'
      },
      collapsible: {
        closeText: 'Ukryj',
        name: 'właściwości',
        openText: 'Pokaż'
      },
      pre: {
        copy: 'Kopiuj kod do schowka'
      }
    },
    selectMenu: {
      create: 'Utwórz "{label}"',
      noData: 'Brak danych',
      noMatch: 'Brak pasujących danych',
      search: 'Szukaj…'
    },
    slideover: {
      close: 'Zamknij'
    },
    table: {
      noData: 'Brak danych'
    },
    toast: {
      close: 'Zamknij'
    }
  }
})
