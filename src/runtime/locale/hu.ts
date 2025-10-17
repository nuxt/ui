import type { Messages } from '../types'
import { defineLocale } from '../composables/defineLocale'

export default defineLocale<Messages>({
  name: 'Magyar',
  code: 'hu',
  messages: {
    alert: {
      close: 'Bezárás'
    },
    authForm: {
      hidePassword: 'Jelszó elrejtése',
      showPassword: 'Jelszó megjelenítése',
      submit: 'Folytatás'
    },
    banner: {
      close: 'Bezárás'
    },
    calendar: {
      nextMonth: 'Következő hónap',
      nextYear: 'Következő év',
      prevMonth: 'Előző hónap',
      prevYear: 'Előző év'
    },
    carousel: {
      dots: 'Válassza ki a megjelenítendő diát',
      goto: 'Ugrás ide {slide}',
      next: 'Következő',
      prev: 'Előző'
    },
    chatPrompt: {
      placeholder: 'Írd be a kérdésedet itt…'
    },
    chatPromptSubmit: {
      label: 'Küldés'
    },
    colorMode: {
      dark: 'Sötét',
      light: 'Világos',
      switchToDark: 'Váltás sötét módra',
      switchToLight: 'Váltás világos módra',
      system: 'Rendszer'
    },
    commandPalette: {
      back: 'Vissza',
      close: 'Bezárás',
      noData: 'Nincs adat',
      noMatch: 'Nincs találat',
      placeholder: 'Írjon be egy parancsot vagy keressen…'
    },
    contentSearch: {
      links: 'Linkek',
      theme: 'Téma'
    },
    contentSearchButton: {
      label: 'Keresés…'
    },
    contentToc: {
      title: 'Ezen az oldalon'
    },
    dashboardSearch: {
      theme: 'Téma'
    },
    dashboardSearchButton: {
      label: 'Keresés…'
    },
    dashboardSidebarCollapse: {
      collapse: 'Oldalsáv összecsukása',
      expand: 'Oldalsáv kinyitása'
    },
    dashboardSidebarToggle: {
      close: 'Oldalsáv bezárása',
      open: 'Oldalsáv megnyitása'
    },
    error: {
      clear: 'Vissza a főoldalra'
    },
    fileUpload: {
      removeFile: '{filename} eltávolítása'
    },
    header: {
      close: 'Menü bezárása',
      open: 'Menü megnyitása'
    },
    inputMenu: {
      create: '"{label}" létrehozása',
      noData: 'Nincs adat',
      noMatch: 'Nincs találat'
    },
    inputNumber: {
      decrement: 'Csökkent',
      increment: 'Növel'
    },
    modal: {
      close: 'Bezárás'
    },
    pricingTable: {
      caption: 'Árlista összehasonlítása'
    },
    prose: {
      codeCollapse: {
        closeText: 'Összecsuk',
        name: 'kód',
        openText: 'Kinyit'
      },
      collapsible: {
        closeText: 'Elrejt',
        name: 'tulajdonságok',
        openText: 'Mutat'
      },
      pre: {
        copy: 'Kód másolása a vágólapra'
      }
    },
    selectMenu: {
      create: '"{label}" létrehozása',
      noData: 'Nincs adat',
      noMatch: 'Nincs találat',
      search: 'Keresés…'
    },
    slideover: {
      close: 'Bezárás'
    },
    table: {
      noData: 'Nincs adat'
    },
    toast: {
      close: 'Bezárás'
    }
  }
})
