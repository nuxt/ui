import type { Messages } from '../types/locale'
import { defineLocale } from '../composables/defineLocale'

export default defineLocale<Messages>({
  name: 'Slovenščina',
  code: 'sl',
  messages: {
    alert: {
      close: 'Zapri'
    },
    authForm: {
      hidePassword: 'Skrij geslo',
      showPassword: 'Prikaži geslo',
      submit: 'Nadaljuj'
    },
    banner: {
      close: 'Zapri'
    },
    breadcrumb: {
      label: 'drobtinice'
    },
    calendar: {
      label: 'Datum dogodka',
      monthPicker: 'Izbira meseca',
      nextMonth: 'Naslednji mesec',
      nextYear: 'Naslednje leto',
      prevMonth: 'Prejšnji mesec',
      prevYear: 'Prejšnje leto',
      yearPicker: 'Izbira leta'
    },
    carousel: {
      dots: 'Izberite diapozitiv za prikaz',
      goto: 'Pojdi na {slide}',
      next: 'Naprej',
      prev: 'Nazaj',
      roledescription: 'vrtiljak',
      slide: 'diapozitiv'
    },
    chatMessages: {
      autoScroll: 'Pomakni na dno'
    },
    chatPrompt: {
      placeholder: 'Tukaj napišite svoje sporočilo…'
    },
    chatPromptSubmit: {
      label: 'Pošlji sporočilo',
      reload: 'Poskusi znova',
      stop: 'Ustavi generiranje'
    },
    chatReasoning: {
      thinking: 'Razmišlja…',
      thought: 'Razmislil',
      thoughtFor: 'Razmišljal {duration}'
    },
    colorMode: {
      dark: 'Temno',
      light: 'Svetlo',
      switchToDark: 'Preklopi na temni način',
      switchToLight: 'Preklopi na svetli način',
      system: 'Sistem'
    },
    commandPalette: {
      back: 'Nazaj',
      close: 'Zapri',
      noData: 'Ni podatkov',
      noMatch: 'Ni ujemanj',
      placeholder: 'Vpiši ukaz ali išči…'
    },
    contentSearch: {
      links: 'Povezave',
      search: 'Rezultati',
      theme: 'Tema'
    },
    contentSearchButton: {
      label: 'Išči…'
    },
    contentToc: {
      title: 'Na tej strani'
    },
    dropdownMenu: {
      noMatch: 'Ni ujemanj',
      search: 'Išči…'
    },
    dashboardSearch: {
      theme: 'Tema'
    },
    dashboardSearchButton: {
      label: 'Išči…'
    },
    dashboardSidebarCollapse: {
      collapse: 'Strni stransko vrstico',
      expand: 'Razširi stransko vrstico'
    },
    dashboardSidebarToggle: {
      close: 'Zapri stransko vrstico',
      open: 'Odpri stransko vrstico'
    },
    drawer: {
      close: 'Zapri'
    },
    error: {
      clear: 'Nazaj na domačo stran'
    },
    fileUpload: {
      removeFile: 'Odstrani {filename}'
    },
    header: {
      close: 'Zapri meni',
      open: 'Odpri meni'
    },
    inputDate: {
      day: 'dan',
      dayPeriod: 'AM/PM',
      era: 'doba',
      hour: 'ura',
      minute: 'minuta',
      month: 'mesec',
      second: 'sekunda',
      timeZoneName: 'časovni pas',
      year: 'leto'
    },
    inputMenu: {
      create: 'Ustvari "{label}"',
      noData: 'Ni podatkov',
      noMatch: 'Ni ujemanj'
    },
    inputNumber: {
      decrement: 'Zmanjšaj',
      increment: 'Povišaj'
    },
    inputRating: {
      rate: 'Oceni z {value} od {length}'
    },
    inputTime: {
      dayPeriod: 'AM/PM',
      hour: 'ura',
      minute: 'minuta',
      second: 'sekunda',
      timeZoneName: 'časovni pas'
    },
    listbox: {
      noData: 'Ni podatkov',
      noMatch: 'Ni ujemanj',
      search: 'Išči…'
    },
    modal: {
      close: 'Zapri'
    },
    pagination: {
      first: 'Prva stran',
      last: 'Zadnja stran',
      next: 'Naslednja stran',
      page: 'Stran {page}',
      prev: 'Prejšnja stran'
    },
    pinInput: {
      input: 'koda PIN, znak {index} od {length}'
    },
    pricingTable: {
      caption: 'Primerjava cenovnih načrtov'
    },
    prose: {
      codeCollapse: {
        closeText: 'Strni',
        name: 'koda',
        openText: 'Razširi'
      },
      collapsible: {
        closeText: 'Skrij',
        name: 'lastnosti',
        openText: 'Prikaži'
      },
      pre: {
        copy: 'Kopiraj kodo v odložišče'
      },
      prompt: {
        copy: 'Kopiraj poziv',
        openIn: 'Odpri v {name}'
      }
    },
    sidebar: {
      close: 'Zapri',
      toggle: 'Preklopi'
    },
    selectMenu: {
      create: 'Ustvari "{label}"',
      noData: 'Ni podatkov',
      noMatch: 'Ni ujemanj',
      search: 'Išči…'
    },
    skeleton: {
      label: 'nalaganje'
    },
    slideover: {
      close: 'Zapri'
    },
    slider: {
      max: 'Maksimum',
      min: 'Minimum',
      thumb: 'Drsnik',
      value: 'Vrednost {index} od {total}'
    },
    table: {
      noData: 'Ni podatkov'
    },
    toast: {
      close: 'Zapri'
    },
    toaster: {
      label: 'Obvestilo',
      viewport: 'Obvestila ({hotkey})'
    }
  }
})
