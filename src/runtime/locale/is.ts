import type { Messages } from '../types/locale'
import { defineLocale } from '../composables/defineLocale'

export default defineLocale<Messages>({
  name: 'Íslenska',
  code: 'is',
  messages: {
    alert: {
      close: 'Loka'
    },
    authForm: {
      hidePassword: 'Fela lykilorð',
      showPassword: 'Sýna lykilorð',
      submit: 'Áfram'
    },
    banner: {
      close: 'Loka'
    },
    breadcrumb: {
      label: 'brauðmolaslóð'
    },
    calendar: {
      label: 'Dagsetning viðburðar',
      monthPicker: 'Mánaðaval',
      nextMonth: 'Næsti mánuður',
      nextYear: 'Næsta ár',
      prevMonth: 'Fyrri mánuður',
      prevYear: 'Fyrra ár',
      yearPicker: 'Ársval'
    },
    carousel: {
      dots: 'Veldu mynd til að sýna',
      goto: 'Fara á mynd {slide}',
      next: 'Næsta',
      prev: 'Fyrri',
      roledescription: 'hringekja',
      slide: 'mynd'
    },
    chatMessages: {
      autoScroll: 'Skruna niður'
    },
    chatPrompt: {
      placeholder: 'Skrifaðu skilaboðin þín hér…'
    },
    chatPromptSubmit: {
      label: 'Senda fyrirspurn',
      reload: 'Reyna aftur',
      stop: 'Stöðva myndun'
    },
    chatReasoning: {
      thinking: 'Hugsar…',
      thought: 'Hugsaði',
      thoughtFor: 'Hugsaði í {duration}'
    },
    colorMode: {
      dark: 'Dökkt',
      light: 'Ljóst',
      switchToDark: 'Skipta yfir í dökkan ham',
      switchToLight: 'Skipta yfir í ljósan ham',
      system: 'Kerfi'
    },
    commandPalette: {
      back: 'Til baka',
      close: 'Loka',
      noData: 'Engin gögn',
      noMatch: 'Engin gögn fundust',
      placeholder: 'Sláðu inn skipun eða leitaðu…'
    },
    contentSearch: {
      links: 'Tenglar',
      search: 'Niðurstöður',
      theme: 'Þema'
    },
    contentSearchButton: {
      label: 'Leita…'
    },
    contentToc: {
      title: 'Á þessari síðu'
    },
    dropdownMenu: {
      noMatch: 'Engin gögn fundust',
      search: 'Leita…'
    },
    dashboardSearch: {
      theme: 'Þema'
    },
    dashboardSearchButton: {
      label: 'Leita…'
    },
    dashboardSidebarCollapse: {
      collapse: 'Fella hliðarstiku saman',
      expand: 'Stækka hliðarstiku'
    },
    dashboardSidebarToggle: {
      close: 'Loka hliðarstiku',
      open: 'Opna hliðarstiku'
    },
    drawer: {
      close: 'Loka'
    },
    error: {
      clear: 'Til baka heim'
    },
    fileUpload: {
      removeFile: 'Fjarlægja {filename}'
    },
    header: {
      close: 'Loka valmynd',
      open: 'Opna valmynd'
    },
    inputDate: {
      day: 'dagur',
      dayPeriod: 'AM/PM',
      era: 'tímabil',
      hour: 'klukkustund',
      minute: 'mínúta',
      month: 'mánuður',
      second: 'sekúnda',
      timeZoneName: 'tímabelti',
      year: 'ár'
    },
    inputMenu: {
      create: 'Búa til "{label}"',
      noData: 'Engin gögn',
      noMatch: 'Engin gögn fundust'
    },
    inputNumber: {
      decrement: 'Minnka',
      increment: 'Auka'
    },
    inputRating: {
      rate: 'Gefa einkunnina {value} af {length}'
    },
    inputTime: {
      dayPeriod: 'AM/PM',
      hour: 'klukkustund',
      minute: 'mínúta',
      second: 'sekúnda',
      timeZoneName: 'tímabelti'
    },
    listbox: {
      noData: 'Engin gögn',
      noMatch: 'Engin gögn fundust',
      search: 'Leita…'
    },
    modal: {
      close: 'Loka'
    },
    pagination: {
      first: 'Fyrsta síða',
      last: 'Síðasta síða',
      next: 'Næsta síða',
      page: 'Síða {page}',
      prev: 'Fyrri síða'
    },
    pinInput: {
      input: 'PIN-númer, stafur {index} af {length}'
    },
    pricingTable: {
      caption: 'Samanburður verðflokka'
    },
    prose: {
      codeCollapse: {
        closeText: 'Fella saman',
        name: 'kóði',
        openText: 'Stækka'
      },
      collapsible: {
        closeText: 'Fela',
        name: 'eiginleikar',
        openText: 'Sýna'
      },
      pre: {
        copy: 'Afrita kóða á klippiborð'
      },
      prompt: {
        copy: 'Afrita fyrirmæli',
        openIn: 'Opna í {name}'
      }
    },
    sidebar: {
      close: 'Loka',
      toggle: 'Skipta'
    },
    selectMenu: {
      create: 'Búa til "{label}"',
      noData: 'Engin gögn',
      noMatch: 'Engin gögn fundust',
      search: 'Leita…'
    },
    skeleton: {
      label: 'hleður'
    },
    slideover: {
      close: 'Loka'
    },
    slider: {
      max: 'Hámark',
      min: 'Lágmark',
      thumb: 'Sleði',
      value: 'Gildi {index} af {total}'
    },
    table: {
      noData: 'Engin gögn'
    },
    toast: {
      close: 'Loka'
    },
    toaster: {
      label: 'Tilkynning',
      viewport: 'Tilkynningar ({hotkey})'
    }
  }
})
