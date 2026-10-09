import type { Messages } from '../types/locale'
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
    breadcrumb: {
      label: 'navigációs útvonal'
    },
    calendar: {
      label: 'Esemény dátuma',
      monthPicker: 'Hónapválasztó',
      nextMonth: 'Következő hónap',
      nextYear: 'Következő év',
      prevMonth: 'Előző hónap',
      prevYear: 'Előző év',
      yearPicker: 'Évválasztó'
    },
    carousel: {
      dots: 'Válassza ki a megjelenítendő diát',
      goto: 'Ugrás ide {slide}',
      next: 'Következő',
      prev: 'Előző',
      roledescription: 'körhinta',
      slide: 'dia'
    },
    chatMessages: {
      autoScroll: 'Görgetés az aljára'
    },
    chatPrompt: {
      placeholder: 'Írd be a kérdésedet itt…'
    },
    chatPromptSubmit: {
      label: 'Küldés',
      reload: 'Újrapróbálás',
      stop: 'Generálás leállítása'
    },
    chatReasoning: {
      thinking: 'Gondolkodik…',
      thought: 'Gondolkodott',
      thoughtFor: '{duration} gondolkodott'
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
      search: 'Eredmények',
      theme: 'Téma'
    },
    contentSearchButton: {
      label: 'Keresés…'
    },
    contentToc: {
      title: 'Ezen az oldalon'
    },
    dropdownMenu: {
      noMatch: 'Nincs találat',
      search: 'Keresés…'
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
    drawer: {
      close: 'Bezárás'
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
    inputDate: {
      day: 'nap',
      dayPeriod: 'AM/PM',
      era: 'korszak',
      hour: 'óra',
      minute: 'perc',
      month: 'hónap',
      second: 'másodperc',
      timeZoneName: 'időzóna',
      year: 'év'
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
    inputRating: {
      rate: 'Értékelés: {value} / {length}'
    },
    inputTime: {
      dayPeriod: 'AM/PM',
      hour: 'óra',
      minute: 'perc',
      second: 'másodperc',
      timeZoneName: 'időzóna'
    },
    listbox: {
      noData: 'Nincs adat',
      noMatch: 'Nincs találat',
      search: 'Keresés…'
    },
    modal: {
      close: 'Bezárás'
    },
    pagination: {
      first: 'Első oldal',
      last: 'Utolsó oldal',
      next: 'Következő oldal',
      page: '{page}. oldal',
      prev: 'Előző oldal'
    },
    pinInput: {
      input: 'PIN-kód, {index}. karakter (összesen {length})'
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
      },
      prompt: {
        copy: 'Prompt másolása',
        openIn: 'Megnyitás: {name}'
      }
    },
    sidebar: {
      close: 'Bezárás',
      toggle: 'Váltás'
    },
    selectMenu: {
      create: '"{label}" létrehozása',
      noData: 'Nincs adat',
      noMatch: 'Nincs találat',
      search: 'Keresés…'
    },
    skeleton: {
      label: 'betöltés'
    },
    slideover: {
      close: 'Bezárás'
    },
    slider: {
      max: 'Maximum',
      min: 'Minimum',
      thumb: 'Csúszka',
      value: '{index}. érték (összesen {total})'
    },
    table: {
      noData: 'Nincs adat'
    },
    toast: {
      close: 'Bezárás'
    },
    toaster: {
      label: 'Értesítés',
      viewport: 'Értesítések ({hotkey})'
    }
  }
})
