import type { Messages } from '../types'
import { defineLocale } from '../composables/defineLocale'

export default defineLocale<Messages>({
  name: 'Suomeksi',
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
    chatPrompt: {
      placeholder: 'Kirjoita viestisi tähän…'
    },
    chatPromptSubmit: {
      label: 'Lähetä'
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
      theme: 'Teema'
    },
    contentSearchButton: {
      label: 'Hae…'
    },
    contentToc: {
      title: 'Tällä sivulla'
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
    modal: {
      close: 'Sulje'
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
      }
    },
    selectMenu: {
      create: 'Luo "{label}"',
      noData: 'Ei tietoja',
      noMatch: 'Ei vastaavia tietoja',
      search: 'Hae…'
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
