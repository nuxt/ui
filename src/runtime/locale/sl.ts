import type { Messages } from '../types'
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
    calendar: {
      nextMonth: 'Naslednji mesec',
      nextYear: 'Naslednje leto',
      prevMonth: 'Prejšnji mesec',
      prevYear: 'Prejšnje leto'
    },
    carousel: {
      dots: 'Izberite diapozitiv za prikaz',
      goto: 'Pojdi na {slide}',
      next: 'Naprej',
      prev: 'Nazaj'
    },
    chatPrompt: {
      placeholder: 'Tukaj napišite svoje sporočilo…'
    },
    chatPromptSubmit: {
      label: 'Pošlji sporočilo'
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
      theme: 'Tema'
    },
    contentSearchButton: {
      label: 'Išči…'
    },
    contentToc: {
      title: 'Na tej strani'
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
    inputMenu: {
      create: 'Ustvari "{label}"',
      noData: 'Ni podatkov',
      noMatch: 'Ni ujemanj'
    },
    inputNumber: {
      decrement: 'Zmanjšaj',
      increment: 'Povišaj'
    },
    modal: {
      close: 'Zapri'
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
      }
    },
    selectMenu: {
      create: 'Ustvari "{label}"',
      noData: 'Ni podatkov',
      noMatch: 'Ni ujemanj',
      search: 'Išči…'
    },
    slideover: {
      close: 'Zapri'
    },
    table: {
      noData: 'Ni podatkov'
    },
    toast: {
      close: 'Zapri'
    }
  }
})
