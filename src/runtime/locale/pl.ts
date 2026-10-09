import type { Messages } from '../types/locale'
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
    breadcrumb: {
      label: 'ścieżka nawigacji'
    },
    calendar: {
      label: 'Data wydarzenia',
      monthPicker: 'Wybór miesiąca',
      nextMonth: 'Przyszły miesiąc',
      nextYear: 'Przyszły rok',
      prevMonth: 'Poprzedni miesiąc',
      prevYear: 'Poprzedni rok',
      yearPicker: 'Wybór roku'
    },
    carousel: {
      dots: 'Wybierz slajd do wyświetlenia',
      goto: 'Idź do {slide}',
      next: 'Następny',
      prev: 'Poprzedni',
      roledescription: 'karuzela',
      slide: 'slajd'
    },
    chatMessages: {
      autoScroll: 'Przewiń na dół'
    },
    chatPrompt: {
      placeholder: 'Tutaj wpisz swoją wiadomość…'
    },
    chatPromptSubmit: {
      label: 'Wyślij',
      reload: 'Spróbuj ponownie',
      stop: 'Zatrzymaj generowanie'
    },
    chatReasoning: {
      thinking: 'Myśli…',
      thought: 'Myślenie zakończone',
      thoughtFor: 'Myślenie zajęło {duration}'
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
      search: 'Wyniki',
      theme: 'Motyw'
    },
    contentSearchButton: {
      label: 'Szukaj…'
    },
    contentToc: {
      title: 'Na tej stronie'
    },
    dropdownMenu: {
      noMatch: 'Brak pasujących danych',
      search: 'Szukaj…'
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
    drawer: {
      close: 'Zamknij'
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
    inputDate: {
      day: 'dzień',
      dayPeriod: 'AM/PM',
      era: 'era',
      hour: 'godzina',
      minute: 'minuta',
      month: 'miesiąc',
      second: 'sekunda',
      timeZoneName: 'strefa czasowa',
      year: 'rok'
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
    inputRating: {
      rate: 'Oceń na {value} z {length}'
    },
    inputTime: {
      dayPeriod: 'AM/PM',
      hour: 'godzina',
      minute: 'minuta',
      second: 'sekunda',
      timeZoneName: 'strefa czasowa'
    },
    listbox: {
      noData: 'Brak danych',
      noMatch: 'Brak pasujących danych',
      search: 'Szukaj…'
    },
    modal: {
      close: 'Zamknij'
    },
    pagination: {
      first: 'Pierwsza strona',
      last: 'Ostatnia strona',
      next: 'Następna strona',
      page: 'Strona {page}',
      prev: 'Poprzednia strona'
    },
    pinInput: {
      input: 'kod PIN, znak {index} z {length}'
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
      },
      prompt: {
        copy: 'Kopiuj prompt',
        openIn: 'Otwórz w {name}'
      }
    },
    sidebar: {
      close: 'Zamknij',
      toggle: 'Przełącz'
    },
    selectMenu: {
      create: 'Utwórz "{label}"',
      noData: 'Brak danych',
      noMatch: 'Brak pasujących danych',
      search: 'Szukaj…'
    },
    skeleton: {
      label: 'ładowanie'
    },
    slideover: {
      close: 'Zamknij'
    },
    slider: {
      max: 'Maksimum',
      min: 'Minimum',
      thumb: 'Suwak',
      value: 'Wartość {index} z {total}'
    },
    table: {
      noData: 'Brak danych'
    },
    toast: {
      close: 'Zamknij'
    },
    toaster: {
      label: 'Powiadomienie',
      viewport: 'Powiadomienia ({hotkey})'
    }
  }
})
