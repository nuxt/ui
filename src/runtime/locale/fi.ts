import type { Messages } from '../types/locale'
import { defineLocale } from '../composables/defineLocale'

export default defineLocale<Messages>({
  name: 'Suomi',
  code: 'fi',
  messages: {
    alert: {
      close: 'Sulje'
    },
    authForm: {
      hidePassword: 'Piilota salasana',
      showPassword: 'Näytä salasana',
      submit: 'Jatka'
    },
    banner: {
      close: 'Sulje'
    },
    calendar: {
      nextMonth: 'Seuraava kuukausi',
      nextYear: 'Seuraava vuosi',
      prevMonth: 'Edellinen kuukausi',
      prevYear: 'Edellinen vuosi'
    },
    carousel: {
      dots: 'Valitse näytettävä dia',
      goto: 'Siirry sivulle {slide}',
      next: 'Seuraava',
      prev: 'Edellinen'
    },
    chatMessages: {
      autoScroll: 'Vieritä alas'
    },
    chatPrompt: {
      placeholder: 'Kirjoita viestisi tähän…'
    },
    chatPromptSubmit: {
      label: 'Lähetä',
      reload: 'Yritä uudelleen',
      stop: 'Lopeta generointi'
    },
    chatReasoning: {
      thinking: 'Ajattelee…',
      thought: 'Ajatteli',
      thoughtFor: 'Ajatteli {duration}'
    },
    colorMode: {
      dark: 'Tumma',
      light: 'Vaalea',
      switchToDark: 'Vaihda tummaan tilaan',
      switchToLight: 'Vaihda vaaleaan tilaan',
      system: 'Järjestelmä'
    },
    commandPalette: {
      back: 'Takaisin',
      close: 'Sulje',
      filterPlaceholder: 'Kirjoita komento tai hae…',
      noData: 'Ei tietoja',
      noMatch: 'Ei vastaavia tietoja'
    },
    contentSearch: {
      links: 'Linkit',
      search: 'Tulokset',
      theme: 'Teema'
    },
    contentSearchButton: {
      label: 'Hae…'
    },
    contentToc: {
      title: 'Tällä sivulla'
    },
    dropdownMenu: {
      filterPlaceholder: 'Hae…',
      noMatch: 'Ei vastaavia tietoja'
    },
    dashboardSearch: {
      theme: 'Teema'
    },
    dashboardSearchButton: {
      label: 'Hae…'
    },
    dashboardSidebarCollapse: {
      collapse: 'Supista sivupalkki',
      expand: 'Laajenna sivupalkki'
    },
    dashboardSidebarToggle: {
      close: 'Sulje sivupalkki',
      open: 'Avaa sivupalkki'
    },
    drawer: {
      close: 'Sulje'
    },
    error: {
      clear: 'Takaisin etusivulle'
    },
    fileUpload: {
      removeFile: 'Poista {filename}'
    },
    header: {
      close: 'Sulje valikko',
      open: 'Avaa valikko'
    },
    inputMenu: {
      create: 'Luo "{label}"',
      noData: 'Ei tietoja',
      noMatch: 'Ei vastaavia tietoja'
    },
    inputNumber: {
      decrement: 'Vähennä',
      increment: 'Kasvata'
    },
    listbox: {
      filterPlaceholder: 'Hae…',
      noData: 'Ei tietoja',
      noMatch: 'Ei vastaavia tietoja'
    },
    modal: {
      close: 'Sulje'
    },
    pagination: {
      first: 'Ensimmäinen sivu',
      last: 'Viimeinen sivu',
      next: 'Seuraava sivu',
      page: 'Sivu {page}',
      prev: 'Edellinen sivu'
    },
    pricingTable: {
      caption: 'Hinnoitellut suunnitelmat'
    },
    prose: {
      codeCollapse: {
        closeText: 'Supista',
        name: 'koodi',
        openText: 'Laajenna'
      },
      collapsible: {
        closeText: 'Piilota',
        name: 'ominaisuudet',
        openText: 'Näytä'
      },
      pre: {
        copy: 'Kopioi koodi leikepöydälle'
      },
      prompt: {
        copy: 'Kopioi kehote',
        openIn: 'Avaa sovelluksessa {name}'
      }
    },
    sidebar: {
      close: 'Sulje',
      toggle: 'Vaihda'
    },
    selectMenu: {
      create: 'Luo "{label}"',
      filterPlaceholder: 'Hae…',
      noData: 'Ei tietoja',
      noMatch: 'Ei vastaavia tietoja'
    },
    slideover: {
      close: 'Sulje'
    },
    table: {
      noData: 'Ei tietoja'
    },
    toast: {
      close: 'Sulje'
    }
  }
})
