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
    breadcrumb: {
      label: 'murupolku'
    },
    calendar: {
      label: 'Tapahtuman päivämäärä',
      monthPicker: 'Kuukausivalitsin',
      nextMonth: 'Seuraava kuukausi',
      nextYear: 'Seuraava vuosi',
      prevMonth: 'Edellinen kuukausi',
      prevYear: 'Edellinen vuosi',
      yearPicker: 'Vuosivalitsin'
    },
    carousel: {
      dots: 'Valitse näytettävä dia',
      goto: 'Siirry sivulle {slide}',
      next: 'Seuraava',
      prev: 'Edellinen',
      roledescription: 'karuselli',
      slide: 'dia'
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
      noData: 'Ei tietoja',
      noMatch: 'Ei vastaavia tietoja',
      placeholder: 'Kirjoita komento tai hae…'
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
      noMatch: 'Ei vastaavia tietoja',
      search: 'Hae…'
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
    inputDate: {
      day: 'päivä',
      dayPeriod: 'AM/PM',
      era: 'aikakausi',
      hour: 'tunti',
      minute: 'minuutti',
      month: 'kuukausi',
      second: 'sekunti',
      timeZoneName: 'aikavyöhyke',
      year: 'vuosi'
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
    inputRating: {
      rate: 'Anna arvosana {value}/{length}'
    },
    inputTime: {
      dayPeriod: 'AM/PM',
      hour: 'tunti',
      minute: 'minuutti',
      second: 'sekunti',
      timeZoneName: 'aikavyöhyke'
    },
    listbox: {
      noData: 'Ei tietoja',
      noMatch: 'Ei vastaavia tietoja',
      search: 'Hae…'
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
    pinInput: {
      input: 'PIN-koodi, merkki {index}/{length}'
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
      noData: 'Ei tietoja',
      noMatch: 'Ei vastaavia tietoja',
      search: 'Hae…'
    },
    skeleton: {
      label: 'ladataan'
    },
    slideover: {
      close: 'Sulje'
    },
    slider: {
      max: 'Maksimi',
      min: 'Minimi',
      thumb: 'Liukusäädin',
      value: 'Arvo {index}/{total}'
    },
    table: {
      noData: 'Ei tietoja'
    },
    toast: {
      close: 'Sulje'
    },
    toaster: {
      label: 'Ilmoitus',
      viewport: 'Ilmoitukset ({hotkey})'
    }
  }
})
